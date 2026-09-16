# Rastro de verificación

Fecha: 2026-09-16

- Se contrastó el wording de producto con los campos y valores reales de `backend/app/routes.py`; los desajustes quedaron resueltos en `frontend/specs/api-wording-alignment.md`, sin cambios en la implementación.
- Verificación documental: `git diff --check` -> sin errores de whitespace.

Fecha: 2026-09-12

- Frontend: `cd frontend && npm run test -- --run` -> 5 tests pasados.
- Backend: `cd backend && pytest` -> 15 tests pasados.
- Se verificaron los cálculos de KPIs, agregación mensual y formateo de moneda/porcentajes.
- Pendiente: validar integración HTTP y ejecución completa con Docker.

## Reglas propuestas: arquitectura

- **Regla A1:** Al conectar una funcionalidad del dashboard, registrar en `frontend/src/App.tsx` el consumo del endpoint correspondiente y pasar sus datos a un componente de `frontend/src/components`. **Hecho:** `App.tsx` solo consume `/api/metrics`, aunque `backend/app/routes.py` también define `/api/metrics/facets`, `/summary`, `/categories/top`, `/comparison`, `/alerts`, `/b2b` y `/b2c`.
- **Regla A2:** No modificar `frontend/src/lib/mock-data.ts` para cambiar el dashboard activo sin cambiar también el flujo de datos de `frontend/src/App.tsx`. **Hecho:** `App.tsx` obtiene los datos mediante `fetch`; `mock-data.ts` no participa en ese flujo.
- **Regla A3:** Mantener los cálculos de KPIs y series en `frontend/src/lib/financial-utils.ts` y dejar que `frontend/src/components` renderice sus resultados. **Hecho:** `App.tsx` calcula con `computeKPIs` y `computeMonthlyData` antes de pasar los valores a los componentes.

## Reglas propuestas: naming y contratos

- **Regla N1:** Usar únicamente `income`/`outcome`, las categorías declaradas en `Category` y `B2B`/`B2C` al crear o modificar movimientos. **Hecho:** `backend/app/routes.py::FinancialMovement` declara esos literales y Pydantic rechaza valores fuera del contrato.
- **Regla N2:** Conservar `create_date` como `YYYY-MM-DD` y los periodos de resumen como `YYYY-MM`, `YYYY-W##` o `YYYY-MM-DD` según `group_by`. **Hecho:** `summarize_movements` genera esos formatos y `frontend/src/lib/financial-utils.ts::computeMonthlyData` parsea `create_date` con ese contrato.
- **Regla N3:** No presentar `2024 - Full Year` como periodo dinámico sin actualizar la fuente de datos o la etiqueta. **Hecho:** `generate_mock_movements` calcula años con `date.today()`, mientras `frontend/src/App.tsx` pasa esa etiqueta fija a `DashboardHeader`.
- **Regla N4:** Cualquier cambio de idioma o moneda debe actualizar `formatCurrency`, `formatMonthYearLabel` y sus pruebas. **Hecho:** `frontend/src/lib/financial-utils.ts` fija `en-US` y `USD`, y las pruebas están en `frontend/src/lib/financial-utils.test.ts`.

## Reglas propuestas: testing

- **Regla T1:** Al cambiar la generación mock, actualizar las expectativas que dependen de `seed=42` y de los 360 movimientos. **Hecho:** `generate_mock_movements(seed=42)` llama a `random.seed(seed)` en cada endpoint y `backend/tests/test_routes.py` verifica la cantidad y el orden.
- **Regla T2:** Añadir una prueba de zona horaria al cambiar el parseo de fechas en `computeMonthlyData`. **Hecho:** `frontend/src/lib/financial-utils.ts` ejecuta `new Date(m.create_date)` y agrupa usando métodos de zona local.
- **Regla T3:** Antes de permitir listas vacías en facets, definir la respuesta esperada y probarla. **Hecho:** `build_metrics_facets` accede a `ordered[0]` y `ordered[-1]`, lo que produce `IndexError`; `backend/tests/test_routes.py` no cubre ese caso.
- **Regla T4:** Rechazar o probar explícitamente rangos con `start_date > end_date` en la comparación. **Hecho:** `get_metrics_comparison` no valida ese orden antes de calcular `timedelta`.
- **Regla T5:** Los cambios de rutas o modelos deben incluir cobertura en `backend/tests/test_routes.py`; los cambios de agregación o formateo deben incluir cobertura en `frontend/src/lib/financial-utils.test.ts`. **Hecho:** esos archivos contienen respectivamente las pruebas HTTP/backend y las pruebas de utilidades frontend existentes.

## Reglas propuestas: documentación y DX

- **Regla D1:** Mantener alineados `docker-compose.yml` y `frontend/vite.config.ts` cuando cambien puertos o destinos del proxy. **Hecho:** Compose expone `8000` y `5173`, y Vite resuelve `/api` contra `http://backend:8000`.
- **Regla D2:** Documentar por separado la ejecución con Compose y la ejecución local de Vite, incluyendo el valor requerido para el proxy fuera de Compose. **Hecho:** `backend` es el hostname creado por `docker-compose.yml` y no está definido fuera de esa red.
- **Regla D3:** No documentar `frontend/.env.example` como disponible hasta crear el archivo o corregir `README.md` y `README.es.md`. **Hecho:** ambos README lo mencionan, pero el archivo no existe; `frontend/src/App.tsx` sí lee `VITE_API_BASE_URL`.
- **Regla D4:** Ejecutar `cd backend && pytest`, `cd frontend && npm run test -- --run` y `cd frontend && npm run build` antes de cerrar cambios que afecten esas áreas. **Hecho:** esos son los comandos de validación declarados en `verification.md`.

## Reglas propuestas: configuración y seguridad

- **Regla S1:** Restringir `allow_origins` a los orígenes permitidos antes de desplegar el backend fuera del entorno local. **Hecho:** `backend/app/main.py` configura `allow_origins=["*"]` junto con `allow_credentials=True`.

## Reglas propuestas: datos y precisión

- **Regla P1:** No usar `FinancialMovement` para importes contables de precisión sin definir una representación decimal y una política de redondeo común. **Hecho:** `backend/app/routes.py` usa `float` y `frontend/src/lib/financial-utils.ts::computeKPIs` y `computeMonthlyData` acumulan esos valores sin redondear cada operación.

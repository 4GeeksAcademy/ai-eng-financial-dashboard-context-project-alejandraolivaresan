# Estado actual

Fecha de referencia: 2026-09-13.

## Funciona

- Backend: `cd backend && pytest` pasa 16 pruebas, incluyendo health, filtros, facets, resumen, categorias, alertas, B2B/B2C y rechazo de rangos invertidos en `/api/metrics/comparison`.
- Frontend: `cd frontend && npm run test -- --run` pasa 5 pruebas de KPIs, agregacion mensual y formateadores.
- Build: `cd frontend && npm run build` termina correctamente.
- Frontend: `frontend/src/App.tsx` usa `VITE_API_BASE_URL` opcional y deriva el periodo visible desde `monthlyData`; ya no usa una etiqueta fija `2024 - Full Year`.
- Backend: `backend/app/routes.py::get_metrics_comparison` devuelve HTTP 400 cuando `start_date > end_date`.
- Documentacion: `README.md` y `README.es.md` explican que `frontend/.env.example` puede dejar `VITE_API_BASE_URL` vacio para conservar el proxy.
- Agent guidance: `.agents/rules/` contiene un indice y reglas separadas para arquitectura/datos, contratos/naming, testing y documentacion/DX/seguridad.
- Git: el arbol estaba limpio tras los cuatro commits de la fase: `c83859c`, `3e73416`, `e604bcc` y `f2155a9`.

## Gaps conocidos

- `frontend/src/App.tsx` solo consume `/api/metrics`; los endpoints adicionales de `backend/app/routes.py` aun no estan conectados a la pantalla principal.
- `backend/app/routes.py::generate_mock_movements` genera datos en memoria en cada request y llama a `random.seed(42)`; no existe persistencia ni una fuente de datos real.
- `backend/app/main.py` configura `allow_origins=["*"]` junto con `allow_credentials=True`; la politica CORS no esta restringida para un despliegue externo.
- `frontend/src/lib/financial-utils.ts::computeMonthlyData` usa `new Date(m.create_date)` y metodos de fecha local; falta una prueba especifica de zonas horarias.
- `backend/app/routes.py::build_metrics_facets` sigue accediendo a `ordered[0]` y `ordered[-1]`; una lista vacia produce `IndexError` y no tiene prueba.
- El build frontend termina con una advertencia de chunk JavaScript mayor de 500 kB.
- La ejecucion completa con Docker Compose y la integracion HTTP no estan cubiertas por las pruebas actuales.

## Prioridades candidatas basadas en gaps

Estas prioridades no son compromisos de roadmap. Cada una deriva de un gap listado arriba y debe confirmarse antes de planificar trabajo.

1. Conectar en `frontend/src/App.tsx` los endpoints de resumen, facets, comparacion, alertas y segmentacion si forman parte del alcance de producto.
2. Sustituir o encapsular `generate_mock_movements` con una fuente persistente y evitar mutar el generador global de `random`.
3. Restringir CORS en `backend/app/main.py` mediante configuracion por entorno antes de exponer el backend.
4. Definir el comportamiento de datasets vacios y añadir pruebas para `build_metrics_facets`.
5. Añadir pruebas de zona horaria para `computeMonthlyData` y una prueba de integracion que ejercite frontend, proxy y backend con Docker Compose.
6. Investigar la advertencia de chunk >500 kB despues de medir el impacto real en la carga inicial.

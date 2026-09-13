# Regla: contratos y naming

## Nombre
Contratos de movimientos, fechas y periodos.

## Alcance
Aplica a modelos Pydantic y endpoints de `backend/app/routes.py`, tipos frontend en `frontend/src/lib/financial-types.ts`, transformaciones en `frontend/src/lib/financial-utils.ts` y etiquetas de periodo en `frontend/src/App.tsx` y `frontend/src/components/dashboard/dashboard-header.tsx`.

## Justificacion
`FinancialMovement` restringe `operation_type` a `income`/`outcome`, `category` a los literales de `Category` y `business_type` a `B2B`/`B2C`. `summarize_movements` genera periodos `YYYY-MM`, `YYYY-W##` o `YYYY-MM-DD`, mientras `computeMonthlyData` parsea `create_date` como fecha ISO. Ademas, el backend usa `date.today()` y la UI muestra la etiqueta fija `2024 - Full Year`.

## Guia especifica del proyecto

- Usa exactamente `income`/`outcome`, las categorias declaradas en `Category` y `B2B`/`B2C`; no introduzcas sinonimos.
- Conserva `create_date` como `YYYY-MM-DD` sin hora.
- Conserva los formatos de periodo de `backend/app/routes.py::summarize_movements`: `YYYY-MM` para mes, `YYYY-W##` para semana y `YYYY-MM-DD` para dia.
- Si cambias idioma o moneda, actualiza `formatCurrency`, `formatMonthYearLabel` y las pruebas en `frontend/src/lib/financial-utils.test.ts`; actualmente fijan `en-US` y `USD`.
- No conviertas `2024 - Full Year` en una afirmacion dinamica sin actualizar la fuente de datos de `generate_mock_movements` o la prop que `frontend/src/App.tsx` pasa a `DashboardHeader`.

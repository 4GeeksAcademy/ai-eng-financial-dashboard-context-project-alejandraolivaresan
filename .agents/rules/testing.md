# Regla: testing

## Nombre
Cobertura de cambios y casos limite.

## Alcance
Aplica a cambios en `backend/app/routes.py`, `backend/app/main.py`, `backend/tests/test_routes.py`, `frontend/src/lib/financial-utils.ts` y `frontend/src/lib/financial-utils.test.ts`.

## Justificacion
`backend/tests/test_routes.py` verifica la cantidad y el orden de los 360 movimientos generados con `seed=42`, ademas de endpoints HTTP. `frontend/src/lib/financial-utils.test.ts` verifica KPIs, agregacion mensual y formateadores. Aun no hay pruebas para listas vacias en facets, rangos invertidos ni zonas horarias.

## Guia especifica del proyecto

- Si cambias `generate_mock_movements(seed=42)`, actualiza las expectativas de cantidad, orden y contenido en `backend/tests/test_routes.py`.
- Si cambias `computeMonthlyData` o el parseo de `create_date`, agrega una prueba que cubra una zona horaria distinta; la implementacion actual usa `new Date(m.create_date)` y metodos de fecha local.
- Si `build_metrics_facets` debe aceptar una lista vacia, define la respuesta y agrega una prueba antes de cambiar el acceso actual a `ordered[0]` y `ordered[-1]`.
- Si `get_metrics_comparison` acepta rangos externos, rechaza o prueba explicitamente `start_date > end_date`.
- Para rutas o modelos, actualiza `backend/tests/test_routes.py`; para agregacion o formateo frontend, actualiza `frontend/src/lib/financial-utils.test.ts`.

# Overview del producto

## Producto
Financial Metrics Dashboard: dashboard web documentado en `README.md` para visualizar movimientos financieros, ingresos, egresos, beneficio y porcentaje de beneficio.

Este documento describe únicamente capacidades observadas en el código y la documentación del repositorio; no constituye un roadmap ni confirma capacidades no implementadas.

## Evidencia verificable

- `README.md` describe el proyecto como un dashboard de metricas financieras con frontend React + TypeScript y backend FastAPI.
- `frontend/src/App.tsx` solicita `GET /api/metrics`, calcula `computeKPIs` y `computeMonthlyData`, y renderiza `KPIRow`, `IncomeOutcomeChart` y `ProfitPercentChart`.
- `backend/app/routes.py` modela cada movimiento con `create_date`, `amount`, `operation_type`, `category` y `business_type`.
- `backend/app/routes.py` expone `/health`, `/api/metrics`, `/api/metrics/facets`, `/api/metrics/summary`, `/api/metrics/categories/top`, `/api/metrics/comparison`, `/api/metrics/alerts`, `/api/metrics/b2b` y `/api/metrics/b2c`.
- `README.md` documenta la ejecucion local con `docker compose up --build` y las URLs de frontend `5173`, backend `8000` y docs FastAPI `/docs`.

## Limites funcionales actuales

- La pantalla principal solo consume `/api/metrics`; los endpoints de facets, resumen, categorias, comparacion, alertas, B2B y B2C no tienen consumidores en `frontend/src/App.tsx`.
- Los datos backend son mock generados por `generate_mock_movements(seed=42)` en cada request; no hay persistencia ni almacenamiento de movimientos en el repositorio.
- No se afirma que los endpoints no consumidos por `frontend/src/App.tsx` formen parte de la experiencia disponible; su existencia en `backend/app/routes.py` solo prueba que están implementados en la API.

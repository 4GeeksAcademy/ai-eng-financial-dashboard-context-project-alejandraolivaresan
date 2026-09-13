# Regla: arquitectura y datos

## Nombre
Arquitectura de flujo financiero y precision de datos.

## Alcance
Aplica a `frontend/src/App.tsx`, `frontend/src/components`, `frontend/src/lib/financial-utils.ts`, `frontend/src/lib/mock-data.ts` y `backend/app/routes.py` cuando se agreguen endpoints, calculos, series o fuentes de datos del dashboard.

## Justificacion
`frontend/src/App.tsx` solo consume `/api/metrics`, calcula KPIs con `computeKPIs` y series con `computeMonthlyData`, y despues pasa los resultados a `frontend/src/components`. `frontend/src/lib/mock-data.ts` no participa en ese flujo. Ademas, `backend/app/routes.py` y las utilidades frontend usan `float`, por lo que la precision no es adecuada para nuevos requisitos contables sin una decision explicita.

## Guia especifica del proyecto

- Registra en `frontend/src/App.tsx` el consumo de cualquier endpoint que vaya a alimentar la pantalla y pasa sus datos a un componente de `frontend/src/components`.
- Mantén los calculos de KPIs y series en `frontend/src/lib/financial-utils.ts`; los componentes deben renderizar resultados ya calculados.
- No modifiques `frontend/src/lib/mock-data.ts` esperando cambiar la pantalla actual; cambia el `fetch` de `App.tsx` si la fuente debe ser otra.
- Antes de usar `FinancialMovement` para importes contables, define una representacion decimal y una politica de redondeo para `backend/app/routes.py` y `frontend/src/lib/financial-utils.ts`.

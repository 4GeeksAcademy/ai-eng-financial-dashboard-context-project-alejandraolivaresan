# Regla: documentacion, DX y seguridad

## Nombre
Entornos de ejecucion, validacion y configuracion segura.

## Alcance
Aplica a `docker-compose.yml`, `frontend/vite.config.ts`, `frontend/src/App.tsx`, `README.md`, `README.es.md` y `backend/app/main.py`.

## Justificacion
`docker-compose.yml` crea el hostname `backend` y expone los puertos `8000` y `5173`; `frontend/vite.config.ts` configura el proxy hacia `http://backend:8000`. Los README mencionan `frontend/.env.example`, pero ese archivo no existe. `backend/app/main.py` permite cualquier origen con `allow_origins=["*"]` y credenciales.

## Guia especifica del proyecto

- Mantén alineados `docker-compose.yml` y `frontend/vite.config.ts` cuando cambien puertos o destinos del proxy.
- Documenta por separado Compose y la ejecucion local de Vite; fuera de Compose el hostname `backend` no esta definido.
- No declares disponible `frontend/.env.example` en `README.md` o `README.es.md` hasta crear el archivo; `frontend/src/App.tsx` usa `VITE_API_BASE_URL` como configuracion alternativa.
- Ejecuta `cd backend && pytest`, `cd frontend && npm run test -- --run` y `cd frontend && npm run build` antes de cerrar cambios que afecten esas areas.
- Antes de desplegar fuera del entorno local, reemplaza `allow_origins=["*"]` en `backend/app/main.py` por los origenes permitidos.

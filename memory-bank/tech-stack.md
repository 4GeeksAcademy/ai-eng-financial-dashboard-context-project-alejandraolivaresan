# Stack tecnologico

## Lenguajes y runtime

- Python: backend y pruebas en `backend/`; version no fijada en `backend/requirements.txt`.
- TypeScript: frontend y configuracion Vite en `frontend/` (`tsconfig*.json`, `frontend/src/**/*.ts`, `frontend/src/**/*.tsx`).
- JavaScript/JSX runtime: React se ejecuta con `react` y `react-dom` en `frontend/package.json`.

## Frameworks y librerias clave

- Backend: FastAPI, Uvicorn y Pydantic transitivo; dependencias declaradas en `backend/requirements.txt` y aplicacion en `backend/app/main.py` y `backend/app/routes.py`.
- Frontend: React 19, Vite 8, TypeScript 6 y Tailwind CSS 4 mediante `@tailwindcss/vite`; declarados en `frontend/package.json` y configurados en `frontend/vite.config.ts`.
- Visualizacion: Recharts en `frontend/package.json`; componentes de graficos en `frontend/src/components/dashboard/`.
- Iconos: lucide-react en `frontend/package.json`.
- Testing frontend: Vitest y `@vitest/coverage-v8`; pruebas en `frontend/src/lib/financial-utils.test.ts`.
- Testing backend: pytest, pytest-cov y httpx; pruebas HTTP en `backend/tests/test_routes.py` usando `fastapi.testclient.TestClient`.

## Infraestructura y tooling

- Docker Compose orquesta los servicios `frontend` y `backend` en `docker-compose.yml`.
- `frontend/Dockerfile` usa `node:24-alpine`, instala dependencias con `npm install` y arranca Vite en `5173`.
- `backend/Dockerfile` define la imagen y arranque del servicio Python; el backend expone tambien el puerto `5678` para debugpy en Compose.
- `frontend/vite.config.ts` configura el proxy `/api` hacia `http://backend:8000` y el alias `@` hacia `frontend/src`.
- Scripts frontend disponibles en `frontend/package.json`: `dev`, `build`, `lint`, `preview`, `test`, `test:watch` y `test:coverage`.

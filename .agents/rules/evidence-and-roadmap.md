# Regla: evidencia y roadmap

## Nombre
Claims de producto y prioridades verificables.

## Alcance
Aplica a `memory-bank/`, `verification.md`, `README.md`, `README.es.md` y cualquier documento nuevo que describa capacidades, estado o trabajo futuro del repositorio.

## Justificacion
`frontend/src/App.tsx` solo consume `/api/metrics`, aunque `backend/app/routes.py` define endpoints adicionales. `memory-bank/product-overview.md` y `memory-bank/current-state.md` deben distinguir la existencia de una ruta de la disponibilidad de una experiencia en la UI. El repositorio contiene gaps observables, pero no contiene fechas, compromisos de entrega ni un roadmap aprobado.

## Guia especifica del proyecto

- Acepta un claim de producto solo si cita una evidencia existente: archivo, simbolo, endpoint, configuracion, prueba o comando reproducible.
- Describe como implementado solo lo que tenga una ruta de ejecucion verificable. La existencia de `/api/metrics/summary` en `backend/app/routes.py` no prueba que la pantalla lo consuma; `frontend/src/App.tsx` es la referencia del flujo actual.
- Etiqueta como gap cualquier capacidad observada en una regla, prueba o endpoint que no este conectada al flujo activo. En este repositorio, los endpoints no consumidos por `App.tsx` pertenecen a esa categoria.
- No inventes fechas, versiones objetivo, hitos, clientes, metricas de negocio ni compromisos de entrega: no hay evidencia de esos datos en `README.md`, `docker-compose.yml`, `frontend/package.json` o `backend/requirements.txt`.
- Escribe las prioridades futuras como propuestas basadas en gaps, no como roadmap aprobado. Cada prioridad debe citar el gap y las rutas que lo demuestran, como `backend/app/main.py` para CORS abierto o `backend/app/routes.py::build_metrics_facets` para listas vacias.
- Si una afirmacion no puede enlazarse a una evidencia del repositorio, omitele o marcala explicitamente como hipotesis pendiente de validar.

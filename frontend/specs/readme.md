# Integracion de funcionalidades

## Alcance

Este documento describe las tres funcionalidades de la fase 2 y su contrato de integracion con la API. Las rutas, nombres de parametros y restricciones se contrastaron con el esquema OpenAPI generado por FastAPI en `/docs`.

Los tipos se encuentran en:

- `api-types.ts`: respuestas `FacetsResponse`, `AlertEntry`, `AlertsResponse`, `CategoryEntry` y `TopCategoriesResponse`.
- `param-types.ts`: `ApiDate`, `GroupBy`, `DateRangeFilter`, `MovementFilterParams`, `AlertsParams` y `TopCategoriesParams`.
- `src/lib/financial-types.ts`: `FinancialMovement`, `OperationType`, `Category` y `BusinessType`.

## Reglas comunes de peticion

- Usar `fetch` nativo con la base opcional `VITE_API_BASE_URL`, como en `App.tsx`.
- Comprobar `response.ok` antes de leer JSON.
- Un error HTTP `422` representa parametros invalidos segun FastAPI y debe mostrarse como error de validacion, no como tabla vacia.
- Las fechas se envian como `YYYY-MM-DD` y los limites `start_date` y `end_date` son inclusivos en los filtros de movimientos.
- Las respuestas de listas son arrays JSON directos; no existe un envoltorio `items`.
- Los valores del contrato se conservan literalmente: `income`, `outcome`, `B2B`, `B2C` y las categorias declaradas.

## 1. Facets, rango y vista B2B/B2C

### Endpoints

| Uso | Metodo y ruta | Query | Respuesta |
| --- | --- | --- | --- |
| Opciones y rango disponible | `GET /api/metrics/facets` | Ninguna | `FacetsResponse` |
| Movimientos del segmento B2B | `GET /api/metrics/b2b` | `MovementFilterParams` | `FinancialMovement[]` |
| Movimientos del segmento B2C | `GET /api/metrics/b2c` | `MovementFilterParams` | `FinancialMovement[]` |

`/api/metrics/b2b` y `/api/metrics/b2c` fijan el segmento en la ruta. No se envia `business_type` en esas peticiones; la respuesta conserva el campo `business_type` para que la UI pueda verificarlo.

### Tipos y valores validos

`GET /api/metrics/facets` no tiene parametros. Su respuesta contiene:

- `operation_types`: lista de `income` y/o `outcome`.
- `business_types`: lista de `B2B` y/o `B2C`.
- `categories`: lista de `suppliers`, `sales`, `operational`, `administrative` y/o `others`.
- `min_date` y `max_date`: fechas con formato `YYYY-MM-DD`.

`MovementFilterParams` contiene:

- `start_date?: ApiDate`: fecha inicial inclusiva.
- `end_date?: ApiDate`: fecha final inclusiva.
- `category?: Category`: `suppliers`, `sales`, `operational`, `administrative` u `others`.
- `operation_type?: OperationType`: `income` u `outcome`.

### Casos limite y UI

1. **Solo existe un segmento en `business_types`.** La UI deshabilita o no renderiza la opcion ausente; no presenta B2B y B2C como disponibles por defecto.
2. **`min_date` y `max_date` son iguales.** El selector permite un unico dia y muestra ese valor como rango completo, sin exigir dos fechas distintas.
3. **El usuario introduce `start_date > end_date`.** La UI muestra un error junto al filtro y no envia la peticion; los endpoints B2B/B2C no deben usarse para ocultar ese error devolviendo una lista vacia.
4. **El filtro valido no devuelve movimientos.** La vista mantiene la estructura de la tabla o grafico y muestra un estado vacio, diferenciandolo de un error HTTP.

## 2. Tabla de anomalias

### Endpoint

| Metodo y ruta | Query | Respuesta |
| --- | --- | --- |
| `GET /api/metrics/alerts` | `AlertsParams` | `AlertsResponse` |

### Tipos y valores validos

`AlertsParams` contiene:

- `threshold?: number`: decimal mayor o igual a `0`; default `0.3`. `0.3` representa 30%, no 0.3%.
- `group_by?: GroupBy`: `day`, `week` o `month`; default `month`.
- `start_date?: ApiDate`: fecha inicial inclusiva en formato `YYYY-MM-DD`.
- `end_date?: ApiDate`: fecha final inclusiva en formato `YYYY-MM-DD`.
- `business_type?: BusinessType`: `B2B` o `B2C`; si se omite, analiza ambos segmentos.

Cada `AlertEntry` de `AlertsResponse` contiene:

- `period: string`: `YYYY-MM-DD` para dia, `YYYY-W##` para semana ISO o `YYYY-MM` para mes.
- `outcome_total: number`: total de egresos del periodo.
- `baseline_average: number`: promedio historico de egresos usado como linea base.
- `increase_ratio: number`: aumento relativo sobre la linea base; `0.35` se presenta como 35%.

### Casos limite y UI

1. **La respuesta es `[]`.** La tabla muestra "No hay anomalias para el rango y umbral seleccionados" y no muestra una fila de error ni inventa valores cero.
2. **La linea base historica es cero.** El backend no genera una alerta porque no puede calcular un aumento relativo; la UI no muestra `Infinity`, `NaN` ni una alerta artificial.
3. **`threshold = 0`.** La UI acepta el valor y explica que solo se muestran aumentos estrictamente positivos, porque la API alerta cuando el aumento supera el umbral.
4. **`threshold < 0` o una fecha con formato invalido.** La API responde `422`; la UI conserva los controles, marca el parametro invalido y no presenta la respuesta como una tabla vacia.

La tabla usa `group_by=month` por defecto. `increase_ratio` se etiqueta como aumento de egresos, nunca como margen o porcentaje de beneficio.

## 3. Tabla comparativa de categorias B2B vs B2C

### Endpoint

| Metodo y ruta | Query | Respuesta |
| --- | --- | --- |
| `GET /api/metrics/categories/top` | `TopCategoriesParams` | `TopCategoriesResponse` |

Para comparar segmentos, la UI realiza dos peticiones con el mismo rango, `operation_type` y `limit`, cambiando solo `business_type` entre `B2B` y `B2C`.

### Tipos y valores validos

`TopCategoriesParams` contiene:

- `operation_type?: OperationType`: `income` u `outcome`; default `outcome`.
- `limit?: number`: entero entre `1` y `20`; default `5`.
- `start_date?: ApiDate`: fecha inicial inclusiva en formato `YYYY-MM-DD`.
- `end_date?: ApiDate`: fecha final inclusiva en formato `YYYY-MM-DD`.
- `business_type?: BusinessType`: `B2B` o `B2C`.

Cada `CategoryEntry` de `TopCategoriesResponse` contiene:

- `category: Category`: `suppliers`, `sales`, `operational`, `administrative` u `others`.
- `operation_type: OperationType`: `income` u `outcome`.
- `total_amount: number`: suma de importes de la categoria para el tipo de operacion solicitado.

### Casos limite y UI

1. **Un segmento no tiene filas para el filtro.** La UI muestra el segmento como sin datos y no confunde la ausencia con un total devuelto por la API.
2. **Una categoria aparece en B2B pero no en B2C.** La comparacion alinea la categoria y muestra `0` solo en la celda visual de B2C; no modifica ni fabrica la respuesta tipada.
3. **`limit = 20` y hay menos de 20 categorias.** La UI muestra las categorias disponibles sin crear filas vacias.
4. **`limit = 0`, `limit = 21` o un decimal.** La API responde `422`; la UI rechaza el valor antes de enviar y conserva el ultimo resultado valido.

La tabla no suma B2B y B2C en una unica cifra. `total_amount` es un agregado por categoria, no el campo `amount` de un movimiento individual.

## Resoluciones del brief

- La vista B2B/B2C usa las rutas `/api/metrics/b2b` y `/api/metrics/b2c` para movimientos filtrados; `business_type` no se agrega a esas rutas porque ya esta fijado por el path.
- La comparacion de categorias usa `/api/metrics/categories/top` dos veces, una por segmento.
- La tabla de alertas analiza todos los segmentos si no se envia `business_type`; no se muestra una comparacion B2B/B2C de alertas por defecto.
- Un estado vacio significa respuesta `200` con lista vacia; un `422` significa parametros invalidos y debe comunicarse como error de validacion.
- La UI puede traducir etiquetas visibles, pero no cambia los nombres ni valores enviados a la API.

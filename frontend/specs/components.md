# Componentes por funcionalidad

## Alcance

Esta especificacion organiza los componentes del dashboard por funcionalidad y los vincula con los contratos de la API definidos en `api-types.ts` y `param-types.ts`. Los nombres descritos como "previstos" documentan una responsabilidad de UI; no implican que el componente ya exista en `frontend/src/components`.

## Reglas compartidas

- Las llamadas HTTP usan `fetch` nativo y la base opcional `VITE_API_BASE_URL`, igual que `App.tsx`.
- Cada respuesta debe validarse con `response.ok` antes de deserializarla.
- Los componentes de presentacion reciben datos tipados y no calculan agregaciones financieras.
- Las fechas de query usan `YYYY-MM-DD`, con limites `start_date` y `end_date` inclusivos.
- Los estados comunes son carga, error, datos vacios y datos cargados.
- Los valores `income`, `outcome`, `B2B` y `B2C` se conservan sin traducir en el contrato; las etiquetas visibles pueden localizarse en la UI.

## 1. Resumen ejecutivo

**Estado:** implementado.

**Componentes:**

- `DashboardHeader`: muestra el nombre del dashboard y el periodo visible.
- `KPIRow`: organiza los indicadores principales.
- `KPICard`: presenta un indicador, su valor, texto auxiliar, icono y estado de carga.
- `IncomeOutcomeChart`: representa ingresos y egresos por mes.
- `ProfitPercentChart`: representa el porcentaje de beneficio calculado.

**Fuente de datos:** `GET /api/metrics`.

**Flujo:**

1. `App.tsx` obtiene `FinancialMovement[]`.
2. `computeKPIs` calcula ingresos, egresos, beneficio y porcentaje.
3. `computeMonthlyData` genera las series mensuales.
4. Los componentes reciben los resultados ya calculados.

**Contrato:** `FinancialMovement` en `src/lib/financial-types.ts`. La API devuelve `create_date`, `amount`, `operation_type`, `category` y `business_type`.

**Props actuales:**

- `DashboardHeader`: `{ period?: string }`.
- `KPIRow`: `{ metrics: KPIMetrics | null; loading?: boolean }`.
- `KPICard`: `{ label: string; value: string; helperText: string; icon: LucideIcon; variant: "income" | "outcome" | "profit" | "profitPercent"; loading?: boolean }`.
- `IncomeOutcomeChart`: `{ data: MonthlyDataPoint[]; loading?: boolean }`.
- `ProfitPercentChart`: `{ data: MonthlyDataPoint[]; loading?: boolean }`.

## 2. Filtros, rango y vista B2B/B2C

**Estado:** previsto; no hay componentes equivalentes en el repositorio actual.

**Componentes previstos:**

- `MetricsFilters`: controla `start_date`, `end_date`, categoria y tipo de operacion cuando la vista consume movimientos filtrados.
- `BusinessTypeComparison`: permite cambiar o comparar los segmentos `B2B` y `B2C`.
- `DateRangeSummary`: muestra el rango disponible de `FacetsResponse` y el rango seleccionado.

**Props previstas:**

```ts
interface MetricsFiltersProps {
	facets: FacetsResponse;
	value: DateRangeFilter;
	onChange: (value: DateRangeFilter) => void;
}

interface BusinessTypeComparisonProps {
	available: FacetsResponse["business_types"];
	value: BusinessType;
	onChange: (value: BusinessType) => void;
}

interface DateRangeSummaryProps {
	facets: FacetsResponse;
	value: DateRangeFilter;
}
```

`MetricsFilters` usa `DateRangeFilter` como estado controlado. `BusinessTypeComparison` solo permite valores presentes en `facets.business_types`; no asume que ambos segmentos existan siempre.

**Fuente de opciones:** `GET /api/metrics/facets`.

**Parámetros:** `DateRangeFilter`, con `start_date` y `end_date` opcionales en formato `YYYY-MM-DD`. Los filtros de segmento usan `business_type` con valores `B2B` o `B2C`.

**Respuesta:** `FacetsResponse` contiene:

- `operation_types`: `income` y/o `outcome` disponibles.
- `business_types`: `B2B` y/o `B2C` disponibles.
- `categories`: categorias disponibles.
- `min_date` y `max_date`: limites del dataset en formato `YYYY-MM-DD`.

**Comportamiento:**

- El selector de fecha no debe permitir fechas fuera de `min_date` y `max_date`.
- Un rango sin una fecha mantiene ese limite abierto.
- El orden invertido debe mostrar un error de validacion en la UI y no enviar la consulta; la API solo garantiza el rechazo explicito para `/api/metrics/comparison`.
- La comparacion B2B/B2C debe conservar `business_type`; no debe renombrarlo a `customer_type`.

## 3. Tabla de anomalias

**Estado:** previsto; no existe una tabla de alertas en `frontend/src/components`.

**Componente previsto:** `AlertsTable`.

**Props previstas:**

```ts
interface AlertsTableProps {
	data: AlertsResponse;
	loading?: boolean;
	error?: string | null;
}
```

**Fuente de datos:** `GET /api/metrics/alerts`.

**Parámetros:** `AlertsParams`:

- `threshold`: numero decimal mayor o igual a `0`; por defecto `0.3`.
- `start_date` y `end_date`: opcionales, formato `YYYY-MM-DD`.

La tabla usa `group_by=month` fijo, porque `AlertsParams` no expone agrupacion. Las alertas se consultan para todos los segmentos; el brief no define una alerta separada por B2B/B2C.

**Respuesta:** `AlertsResponse`, una lista directa de `AlertEntry` sin envoltorio `items`.

Cada fila muestra:

- `period`: periodo de la alerta en formato `YYYY-MM-DD`, `YYYY-W##` o `YYYY-MM`.
- `outcome_total`: total de egresos del periodo.
- `baseline_average`: promedio historico usado como linea base.
- `increase_ratio`: aumento relativo; `0.35` se presenta como 35%.

**Estados:**

- Carga: skeleton de filas.
- Vacio: indicar que no hay anomalias para el rango y umbral seleccionados.
- Error: mostrar fallo de consulta sin presentar una tabla parcial.
- Datos: conservar el orden cronologico recibido por la API; no ordenar lexicograficamente periodos de granularidades distintas.

`increase_ratio` describe un aumento de egresos y no debe presentarse como margen o porcentaje de beneficio.

## 4. Tabla comparativa de categorias B2B vs B2C

**Estado:** previsto; no existe una tabla de categorias principales en `frontend/src/components`.

**Componentes previstos:**

- `TopCategoriesTable`: presenta las categorias principales del segmento seleccionado.
- `BusinessTypeTabs` o control equivalente: solicita los datos para `B2B` y `B2C` sin alterar los valores del contrato.

**Props previstas:**

```ts
interface TopCategoriesTableProps {
	data: TopCategoriesResponse;
	businessType: BusinessType;
	operationType: TopCategoriesParams["operation_type"];
	loading?: boolean;
	error?: string | null;
}

interface BusinessTypeTabsProps {
	value: BusinessType;
	onChange: (value: BusinessType) => void;
}
```

**Fuente de datos:** `GET /api/metrics/categories/top`.

**Parámetros:** `TopCategoriesParams`:

- `operation_type`: `income` o `outcome`; por defecto `outcome`.
- `limit`: numero entero entre `1` y `20`; por defecto `5`.
- `start_date` y `end_date`: opcionales, formato `YYYY-MM-DD`.
- `business_type`: `B2B` o `B2C` cuando se solicita un segmento concreto.

**Respuesta:** `TopCategoriesResponse`, una lista directa de `CategoryEntry` sin envoltorio `items`.

Cada fila muestra:

- `category`: `suppliers`, `sales`, `operational`, `administrative` u `others`.
- `operation_type`: tipo de operacion agregado.
- `total_amount`: suma de importes de la categoria; no es el importe de un movimiento individual.

**Comparacion:**

- Para comparar B2B y B2C, ejecutar la misma consulta con cada `business_type`.
- Mantener el mismo `operation_type`, rango y `limit` en ambas consultas.
- Una categoria ausente en un segmento se presenta como cero solo en la capa de visualizacion; la respuesta de la API no incluye filas con total cero si no hay movimientos.
- La tabla no mezcla ni suma respuestas B2B y B2C; conserva cada resultado en su columna o vista correspondiente.

## Limites de responsabilidad

- `App.tsx` conserva la orquestacion de carga y errores del dashboard existente.
- Los calculos de KPIs, beneficio y series siguen en `src/lib/financial-utils.ts`.
- Las tablas no deben duplicar calculos del backend ni cambiar los nombres de los campos.
- `frontend/specs` documenta contratos y responsabilidades; no es un registro de componentes implementados.

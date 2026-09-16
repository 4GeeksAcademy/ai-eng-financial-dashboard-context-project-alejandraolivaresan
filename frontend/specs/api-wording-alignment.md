# Alineacion entre wording del PM y contrato de la API

## Objetivo

Esta especificacion resuelve las diferencias de vocabulario entre el wording funcional del PM y los nombres reales del contrato de la API. La implementacion existente es la fuente de verdad para nombres, valores y formatos; esta spec no introduce aliases ni cambios de endpoint.

## Vocabulario canonico

| Wording del PM | Campo o concepto de API | Resolucion |
| --- | --- | --- |
| Ingreso, ingresos, revenue | `operation_type: "income"` y `amount` | Un movimiento es ingreso cuando `operation_type` vale `income`. El importe esta en `amount`. |
| Egreso, egresos, gasto, expense | `operation_type: "outcome"` y `amount` | Un movimiento es egreso cuando `operation_type` vale `outcome`. No se usa `expense` como valor de API. |
| Movimiento financiero, transaccion | `FinancialMovement` | El recurso contiene `create_date`, `amount`, `operation_type`, `category` y `business_type`. |
| Fecha, fecha de movimiento | `create_date` | Es una fecha sin hora con formato ISO `YYYY-MM-DD`; no se llama `date` en el contrato. |
| Tipo de cliente, segmento comercial | `business_type` | Los unicos valores son `B2B` y `B2C`. |
| Proveedor | `category: "suppliers"` | Es una categoria de egreso, no un `business_type`. |
| Ventas | `category: "sales"` | Es la categoria habitual de ingresos, pero el contrato permite `sales` como valor de `category` sin redefinirlo como tipo de operacion. |
| Operativo | `category: "operational"` | Categoria de egreso. |
| Administrativo | `category: "administrative"` | Categoria de egreso. |
| Otros | `category: "others"` | Categoria disponible para ingresos y egresos. |
| Beneficio, profit, balance neto | `net` en `MetricsSummaryItem` o valor de `current_period`/`previous_period` en `MetricsComparison` | No existe `profit` como campo. El neto es ingresos menos egresos. No debe esperarse `net` en `/api/metrics`. |
| Variacion absoluta | `delta_abs` | Diferencia entre el neto del periodo actual y el anterior. |
| Variacion porcentual, profit change % | `delta_pct` | Cambio porcentual del neto respecto al periodo anterior, expresado como numero en porcentaje, no como fraccion. Puede ser `null` si el neto anterior es cero. |
| Margen o porcentaje de beneficio | No es un campo de la API actual | Si el PM requiere margen, se calcula fuera del contrato como `net / income * 100`, con politica explicita para ingresos cero. No se debe llamar `delta_pct` margen. |
| Fecha desde / hasta | `start_date` / `end_date` | Los limites son inclusivos en los endpoints que filtran movimientos. |
| Agrupar por dia / semana / mes | `group_by: "day"` / `"week"` / `"month"` | El valor por defecto de `/api/metrics/summary` y `/api/metrics/alerts` es `month`. |
| Umbral de alerta | `threshold` | Es una fraccion decimal para comparar el aumento de egresos; por ejemplo `0.3` representa un 30%, no `30`. |

## Contratos relevantes

### Movimientos

`GET /api/metrics` devuelve una lista ordenada por `create_date` de objetos con esta forma:

```json
{
  "create_date": "YYYY-MM-DD",
  "amount": 1234.56,
  "operation_type": "income",
  "category": "sales",
  "business_type": "B2B"
}
```

Valores permitidos:

- `operation_type`: `income` o `outcome`.
- `category`: `suppliers`, `sales`, `operational`, `administrative` u `others`.
- `business_type`: `B2B` o `B2C`.

Los filtros `category` y `operation_type` mantienen esos nombres exactos. Los endpoints `/api/metrics/b2b` y `/api/metrics/b2c` son atajos filtrados por `business_type`; no cambian el nombre ni la forma de los campos.

### Resumen

`GET /api/metrics/summary` devuelve elementos con:

```json
{
  "period": "YYYY-MM",
  "income": 1234.56,
  "outcome": 789.01,
  "net": 445.55
}
```

El formato de `period` depende de `group_by`:

- `day`: `YYYY-MM-DD`.
- `week`: `YYYY-W##` usando semana ISO.
- `month`: `YYYY-MM`.

Los campos `income` y `outcome` son totales por periodo, no nombres alternativos para `operation_type`.

### Categorias principales

`GET /api/metrics/categories/top` devuelve `category`, `operation_type` y `total_amount`. `total_amount` es el total de la categoria para el tipo de operacion solicitado; no es un importe individual ni un campo llamado `amount`.

### Comparacion

`GET /api/metrics/comparison` requiere `start_date` y `end_date` y devuelve:

```json
{
  "current_period": 100.0,
  "previous_period": 80.0,
  "delta_abs": 20.0,
  "delta_pct": 25.0
}
```

Los cuatro valores comparan **neto**, no ingresos brutos ni egresos brutos. El periodo anterior tiene la misma duracion que el actual y termina el dia anterior a `start_date`. Un rango invertido (`start_date > end_date`) responde `400`.

### Alertas

`GET /api/metrics/alerts` devuelve `period`, `outcome_total`, `baseline_average` e `increase_ratio`.

- `outcome_total` y `baseline_average` son totales de egresos.
- `increase_ratio` es una fraccion decimal: `0.35` equivale a un aumento del 35%.
- La alerta se produce cuando el aumento supera `threshold`; no representa un margen de beneficio.

## Reglas de redaccion para UI y documentacion

1. Usar “ingreso” y “egreso” en texto de producto, y mapearlos a `income` y `outcome` al hablar del contrato.
2. Usar “beneficio neto” para `net`, `current_period`, `previous_period` y `delta_abs` cuando el contexto sea financiero; no presentar esos campos como “ventas” o “facturacion”.
3. Reservar “margen” o “porcentaje de beneficio” para una formula calculada, porque la API actual no entrega ese campo.
4. Usar “segmento B2B/B2C” para `business_type`; no traducir esos valores ni sustituirlos por `customer_type`.
5. Mostrar fechas como fechas ISO de calendario y conservar los nombres `start_date` y `end_date` en parametros de integracion.

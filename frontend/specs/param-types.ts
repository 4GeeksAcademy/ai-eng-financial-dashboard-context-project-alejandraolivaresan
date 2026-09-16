import type {
  BusinessType,
  Category,
  OperationType,
} from "../src/lib/financial-types";

/** Cadena con forma de fecha ISO de calendario `YYYY-MM-DD`. */
export type ApiDate = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

/** Granularidad aceptada por los endpoints de resumen y alertas. */
export type GroupBy = "day" | "week" | "month";

export interface DateRangeFilter {
  /** Fecha inicial inclusiva del filtro, en formato `YYYY-MM-DD`; opcional. */
  start_date?: ApiDate;
  /** Fecha final inclusiva del filtro, en formato `YYYY-MM-DD`; opcional. */
  end_date?: ApiDate;
}

export interface MovementFilterParams extends DateRangeFilter {
  /** Categoria opcional: `suppliers`, `sales`, `operational`, `administrative` u `others`. */
  category?: Category;
  /** Tipo de operacion opcional: `income` o `outcome`. */
  operation_type?: OperationType;
}

export interface AlertsParams extends DateRangeFilter {
  /** Umbral decimal de aumento de egresos; debe ser `>= 0` y por defecto es `0.3`. */
  threshold?: number;
  /** Granularidad de alerta: `day`, `week` o `month`; por defecto `month`. */
  group_by?: GroupBy;
  /** Segmento comercial opcional: `B2B` o `B2C`. */
  business_type?: BusinessType;
}

export interface TopCategoriesParams extends DateRangeFilter {
  /** Tipo de operacion: `income` o `outcome`; por defecto es `outcome`. */
  operation_type?: OperationType;
  /** Numero entero de categorias a devolver; rango valido `1..20`, por defecto `5`. */
  limit?: number;
  /** Segmento comercial opcional: `B2B` o `B2C`. */
  business_type?: BusinessType;
}

import type {
  BusinessType,
  OperationType,
} from "../src/lib/financial-types";

/** Cadena con forma de fecha ISO de calendario `YYYY-MM-DD`. */
export type ApiDate = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export interface DateRangeFilter {
  /** Fecha inicial inclusiva del filtro, en formato `YYYY-MM-DD`; opcional. */
  start_date?: ApiDate;
  /** Fecha final inclusiva del filtro, en formato `YYYY-MM-DD`; opcional. */
  end_date?: ApiDate;
}

export interface AlertsParams extends DateRangeFilter {
  /** Umbral decimal de aumento de egresos; debe ser `>= 0` y por defecto es `0.3`. */
  threshold?: number;
}

export interface TopCategoriesParams extends DateRangeFilter {
  /** Tipo de operacion: `income` o `outcome`; por defecto es `outcome`. */
  operation_type?: OperationType;
  /** Numero entero de categorias a devolver; rango valido `1..20`, por defecto `5`. */
  limit?: number;
  /** Segmento comercial opcional: `B2B` o `B2C`. */
  business_type?: BusinessType;
}

import type {
  BusinessType,
  Category,
  OperationType,
} from "../src/lib/financial-types";
import type { ApiDate } from "./param-types";

export interface FacetsResponse {
  /** Valores disponibles: `income` y `outcome`. */
  operation_types: OperationType[];
  /** Segmentos comerciales disponibles: `B2B` y `B2C`. */
  business_types: BusinessType[];
  /** Categorias disponibles: `suppliers`, `sales`, `operational`, `administrative` y `others`. */
  categories: Category[];
  /** Fecha minima disponible, en formato ISO `YYYY-MM-DD`. */
  min_date: ApiDate;
  /** Fecha maxima disponible, en formato ISO `YYYY-MM-DD`. */
  max_date: ApiDate;
}

export interface AlertEntry {
  /** Periodo de la alerta: `YYYY-MM-DD`, `YYYY-W##` o `YYYY-MM`, segun `group_by`. */
  period: string;
  /** Total de egresos del periodo, expresado como numero decimal. */
  outcome_total: number;
  /** Promedio historico de egresos usado como linea base, expresado como numero decimal. */
  baseline_average: number;
  /** Aumento relativo frente a la linea base; `0.35` representa un 35%. */
  increase_ratio: number;
}

/** Lista JSON directa de entradas de anomalias; no tiene un envoltorio `items`. */
export interface AlertsResponse extends Array<AlertEntry> {}

export interface CategoryEntry {
  /** Categoria agregada: `suppliers`, `sales`, `operational`, `administrative` u `others`. */
  category: Category;
  /** Tipo de operacion agregado: `income` o `outcome`. */
  operation_type: OperationType;
  /** Total acumulado de la categoria para el tipo de operacion solicitado. */
  total_amount: number;
}

/** Lista JSON directa de categorias principales; no tiene un envoltorio `items`. */
export interface TopCategoriesResponse extends Array<CategoryEntry> {}

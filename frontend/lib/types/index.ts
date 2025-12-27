export interface Period {
  id: string;
  start_date: string;
  end_date: string;
  monthly_salary: number;
}

export interface PeriodBreakdown {
  start_date: string;
  end_date: string;
  months: number;
  years: number;
  original_salary: number;
  coefficient: number;
  adjusted_salary: number;
  multiplier: number;
  amount: number;
  is_pre_2014: boolean;
}

export interface Step {
  step: number;
  description: string;
  calculation: string;
}

export interface FormulaExplanation {
  formula: string;
  steps: Step[];
}

export interface CalculationResult {
  total_amount: number;
  average_salary: number;
  total_months: number;
  period_breakdowns: PeriodBreakdown[];
  explanation: FormulaExplanation;
  calculated_at: string;
}

export interface CalculationRequest {
  periods: Period[];
  calculation_year: string;
}

export interface OCRResult {
  imageId: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  extractedPeriods?: Period[];
  confidence?: number;
  errorMessage?: string;
  retryCount: number;
}

export interface Coefficient {
  id: number;
  year: number;
  month: number;
  coefficient: number;
  effective_from: string;
  effective_to: string;
  is_active: boolean;
}

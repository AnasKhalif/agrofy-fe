export interface StuntingResult {
  id: number;
  child_id: number;
  child?: { id: number; name: string; gender: string };
  gender: string;
  age: number;
  height: number;
  weight: number | null;
  measurement_date: string;
  z_score: number;
  prediction_result: 'severely stunted' | 'stunted' | 'normal' | 'tinggi';
  prediction_label: string;
  notes: string | null;
  created_at: string;
  advice?: StuntingAdvice;
  foods?: FoodSuggestion[];
  who_ref?: WhoReference;
}

export interface StuntingAdvice {
  label: string;
  color: string;
  message: string;
  steps: string[];
  stimulasi: string[];
}

export interface FoodSuggestion {
  name: string;
  benefit: string;
  icon: string;
}

export interface WhoReference {
  SD3neg: number;
  SD2neg: number;
  SD1neg: number;
  median: number;
  SD1: number;
  SD2: number;
  SD3: number;
}

export interface DetectRequest {
  child_id: number;
  height: number;
  weight?: number;
  measurement_date: string;
  notes?: string;
}

export interface DetectResponse {
  result: StuntingResult;
  child: { id: number; name: string; gender: string };
  age_months: number;
  z_score: number;
  who_ref: WhoReference;
  advice: StuntingAdvice;
  foods: FoodSuggestion[];
}

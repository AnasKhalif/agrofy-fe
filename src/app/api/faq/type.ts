export interface FaqItem {
  id: number;
  user_id: number;
  question: string;
  answer: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaqListParams {
  search?: string;
  published?: boolean;
}

export interface CreateFaqRequest {
  question: string;
  answer: string;
  published?: boolean;
}

export type UpdateFaqRequest = Partial<CreateFaqRequest>;

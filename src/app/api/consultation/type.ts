export interface Consultation {
  id: number;
  parent_id: number;
  health_worker_id: number;
  child_id: number | null;
  status: 'pending' | 'ongoing' | 'completed';
  subject: string | null;
  parent?: {
    id: number;
    name: string;
    email: string;
  };
  health_worker?: {
    id: number;
    name: string;
    email: string;
  };
  child?: {
    id: number;
    name: string;
  };
  latest_message?: ConsultationMessage | null;
  messages_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ConsultationMessage {
  id: number;
  consultation_id: number;
  sender_id: number;
  message: string;
  attachment: string | null;
  is_read: boolean;
  sender?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ConsultationListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface CreateConsultationRequest {
  health_worker_id: number;
  child_id?: number;
  subject?: string;
}

export interface SendMessageRequest {
  message: string;
  attachment?: string;
}

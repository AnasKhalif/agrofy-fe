export interface ParentDashboard {
  total_children: number;
  total_detections: number;
  active_consultations: number;
  status_counts: Record<string, number>;
  latest_results: {
    id: number;
    child_name: string;
    measurement_date: string;
    prediction_result: string;
    prediction_label: string;
    z_score: number;
    height: number;
    age: number;
  }[];
  children_summary: {
    id: number;
    name: string;
    gender: string;
    age_in_months: number;
    latest_status: string | null;
    latest_label: string;
    latest_height: number | null;
    latest_date: string | null;
  }[];
}

export interface DoctorDashboard {
  total_consultations: number;
  pending_consultations: number;
  ongoing_consultations: number;
  completed_consultations: number;
  total_patients: number;
  recent_consultations: {
    id: number;
    parent_name: string;
    subject: string | null;
    status: string;
    created_at: string;
  }[];
}

export interface AdminDashboard {
  total_users: number;
  total_children: number;
  total_detections: number;
  total_consultations: number;
  status_counts: Record<string, number>;
  monthly_detections: { month: string; total: number }[];
}

export type VaccineStatus = 'given' | 'due' | 'overdue' | 'upcoming';

export interface VaccineScheduleItem {
  code: string;
  name: string;
  recommended_age: number; // bulan
  catch_up_until: number;  // bulan
  group: string;
}

export interface ChildVaccineItem extends VaccineScheduleItem {
  status: VaccineStatus;
  given_date: string | null;
  batch_no: string | null;
  notes: string | null;
  record_id: number | null;
}

export interface VaccinationListResponse {
  child: {
    id: number;
    name: string;
    gender: 'laki-laki' | 'perempuan';
    date_of_birth: string;
    age_months: number;
  };
  items: ChildVaccineItem[];
  summary: {
    total: number;
    given: number;
    due: number;
    overdue: number;
    upcoming: number;
  };
}

export interface RecordVaccinationRequest {
  vaccine_code: string;
  given_date: string;
  batch_no?: string;
  notes?: string;
}

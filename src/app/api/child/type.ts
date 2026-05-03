export interface ChildItem {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  gender: 'laki-laki' | 'perempuan';
  date_of_birth: string;
  birth_weight: number | null;
  birth_height: number | null;
  asi_eksklusif: boolean | null;
  age_in_months: number;
  photo: string | null;
  parent?: {
    id: number;
    name: string;
    email: string;
  } | null;
  created_at: string;
}

export interface CreateChildRequest {
  name: string;
  gender: 'laki-laki' | 'perempuan';
  date_of_birth: string;
  birth_weight?: number;
  birth_height?: number;
  asi_eksklusif?: boolean;
}

export type UpdateChildRequest = Partial<CreateChildRequest>;

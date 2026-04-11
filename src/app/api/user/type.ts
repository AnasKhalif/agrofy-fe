export interface UserItem {
  id: number;
  uid: string;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  role: string | { id: number; name: string; display_name: string } | null;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  role: string;
}

export type UpdateUserRequest = Partial<Omit<CreateUserRequest, 'password'>> & {
  password?: string;
};

export interface RoleItem {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
}

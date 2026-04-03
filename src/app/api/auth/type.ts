/** Auth types */

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  is_nex: boolean;
  description: string;
  created_at: string;
  updated_at: string;
  branches: Branch[];
}

export interface Profile {
  id: string;
  company_id: string;
  role_id: string;
  first_name: string;
  last_name: string;
  national_id_number: string;
  gender: "male" | "female";
  birth_place: string;
  birth_date: string | null;
  last_education: string;
  profession: string;
  marital_status: string;
  religion: string;
  province_id: string;
  city_id: string;
  sub_district_id: string;
  province: string;
  city: string;
  sub_district: string;
  rt_rw: string;
  address: string;
  photo: string;
  email: string;
  phone_number: string;
  passcode: string;
  branch_ids: string[];
  branches: Branch[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role | null;
  company: Company | null;
  is_active: boolean;
  email_verified: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  profile: Profile | null; // Employee profile details
  selected_branch: Branch | null; // Current selected branch from JWT
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
  company_name: string;
  company_address: string;
  company_npwp: string;
}

export interface RegisterEmployeeRequest {
  token: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterEmployeeResponse {
  id: string;
  email: string;
  name: string;
  company_id: string;
  role_id: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface UpdateAccountData {
  name?: string;
  email?: string;
}

export interface ChangeBranchRequest {
  branch_id: string;
}

export interface LoginData {
  token: string;
  user: User;
  expires_at: string;
}

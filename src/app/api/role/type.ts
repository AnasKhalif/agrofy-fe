export interface RoleItem {
  id: number;
  name: string;
  display_name: string;
  description: string | null;
  permissions: string[];
  created_at: string;
}

export interface CreateRoleRequest {
  name: string;
  display_name: string;
  description?: string;
  permissions?: string[];
}

export type UpdateRoleRequest = Partial<CreateRoleRequest>;

export interface PermissionItem {
  id: number;
  name: string;
  display_name: string | null;
  description: string | null;
}

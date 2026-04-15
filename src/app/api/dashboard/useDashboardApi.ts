import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi } from "@/shared/types/api/type";
import { dashboardApi } from "./dashboardApi";
import type { AdminDashboard, DoctorDashboard, ParentDashboard } from "./type";

export const useGetParentDashboard = (options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<ParentDashboard>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["dashboard", "parent"], queryFn: () => dashboardApi.getParent(), refetchInterval: 30000 });

export const useGetDoctorDashboard = (options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<DoctorDashboard>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["dashboard", "doctor"], queryFn: () => dashboardApi.getDoctor(), refetchInterval: 30000 });

export const useGetAdminDashboard = (options?: Omit<UseQueryOptions<AxiosResponse<ResponseApi<AdminDashboard>>, AxiosError>, "queryKey" | "queryFn">) =>
  useQuery({ ...options, queryKey: ["dashboard", "admin"], queryFn: () => dashboardApi.getAdmin(), refetchInterval: 60000 });

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/auth";
import { ROUTES } from "@/app/constants/router";
import { useBoolean } from "@/shared/hooks";
import { useStandby } from "@/app/contexts/StandbyContext";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const loading = useBoolean();
  const { setStandby } = useStandby();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage("");
    loading.setTrue();

    try {
      const loggedInUser = await login(data.email, data.password);
      const roleName = loggedInUser?.role
        ? (typeof loggedInUser.role === "string"
            ? loggedInUser.role
            : loggedInUser.role.name
          ).toLowerCase()
        : "";

      const redirectPath =
        roleName === "dokter" || roleName === "health_worker" || roleName === "doctor"
          ? ROUTES.PARENT.DASHBOARD
          : roleName === "admin"
            ? ROUTES.PARENT.DASHBOARD
            : roleName === "superadmin"
              ? ROUTES.PARENT.DASHBOARD
              : ROUTES.PARENT.DASHBOARD;

      setStandby(false);
      navigate(redirectPath, { replace: true });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Login failed. Please check your credentials.";
      setErrorMessage(message);
    } finally {
      loading.setFalse();
    }
  };

  return {
    form,
    errorMessage,
    isLoading: loading.value,
    onSubmit,
  };
};

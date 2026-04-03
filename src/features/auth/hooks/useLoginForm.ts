import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/auth";
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
      await login(data.email, data.password);
      // Login successful, redirect to dashboard
      setStandby(false);
      navigate("/");
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

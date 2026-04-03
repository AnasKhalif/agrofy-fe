import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { usePostRegister } from "@/app/api/auth/useAuthApi";
import { ROUTES } from "@/app/constants/router";
import { useBoolean } from "@/shared/hooks";
import { useToast } from "@/shared/hooks/useToast";
import { getEncryptedItem, removeEncryptedItem } from "@/shared/utils/encryptionUtils";
import type { RegisterData } from "@/app/api/auth/type";

interface RegisterStep1Data {
  full_name: string;
  phone_number: string;
  address: string;
}

interface RegisterStep2FormData {
  email: string;
  password: string;
  confirm_password: string;
}

const STORAGE_KEY = "register_user_profile_data";

export const useRegisterStep2Form = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const loading = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(true);

  const form = useForm<RegisterStep2FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const registerMutation = usePostRegister({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  useEffect(() => {
    const step1Data = getEncryptedItem<RegisterStep1Data>(STORAGE_KEY);
    if (!step1Data) {
      toast.error("Silakan isi data langkah 1 terlebih dahulu");
      navigate(ROUTES.AUTH.REGISTER, { replace: true });
      return;
    }

    if (!step1Data.full_name || !step1Data.phone_number || !step1Data.address) {
      toast.error("Data langkah 1 tidak valid. Silakan isi ulang.");
      removeEncryptedItem(STORAGE_KEY);
      navigate(ROUTES.AUTH.REGISTER, { replace: true });
      return;
    }

    setIsValidating(false);
  }, [navigate, toast]);

  const handleGoBack = useCallback(() => {
    navigate(ROUTES.AUTH.REGISTER);
  }, [navigate]);

  const onSubmit = useCallback(
    async (data: RegisterStep2FormData) => {
      setErrorMessage("");
      loading.setTrue();

      try {
        const step1Data = getEncryptedItem<RegisterStep1Data>(STORAGE_KEY);
        if (!step1Data) {
          throw new Error("Data langkah 1 tidak ditemukan");
        }

        const payload: RegisterData = {
          full_name: step1Data.full_name,
          phone_number: step1Data.phone_number,
          address: step1Data.address,
          email: data.email,
          password: data.password,
          confirm_password: data.confirm_password,
        };

        await registerMutation.mutateAsync(payload);
        removeEncryptedItem(STORAGE_KEY);
        toast.success("Registrasi berhasil. Silakan login.");
        navigate(ROUTES.AUTH.LOGIN);
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data
            ?.message || "Registrasi gagal. Silakan coba lagi.";
        setErrorMessage(message);
        toast.error(message);
      } finally {
        loading.setFalse();
      }
    },
    [loading, navigate, registerMutation, toast],
  );

  return {
    form,
    onSubmit,
    handleGoBack,
    errorMessage,
    isLoading: loading.value,
    isValidating,
  };
};

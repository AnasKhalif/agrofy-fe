import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { ROUTES } from "@/app/constants/router";
import { useBoolean } from "@/shared/hooks";
import { getEncryptedItem, setEncryptedItem } from "@/shared/utils/encryptionUtils";

interface RegisterStep1FormData {
  full_name: string;
  phone_number: string;
  address: string;
}

const STORAGE_KEY = "register_user_profile_data";

export const useRegisterStep1Form = () => {
  const navigate = useNavigate();
  const loading = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<RegisterStep1FormData>({
    defaultValues: {
      full_name: "",
      phone_number: "",
      address: "",
    },
  });

  useEffect(() => {
    const savedData = getEncryptedItem<RegisterStep1FormData>(STORAGE_KEY);
    if (savedData) {
      form.reset(savedData);
    }
  }, [form]);

  const onSubmit = useCallback(
    async (data: RegisterStep1FormData) => {
      setErrorMessage("");
      loading.setTrue();

      try {
        setEncryptedItem(STORAGE_KEY, data);
        navigate(ROUTES.AUTH.REGISTER_STEP_2);
      } catch {
        setErrorMessage("Gagal menyimpan data. Silakan coba lagi.");
      } finally {
        loading.setFalse();
      }
    },
    [loading, navigate],
  );

  return {
    form,
    onSubmit,
    errorMessage,
    isLoading: loading.value,
  };
};

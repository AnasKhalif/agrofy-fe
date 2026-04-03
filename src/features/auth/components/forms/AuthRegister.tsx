import { Button } from "@/shared/components/theme-ui";
import { Form, FormTextField } from "@/shared/components/agrofy-ui-legacy";
import { useRegisterStep1Form } from "../../hooks/useRegisterStep1Form";

const AuthRegister = () => {
  const { form, errorMessage, isLoading, onSubmit } = useRegisterStep1Form();
  const {
    formState: { errors },
  } = form;

  return (
    <>
      <Form form={form} className="mt-6 pt-5" onSubmit={onSubmit}>
        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/50 dark:text-red-300 dark:border-red-800">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <FormTextField
            className="form-control"
            id="full-name-input"
            name="full_name"
            label="Nama Lengkap"
            placeholder="Masukkan Nama Lengkap"
            fullWidth
            rules={{
              required: "Nama lengkap wajib diisi",
              minLength: {
                value: 2,
                message: "Nama minimal 2 karakter",
              },
              maxLength: {
                value: 120,
                message: "Nama maksimal 120 karakter",
              },
            }}
            helperText={errors.full_name?.message}
          />
        </div>

        <div className="mb-4">
          <FormTextField
            className="form-control"
            id="phone-input"
            name="phone_number"
            label="No. WhatsApp / Telepon"
            placeholder="Contoh: 081234567890"
            fullWidth
            rules={{
              required: "No. WhatsApp / Telepon wajib diisi",
              pattern: {
                value: /^[0-9+]{8,20}$/,
                message: "Nomor harus 8-20 digit (boleh diawali +)",
              },
            }}
            helperText={errors.phone_number?.message}
          />
        </div>

        <div className="mb-4">
          <FormTextField
            className="form-control"
            id="address-input"
            name="address"
            label="Alamat"
            placeholder="Masukkan alamat lengkap"
            fullWidth
            multiline
            rows={3}
            rules={{
              required: "Alamat wajib diisi",
              maxLength: {
                value: 255,
                message: "Alamat maksimal 255 karakter",
              },
            }}
            helperText={errors.address?.message}
          />
        </div>

        <Button
          id="register-step-1-button"
          type="submit"
          color="primary"
          className="rounded-md w-full"
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Lanjutkan"}
        </Button>
      </Form>
    </>
  );
};

export default AuthRegister;

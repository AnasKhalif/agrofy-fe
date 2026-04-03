import { Button } from "@/shared/components/theme-ui";
import { Form, FormTextField } from "@/shared/components/agrofy-ui-legacy";
import { useRegisterStep2Form } from "../../hooks/useRegisterStep2Form";
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

const AuthRegister2 = () => {
  const {
    form,
    errorMessage,
    isLoading,
    isValidating,
    onSubmit,
    handleGoBack,
  } = useRegisterStep2Form();

  const {
    formState: { errors },
  } = form;

  const password = form.watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (isValidating) {
    return <div className="py-8 text-center text-sm opacity-80">Memuat data...</div>;
  }

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
            id="email-input"
            name="email"
            label="Email"
            placeholder="Masukkan Email"
            type="email"
            fullWidth
            rules={{
              required: "Email wajib diisi",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format email tidak valid",
              },
              maxLength: {
                value: 255,
                message: "Email maksimal 255 karakter",
              },
            }}
            helperText={errors.email?.message}
          />
        </div>

        <div className="mb-4">
          <FormTextField
            className="form-control"
            id="password-input"
            name="password"
            label="Password"
            placeholder="Masukkan Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            rules={{
              required: "Password wajib diisi",
              minLength: {
                value: 6,
                message: "Password minimal 6 karakter",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors.password?.message}
          />
        </div>

        <div className="mb-4">
          <FormTextField
            className="form-control"
            id="confirm-password-input"
            name="confirm_password"
            label="Konfirmasi Password"
            placeholder="Ulangi Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            rules={{
              required: "Konfirmasi password wajib diisi",
              validate: (value: string) =>
                value === password || "Konfirmasi password tidak sama",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors.confirm_password?.message}
          />
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            id="register-step-2-back-button"
            type="button"
            color="secondary"
            className="rounded-md flex-1"
            onClick={handleGoBack}
            disabled={isLoading}
          >
            Kembali
          </Button>
          <Button
            id="register-step-2-button"
            type="submit"
            color="primary"
            className="rounded-md flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Mendaftar..." : "Daftar"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AuthRegister2;

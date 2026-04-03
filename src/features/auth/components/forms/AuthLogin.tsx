/* eslint-disable react-refresh/only-export-components */
import { Button, Label, Checkbox } from "@/shared/components/theme-ui";
import { Form, FormTextField } from "@/shared/components/agrofy-ui-legacy";
// import { Link } from "react-router";
import { useLoginForm } from "../../hooks/useLoginForm";
import { FC, useState } from "react";
import { StandbyProvider } from "@/app/contexts/StandbyContext";
import { IconButton, InputAdornment } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

const AuthLoginContent: FC = () => {
  const { form, errorMessage, isLoading, onSubmit } = useLoginForm();
  const {
    register,
    formState: { errors },
  } = form;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Form form={form} className="mt-6" onSubmit={onSubmit}>
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900/50 dark:text-red-300 dark:border-red-800">
            {errorMessage}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <FormTextField
            className="form-control"
            id="email-input"
            name="email"
            label="Email"
            placeholder="Masukan Email"
            type="email"
            fullWidth
            rules={{ required: "Email Wajib" }}
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <FormTextField
            className="form-control"
            id="password-input"
            name="password"
            label="Password"
            placeholder="Masukan Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            rules={{
              required: "Email Wajib",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
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

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              className="checkbox"
              color="primary"
              {...register("rememberMe")}
            />
            <Label
              htmlFor="rememberMe"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          {/* <Link to={"/auth/auth1/forgot-password"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link> */}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          id="login-button"
          color="primary"
          className="rounded-md w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Login"}
        </Button>
      </Form>
    </>
  );
};

const AuthLogin: FC = () => {
  return (
    <StandbyProvider>
      <AuthLoginContent />
    </StandbyProvider>
  );
};

export default AuthLogin;

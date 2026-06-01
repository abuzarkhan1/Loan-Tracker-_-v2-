import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { ROUTES } from "../../config/routes.config";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const loginSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = zod.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const showExpired = searchParams.get("expired") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setServerError(null);
    try {
      await login(data);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-appBg px-4 py-12 select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-appPrimary text-white font-extrabold text-xl shadow-lg">
            LT
          </div>
          <h2 className="text-2xl font-extrabold text-appText tracking-tight">
            Welcome to <span className="text-appPrimary">Loan Tracker</span>
          </h2>
          <p className="text-sm text-appMuted max-w-xs">
            Manage your personal finance, envelopes, and loan records safely.
          </p>
        </div>

        {/* Form container */}
        <Card variant="elevated" className="border border-appBorder/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {showExpired && (
              <div className="rounded-xl bg-appWarning/10 border border-appWarning/25 p-3.5 text-center text-xs font-semibold text-appWarning">
                Your session has expired. Please log in again.
              </div>
            )}
            
            {serverError && (
              <div className="rounded-xl bg-appDanger/10 border border-appDanger/25 p-3.5 text-center text-xs font-semibold text-appDanger">
                {serverError}
              </div>
            )}

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              disabled={loading}
              {...register("register" in register ? "email" : "email" as any)}
            />

            <div className="space-y-1">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                disabled={loading}
                {...register("password" as any)}
              />
              <div className="flex justify-end pr-1 pt-1.5">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-bold text-appPrimary hover:text-appPrimaryDark transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-2 py-3">
              Log In
            </Button>
          </form>
        </Card>

        {/* Footer links */}
        <p className="text-center text-xs font-semibold text-appMuted">
          Don't have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-bold text-appPrimary hover:text-appPrimaryDark transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

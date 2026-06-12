import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock, Mail, ShieldCheck, WalletCards } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { ROUTES } from "../../config/routes.config";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import BrandLogo from "../../components/common/BrandLogo";
import { CanvasRevealEffect } from "../../components/ui/CanvasRevealEffect";

const loginSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = zod.infer<typeof loginSchema>;

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message;
  }
  return undefined;
};

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
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(err) || "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-black px-4 py-10 select-none relative overflow-hidden">
      {/* Dynamic Canvas Dots Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [255, 255, 255],
              [255, 255, 255],
            ]}
            dotSize={6}
            reverse={false}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.4)_0%,_rgba(0,0,0,1)_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-elevated lg:grid-cols-[0.95fr_1.05fr]">
        <div className="navy-panel hidden p-8 lg:flex lg:flex-col lg:justify-between rounded-l-3xl border-0 relative overflow-hidden">
          {/* Subtle panel grid/reveal overlay */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <CanvasRevealEffect
              animationSpeed={1.5}
              containerClassName="bg-transparent"
              colors={[[255, 255, 255]]}
              dotSize={4}
              showGradient={false}
            />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <BrandLogo markSize="lg" />

              <div className="mt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#a3acb9]">Simple hisaab</p>
                <h1 className="mt-3 max-w-md text-3xl font-bold leading-tight tracking-tight text-white">
                  Track loans, payments, expenses, and saving goals with clarity.
                </h1>
                <p className="mt-5 max-w-md text-[15px] font-normal leading-7 text-[#c7d2e1]">
                  A professional workspace for money you gave, money you took, partial payments, and daily cash records.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
                <WalletCards className="h-5 w-5 text-white" />
                <p className="mt-3 text-xs font-semibold text-white">Clean dashboard</p>
                <p className="mt-1 text-xs font-normal leading-5 text-[#c7d2e1]">Balances and charts at a glance.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
                <ShieldCheck className="h-5 w-5 text-white" />
                <p className="mt-3 text-xs font-semibold text-white">Private records</p>
                <p className="mt-1 text-xs font-normal leading-5 text-[#c7d2e1]">Your personal ledger stays organized.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div>
              <BrandLogo showText={false} markSize="lg" className="mb-6 lg:hidden" />
              <p className="page-kicker">Welcome back</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-appText">Log in</h2>
              <p className="mt-2 text-[15px] font-normal leading-6 text-appTextSecondary">
                Continue your loan tracker and expense ledger.
              </p>
            </div>

            <Card variant="bordered" className="border-appBorder/60">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {showExpired && (
              <div className="rounded-lg border border-appWarning/25 bg-appWarning/10 p-3.5 text-center text-xs font-semibold text-appWarning">
                Your session has expired. Please log in again.
              </div>
            )}
            
            {serverError && (
              <div className="rounded-lg border border-appDanger/25 bg-appDanger/10 p-3.5 text-center text-xs font-semibold text-appDanger">
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
              {...register("email")}
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
                {...register("password")}
              />
              <div className="flex justify-end pr-1 pt-1.5">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-medium text-appPrimary transition-colors hover:text-appPrimaryHover"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={loading}  rightIcon={<ArrowRight className="h-4 w-4" />}>
              Log In
            </Button>
              </form>
            </Card>

            <p className="text-center text-xs font-semibold text-appMuted">
              Don't have an account?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="font-medium text-appPrimary transition-colors hover:text-appPrimaryHover"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

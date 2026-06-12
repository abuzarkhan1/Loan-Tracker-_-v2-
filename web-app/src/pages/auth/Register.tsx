import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Target, User, WalletCards } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { ROUTES } from "../../config/routes.config";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import BrandLogo from "../../components/common/BrandLogo";
import { CanvasRevealEffect } from "../../components/ui/CanvasRevealEffect";

const registerSchema = zod.object({
  name: zod.string().min(1, "Name is required").max(50, "Name must be under 50 characters"),
  email: zod.string().min(1, "Email is required").email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormInputs = zod.infer<typeof registerSchema>;

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message;
  }
  return undefined;
};

export const Register: React.FC = () => {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setServerError(null);
    try {
      await registerUser(data);
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(err) || "Failed to create account. Email might already be taken."
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
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#a3acb9]">Start simple</p>
                <h1 className="mt-3 max-w-md text-3xl font-bold leading-tight tracking-tight text-white">
                  Build a clean money ledger in minutes.
                </h1>
                <p className="mt-5 max-w-md text-[15px] font-normal leading-7 text-[#c7d2e1]">
                  Add contacts, track given or taken loans, record partial payments, and manage everyday income and expenses.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
                <WalletCards className="h-5 w-5 text-white" />
                <p className="mt-3 text-xs font-semibold text-white">Loan clarity</p>
                <p className="mt-1 text-xs font-normal leading-5 text-[#c7d2e1]">Remaining balances update automatically.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4">
                <Target className="h-5 w-5 text-white" />
                <p className="mt-3 text-xs font-semibold text-white">Saving goals</p>
                <p className="mt-1 text-xs font-normal leading-5 text-[#c7d2e1]">Track progress toward personal targets.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div>
              <BrandLogo showText={false} markSize="lg" className="mb-6 lg:hidden" />
              <p className="page-kicker">Create account</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-appText">Get started</h2>
              <p className="mt-2 text-[15px] font-normal leading-6 text-appTextSecondary">
                Your simple workspace for loans, contacts, expenses, and goals.
              </p>
            </div>

            <Card variant="bordered" className="border-appBorder/60">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="rounded-lg border border-appDanger/25 bg-appDanger/10 p-3.5 text-center text-xs font-semibold text-appDanger">
                {serverError}
              </div>
            )}

            <Input
              id="name"
              type="text"
              label="Full Name"
              placeholder="Alex Mercer"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              disabled={loading}
              {...register("name")}
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="alex@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              disabled={loading}
              {...register("email")}
            />

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

            <Button type="submit" variant="primary" fullWidth isLoading={loading}  rightIcon={<ArrowRight className="h-4 w-4" />}>
              Sign Up
            </Button>
              </form>
            </Card>

            <p className="text-center text-xs font-semibold text-appMuted">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-appPrimary transition-colors hover:text-appPrimaryHover"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

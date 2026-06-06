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
    <div className="app-shell-bg flex min-h-screen w-screen items-center justify-center bg-appBg px-4 py-10 select-none">
      <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[32px] border border-appBorder bg-appCard shadow-elevated lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden border-r border-appBorder bg-appBgSoft/70 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandLogo markSize="lg" />

            <div className="mt-16">
              <p className="page-kicker">Start simple</p>
              <h1 className="mt-3 max-w-md text-4xl font-extrabold leading-tight tracking-tight text-appText">
                Build a clean money ledger in minutes.
              </h1>
              <p className="mt-5 max-w-md text-sm font-semibold leading-7 text-appMuted">
                Add contacts, track given or taken loans, record partial payments, and manage everyday income and expenses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-appBorder bg-appCard p-4">
              <WalletCards className="h-5 w-5 text-appPrimary" />
              <p className="mt-3 text-xs font-extrabold text-appText">Loan clarity</p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-appMuted">Remaining balances update automatically.</p>
            </div>
            <div className="rounded-2xl border border-appBorder bg-appCard p-4">
              <Target className="h-5 w-5 text-appSuccess" />
              <p className="mt-3 text-xs font-extrabold text-appText">Saving goals</p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-appMuted">Track progress toward personal targets.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md space-y-7">
            <div>
              <BrandLogo showText={false} markSize="lg" className="mb-6 lg:hidden" />
              <p className="page-kicker">Create account</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-appText">Get started</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-appMuted">
                Your simple workspace for loans, contacts, expenses, and goals.
              </p>
            </div>

            <Card variant="bordered" className="border-appBorder/60">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="rounded-xl bg-appDanger/10 border border-appDanger/25 p-3.5 text-center text-xs font-semibold text-appDanger">
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

            <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-2 py-3" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Sign Up
            </Button>
              </form>
            </Card>

            <p className="text-center text-xs font-semibold text-appMuted">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-bold text-appPrimary hover:text-appPrimaryDark transition-colors"
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

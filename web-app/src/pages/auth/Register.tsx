import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { ROUTES } from "../../config/routes.config";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const registerSchema = zod.object({
  name: zod.string().min(1, "Name is required").max(50, "Name must be under 50 characters"),
  email: zod.string().min(1, "Email is required").email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormInputs = zod.infer<typeof registerSchema>;

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
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Failed to create account. Email might already be taken."
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
            Create your account
          </h2>
          <p className="text-sm text-appMuted max-w-xs">
            Start tracking loans, envelopes, cycles, and expenses globally.
          </p>
        </div>

        {/* Form container */}
        <Card variant="elevated" className="border border-appBorder/50">
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
              {...register("name" as any)}
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="alex@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              disabled={loading}
              {...register("email" as any)}
            />

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

            <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-2 py-3">
              Sign Up
            </Button>
          </form>
        </Card>

        {/* Footer links */}
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
  );
};

export default Register;

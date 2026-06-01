import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const forgotSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotFormInputs = zod.infer<typeof forgotSchema>;

export const ForgotPassword: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
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
            Reset password
          </h2>
          <p className="text-sm text-appMuted max-w-xs">
            We will send you instructions on how to safely recover your credentials.
          </p>
        </div>

        {/* Form container */}
        <Card variant="elevated" className="border border-appBorder/50">
          {!success ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Registered Email"
                placeholder="name@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                disabled={loading}
                {...register("email" as any)}
              />

              <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-2 py-3">
                Send Recovery Instructions
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-center py-4">
              <div className="rounded-xl bg-appSuccess/10 border border-appSuccess/20 p-4 text-xs font-semibold text-appSuccess leading-relaxed">
                Instructions have been dispatched successfully. Please check your spam folder if you do not receive it shortly.
              </div>
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 text-xs font-bold text-appPrimary hover:text-appPrimaryDark transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          )}
        </Card>

        {/* Footer links */}
        {!success && (
          <p className="text-center text-xs font-semibold text-appMuted">
            Remembered your password?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-bold text-appPrimary hover:text-appPrimaryDark transition-colors"
            >
              Log in here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

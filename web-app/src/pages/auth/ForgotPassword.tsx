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
import BrandLogo from "../../components/common/BrandLogo";
import { CanvasRevealEffect } from "../../components/ui/CanvasRevealEffect";

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
    <div className="flex min-h-screen w-screen items-center justify-center bg-black px-4 py-12 select-none relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center gap-2">
          <BrandLogo showText={false} markSize="md" />
          <h2 className="text-xl font-semibold tracking-tight text-appText">
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

              <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-2">
                Send Recovery Instructions
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-center py-4">
              <div className="rounded-lg border border-appSuccess/20 bg-appSuccess/10 p-4 text-xs font-medium leading-relaxed text-appSuccess">
                Instructions have been dispatched successfully. Please check your spam folder if you do not receive it shortly.
              </div>
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 text-xs font-medium text-appPrimary transition-colors hover:text-appPrimaryHover"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
              </Link>
            </div>
          )}
        </Card>

        {/* Footer links */}
        {!success && (
          <p className="text-center text-xs font-normal text-appMuted">
            Remembered your password?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="font-medium text-appPrimary transition-colors hover:text-appPrimaryHover"
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

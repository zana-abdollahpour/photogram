"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FormRootError } from "@/components/auth/_form-root-error";

import { authClient } from "@/lib/auth/client";
import { SignupFormData, signupSchema } from "@/lib/auth/schema";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const rootError = form.formState.errors.root;
  const isSubmitting = form.formState.isSubmitting;

  const handleSignup = async (data: SignupFormData) => {
    try {
      const { error: signupError } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (signupError) {
        form.setError("root", signupError);
        return;
      }

      const { error: signinError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signinError) {
        router.push("/login");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <form
        onSubmit={form.handleSubmit(handleSignup)}
        className="space-y-4"
        noValidate
      >
        {rootError && <FormRootError>{rootError.message}</FormRootError>}

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Giordano Giovanna"
                disabled={isSubmitting}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="giordano@example.com"
                disabled={isSubmitting}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <hr className="border-border" />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  aria-invalid={fieldState.invalid}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </Card>
  );
}

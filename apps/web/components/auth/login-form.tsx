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
import { LoginFormData, loginSchema } from "@/lib/auth/schema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const rootError = form.formState.errors.root;
  const isSubmitting = form.formState.isSubmitting;

  const handleLogin = async (data: LoginFormData) => {
    try {
      const { error: signinError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signinError) {
        form.setError("root", signinError);
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div>
        <div className="mb-7">
          <h2 className="text-foreground text-xl font-medium">Welcome back</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="space-y-4"
          noValidate
        >
          {rootError && <FormRootError>{rootError.message}</FormRootError>}

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
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* TODO: add forgot password feature */}
          {/* <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Forgot password?
            </Link>
          </div> */}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </Card>
  );
}

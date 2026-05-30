import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "name must be at least 2 characters long"),
    email: z.email("please provide a valid email address"),
    password: z.string().min(8, "password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

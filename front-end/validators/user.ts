import { z } from "zod";

// Define UserSchema using Zod
export const SignUpValidator = z
  .object({
    fullName: z.string().min(1),
    email: z.string().email("Use um email válido"),
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser a mesma",
    path: ["passwordConfirmation"], // path of error
  });
export type SignUpInfer = z.infer<typeof SignUpValidator>;

export const PasswordValidator = z
  .object({
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser a mesma",
    path: ["passwordConfirmation"], // path of error
  });

export type PasswordInfer = z.infer<typeof PasswordValidator>;

export const StoreUserValidator = z
  .object({
    fullName: z.string().min(1),
    email: z.string().email("Use um email válido"),
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/),
    passwordConfirmation: z.string(),
    isAdmin: z.enum(["false", "true"]),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser a mesma",
    path: ["passwordConfirmation"], // path of error
  });

export type StoreUserInfer = z.infer<typeof StoreUserValidator>;

export const UserInfoProfileValidator = z.object({
  fullName: z.string().min(1),
  email: z.string().email("Use um email válido"),
});

export type UserInfoProfileInfer = z.infer<typeof UserInfoProfileValidator>;

export const PutUserValidator = z.object({
  fullName: z.string().min(1),
  email: z.string().email("Use um email válido"),
  isAdmin: z.enum(["false", "true"]),
});

export type PutUserInfer = z.infer<typeof PutUserValidator>;

import { z } from "zod";
// password redefinition
// external register
// internal register
// general users edit
// user general
// store ticket

// password redefinition
export const PasswordRedefinitionValidator = z
  .object({
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/, {
        message: "8 digitos, caracter especial, letras maisculas e minusculas",
      }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser a mesma",
    path: ["passwordConfirmation"], // path of error
  });

// external register, login, internal register, profile general, password redifinition
export type PasswordRedefinitionInfer = z.infer<
  typeof PasswordRedefinitionValidator
>;

// external register
export const ExternalRegisterValidator = z
  .object({
    // a to z, A to Z, acentos, remove start and end space, lowercase
    fullName: z.string().trim().min(5).toLowerCase(),
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/, {
        message: "8 digitos, caracter especial, letras maisculas e minusculas",
      }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser a mesma",
    path: ["passwordConfirmation"], // path of error
  });

//ExternalRegisterValidator validator

export type ExternalRegisterInfer = z.infer<typeof ExternalRegisterValidator>;
ExternalRegisterValidator;

// internal register
export const InternalRegisterValidator = z
  .object({
    // a to z, A to Z, acentos, remove start and end space, lowercase
    fullName: z.string().trim().min(5).toLowerCase(),
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message: "8 digitos, caracter especial, letras maisculas e minusculas",
      }),
    passwordConfirmation: z.string(),
    isAdmin: z.enum(["false", "true"]),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser a mesma",
    path: ["passwordConfirmation"], // path of error
  });

export type InternalRegisterInfer = z.infer<typeof InternalRegisterValidator>;

// general users edit
export const GeneralUsersValidator = z.object({
  fullName: z.string(),
  email: z.string().email().trim().toLowerCase(),
  isAdmin: z.enum(["false", "true"]),
});

export type GeneralUsersInfer = z.infer<typeof GeneralUsersValidator>;

// user general
export const GeneralUserValidation = z.object({
  fullName: z.string().toLowerCase().trim().optional().or(z.literal("")),

  email: z
    .string()
    .toLowerCase()
    .trim()
    .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "deve conter nome e dominio, exemplo: email@email.com",
    })
    .optional()
    .or(z.literal("")),
});

export type GeneralUserInfer = z.infer<typeof GeneralUserValidation>;

// store ticket

export const StoreTicketValidation = z.object({
  subject: z
    .string()
    .min(3, { message: "minimo 3 caracteres" })
    .max(50, { message: "maximo 50 caracteres" }),
  description: z
    .string()
    .min(3, { message: "minimo 3 caracteres" })
    .max(500, { message: "maximo 500 caracteres" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  priority: z.string().min(1, { message: "Selecione uma prioridade" }),
});

export type StoreTicketInfer = z.infer<typeof StoreTicketValidation>;

export const TicketConfigValidator = z.object({
  name: z.string().min(1, { message: "digite um nome" }),

  color: z.string().min(1, { message: "Escolha uma cor" }),
});

export type TicketConfigInfer = z.infer<typeof TicketConfigValidator>;

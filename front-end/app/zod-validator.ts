import { z } from "zod";
// password redefinition
// external register
// internal register
// general users edit
// user general

// password redefinition
export const PasswordRedefinitionValidator = z
  .object({
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
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
    fullName: z
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
        message: "apenas letras, com ou sem acentos!",
      })
      .trim()
      .min(5)
      .toLowerCase(),
    email: z
      .string()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "deve conter nome e dominio, exemplo: email@email.com",
      })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
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
    fullName: z
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
        message: "apenas letras, com ou sem acentos!",
      })
      .trim()
      .min(5)
      .toLowerCase(),
    email: z
      .string()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: "deve conter nome e dominio, exemplo: email@email.com",
      })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message: "8 digitos, caracter especial, letras maisculas e minusculas",
      }),
    passwordConfirmation: z.string(),
    isAdmin: z.enum(["0", "1"]),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas devem ser a mesma",
    path: ["passwordConfirmation"], // path of error
  });

export type InternalRegisterInfer = z.infer<typeof InternalRegisterValidator>;

// general users edit
export const UsersEditValidator = z.object({
  fullName: z.string().regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
    message: "Nome deve conter apenas letras, com ou sem acentos!",
  }),
  email: z
    .string()
    .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email deve conter nome e dominio, exemplo: nome@dominio.com",
    })
    .trim()
    .toLowerCase(),
  isAdmin: z.enum(["0", "1"]),
});

export type UsersEditInfer = z.infer<typeof UsersEditValidator>;

// user general
export const GeneralUserValidation = z.object({
  fullName: z
    .string()
    .toLowerCase()
    .trim()
    .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/, {
      message: "Nome deve conter apenas letras, com ou sem acentos!",
    })
    .optional()
    .or(z.literal("")),

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

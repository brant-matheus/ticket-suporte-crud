import vine from '@vinejs/vine'

//schemas
const PasswordSchema = vine.object({
  password: vine
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/)
    .confirmed({
      confirmationField: 'passwordConfirmation',
    }),
})

const UserSchema = vine.object({
  email: vine.string().trim().email().toLowerCase(),
  fullName: vine.string().trim(),
  isAdmin: vine.boolean(),
})

//compiles
export const StoreUserValidator = vine.compile(
  vine.object({
    ...PasswordSchema.getProperties(),
    ...UserSchema.getProperties(),
  })
)

export const PasswordValidator = vine.compile(PasswordSchema)

export const PutUserValidator = vine.compile(UserSchema)

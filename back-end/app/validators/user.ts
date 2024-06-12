import vine from '@vinejs/vine'

//same regex front/back
//trim: removes whitespace from start to end, lowercase: lowercase the input before storing it
// external register validator, strick to false, user MUST not create anything bug a client user.
export const ExternalUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().toLowerCase().email(),
    password: vine
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/)
      .confirmed({
        confirmationField: 'passwordConfirmation',
      }),
    fullName: vine
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/)
      .trim(),
  })
)

export const InternalUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: vine
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/)
      .confirmed({
        confirmationField: 'passwordConfirmation',
      }),
    fullName: vine
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/)
      .trim(),
    isAdmin: vine.boolean(),
  })
)

export const PutUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/),
    fullName: vine
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/)
      .trim(),
    isAdmin: vine.boolean(),
  })
)

export const PutPasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*]).{8,}$/)
      .confirmed({
        confirmationField: 'passwordConfirmation',
      }),
  })
)

export const PutProfileValidator = vine.compile(
  vine.object({
    fullName: vine
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/)
      .trim(),
    email: vine
      .string()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
      .trim()
      .toLowerCase(),
  })
)

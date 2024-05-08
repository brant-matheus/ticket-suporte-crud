import vine from '@vinejs/vine'

//same regex front/back
//trim: removes whitespace from start to end, lowercase: lowercase the input before storing it
// external register validator, strick to false, user MUST not create anything bug a client user.
export const ExternalUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: vine
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .confirmed({
        confirmationField: 'passwordConfirmation',
      }),
    fullName: vine
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/)
      .trim()
      .toLowerCase(),
    isAdmin: vine.boolean({ strict: false }),
  })
)

export const PostUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/),
    password: vine
      .string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .confirmed({
        confirmationField: 'passwordConfirmation',
      }),
    fullName: vine
      .string()
      .regex(/^[A-Za-z-áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+$/)
      .trim()
      .toLowerCase(),
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
      .trim()
      .toLowerCase(),
    isAdmin: vine.boolean(),
  })
)

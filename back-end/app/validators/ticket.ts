import vine from '@vinejs/vine'

export const TicketValidator = vine.compile(
  vine.object({
    subject: vine.string(),
    description: vine.string().maxLength(500),
    category: vine.string(),
    priority: vine.string(),
  })
)

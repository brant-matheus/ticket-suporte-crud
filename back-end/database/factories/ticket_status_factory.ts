import factory from '@adonisjs/lucid/factories'
import TicketStatus from '#models/ticket_status'

export const TicketStatusFactory = factory
  .define(TicketStatus, async ({ faker }) => {
    return {
      name: faker.color.rgb(),
    }
  })
  .build()

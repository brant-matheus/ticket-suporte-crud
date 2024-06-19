import factory from '@adonisjs/lucid/factories'
import TicketStatus from '#models/ticket_status'

export const TicketStatusFactory = factory
  .define(TicketStatus, async ({ faker }) => {
    return {
      name: faker.lorem.word(),
      colorId: faker.number.int({ min: 1, max: 7 }),
      responsibleId: 1,
    }
  })
  .build()

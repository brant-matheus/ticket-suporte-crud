import factory from '@adonisjs/lucid/factories'
import TicketStatus from '#models/ticket_status'
import { UserFactory } from './user_factory.js'

export const TicketStatusFactory = factory
  .define(TicketStatus, async ({ faker }) => {
    return {
      name: faker.lorem.word(),
      colorId: faker.number.int({ min: 1, max: 7 }),
    }
  })

  .relation('responsible', () => UserFactory)
  .build()

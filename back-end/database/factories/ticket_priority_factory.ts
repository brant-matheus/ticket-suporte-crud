import factory from '@adonisjs/lucid/factories'
import TicketPriority from '#models/ticket_priority'
import Color from '#models/color'
import { UserFactory } from './user_factory.js'

export const TicketPriorityFactory = factory
  .define(TicketPriority, async ({ faker }) => {
    return {
      name: faker.lorem.word(),
      colorId: faker.number.int({ min: 1, max: 7 }),
    }
  })

  .relation('responsible', () => UserFactory)
  .build()

import factory from '@adonisjs/lucid/factories'
import TicketCategory from '#models/ticket_category'
import { UserFactory } from './user_factory.js'

export const TicketCategoryFactory = factory
  .define(TicketCategory, async ({ faker }) => {
    return {
      name: faker.lorem.word(12),
      colorId: faker.number.int({ min: 1, max: 7 }),
    }
  })

  .relation('responsible', () => UserFactory)
  .build()

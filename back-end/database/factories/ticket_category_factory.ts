import factory from '@adonisjs/lucid/factories'
import TicketCategory from '#models/ticket_category'

export const TicketCategoryFactory = factory
  .define(TicketCategory, async ({ faker }) => {
    return {
      name: faker.lorem.word(),
      colorId: faker.number.int({ min: 1, max: 7 }),
      responsibleId: 1,
    }
  })
  .build()

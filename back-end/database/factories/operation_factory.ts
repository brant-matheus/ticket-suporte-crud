import Operation from '#models/operation'
import factory from '@adonisjs/lucid/factories'
import { TicketFactory } from './ticket_factory.js'
import { UserFactory } from './user_factory.js'

export const OperationFactory = factory
  .define(Operation, async ({ faker }) => {
    return {
      description: faker.word.words({ count: 5 }),
    }
  })

  .relation('responsible', () => UserFactory)
  .relation('ticket', () => TicketFactory)
  .build()

import Ticket from '#models/ticket'
import factory from '@adonisjs/lucid/factories'
import { TicketCategoryFactory } from './ticket_category_factory.js'
import { TicketPriorityFactory } from './ticket_priority_factory.js'
import { TicketStatusFactory } from './ticket_status_factory.js'
import { UserFactory } from './user_factory.js'

export const TicketFactory = factory
  .define(Ticket, async ({ faker }) => {
    return {
      description: faker.word.words({ count: 5 }),

      subject: faker.word.words({ count: 10 }),
    }
  })
  .relation('ticketPriority', () => TicketPriorityFactory)

  .relation('ticketCategory', () => TicketCategoryFactory)
  .relation('ticketStatus', () => TicketStatusFactory)
  .relation('user', () => UserFactory)
  .build()

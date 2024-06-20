import User from '#models/user'
import factory from '@adonisjs/lucid/factories'
import { TicketFactory } from './ticket_factory.js'
import { TicketStatusFactory } from './ticket_status_factory.js'
import { TicketCategoryFactory } from './ticket_category_factory.js'
import { TicketPriorityFactory } from './ticket_priority_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email().toLowerCase(),
      fullName: faker.person.fullName(),
      password: 'Testing@123',
      isAdmin: false,
    }
  })
  .state('admin', (user) => (user.isAdmin = true))
  .relation('ticketPriority', () => TicketPriorityFactory)
  .relation('ticketCategory', () => TicketCategoryFactory)
  .relation('ticketStatus', () => TicketStatusFactory)
  .relation('ticket', () => TicketFactory)
  .build()

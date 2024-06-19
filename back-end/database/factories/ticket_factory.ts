import factory from '@adonisjs/lucid/factories'
import Ticket from '#models/ticket'
import { UserFactory } from './user_factory.js'
import { TicketCategoryFactory } from './ticket_category_factory.js'
import { TicketPriorityFactory } from './ticket_priority_factory.js'
import TicketStatus from '#models/ticket_status'
import { TicketStatusFactory } from './ticket_status_factory.js'

export const TicketFactory = factory
  .define(Ticket, async ({ faker }) => {
    const guest = await UserFactory.create()
    const category = await TicketCategoryFactory.create()
    const priority = await TicketPriorityFactory.create()
    const status = await TicketStatusFactory.create()
    return {
      createdById: guest.id,
      description:
        'The has many relationship is defined using the @hasMany decorator on a model property.',
      isConclued: false,
      ticketCategoryId: category.id,
      ticketPriorityId: priority.id,
      ticketStatusId: status.id,
      subject: 'has many relationship',
    }
  })
  .relation('user', () => TicketFactory)
  .build()

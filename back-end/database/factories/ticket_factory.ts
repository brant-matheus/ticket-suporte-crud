import Ticket from '#models/ticket'
import factory from '@adonisjs/lucid/factories'
import { TicketCategoryFactory } from './ticket_category_factory.js'
import { TicketPriorityFactory } from './ticket_priority_factory.js'
import { TicketStatusFactory } from './ticket_status_factory.js'

export const TicketFactory = factory
  .define(Ticket, async ({ faker }) => {
    const category = await TicketCategoryFactory.create()
    const priority = await TicketPriorityFactory.create()
    const status = await TicketStatusFactory.create()
    return {
      description:
        'The has many relationship is defined using the @hasMany decorator on a model property.',
      ticketCategoryId: category.id,
      ticketPriorityId: priority.id,
      ticketStatusId: status.id,
      subject: 'has many relationship',
    }
  })
  .relation('user', () => TicketFactory)
  .build()

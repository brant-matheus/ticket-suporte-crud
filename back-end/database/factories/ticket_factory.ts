import factory from '@adonisjs/lucid/factories'
import Ticket from '#models/ticket'

export const TicketFactory = factory
  .define(Ticket, async ({ faker }) => {
    return {
      createdById: 2,
      description:
        'The has many relationship is defined using the @hasMany decorator on a model property.',
      isConclued: false,
      ticketCategoryId: 1,
      ticketPriorityId: 1,
      ticketStatusId: 1,
      subject: 'has many relationship',
    }
  })
  .relation('user', () => TicketFactory)
  .build()

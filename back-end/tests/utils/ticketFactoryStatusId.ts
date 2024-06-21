import { TicketCategoryFactory } from '#database/factories/ticket_category_factory'
import { TicketPriorityFactory } from '#database/factories/ticket_priority_factory'
import { UserFactory } from '#database/factories/user_factory'
import Ticket from '#models/ticket'

export async function ticketFactoryStatusId(statusId: number) {
  const user = await UserFactory.create()
  const category = await TicketCategoryFactory.merge({ responsibleId: user.id }).create()
  const priority = await TicketPriorityFactory.merge({ responsibleId: user.id }).create()

  await Ticket.create({
    createdById: user.id,
    ticketStatusId: statusId,
    subject: 'has many relationship',
    description:
      'The has many relationship is defined using the @hasMany decorator on a model property.',
    ticketCategoryId: category.id,
    ticketPriorityId: priority.id,
  })
}

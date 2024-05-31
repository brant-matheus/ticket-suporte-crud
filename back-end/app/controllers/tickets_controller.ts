import type { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/ticket'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'

export default class TicketsController {
  /**
   * Display a list of resource
   */
  async index({ request, auth }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])
    if (auth.user?.isAdmin) {
      return await Ticket.query()
        .preload('user')
        .preload('ticketCategory')
        .preload('ticketPriority')
        .preload('ticketStatus')
        .paginate(page, pageSize)
    } else {
      return await Ticket.query()
        .where('created_by_id', auth.user?.id as number)
        .preload('ticketCategory')
        .preload('ticketPriority')
        .preload('ticketStatus')
        .paginate(page, pageSize)
    }
  }

  async store({ request, auth }: HttpContext) {
    const { subject, category, priority, description } = request.only([
      'subject',
      'category',
      'priority',
      'description',
    ])
    const userId = auth.user?.id
    const categoryId = (await TicketCategory.findByOrFail('name', category)).id
    const priorityId = (await TicketPriority.findByOrFail('name', priority)).id
    return await Ticket.create({
      subject: subject,
      ticketCategoryId: categoryId,
      createdById: userId,
      description: description,
      ticketPriorityId: priorityId,
      ticketStatusId: 1,
    })
  }

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {
    //allow to delete if ticket status !== ticket status first (pendente)
    const ticket = await Ticket.findOrFail(params.id)
    if (ticket.ticketStatusId !== 1) {
      throw new Error()
    } else {
      ticket.delete()
    }
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/ticket'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import { DateTime } from 'luxon'
import Operation from '#models/operation'
import TicketStatus from '#models/ticket_status'

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

  async update({ params, request, auth }: HttpContext) {
    // update either the priority or status
    const { fromTable, ticketConfigItem } = request.only(['fromTable', 'ticketConfigItem'])
    //
    const ticket = await Ticket.findOrFail(params.id)
    //
    const updatedTime = DateTime.local()

    switch (fromTable) {
      case 'ticket_status_id':
        const statusId = (await TicketStatus.findByOrFail('name', ticketConfigItem)).id
        await ticket.merge({ ticketStatusId: statusId, updatedAt: updatedTime }).save()
        break

      case 'ticket_priority_id':
        const priorityId = (await TicketPriority.findByOrFail('name', ticketConfigItem)).id
        await ticket.merge({ ticketPriorityId: priorityId, updatedAt: updatedTime }).save()
        break
      default:
        break
    }
    return request.all()
  }

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

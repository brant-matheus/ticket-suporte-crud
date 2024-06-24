import Ticket from '#models/ticket'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class TicketsController {
  async show({}: HttpContext) {}

  async index({ request, auth, response }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    if (auth.user?.isAdmin) {
      const data = await Ticket.query()
        .preload('user')
        .preload('ticketStatus', (ticketStatus) => ticketStatus.preload('color'))
        .preload('ticketCategory', (ticketCategory) => ticketCategory.preload('color'))
        .preload('ticketPriority', (ticketPriority) => ticketPriority.preload('color'))
        .paginate(page, pageSize)
      return response.ok(data)
    }

    if (!auth.user?.isAdmin) {
      const data = await Ticket.query()
        .where('createdById', auth.user?.id as number)
        .preload('ticketCategory', (ticketCategory) => ticketCategory.preload('color'))
        .preload('ticketPriority', (ticketPriority) => ticketPriority.preload('color'))
        .preload('ticketStatus', (ticketStatus) => ticketStatus.preload('color'))

      return response.ok(data)
    }
  }

  async store({ request, auth }: HttpContext) {
    const { subject, category, priority, description } = request.only([
      'subject',
      'category',
      'priority',
      'description',
    ])

    const categoryId = (await TicketCategory.findByOrFail('name', category)).id
    const priorityId = (await TicketPriority.findByOrFail('name', priority)).id
    const pendingId = (await TicketStatus.findByOrFail('name', 'pendente')).id
    return await Ticket.create({
      subject: subject,
      ticketCategoryId: categoryId,
      createdById: auth.user?.id,
      description: description,
      ticketPriorityId: priorityId,
      ticketStatusId: pendingId,
    })
  }

  async update({ params, request, auth }: HttpContext) {
    const { fromTable, ticketConfigItem } = request.only(['fromTable', 'ticketConfigItem'])
    const ticket = await Ticket.findOrFail(params.id)
    //
    const updatedTime = DateTime.local()

    if (fromTable === 'priorities') {
      const priorityId = (await TicketPriority.findByOrFail('name', ticketConfigItem)).id
      await ticket.merge({ ticketPriorityId: priorityId, updatedAt: updatedTime }).save()
    } else {
      if (auth.user?.isAdmin) {
        // admin should only modify status and priority
        // status(from any status to 4, set isConclued to true. from 4 to any, or any to !4, set to false)
        if (fromTable === 'statuses') {
          const statusId = (await TicketStatus.findByOrFail('name', ticketConfigItem)).id
          if (statusId === 4) {
            await ticket
              .merge({ ticketStatusId: statusId, updatedAt: updatedTime, isConclued: true })
              .save()
          } else {
            await ticket
              .merge({ ticketStatusId: statusId, updatedAt: updatedTime, isConclued: false })
              .save()
          }
        }
      } else {
        if (fromTable === 'categories') {
          const categoryId = (await TicketCategory.findByOrFail('name', ticketConfigItem)).id
          await ticket.merge({ ticketCategoryId: categoryId, updatedAt: updatedTime }).save()
        }
      }
    }
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

import Ticket from '#models/ticket'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class TicketsController {
  async show({}: HttpContext) {}

  async index({ request, auth }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])
    if (auth.user?.isAdmin) {
      return await Ticket.query()
        .preload('user')
        .preload('ticketCategory', (preload) => {
          preload.preload('color')
        })
        .preload('ticketPriority', (preload) => {
          preload.preload('color')
        })
        .preload('ticketStatus', (preload) => {
          preload.preload('color')
        })
        .paginate(page, pageSize)
    } else {
      return await Ticket.query()
        .where('created_by_id', auth.user?.id as number)
        .preload('user')
        .preload('ticketCategory', (preload) => {
          preload.preload('color')
        })
        .preload('ticketPriority', (preload) => {
          preload.preload('color')
        })
        .preload('ticketStatus', (preload) => {
          preload.preload('color')
        })
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
    const ticket = await Ticket.findOrFail(params.id)
    //
    const updatedTime = DateTime.local()

    // both admin and guest can modify ticket priority if no logic involve
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

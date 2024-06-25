import Ticket from '#models/ticket'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'
import { TicketValidator } from '#validators/ticket'
export default class TicketsController {
  async show({ params, response }: HttpContext) {
    const data = await Ticket.findOrFail(params)
    return response.ok(data)
  }

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
        .paginate(page, pageSize)

      return response.ok(data)
    }
  }

  async store({ request, auth, response }: HttpContext) {
    const verifyData = await request.validateUsing(TicketValidator)

    const categoryId = (await TicketCategory.findByOrFail('name', verifyData.category)).id
    const priorityId = (await TicketPriority.findByOrFail('name', verifyData.priority)).id
    const pendingId = (await TicketStatus.findByOrFail('name', 'pendente')).id

    const data = await Ticket.create({
      createdById: auth.user?.id,
      description: verifyData.description,
      subject: verifyData.subject,
      ticketCategoryId: categoryId,
      ticketPriorityId: priorityId,
      ticketStatusId: pendingId,
    })
    return response.created(data)
  }

  async update({ params, request, auth, response }: HttpContext) {
    const ticket = await Ticket.findOrFail(params.id)
    const requestData = request.all()

    const pendingId = (await TicketStatus.findByOrFail('name', 'pendente')).id
    const condition =
      (!auth.user?.isAdmin && ticket.ticketStatusId != pendingId) ||
      (auth.user?.isAdmin && requestData.hasOwnProperty('category')) ||
      (!auth.user?.isAdmin && requestData.hasOwnProperty('status'))

    if (condition) {
      return response.badRequest('unable to update ticket after status changed')
    }

    if (!auth.user?.isAdmin) {
      const validatedRequest = await request.validateUsing(TicketValidator)
      const ticketPriorityId = (
        await TicketPriority.findByOrFail('name', validatedRequest.priority)
      ).id

      const ticketCategoryId = (
        await TicketCategory.findByOrFail('name', validatedRequest.category)
      ).id

      const data = await ticket
        .merge({
          description: validatedRequest.description,
          subject: validatedRequest.subject,
          ticketPriorityId: ticketPriorityId,
          ticketCategoryId: ticketCategoryId,
        })
        .save()
      return response.ok(data)
    }

    if (requestData.hasOwnProperty('priority') && auth.user.isAdmin) {
      const ticketPriorityId = (await TicketPriority.findByOrFail('name', requestData.priority)).id
      const data = await ticket.merge({ ticketPriorityId: ticketPriorityId }).save()
      return response.ok(data)
    }

    if (requestData.hasOwnProperty('status') && auth.user.isAdmin) {
      const TicketStatusId = (await TicketStatus.findByOrFail('name', requestData.status)).id
      const ticketStatusConcluedId = (await TicketStatus.findByOrFail('name', 'concluido')).id

      const data = await ticket
        .merge({
          ticketStatusId: TicketStatusId,
          isConclued: TicketStatusId === ticketStatusConcluedId,
        })
        .save()

      return response.ok(data)
    }
  }

  async destroy({ params, response }: HttpContext) {
    const ticket = await Ticket.findOrFail(params.id)
    const pendingId = (await TicketStatus.findByOrFail('name', 'pendente')).id

    if (ticket.ticketStatusId != pendingId) {
      return response.badRequest('unable to delete a in progress ticket')
    }

    await ticket.delete()
    return response.noContent()
  }
}

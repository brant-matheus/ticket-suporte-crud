import Operation from '#models/operation'
import Ticket from '#models/ticket'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class OperationsController {
  async show({ params }: HttpContext) {}

  async index({ request }: HttpContext) {
    const { ticketId } = request.only(['ticketId'])
    return await Operation.query()
      .where('ticket_id', ticketId)
      .preload('responsible')

      .preload('ticket', (ticketQuery) => {
        ticketQuery
          .preload('user')
          .preload('ticketCategory')
          .preload('ticketPriority')
          .preload('ticketStatus')
      })
  }

  async store({ request, auth }: HttpContext) {
    const { description, ticketId } = request.only(['description', 'ticketId'])
    const ticket = await Ticket.findOrFail(ticketId)

    await Operation.create({
      description: description,
      responsibleId: auth.user?.id,
      ticketId: ticket.id,
    })

    const workingInProgress = await TicketStatus.findByOrFail('name', 'em análise')
    const pendingId = (await TicketStatus.findByOrFail('name', 'pendente')).id
    if (ticket.ticketStatusId == pendingId) {
      await ticket.merge({ ticketStatusId: workingInProgress.id }).save()
    }
  }

  async update({ params, request }: HttpContext) {
    const { description } = request.only(['description'])
    const operation = await Operation.findOrFail(params.id)
    await operation.merge({ description: description }).save()
  }

  async destroy({ params }: HttpContext) {}
}

import Operation from '#models/operation'
import Ticket from '#models/ticket'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'

export default class OperationsController {
  async index({ request, response }: HttpContext) {
    const { ticketId } = request.only(['ticketId'])
    const data = await Operation.query().where('ticket_id', ticketId).preload('responsible')

    return response.ok(data)
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
}

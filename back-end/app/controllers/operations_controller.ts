import Operation from '#models/operation'
import Ticket from '#models/ticket'
import type { HttpContext } from '@adonisjs/core/http'
import { Preloader } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class OperationsController {
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
    await Operation.create({
      description: description,
      responsibleId: auth.user?.id,
      ticketId: ticketId,
    })
    const ticket = await Ticket.findOrFail(ticketId)
    await ticket.merge({ ticketStatusId: 2, updatedAt: DateTime.local() }).save()
  }

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}

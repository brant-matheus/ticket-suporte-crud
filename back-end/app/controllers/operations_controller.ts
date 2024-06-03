import Operation from '#models/operation'
import type { HttpContext } from '@adonisjs/core/http'
import { Preloader } from '@adonisjs/lucid/orm'

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

  async store({ request }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}

import type { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/ticket'

export default class TicketsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    return await Ticket.query()
      .preload('user')
      .preload('ticketCategory')
      .preload('ticketPriority')
      .preload('TicketStatus')
      .paginate(1, 10)
  }

  async store({ request }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  stroy({ params }: HttpContext) {}
}

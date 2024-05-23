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

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}

import type { HttpContext } from '@adonisjs/core/http'

export default class TicketConfigsController {
  async index({}: HttpContext) {}

  async store({ request }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}

import Ticket from '#models/ticket'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'
import { stat } from 'fs'
import { DateTime } from 'luxon'

export default class TicketStatusesController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])
    return await TicketStatus.query().preload('responsible').paginate(page, pageSize)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    return await Ticket.create(request.all())
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (params.id == 1) {
      return response.forbidden({ message: 'cannot delete this params id' })
    } else {
      const statusUpdateRequest: any = request.only(['statusUpdateRequest'])
      const status = await TicketStatus.findByOrFail(params.id)
      await status
        .merge({
          responsibleId: auth.user?.id,
          updatedAt: DateTime.local(),
          name: statusUpdateRequest,
        })
        .save()
      return response.ok({ message: 'ticket updation succeed' })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}

import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketStatusesController {
  async index({ request, response }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])
    const data = await TicketStatus.query().preload('responsible').paginate(page, pageSize)
    return response.ok({ message: 'get/index request succeed', data: data })
  }

  async store({ request, response }: HttpContext) {
    await TicketStatus.create(request.all())
    return response.created({ message: 'ticket status creation succeed' })
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (params.id == 1) {
      return response.forbidden({ message: 'cannot delete this specific status' })
    }
    const statusUpdateRequest: any = request.only(['statusUpdateRequest'])
    const status = await TicketStatus.findOrFail(params.id)
    await status
      .merge({
        responsibleId: auth.user?.id,
        name: statusUpdateRequest,
      })
      .save()
    return response.ok({ message: 'ticket status update succeed' })
  }

  async destroy({ params, response }: HttpContext) {
    const status = await TicketStatus.findBy(params.id)
    await status?.delete()

    return response.noContent()
  }
}

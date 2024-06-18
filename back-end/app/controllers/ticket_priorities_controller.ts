import type { HttpContext } from '@adonisjs/core/http'
import TicketPriority from '#models/ticket_priority'

export default class TicketPrioritiesController {
  async index({ request, response }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])
    const data = await TicketPriority.query().preload('responsible').paginate(page, pageSize)
    return response.ok({ message: 'get/index request succeed', data: data })
  }
  async store({ request, response }: HttpContext) {
    await TicketPriority.create(request.all())
    return response.created({ message: 'ticket priority creation succeed' })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const priorityUpdateRequest: any = request.only(['priorityUpdateRequest'])
    const priority = await TicketPriority.findOrFail(params.id)
    await priority
      .merge({
        responsibleId: auth.user?.id,
        name: priorityUpdateRequest,
      })
      .save()
    return response.ok({ message: 'ticket priority update succeed' })
  }

  async destroy({ params, response }: HttpContext) {
    const priority = await TicketPriority.findBy(params.id)
    await priority?.delete()

    return response.noContent()
  }
}

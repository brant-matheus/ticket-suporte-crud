import type { HttpContext } from '@adonisjs/core/http'
import TicketPriority from '#models/ticket_priority'

export default class TicketPrioritiesController {
  async index({ request, response, auth }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    if (auth.user?.isAdmin) {
      const data = await TicketPriority.query()
        .preload('responsible')
        .preload('color')
        .paginate(page, pageSize)
      return response.ok(data)
    }

    const data = await TicketPriority.query().preload('color')
    return response.ok(data)
  }
  async store({ request, response }: HttpContext) {
    const data = await TicketPriority.create(request.all())
    return response.created(data)
  }

  async update({ params, request, response, auth }: HttpContext) {
    const priorityUpdateRequest: any = request.only(['priorityUpdateRequest'])
    const priority = await TicketPriority.findOrFail(params.id)
    const data = await priority
      .merge({
        responsibleId: auth.user?.id,
        name: priorityUpdateRequest,
      })
      .save()
    return response.ok(data)
  }

  async destroy({ params, response }: HttpContext) {
    const priority = await TicketPriority.findBy(params.id)
    await priority?.delete()

    return response.noContent()
  }
}

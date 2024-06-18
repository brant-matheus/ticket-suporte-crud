import { faker } from '@faker-js/faker'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketStatusesController {
  async index({ request, response, auth }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    if (auth.user?.isAdmin) {
      const data = await TicketStatus.query().preload('responsible').paginate(page, pageSize)
      return response.ok(data)
    }

    const data = await TicketStatus.all()
    return response.ok(data)
  }

  async store({ request, response, auth }: HttpContext) {
    const { statusName } = request.only(['statusName'])
    const status = await TicketStatus.create({
      name: statusName,
      responsibleId: auth.user?.id,
      color: faker.color.rgb(),
    })
    return response.created(status)
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (params.id == 1) {
      return response.forbidden({ message: 'cannot delete this specific status' })
    }
    const { statusUpdateRequest } = request.only(['statusUpdateRequest'])
    const status = await TicketStatus.findOrFail(params.id)
    const data = await status
      .merge({
        responsibleId: auth.user?.id,
        name: statusUpdateRequest,
        color: status.color,
      })
      .save()
    return response.ok(data)
  }

  async destroy({ params, response }: HttpContext) {
    const status = await TicketStatus.findBy(params.id)
    await status?.delete()

    return response.noContent()
  }
}

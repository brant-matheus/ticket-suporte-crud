import Color from '#models/color'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketStatusesController {
  async index({ request, response, auth }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    if (auth.user?.isAdmin) {
      const data = await TicketStatus.query()
        .preload('responsible')
        .preload('color')
        .paginate(page, pageSize)
      return response.ok(data)
    }

    const data = await TicketStatus.query().preload('color')
    return response.ok(data)
  }

  async store({ request, response, auth }: HttpContext) {
    const { name, color } = request.only(['name', 'color'])

    const colorId = (await Color.findByOrFail('name', color)).id
    const status = await TicketStatus.create({
      name: name,
      responsibleId: auth.user?.id,
      colorId: colorId,
    })
    return response.created(status)
  }

  async update({ params, request, response, auth }: HttpContext) {
    if (params.id == 1 || params.id == 2) {
      return response.forbidden({ message: 'cannot delete this specific status' })
    }
    const { name, color } = request.only(['name', 'color'])

    const colorId = (await Color.findByOrFail('name', color)).id
    const status = await TicketStatus.findOrFail(params.id)
    const data = await status
      .merge({
        responsibleId: auth.user?.id,
        name: name,
        colorId: colorId,
      })
      .save()
    return response.ok(data)
  }

  async destroy({ params, response }: HttpContext) {
    if ([1, 2].includes(params.id)) {
      return response.forbidden({ message: 'cannot delete this specific status' })
    }
    const status = await TicketStatus.findBy(params)

    await status?.delete()

    return response.noContent()
  }
}

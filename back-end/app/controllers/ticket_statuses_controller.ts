import Color from '#models/color'
import Ticket from '#models/ticket'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketStatusesController {
  async index({ request, response }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    const data = await TicketStatus.query()
      .preload('responsible')
      .preload('color')
      .paginate(page, pageSize)
    return response.ok(data)
  }

  async store({ request, response, auth }: HttpContext) {
    const { name, color } = request.only(['name', 'color'])

    const isNameExist = await TicketStatus.findBy('name', name)
    if (isNameExist) {
      return response.conflict('ticket status name already exist')
    }

    const colorId = (await Color.findByOrFail('name', color)).id
    const status = await TicketStatus.create({
      name: name,
      responsibleId: auth.user?.id,
      colorId: colorId,
    })
    return response.created(status)
  }

  async update({ params, request, response, auth }: HttpContext) {
    if ([1, 2].includes(parseInt(params.id))) {
      return response.badRequest('cannot update this specific status')
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
    const ticket = await Ticket.findManyBy('ticketStatusId', params.id)

    const condition = [1, 2].includes(parseInt(params.id)) || ticket.length >= 1
    if (condition) {
      return response.badRequest('cannot delete this specific ticket status')
    }
    const status = await TicketStatus.findBy(params)

    await status?.delete()

    return response.noContent()
  }
}

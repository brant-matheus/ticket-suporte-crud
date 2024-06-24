import Color from '#models/color'
import Ticket from '#models/ticket'
import TicketPriority from '#models/ticket_priority'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketPriorityesController {
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

  async store({ request, response, auth }: HttpContext) {
    const { name, color } = request.only(['name', 'color'])

    const isNameExist = await TicketPriority.findBy('name', name)
    if (isNameExist) {
      return response.conflict('ticket already exist')
    }

    const colorId = (await Color.findByOrFail('name', color)).id
    const priority = await TicketPriority.create({
      name: name,
      responsibleId: auth.user?.id,
      colorId: colorId,
    })
    return response.created(priority)
  }

  async update({ params, request, response, auth }: HttpContext) {
    const ticket = await Ticket.findManyBy('ticketPriorityId', params.id)

    if (ticket.length >= 1) {
      return response.forbidden('cannot update this specific priority')
    }
    const { name, color } = request.only(['name', 'color'])

    const colorId = (await Color.findByOrFail('name', color)).id
    const priority = await TicketPriority.findOrFail(params.id)
    const data = await priority
      .merge({
        responsibleId: auth.user?.id,
        name: name,
        colorId: colorId,
      })
      .save()
    return response.ok(data)
  }

  async destroy({ params, response }: HttpContext) {
    const ticket = await Ticket.findManyBy('ticketPriorityId', params.id)

    if (ticket.length >= 1) {
      return response.badRequest('cannot delete this specific priority')
    }
    const priority = await TicketPriority.findBy(params)

    await priority?.delete()

    return response.noContent()
  }
}

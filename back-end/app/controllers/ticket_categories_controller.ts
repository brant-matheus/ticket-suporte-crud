import TicketCategory from '#models/ticket_category'

import Color from '#models/color'
import Ticket from '#models/ticket'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketCategoriesController {
  async index({ request, response, auth }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])

    if (auth.user?.isAdmin) {
      const data = await TicketCategory.query()
        .preload('responsible')
        .preload('color')
        .paginate(page, pageSize)
      return response.ok(data)
    }

    if (!auth.user?.isAdmin) {
      const data = await TicketCategory.query().preload('color')
      return response.ok(data)
    }
  }

  async store({ request, response, auth }: HttpContext) {
    const { name, color } = request.only(['name', 'color'])

    const isNameExist = await TicketCategory.findBy('name', name)
    if (isNameExist) {
      return response.conflict('ticket category name already exist')
    }

    const colorId = (await Color.findByOrFail('name', color)).id
    const ticketCategory = await TicketCategory.create({
      name: name,
      responsibleId: auth.user?.id,
      colorId: colorId,
    })
    return response.created(ticketCategory)
  }

  async update({ params, request, response, auth }: HttpContext) {
    const { name, color } = request.only(['name', 'color'])
    const colorId = (await Color.findByOrFail('name', color)).id
    const ticketCategory = await TicketCategory.findOrFail(params.id)
    const data = await ticketCategory
      .merge({
        responsibleId: auth.user?.id,
        name: name,
        colorId: colorId,
      })
      .save()
    return response.ok(data)
  }

  async destroy({ params, response }: HttpContext) {
    const ticket = await Ticket.findManyBy('ticketCategoryId', params.id)

    if (ticket.length >= 1) {
      return response.badRequest('cannot delete this specific ticket category')
    }
    const ticketCategory = await TicketCategory.findBy(params)

    await ticketCategory?.delete()

    return response.noContent()
  }
}

import TicketCategory from '#models/ticket_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketCategoriesController {
  async index({ request, response }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])
    const data = await TicketCategory.query().preload('responsible').paginate(page, pageSize)
    return response.ok({ message: 'get/index request succeed', data: data })
  }

  async store({ request, response }: HttpContext) {
    await TicketCategory.create(request.all())
    return response.created({ message: 'ticket category creation succeed' })
  }

  async update({ params, request, response, auth }: HttpContext) {
    const categoryUpdateRequest: any = request.only(['categoryUpdateRequest'])
    const category = await TicketCategory.findOrFail(params.id)
    await category
      .merge({
        responsibleId: auth.user?.id,
        name: categoryUpdateRequest,
      })
      .save()
    return response.ok({ message: 'ticket category update succeed' })
  }

  async destroy({ params, response }: HttpContext) {
    const category = await TicketCategory.findBy(params.id)
    await category?.delete()

    return response.noContent()
  }
}

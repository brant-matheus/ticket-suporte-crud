import TicketCategory from '#models/ticket_category'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketCategoriesController {
  async index({ request, response }: HttpContext) {
    const { page, pageSize } = request.only(['page', 'pageSize'])
    const data = await TicketCategory.query().preload('responsible').paginate(page, pageSize)
    return response.ok(data)
  }

  async store({ request, response }: HttpContext) {
    const data = await TicketCategory.create(request.all())
    return response.created(data)
  }

  async update({ params, request, response, auth }: HttpContext) {
    const categoryUpdateRequest: any = request.only(['categoryUpdateRequest'])
    const category = await TicketCategory.findOrFail(params.id)
    const data = await category
      .merge({
        responsibleId: auth.user?.id,
        name: categoryUpdateRequest,
      })
      .save()
    return response.ok(data)
  }

  async destroy({ params, response }: HttpContext) {
    const category = await TicketCategory.findBy(params.id)
    await category?.delete()

    return response.noContent()
  }
}

import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import type { HttpContext } from '@adonisjs/core/http'

export default class TicketConfigsController {
  async index({ auth, request }: HttpContext) {
    if (auth.user?.isAdmin) {
      const { fromTable, page, pageSize } = request.only(['fromTable', 'page', 'pageSize'])
      switch (fromTable) {
        case 'categories':
          return await TicketCategory.query().paginate(page, pageSize)
        case 'statuses':
          return await TicketStatus.query().paginate(page, pageSize)
        case 'priorities':
          return await TicketPriority.query().paginate(page, pageSize)
        default:
          break
      }
    }
  }

  async store({ request }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}

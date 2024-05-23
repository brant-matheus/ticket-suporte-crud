import Ticket from '#models/ticket'
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
          return await TicketCategory.query().preload('responsible').paginate(page, pageSize)
        case 'statuses':
          return await TicketStatus.query().paginate(page, pageSize)
        case 'priorities':
          return await TicketPriority.query().preload('responsible').paginate(page, pageSize)
        default:
          break
      }
    }
  }

  async store({ request }: HttpContext) {}

  async update({ params, request }: HttpContext) {}

  async destroy({ params, request }: HttpContext) {
    const { fromTable, tableId } = request.only(['fromTable', 'tableId'])

    // it can't delete category, status or priority if a ticket is already using them.
    const ticket = await Ticket.findBy(tableId, params.id)
    if (ticket?.$isPersisted) {
      throw new Error()
    }

    switch (fromTable) {
      case 'categories':
        const category = await TicketCategory.findOrFail(params.id)
        // can't get here
        return await category.delete()
      case 'statuses':
        const status = await TicketStatus.findOrFail(params.id)
        return await status.delete()
      case 'priorities':
        const priority = await TicketPriority.findOrFail(params.id)
        return await priority.delete()

      default:
        break
    }
  }
}

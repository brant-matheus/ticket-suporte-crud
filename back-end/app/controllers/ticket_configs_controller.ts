import { faker } from '@faker-js/faker'
import Ticket from '#models/ticket'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

import type { HttpContext } from '@adonisjs/core/http'

export default class TicketConfigsController {
  async index({ auth, request }: HttpContext) {
    if (auth.user?.isAdmin) {
      const { fromTable, page, pageSize } = request.only(['fromTable', 'page', 'pageSize'])
      switch (fromTable) {
        case 'categories':
          return await TicketCategory.query().preload('responsible').paginate(page, pageSize)
        case 'statuses':
          return await TicketStatus.query().preload('responsible').paginate(page, pageSize)
        case 'priorities':
          return await TicketPriority.query().preload('responsible').paginate(page, pageSize)

        case 'select':
          const categories = await db.from('ticket_categories').select('name', 'color', 'id')
          const priorities = await db.from('ticket_priorities').select('name', 'color', 'id')
          return { categories, priorities }
        default:
          break
      }
    } else {
      const categories = await db.from('ticket_categories').select('name', 'color', 'id')
      const priorities = await db.from('ticket_priorities').select('name', 'color', 'id')
      const statuses = await db.from('ticket_statuses').select('name', 'color', 'id')
      return { categories, priorities, statuses }
    }
  }

  async store({ request, auth }: HttpContext) {
    const userId = auth.user?.id
    const { fromTable, item } = request.only(['fromTable', 'item'])
    const randomColor = faker.color.rgb()
    switch (fromTable) {
      case 'categories':
        return await TicketCategory.create({
          name: item,
          color: randomColor,
          responsibleId: userId,
        })

      case 'priorities':
        return await TicketPriority.create({
          name: item,
          color: randomColor,
          responsibleId: userId,
        })

      case 'statuses':
        return await TicketStatus.create({
          name: item,
          color: randomColor,
          responsibleId: userId,
        })
      default:
        break
    }
  }

  async update({ params, request }: HttpContext) {
    const { fromTable, item } = request.only(['fromTable', 'item'])
    const updateAt = { updatedAt: DateTime.local() }
    const payload = Object.assign({ name: item }, updateAt)
    switch (fromTable) {
      case 'categories':
        const category = await TicketCategory.findOrFail(params.id)
        // can't get here
        return await category.merge(payload).save()
      case 'statuses':
        const status = await TicketStatus.findOrFail(params.id)
        return await status.merge(payload).save()
      case 'priorities':
        const priority = await TicketPriority.findOrFail(params.id)
        return await priority.merge(payload).save()

      default:
        break
    }
  }

  async destroy({ params, request }: HttpContext) {
    const { fromTableWhere } = request.only(['fromTableWhere'])

    // it can't delete category, status or priority if a ticket is already using them.
    const ticket = await Ticket.findBy(fromTableWhere, params.id)
    // if category, status or priority exists in ticket, throw new error
    if (ticket?.$isPersisted) {
      throw new Error()
    }
    //
    switch (fromTableWhere) {
      case 'ticket_category_id':
        const category = await TicketCategory.findOrFail(params.id)
        // can't get here
        return await category.delete()
      case 'ticket_status_id':
        const status = await TicketStatus.findOrFail(params.id)
        return await status.delete()
      case 'ticket_priority_id':
        const priority = await TicketPriority.findOrFail(params.id)
        return await priority.delete()

      default:
        break
    }
  }
}

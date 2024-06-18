import TicketStatus from '#models/ticket_status'
import { faker } from '@faker-js/faker'

import { AdminFactory } from '#database/factories/admin_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  color = faker.color
  async run() {
    await AdminFactory.create()
    await TicketStatus.createMany([{ name: 'pendente', color: 1, responsibleId: 1 }, {}])

    // await TicketCategory.createMany(TicketCategoryFactory)
    // await TicketPriority.createMany(TicketPrioriesFactory)
    // await UserFactory.with('ticket').create()
    // await CommentFactory.createMany(20)
    // await OperationFactory.createMany(5)
    // await CommentFactory.createMany(20)
    // await UserFactory.createMany(20)
  }
}

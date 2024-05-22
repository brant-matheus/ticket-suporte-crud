import { UserFactory } from '#database/factories/user_factory'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import User from '#models/user'
import { faker } from '@faker-js/faker'

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import {
  TicketCategoryFactory,
  TicketPrioriesFactory,
  TicketStatusesFactory,
} from '#database/factories/ticket_configs_factory'
import Ticket from '#models/ticket'

export default class extends BaseSeeder {
  color = faker.color
  async run() {
    // Write your database queries inside the run method
    await User.create({
      fullName: 'matheus',
      email: 'matheus@saga.com',
      isAdmin: true,
      password: 'Testing@123',
    })
    await UserFactory.createMany(2)

    await TicketCategory.createMany(TicketCategoryFactory)
    await TicketPriority.createMany(TicketPrioriesFactory)
    await TicketStatus.createMany(TicketStatusesFactory)
    await Ticket.create({
      categoryId: 1,
      createdById: 2,
      description: 'loren epsiun',
      priorityId: 1,
      statusId: 1,
      subject: 'loren epsium',
    })
  }
}

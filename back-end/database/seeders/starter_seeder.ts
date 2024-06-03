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
import Operation from '#models/operation'
import { DateTime } from 'luxon'

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
      ticketCategoryId: 1,
      createdById: 2,
      description: 'loren epsiun',
      ticketPriorityId: 1,
      ticketStatusId: 2,
      subject: 'loren epsium',
    })
    await Ticket.create({
      ticketCategoryId: 1,
      createdById: 3,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptat ',
      ticketPriorityId: 1,
      ticketStatusId: 1,
      subject: 'loren epsium',
      finishedAt: true,
    })

    await Operation.create({
      description: 'meditor requerido, 3 dias uteis para entrega',
      responsibleId: 1,
      ticketId: 1,
    })
    await Operation.create({
      description: 'meditor requerido, 3 dias uteis para entrega',
      responsibleId: 1,
      ticketId: 1,
    })
  }
}

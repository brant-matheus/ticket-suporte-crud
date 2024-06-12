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
import Comment from '#models/comment'
import { CommentFactory } from '#database/factories/comment_factory'
import { AdminFactory } from '#database/factories/admin_factory'
import { OperationFactory } from '#database/factories/operation_factory'

export default class extends BaseSeeder {
  color = faker.color
  async run() {
    // await AdminFactory.create()
    // await TicketCategory.createMany(TicketCategoryFactory)
    // await TicketPriority.createMany(TicketPrioriesFactory)
    // await TicketStatus.createMany(TicketStatusesFactory)
    // await UserFactory.with('ticket').create()
    // await CommentFactory.createMany(20)
    // await OperationFactory.createMany(5)
    // await CommentFactory.createMany(20)
  }
}

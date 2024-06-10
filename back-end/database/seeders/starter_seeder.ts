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

export default class extends BaseSeeder {
  color = faker.color
  async run() {
    // await User.create({
    //   fullName: 'matheus',
    //   email: 'matheus@saga.com',
    //   isAdmin: true,
    //   password: 'Testing@123',
    // })
    // await UserFactory.createMany(100)
    // await TicketCategory.createMany(TicketCategoryFactory)
    // await TicketPriority.createMany(TicketPrioriesFactory)
    // await TicketStatus.createMany(TicketStatusesFactory)
    // await Ticket.create({
    //   createdById: 2,
    //   subject: 'aaaaaaaaa',
    //   ticketCategoryId: 1,
    //   ticketStatusId: 1,
    //   ticketPriorityId: 1,
    //   isConclued: false,
    //   description: 'aaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa a',
    // })
    // await CommentFactory.createMany(20)
  }
}

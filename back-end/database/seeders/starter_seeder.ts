import { UserFactory } from '#database/factories/user_factory'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import User from '#models/user'
import { faker } from '@faker-js/faker'

import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  color = faker.color
  async run() {
    // Write your database queries inside the run method
    // await UserFactory.createMany(100)
    // await User.create({
    //   fullName: 'matheus',
    //   email: 'matheus@saga.com',
    //   isAdmin: true,
    //   password: 'Testing@123',
    // })
    await TicketCategory.create({
      name: this.color.rgb(),
      color: this.color.human(),
      responsibleId: 1,
    })
  }
}

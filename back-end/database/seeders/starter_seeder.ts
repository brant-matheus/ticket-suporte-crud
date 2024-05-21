import { UserFactory } from '#database/factories/user_factory'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    // await UserFactory.createMany(100)
    // await User.create({
    //   fullName: 'matheus',
    //   email: 'matheus@saga.com',
    //   isAdmin: true,
    //   password: 'Testing@123',
    // })
    // await TicketCategory.create({ name: 'categoria', color: 'red', responsibleId: 1 })
    await TicketPriority.create({ name: 'prioritya', color: 'blue', responsibleId: 1 })
    // await TicketStatus.create({ name: 'statuses', color: 'green', responsibleId: 1 })
  }
}

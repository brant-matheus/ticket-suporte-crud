import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    // await UserFactory.createMany(100)
    // await User.create({
    //   fullName: 'suporte saga',
    //   email: 'suporte@sagatech.com',
    //   isAdmin: true,
    //   password: 'Testing@123',
    // })
  }
}

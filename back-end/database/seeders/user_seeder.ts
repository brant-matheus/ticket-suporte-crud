import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      {
        email: 'matheus@saga.com',
      },
      {
        email: 'matheus@saga.com',
        fullName: 'matheus carvalho caldeira brant',
        isAdmin: true,
        password: 'Testing@123',
      }
    )
  }
}

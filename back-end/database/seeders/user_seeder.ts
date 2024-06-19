import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      email: 'matheus@saga.com',
      fullName: 'matheus carvalho caldeira brant',
      isAdmin: true,
      password: 'Testing@123',
    })
  }
}

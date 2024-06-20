import Color from '#models/color'
import TicketStatus from '#models/ticket_status'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const blueColor = await Color.findByOrFail('name', 'azul')
    const greenColor = await Color.findByOrFail('name', 'verde')
    const user = await User.findByOrFail('email', 'matheus@saga.com')

    await TicketStatus.updateOrCreateMany(
      ['name'],
      [
        {
          name: 'pendente',
          responsibleId: user.id,
          colorId: blueColor.id,
        },
        {
          name: 'concluido',
          responsibleId: user.id,
          colorId: greenColor.id,
        },
      ]
    )
  }
}

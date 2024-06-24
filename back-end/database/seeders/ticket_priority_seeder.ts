import Color from '#models/color'
import TicketPriority from '#models/ticket_priority'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const orange = (await Color.findByOrFail('name', 'laranja')).id
    const red = (await Color.findByOrFail('name', 'vermelho')).id
    const blue = (await Color.findByOrFail('name', 'azul')).id
    const user = await User.first()

    await TicketPriority.updateOrCreateMany('name', [
      {
        name: 'baixa',
        colorId: blue,
        responsibleId: user?.id,
      },
      {
        name: 'media',
        colorId: orange,
        responsibleId: user?.id,
      },
      {
        name: 'urgente',
        colorId: red,
        responsibleId: user?.id,
      },
    ])
  }
}

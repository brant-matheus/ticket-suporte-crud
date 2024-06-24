import Color from '#models/color'
import TicketCategory from '#models/ticket_category'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const yellow = (await Color.findByOrFail('name', 'amarelo')).id
    const green = (await Color.findByOrFail('name', 'verde')).id
    const orange = (await Color.findByOrFail('name', 'laranja')).id

    const user = await User.first()

    await TicketCategory.updateOrCreateMany('name', [
      {
        colorId: yellow,
        name: 'error no sistema',
        responsibleId: user?.id,
      },
      {
        colorId: green,
        name: ' problema de permissão',
        responsibleId: user?.id,
      },
      {
        colorId: orange,
        name: 'outros',
        responsibleId: user?.id,
      },
    ])
  }
}

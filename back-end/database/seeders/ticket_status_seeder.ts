import Color from '#models/color'
import TicketStatus from '#models/ticket_status'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const colors = await Color.all()

    await TicketStatus.updateOrCreateMany(
      ['name'],
      [
        {
          name: 'pendente',
          responsibleId: 1,
          colorId: colors.find((color) => color.name == 'azul')?.id,
        },
        {
          name: 'concluido',
          responsibleId: 1,
          colorId: colors.find((color) => color.name == 'verde')?.id,
        },
      ]
    )
  }
}

import TicketStatus from '#models/ticket_status'
import { faker } from '@faker-js/faker'

import { AdminFactory } from '#database/factories/admin_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Color from '#models/color'

export default class extends BaseSeeder {
  color = faker.color
  async run() {
    await AdminFactory.create()

    await Color.createMany([
      {
        name: 'Azul',
        hex: '#00BFFF',
      },
      {
        name: 'Verde',
        hex: '#32CD32',
      },
      {
        name: 'Amarelo',
        hex: '#FFFF00',
      },
      {
        name: 'Laranja',
        hex: '#FFA500',
      },
      {
        name: 'Vermelho',
        hex: '#FF4500',
      },
      {
        name: 'Rosa',
        hex: '#FF1493',
      },
      {
        name: 'Roxo',
        hex: '#800080',
      },
    ])
    await TicketStatus.createMany([
      { name: 'pendente', colorId: 1, responsibleId: 1 },
      { name: 'concluido', colorId: 2, responsibleId: 1 },
    ])
  }
}

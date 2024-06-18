import TicketStatus from '#models/ticket_status'

import Color from '#models/color'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Ticket from '#models/ticket'

export default class extends BaseSeeder {
  async run() {
    const admin = await User.create({
      email: 'matheus@saga.com',
      fullName: 'matheus carvalho caldeira brant',
      isAdmin: true,
      password: 'Testing@123',
    })
    const color = await Color.createMany([
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

    const green = await Color.findBy('name', 'Verde')
    const blue = await Color.findBy('name', 'Azul')
    await TicketStatus.create({
      name: 'pendente',
      responsibleId: admin.id,
      colorId: 1,
    })

    // await TicketStatus.createMany([
    //   { name: 'pendente', colorId: blue?.id, responsibleId: admin.id },
    //   {
    //     name: 'concluido',
    //     colorId: green?.id,
    //     responsibleId: admin.id,
    //   },
    // ])
  }
}

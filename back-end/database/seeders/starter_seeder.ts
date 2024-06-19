import TicketStatus from '#models/ticket_status'

import Color from '#models/color'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const admin = await User.create({
      email: 'matheus@saga.com',
      fullName: 'matheus carvalho caldeira brant',
      isAdmin: true,
      password: 'Testing@123',
    })
    await Color.createMany([
      { name: 'azul', hex: '#00bfff' },
      { name: 'verde', hex: '#32cd32' },
      { name: 'amarelo', hex: '#ffff00' },
      { name: 'laranja', hex: '#ffa500' },
      { name: 'vermelho', hex: '#ff4500' },
      { name: 'rosa', hex: '#ff1493' },
      { name: 'roxo', hex: '#800080' },
    ])

    await TicketStatus.createMany([
      {
        name: 'pendente',
        responsibleId: 1,
        colorId: 1,
      },
      {
        name: 'concluido',
        responsibleId: 1,
        colorId: 2,
      },
    ])
  }
}

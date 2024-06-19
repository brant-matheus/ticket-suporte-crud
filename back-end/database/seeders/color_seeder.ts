import Color from '#models/color'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Color.updateOrCreateMany(
      ['name', 'hex'],
      [
        { name: 'azul', hex: '#00bfff' },
        { name: 'verde', hex: '#32cd32' },
        { name: 'amarelo', hex: '#ffff00' },
        { name: 'laranja', hex: '#ffa500' },
        { name: 'vermelho', hex: '#ff4500' },
        { name: 'rosa', hex: '#ff1493' },
        { name: 'roxo', hex: '#800080' },
      ]
    )
  }
}

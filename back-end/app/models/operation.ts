import Ticket from '#models/ticket'
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Operation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string

  @column()
  declare responsibleId: number

  @column()
  declare ticketId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'responsibleId',
  })
  declare responsible: BelongsTo<typeof User>

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>
}

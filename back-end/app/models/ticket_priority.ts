import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Color from './color.js'

export default class TicketPriority extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare responsibleId: number

  @column()
  declare colorId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'responsibleId',
  })
  declare responsible: BelongsTo<typeof User>

  @belongsTo(() => Color)
  declare color: BelongsTo<typeof Color>
}

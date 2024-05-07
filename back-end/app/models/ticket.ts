import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare createdById: number

  @column()
  declare subject: string

  @column()
  declare description: string

  @column()
  declare categoryId: number

  @column()
  declare priorityId: number

  @column()
  declare statusId: number



  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

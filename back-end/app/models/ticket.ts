import { DateTime } from 'luxon'
import { BaseModel, beforeFind, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import TicketCategory from '#models/ticket_category'
import TicketPriority from '#models/ticket_priority'
import TicketStatus from '#models/ticket_status'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
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
  declare ticketCategoryId: number

  @column()
  declare ticketPriorityId: number

  @column()
  declare ticketStatusId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare isConclued: boolean

  @belongsTo(() => User, {
    foreignKey: 'createdById',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => TicketCategory)
  declare ticketCategory: BelongsTo<typeof TicketCategory>

  @belongsTo(() => TicketPriority)
  declare ticketPriority: BelongsTo<typeof TicketPriority>

  @belongsTo(() => TicketStatus)
  declare ticketStatus: BelongsTo<typeof TicketStatus>

  @beforeFind()
  static preloaders(query: ModelQueryBuilderContract<typeof Ticket>) {
    query
      .preload('ticketCategory')
      .preload('ticketPriority')
      .preload('ticketStatus')
      .preload('user')
  }
}

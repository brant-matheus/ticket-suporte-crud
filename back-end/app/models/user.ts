import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeDelete, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Ticket from './ticket.js'
import Operation from './operation.js'
import Comment from './comment.js'
import TicketCategory from './ticket_category.js'
import TicketPriority from './ticket_priority.js'
import TicketStatus from './ticket_status.js'
import db from '@adonisjs/lucid/services/db'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  currentAccessToken?: AccessToken

  @beforeDelete()
  static async removeAcessToken(user: User) {
    await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ consume: (value) => Boolean(value) })
  declare isAdmin: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => Ticket, {
    foreignKey: 'createdById',
  })
  declare ticket: HasMany<typeof Ticket>

  @hasMany(() => Comment, {
    foreignKey: 'responsibleId',
  })
  declare comment: HasMany<typeof Comment>

  @hasMany(() => Operation, {
    foreignKey: 'responsibleId',
  })
  declare operation: HasMany<typeof Operation>

  @hasMany(() => TicketCategory, {
    foreignKey: 'responsibleId',
  })
  declare ticketCategory: HasMany<typeof TicketCategory>

  @hasMany(() => TicketPriority, {
    foreignKey: 'responsibleId',
  })
  declare ticketPriority: HasMany<typeof TicketPriority>

  @hasMany(() => TicketStatus, {
    foreignKey: 'responsibleId',
  })
  declare ticketStatus: HasMany<typeof TicketStatus>
}

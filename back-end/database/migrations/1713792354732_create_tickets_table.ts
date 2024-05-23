import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('created_by_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('subject').notNullable()

      table.string('description').notNullable()

      table
        .integer('ticket_category_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('ticket_categories')
        .onDelete('CASCADE')

      table
        .integer('ticket_priority_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('ticket_priorities')
        .onDelete('CASCADE')

      table
        .integer('ticket_status_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('ticket_statuses')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

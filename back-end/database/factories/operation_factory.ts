import factory from '@adonisjs/lucid/factories'
import Operation from '#models/operation'
import User from '#models/user'
import { AdminFactory } from './admin_factory.js'

export const OperationFactory = factory
  .define(Operation, async ({ faker }) => {
    return {
      responsibleId: 1,
      ticketId: 1,
      description: 'Once you have created',
    }
  })
  .build()

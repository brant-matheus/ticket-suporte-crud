import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import { group } from 'console'

test.group('Users crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to store a guest user').run(async ({ assert, client, route }) => {
    const data = {
      fullName: 'saga brasil',
      email: 'saga@brasil.com',
      isAdmin: false,
    }
  })
})

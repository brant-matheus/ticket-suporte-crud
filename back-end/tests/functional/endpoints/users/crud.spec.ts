import { AdminFactory } from '#database/factories/admin_factory'
import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

// update 200, destroy 204
test.group('Users crud', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('it should be able to store a guest user in external register').run(
    async ({ assert, client, route }) => {
      const data = {
        fullName: 'saga brasil',
        email: 'saga@brasil.com',
      }
      const request = {
        password: 'Testing@123',
        passwordConfirmation: 'Testing@123',
        ...data,
      }
      const response = await client.post(route('sign_up')).json(request)
      response.assertStatus(201)

      const user = await User.findByOrFail('email', data.email)

      response.assertJsonStructure({
        token: ['token'],
        user: ['id', 'isAdmin', 'fullName', 'email'],
      })

      const body = response.body()
      assert.notProperty(body, 'password')

      assert.isTrue(await hash.verify(user.password, request.password))

      assert.propertyVal(user.serialize(), 'isAdmin', false)

      assert.include(user.serialize(), data)
    }
  )
  test('it should be able store a user by admin').run(async ({ assert, client, route }) => {
    const admin = await AdminFactory.create()
    const data = {
      email: 'validemail@valid.com',
      fullName: 'full name',
      isAdmin: false,
    }

    const request = {
      passwordConfirmation: 'Testing@123',
      password: 'Testing@123',

      ...data,
    }
    const response = await client.post(route('user.store')).loginAs(admin).json(request)
    response.assertStatus(201)

    const user = await User.findByOrFail('email', request.email)
    assert.include(user.serialize(), data)
    assert.isTrue(await hash.verify(user.password, request.password))

    const body = response.body()
    assert.include(body.user, data)
  })

  test('it should be able to the guest user update its password').run(
    async ({ assert, client, route }) => {
      const guest = await UserFactory.create()
      const passwords = {
        password: 'Anypass@123',
        passwordConfirmation: 'Anypass@123',
      }

      const response = await client
        .put(route('user.update', { id: guest.id }))
        .loginAs(guest)
        .json(passwords)

      response.assertStatus(200)
      const user = await User.findOrFail(guest.id)
      assert.isTrue(await hash.verify(user.password, passwords.password))
    }
  )

  test('it should be able to the admin user update its password').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const passwords = {
        password: 'Anypass@123',
        passwordConfirmation: 'Anypass@123',
      }

      const response = await client
        .put(route('user.update', { id: admin.id }))
        .loginAs(admin)
        .json(passwords)

      response.assertStatus(200)
      const user = await User.findOrFail(admin.id)
      assert.isTrue(await hash.verify(user.password, passwords.password))
    }
  )

  test('it should be able to guest user update its general Information').run(
    async ({ assert, client, route }) => {
      const guest = await UserFactory.create()
      const request = {
        email: 'saga@saga.com',
        fullName: 'saga saga',
      }

      const response = await client
        .put(route('user.update', { id: guest.id }))
        .loginAs(guest)
        .json(request)
      response.assertStatus(200)
      const body = response.body()
      assert.include(body.user, request)

      const user = await User.findByOrFail('id', guest.id)
      assert.include(user.serialize(), request)
    }
  )
  test('it should be able to admin user update its general Information').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const request = {
        email: 'saga@saga.com',
        fullName: 'saga saga',
      }

      const response = await client
        .put(route('user.update', { id: admin.id }))
        .loginAs(admin)
        .json(request)
      response.assertStatus(200)
      const body = response.body()
      assert.include(body.user, request)

      const user = await User.findByOrFail('id', admin.id)
      assert.include(user.serialize(), request)
    }
  )
  test('it should be able to update user general Information by admin').run(
    async ({ assert, client, route }) => {
      const admin = await AdminFactory.create()
      const guest = await UserFactory.create()
      const request = {
        email: 'saga@saga.com',
        fullName: 'saga saga',
        isAdmin: !admin.isAdmin,
      }

      const response = await client
        .put(route('user.update', { id: guest.id }))
        .loginAs(admin)
        .json(request)
      response.assertStatus(200)
      const body = response.body()
      assert.include(body.user, request)

      const user = await User.findByOrFail('id', guest.id)
      assert.include(user.serialize(), request)
    }
  )
  test('it should be able to the guest user to delete itself').run(
    async ({ assert, client, route }) => {
      const guest = await UserFactory.create()
      const response = await client.delete(route('user.destroy', { id: guest.id })).loginAs(guest)
      response.assertStatus(204)
      assert.isNull(await User.find(guest.id))
      assert.isNull(await User.findBy('email', guest.email))
      assert.isEmpty(await db.from('auth_access_tokens').where('tokenable_id', guest.id!))
    }
  )
  test('it should be able to delete a user by admin').run(async ({ assert, client, route }) => {
    const admin = await AdminFactory.create()
    const guest = await UserFactory.create()
    const response = await client.delete(route('user.destroy', { id: guest.id })).loginAs(admin)
    response.assertStatus(204)
    assert.isNull(await User.find(guest.id))
    assert.isNull(await User.findBy('email', guest.email))
    assert.isEmpty(await db.from('auth_access_tokens').where('tokenable_id', guest.id!))
  })
})
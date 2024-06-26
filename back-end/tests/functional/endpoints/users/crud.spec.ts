import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

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
  test('it should be able to store a admin user by admin').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').create()
      const data = {
        email: 'validemail@valid.com',
        fullName: 'full name',
        isAdmin: true,
      }

      const request = {
        passwordConfirmation: 'Testing@123',
        password: 'Testing@123',

        ...data,
      }
      const response = await client.post(route('user.store')).loginAs(user).json(request)
      response.assertStatus(201)

      const userStored = await User.findByOrFail('email', request.email)
      assert.include(userStored.serialize(), data)
      assert.isTrue(await hash.verify(userStored.password, request.password))

      const body = response.body()
      assert.include(body, data)
    }
  )
  test('it should be able to store a guest user by admin').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
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
      const response = await client.post(route('user.store')).loginAs(user).json(request)
      response.assertStatus(201)

      const userStored = await User.findByOrFail('email', request.email)
      assert.include(userStored.serialize(), data)
      assert.isTrue(await hash.verify(userStored.password, request.password))

      const body = response.body()
      assert.include(body, data)
    }
  )
  test('it should be able to update user password').run(async ({ assert, client, route }) => {
    const user = await UserFactory.create()
    const passwords = {
      password: 'Anypass@123',
      passwordConfirmation: 'Anypass@123',
    }

    const response = await client
      .put(route('user.update', { id: user.id }))
      .loginAs(user)
      .json(passwords)

    response.assertStatus(200)
    const updatedUser = await User.findOrFail(user.id)
    assert.isTrue(await hash.verify(updatedUser.password, passwords.password))
  })

  test('it should be able to update user general Information').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.create()
      const request = {
        email: 'saga@saga.com',
        fullName: 'saga saga',
      }

      const response = await client
        .put(route('user.update', { id: user.id }))
        .loginAs(user)
        .json(request)
      response.assertStatus(200)
      const body = response.body()
      assert.include(body, request)

      const updatedUser = await User.findOrFail(user.id)
      assert.include(updatedUser.serialize(), request)
    }
  )

  test('it should be able to update user general Information by admin').run(
    async ({ assert, client, route }) => {
      const admin = await UserFactory.apply('admin').create()
      const guest = await UserFactory.create()
      const request = {
        email: 'saga@saga.com',
        fullName: 'saga saga',
        isAdmin: !guest.isAdmin,
      }

      const response = await client
        .put(route('user.update', { id: guest.id }))
        .loginAs(admin)
        .json(request)
      response.assertStatus(200)
      const body = response.body()
      assert.include(body, request)

      const user = await User.findByOrFail('id', guest.id)
      assert.include(user.serialize(), request)
    }
  )
  test('it should be able to delete user').run(async ({ assert, client, route }) => {
    const user = await UserFactory.create()
    const response = await client.delete(route('user.destroy', { id: user.id })).loginAs(user)
    response.assertStatus(204)

    assert.isNull(await User.find(user.id))
    assert.isEmpty(await db.from('auth_access_tokens').where('tokenable_id', user.id!))
  })
  test('it should be able to delete a user by admin').run(async ({ assert, client, route }) => {
    const admin = await UserFactory.apply('admin').create()
    const guest = await UserFactory.create()
    const response = await client.delete(route('user.destroy', { id: guest.id })).loginAs(admin)
    response.assertStatus(204)

    assert.isNull(await User.find(guest.id))
    assert.isEmpty(await db.from('auth_access_tokens').where('tokenable_id', guest.id!))
  })

  test('it should be able to get/index all users by admin').run(
    async ({ assert, client, route }) => {
      const user = await UserFactory.apply('admin').create()
      await UserFactory.createMany(20)

      const request = {
        page: 1,
        pageSize: 10,
      }
      const response = await client.get(route('user.index')).loginAs(user).qs(request)
      response.assertStatus(200)

      const body = response.body()

      response.assertPaginatedStructure({ '*': ['email', 'fullName', 'isAdmin'] })
      response.assertBodyLength(request.pageSize, 'data')

      const total = (await User.all()).length
      assert.equal(body.meta.total, total)
      assert.equal(body.meta.perPage, 10)
      assert.equal(body.meta.currentPage, 1)
    }
  )
})

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import ExternalsController from '#controllers/externals_controller'
import SandboxesController from '#controllers/sandboxes_controller'
// internal, auth.
router
  .group(() => {
    // user
    router
      .resource('user', UsersController)
      .except(['create', 'edit', 'show'])
      .use(['index'], middleware.admin())
  })
  .middleware(middleware.auth())

// external, no auth.
router.post('/login', [ExternalsController, 'login'])
router.post('/externalUser', [ExternalsController, 'store'])

// // sandbox, test controller
// router.get('/sandbox', [SandboxesController, 'index'])

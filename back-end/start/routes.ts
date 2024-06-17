import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AuthController from '#controllers/auth_controller'
import TicketConfigsController from '#controllers/ticket_configs_controller'
import TicketsController from '#controllers/tickets_controller'
import OperationsController from '#controllers/operations_controller'
import CommentsController from '#controllers/comments_controller'
import TicketStatusesController from '#controllers/ticket_statuses_controller'
router
  .group(() => {
    // user
    router
      .resource('user', UsersController)
      .except(['create', 'edit', 'show'])
      .use(['index'], middleware.admin())

    // logout
    router.delete('auth', [AuthController, 'logout']).as('sign_out')
    // ticket config
    router
      .resource('ticket-configs', TicketConfigsController)
      .except(['create', 'edit', 'show'])
      .use(['destroy', 'store', 'update'], middleware.admin()) //only admins MUST DO those actions.
    // ticket
    router
      .resource('ticket', TicketsController)
      .except(['create', 'edit', 'show'])
      .use(['store', 'destroy'], middleware.guest())
    // operation
    router
      .resource('operation', OperationsController)
      .except(['create', 'edit', 'show'])
      .use('*', middleware.admin())

    router
      .resource('comments', CommentsController)
      .except(['create', 'edit', 'show'])
      .use('*', middleware.admin())
    router.resource('ticket-status', TicketStatusesController).except(['create', 'edit', 'show'])
  })
  .middleware(middleware.auth())

router.post('auth', [AuthController, 'login']).as('login')

//guest register by guest

router.post('external-register', [UsersController, 'store']).as('sign_up')

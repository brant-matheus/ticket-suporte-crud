import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  async show({ params }: HttpContext) {}

  async index({ request }: HttpContext) {
    const { ticketId } = request.only(['ticketId'])
    return await Comment.query().where('ticketId', ticketId).preload('user').preload('ticket')
  }

  async store({ request, auth }: HttpContext) {
    const { comment, ticketId } = request.only(['comment', 'ticketId'])
    await Comment.create({ content: comment, responsibleId: auth.user?.id, ticketId: ticketId })
  }

  async update() {}

  async destroy() {}
}

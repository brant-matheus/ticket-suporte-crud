import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  async index({ request }: HttpContext) {
    const { ticketId } = request.only(['ticketId'])
    return await Comment.query().where('ticketId', ticketId).preload('user').preload('ticket')
  }

  async store({ request, auth }: HttpContext) {
    const { content, ticketId } = request.only(['content', 'ticketId'])
    await Comment.create({ content: content, responsibleId: auth.user?.id, ticketId: ticketId })
  }

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}
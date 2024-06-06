import Comment from '#models/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  async index({}: HttpContext) {
    return await Comment.query()
  }

  async store({ request, auth }: HttpContext) {
    const { content, ticketId } = request.only(['content', 'ticketId'])
    await Comment.create({ content: content, responsibleId: auth.user?.id, ticketId: ticketId })
  }

  async update({ params, request }: HttpContext) {}

  async destroy({ params }: HttpContext) {}
}

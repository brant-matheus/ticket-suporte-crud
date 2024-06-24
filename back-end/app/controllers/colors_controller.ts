import Color from '#models/color'
import type { HttpContext } from '@adonisjs/core/http'

export default class ColorsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const data = await Color.query().orderBy('name', 'asc')
    return response.ok(data)
  }
}

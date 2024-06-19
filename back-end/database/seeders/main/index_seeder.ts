import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class IndexSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    // this should run
    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/color_seeder'))
    await this.seed(await import('#database/seeders/ticket_status_seeder'))
  }
}

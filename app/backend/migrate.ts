import electron from 'electron';
import { Umzug, JSONStorage } from 'umzug';

const cwd = (electron.app || electron.remote.app);
export class Migrate {
  private static umzug: any;
  private constructor() {}

  static async runMain(userId, env) {
    this.umzug = new Umzug({
      migrations: {
        glob: `${cwd.getAppPath()}/dist/migrations/main_*.js`,
        resolve: ({ name }) => {
          const script = require(`./migrations/${name}`);
          return script;
        },
      },
      storage: new JSONStorage({ path: `${cwd.getPath('userData')}/migrations-${userId.replace(/[/\\:*?"<>|]/g, '-')}-${env || ''}-main.json` }),
      logger: console,
    });
    await this.umzug.up();
  }

  static async runCrypted(userId, env) {
    this.umzug = new Umzug({
      migrations: {
        glob: `${cwd.getAppPath()}/dist/migrations/crypt_*.js`,
        resolve: ({ name }) => {
          const script = require(`./migrations/${name}`);
          return script;
        },
      },
      storage: new JSONStorage({ path: `${cwd.getPath('userData')}/migrations-${userId.replace(/[/\\:*?"<>|]/g, '-')}-${env || ''}-crypted.json` }),
      logger: console,
    });
    await this.umzug.up();
  }
}

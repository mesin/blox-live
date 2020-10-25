import electron from 'electron';
import { Umzug, JSONStorage } from 'umzug';

const cwd = (electron.app || electron.remote.app);
export class Migrate {
  private static umzug: any;
  private constructor() {}

  static async run() {
    this.umzug = new Umzug({
      migrations: {
        glob: `${cwd.getAppPath()}/dist/migrations/*.js`,
        resolve: ({ path, name, context }) => {
          console.log(name, path);
          console.log(context);
          const script = require(`./migrations/${name}`);
          console.log(script);
          return script;
        },
      },
      storage: new JSONStorage({ path: `${cwd.getPath('userData')}/migrations-log.json` }),
      logger: console,
    });
    console.log(await this.umzug.pending());
    await this.umzug.up();
  }
}

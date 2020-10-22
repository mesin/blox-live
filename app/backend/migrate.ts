import path from 'path';
import electron from 'electron';
import { Umzug, JSONStorage } from 'umzug';

const cwd = (electron.app || electron.remote.app);

const umzug = new Umzug({
  migrations: {
    // glob: `${cwd.getAppPath()}/dist/migrations/*.js`
    resolve: (migrationFile) => {
      return require(`./migrations/${path.basename(migrationFile, '.js')}`);
    }
  },
  storage: new JSONStorage({ path: `${cwd.getPath('userData')}/migrations-log.json` }),
  logger: console,
});

export class Migrate {
  static async run() {
    console.log(`${cwd.getAppPath()}/dist/migrations/*.js`);
    console.log(path.join(__dirname, 'migrations'));
    console.log(await umzug.pending());
    await umzug.up();
  }
}

export type Migration = typeof umzug._types.migration;

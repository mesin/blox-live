import { Umzug, JSONStorage } from 'umzug';

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.ts' },
  storage: new JSONStorage(),
  logger: console,
});

export class Migrate {
  static async run() {
    console.log(await umzug.pending());
    await umzug.up();
  }
}

export type Migration = typeof umzug._types.migration;

import { exec } from 'child_process';
import { execPath } from '../../binaries';
import util from 'util';


export default class KeyVaultCliService {
  protected readonly executablePath: string;
  protected readonly executor: (command: string) => Promise<any>;

  constructor() {
    this.executor = util.promisify(exec);
    this.executablePath = execPath;
  }

  execOutput(stdout, stderr): void {
    if (stderr) {
      console.error(`error: ${stderr}`);
    }
    console.log(stdout);
  }
}

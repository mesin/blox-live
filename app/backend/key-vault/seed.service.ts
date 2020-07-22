import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'


export default class KeyVaultCli {
  private readonly executableBin: string;
  private readonly executablePath: string;

  constructor() {
    this.executableBin = 'keyvault-cli';
    // dev path
    this.executablePath = path.resolve(`${__dirname}/../bin/${this.executableBin}`);
    // prod path
    if (!fs.existsSync(this.executablePath)) {
      this.executablePath = path.resolve(`${process.resourcesPath}/../bin/${this.executableBin}`);
    }
  }

  async seedGenerate(): Promise<void> {
    // Run binary
    await exec(`${this.executablePath} portfolio seed generate`, (
      error,
      stdout,
      stderr) => this.execOutput(error, stdout, stderr)
    );
  }

  async mnemonicGenerate(): Promise<void> {
    // Run binary
    await exec(`${this.executablePath} portfolio seed generate --mnemonic`, (
      error,
      stdout,
      stderr) => this.execOutput(error, stdout, stderr)
    );
  }

  async seedToMnemonicGenerate(): Promise<void> {
    // Run binary
    await exec(`${this.executablePath} portfolio seed generate --mnemonic --seed=a42b2d973095bb518e45ae5b372dbff9a3aec572ff74b1c8c54749d34b4479eb`, (
      error,
      stdout,
      stderr) => this.execOutput(error, stdout, stderr)
    );
  }

  execOutput( error, stdout, stderr): void {
    if (stderr) {
      console.error(`error: ${stderr}`);
    }
    if (error !== null) {
      console.error('exec error:', error);
    }
    console.log(stdout);
  }
}

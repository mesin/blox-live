const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


export default class KeyVaultCli {
  private readonly executableBin: string;
  private readonly executablePath: string;

  constructor() {
    this.executableBin = 'keyvault-cli';
    // dev path
    this.executablePath = path.resolve(`./bin/${this.executableBin}`);
    // prod path
    if (!fs.existsSync(this.executablePath)) {
      this.executablePath = path.resolve(`${process.resourcesPath}/../bin/${this.executableBin}`);
    }
  }

  async seedGenerate(): Promise<void> {
    // Create a writable stream
    // const writeStream = fs.createWriteStream('./.config');

    // Run binary
    exec(`${this.executablePath} portfolio seed generate`, (
      error,
      stdout,
      stderr
    ) => {
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      if (error !== null) {
        console.log('exec error:', error);
      }
    });

    // Pipe the stdout to stream
    // child.stdout.pipe(writeStream)
  }

  async mnemonicGenerate(): Promise<void> {
    // Run binary
    exec(`${this.executablePath} portfolio seed generate --mnemonic`, (
      error,
      stdout,
      stderr
    ) => {
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      if (error !== null) {
        console.log('exec error:', error);
      }
    });
  }

  async seedToMnemonicGenerate(): Promise<void> {
    // Run binary
    exec(`${this.executablePath} portfolio seed generate --mnemonic --seed=a42b2d973095bb518e45ae5b372dbff9a3aec572ff74b1c8c54749d34b4479eb`, (
      error,
      stdout,
      stderr
    ) => {
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      if (error !== null) {
        console.log('exec error:', error);
      }
    });
  }
}

import inquirer from 'inquirer';

export default class InquirerLib {
  askOtp(): Promise<any> {
    const questions = [
      {
        name: 'otp',
        type: 'input',
        message: 'Enter OTP from Blox Stacking signup wizard:',
        validate: (value: string) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter OTP.';
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  }

  askAwsCredentials(): Promise<any> {
    const questions = [
      {
        name: 'accessKeyId',
        type: 'input',
        message: 'Enter AWS access key id:',
        validate: (value: string) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter AWS access key id.';
          }
        },
      },
      {
        name: 'secretAccessKey',
        type: 'password',
        message: 'Enter AWS access secret key:',
        validate: (value: string) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter AWS access secret key.';
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  }
}

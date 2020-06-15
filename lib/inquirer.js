const inquirer = require('inquirer');

module.exports = {
  askAwsCredentials: () => {
    const questions = [
      {
        name: 'accessKeyId',
        type: 'input',
        message: 'Enter AWS access key id:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter AWS access key id.';
          }
        }
      },
      {
        name: 'secretAccessKey',
        type: 'password',
        message: 'Enter AWS access secret key:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter AWS access secret key.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  }
};
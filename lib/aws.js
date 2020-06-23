const Steps = require('cli-step');
const Configstore = require('configstore');
const inquirer = require('./inquirer');
const AWS = require('aws-sdk');
const server = require('./server');
const awsOptions = {
  apiVersion: '2016-11-15',
  region: 'us-west-1',
};
let ec2;
const conf = new Configstore('blox-infra');

module.exports = {
  getInstance: () => {
    return ec2;
  },

  getAccessKey: async () => {
    const steps = new Steps(1);

    const storedCredentials = conf.get('credentials');
    if (storedCredentials) {
      awsOptions.credentials = { ... storedCredentials };
    } else {
      const { accessKeyId, secretAccessKey } = await inquirer.askAwsCredentials();
      awsOptions.credentials = {
        accessKeyId,
        secretAccessKey
      };
    }
    const step1 = steps.advance('Authenticating you, please wait...', 'lock', 'AWS credentials').start();
    ec2 = new AWS.EC2(awsOptions);
    try {
      // check for ec2 instances permissions
      await ec2.describeInstances().promise();
      // check for ec2 elastic ips permissions
      await ec2.describeAddresses().promise();
      conf.set('credentials', awsOptions.credentials);
      step1.success('Successfully authenticated', 'white_check_mark')
    } catch (e) {
      ec2 = null;
      step1.error('Unable to authenticate', 'x');
      throw new Error(e.message);
    } 
  },

  setup: async () => {
    const keyName = 'BLOX_INFRA_KEY_PAIR';
    const securityGroupName = 'BLOX_INFRA_GROUP';
    const otp = conf.get('otp');
    const steps = new Steps(5);
    if (!ec2) {
      throw new Error('Can\'t setup environment. AWS not connected');
    }
    steps.advance('Initializing AWS Credentials...', 'key', 'IAM init')
      .start()
      .success(`Initialized AWS Credentials`, 'white_check_mark');
    // const status = new Spinner('Setting up environment, please wait...');
    // status.start();
    let currentStep;
    try {
      currentStep = steps.advance('Creating ec2 key pair...', 'key', 'EC2.createKeyPair').start();
      // 1. get stored pair key or create new one
      const storedKeyPair = conf.get('keyPair');
      if (!storedKeyPair) {
        const keyPairData = await ec2.createKeyPair({ KeyName: `${keyName}-${otp}` }).promise();
        conf.set('keyPair', {
          pairId: keyPairData.KeyPairId,
          privateKey: keyPairData.KeyMaterial
        });  
      }
      currentStep.success(`Successfully created key pair`, 'white_check_mark');
      currentStep = steps.advance('Allocating ip address...', 'round_pushpin', 'EC2.allocateAddress').start();
      // 2. get stored allocated address or create new one
      let addressId = conf.get('addressId');
      let publicIp = conf.get('publicIp');
      if (!addressId) {
        // status.message('Creating ip address...');
        const data = await ec2.allocateAddress({ Domain: 'vpc' }).promise();
        conf.set('addressId', data.AllocationId);
        conf.set('publicIp', data.PublicIp);
        addressId = data.AllocationId;
        publicIp = data.PublicIp;
      }
      currentStep.success(`Successfully setup ip address`, 'white_check_mark');
      currentStep = steps.advance('Setting up security group...', 'key', 'EC2.createSecurityGroup').start();
      let securityGroupId = conf.get('securityGroupId');
      if (!securityGroupId) {
        const vpc = (await ec2.describeVpcs().promise()).Vpcs[0].VpcId;
        const securityData = await ec2.createSecurityGroup({
          Description: `${securityGroupName}-${otp}`,
          GroupName: `${securityGroupName}-${otp}`,
          VpcId: vpc
        }).promise();
        securityGroupId = securityData.GroupId;
        await ec2.authorizeSecurityGroupIngress({
          GroupId: securityGroupId,
          IpPermissions:[
            {
                IpProtocol: 'tcp',
                FromPort: 8200,
                ToPort: 8200,
                IpRanges: [{"CidrIp":"0.0.0.0/0"}]
            },
            {
                IpProtocol: 'tcp',
                FromPort: 22,
                ToPort: 22,
                IpRanges: [{"CidrIp":"0.0.0.0/0"}]
            }
          ]
        }).promise()
        conf.set('securityGroupId', securityGroupId);
      }
      currentStep.success('Security group setup successfully', 'white_check_mark');
      currentStep = steps.advance('Setting up Linux AMI t2.micro instance...', 'desktop_computer', 'EC2.runInstances').start();
      // 3. get stored instance id or create new one. And associate it with ip address
      let instanceId = conf.get('instanceId');
      if (!instanceId) {
        // status.message('Running Ubuntu t2.micro instance...');
        const data = await ec2.runInstances({
          ImageId: 'ami-0d3caf10672b8e870', // ubuntu 16.04LTS for us-west-1
          InstanceType: 't2.micro',
          SecurityGroupIds: [securityGroupId],
          KeyName: `${keyName}-${otp}`,
          MinCount: 1,
          MaxCount: 1
        }).promise();
        instanceId = data.Instances[0].InstanceId;
        conf.set('instanceId', instanceId);
        await server.delay(60000);
        // let's tag it
        // status.message('Setting the instance name...')
        await ec2.createTags({
          Resources: [instanceId],
          Tags: [{ Key: 'Name', Value: 'Blox-Infra-Server' }]
        }).promise();

        // status.message(`Associating instance with public ip ${publicIp}...`);  
        await ec2.associateAddress({
          AllocationId: addressId,
          InstanceId: instanceId
        }).promise();
      }
      currentStep.success(`Successfully setup server on ip ${publicIp}`, 'white_check_mark');
    } catch (e) {
      currentStep.error(e.message, 'x');
      throw new Error('x AWS setup not completed');
    }
  },

  waitForInstanceRunning: async () => {
    ec2 = new AWS.EC2(awsOptions);
    const instanceId = conf.get('instanceId');
    if (!instanceId) throw Error('InstanceId not found');
    await ec2.waitFor('instanceStatusOk', { InstanceIds: [instanceId] }, async () => {
      // check for ok
    }).promise();
  },

  rebootInstance: async () => {
    ec2 = new AWS.EC2(awsOptions);
    const instanceId = conf.get('instanceId');
    if (!instanceId) throw Error('InstanceId not found');
    await ec2.rebootInstances({
      InstanceIds: [instanceId],
      DryRun: false
    }).promise();
    await ec2.waitFor('instanceRunning', { InstanceIds: [instanceId] }, async () => {
      // check for ok
    }).promise();
  },
};
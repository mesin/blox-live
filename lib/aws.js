const Configstore = require('configstore');
const inquirer = require('./inquirer');
const AWS = require('aws-sdk');
const flow = require('./flow');

const conf = new Configstore('blox-infra');


const keyName = 'BLOX_INFRA_KEY_PAIR';
const securityGroupName = 'BLOX_INFRA_GROUP';
const defaultAwsOptions = {
  apiVersion: '2016-11-15',
  region: 'us-west-1',
};

async function initAwsCredentials() {
  try {
    flow.validate('credentials');
  } catch (error) {
    const { accessKeyId, secretAccessKey } = await inquirer.askAwsCredentials();
    conf.set('credentials', { accessKeyId, secretAccessKey });
  }
}

async function initEC2Connection() {
  flow.validate('credentials');
  const ec2 = new AWS.EC2({ ...defaultAwsOptions, credentials: conf.get('credentials') });
  return ec2;
}

async function validateAWSPermissions() {
  const ec2 = initEC2Connection();
  try {
    await ec2.describeInstances().promise();
    await ec2.describeAddresses().promise();  
  } catch (error) {
    conf.delete('credentials');
    throw new Error(error.message);
  }
}

async function createEc2KeyPair() {
  flow.validate('otp');
  if (conf.get('keyPair')) return;

  const ec2 = initEC2Connection();
  const { KeyPairId: pairId, KeyMaterial: privateKey } = await ec2.createKeyPair({ KeyName: `${keyName}-${conf.get('otp')}` }).promise();
  conf.set('keyPair', { pairId, privateKey });  
}

async function createElasticIp() {
  if (conf.get('addressId')) return;

  const ec2 = initEC2Connection();
  const { AllocationId: addressId, PublicIp: publicIp } = await ec2.allocateAddress({ Domain: 'vpc' }).promise();
  conf.set('addressId', addressId);
  conf.set('publicIp', publicIp);
}

async function createSecurityGroup() {
  flow.validate('otp');
  if (conf.get('securityGroupId')) return;

  const ec2 = initEC2Connection();
  const vpc = (await ec2.describeVpcs().promise()).Vpcs[0].VpcId;
  const securityData = await ec2.createSecurityGroup({
    Description: `${securityGroupName}-${conf.get('otp')}`,
    GroupName: `${securityGroupName}-${conf.get('otp')}`,
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

async function createInstance() {
  flow.validate('otp');
  flow.validate('securityGroupId');
  flow.validate('addressId');
  if (conf.get('instanceId')) return;

  const ec2 = initEC2Connection();
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

  await flow.delay(60000); // need to improve

  await ec2.createTags({
    Resources: [instanceId],
    Tags: [{ Key: 'Name', Value: 'Blox-Infra-Server' }]
  }).promise();

  await ec2.associateAddress({
    AllocationId: conf.get('addressId'),
    InstanceId: instanceId
  }).promise();
}

async function uninstallItems() {
  flow.validate('otp');
  flow.validate('instanceId');
  flow.validate('securityGroupId');
  flow.validate('addressId');
  flow.validate('publicIp');
  flow.validate('keyPair');
  const ec2 = initEC2Connection();
  await ec2.terminateInstances({ InstanceIds: [conf.get('instanceId')] }).promise();
  await ec2.waitFor('instanceTerminated', { InstanceIds: [conf.get('instanceId')] }, () => {}).promise();
  await ec2.deleteSecurityGroup({ GroupId: conf.get('securityGroupId'), DryRun: false }).promise();
  await ec2.releaseAddress({ AllocationId: conf.get('addressId') }).promise();
  await ec2.deleteKeyPair({ KeyPairId: conf.get('keyPair').pairId }).promise();
}

const installFlow = [
  {
    name: 'Init AWS Credentials',
    func: initAwsCredentials
  },
  {
    name: 'Check AWS keys permissions',
    func: validateAWSPermissions
  },
  {
    name: 'Create EC2 Key Pair',
    func: createEc2KeyPair
  },
  {
    name: 'Allocate Elastic IP',
    func: createElasticIp
  },
  {
    name: 'Create Security Group',
    func: createSecurityGroup
  },
  {
    name: 'Setup VPC Linux Instance',
    func: createInstance
  },
]

const uninstallFlow = [
  {
    name: 'Delete all EC2 items',
    func: uninstallItems
  }
]

module.exports = {
  install: async () => {
    await flow.run(installFlow);
  },

  uninstall: async () => {
    await flow.run(uninstallFlow);
  }
};
import Configstore from 'configstore';
import * as AWS from 'aws-sdk';
import InquirerLib from './inquirer';
import FlowLib from './flow';

export default class AWSLib {
  public readonly conf: Configstore = new Configstore('blox-infra');
  public readonly inquirer: InquirerLib = new InquirerLib();
  public readonly flow: FlowLib = new FlowLib();
  public readonly ec2: AWS.EC2;
  public readonly keyName: string = 'BLOX_INFRA_KEY_PAIR';
  public readonly securityGroupName: string = 'BLOX_INFRA_GROUP';
  public readonly defaultAwsOptions = {
    apiVersion: '2016-11-15',
    region: 'us-west-1',
  };
  
  constructor() {
   this.flow.validate('credentials');
   this.ec2 = new AWS.EC2({ ...this.defaultAwsOptions, credentials: this.conf.get('credentials') });
  }

  async initAwsCredentials(): Promise<void> {
    try {
      this.flow.validate('credentials');
    } catch (error) {
      const { accessKeyId, secretAccessKey } = await this.inquirer.askAwsCredentials();
      this.conf.set('credentials', { accessKeyId, secretAccessKey });
    }
  }
  
  async validateAWSPermissions() {
    try {
      await this.ec2.describeInstances().promise();
      await this.ec2.describeAddresses().promise();  
    } catch (error) {
      this.conf.delete('credentials');
      throw new Error(error.message);
    }
  }

  async createEc2KeyPair() {
    this.flow.validate('otp');
    if (this.conf.get('keyPair')) return;

    const {
      KeyPairId: pairId,
      KeyMaterial: privateKey
    } = await this.ec2.createKeyPair({ KeyName: `${this.keyName}-${this.conf.get('otp')}` }).promise();
    this.conf.set('keyPair', { pairId, privateKey });  
  }

  async createElasticIp() {
    if (this.conf.get('addressId')) return;

    const {
      AllocationId: addressId,
      PublicIp: publicIp
    } = await this.ec2.allocateAddress({ Domain: 'vpc' }).promise();
    this.conf.set('addressId', addressId);
    this.conf.set('publicIp', publicIp);
  }

  async createSecurityGroup() {
    this.flow.validate('otp');
    if (this.conf.get('securityGroupId')) return;

    const vpc = (await this.ec2.describeVpcs().promise()).Vpcs[0].VpcId;
    const securityData = await this.ec2.createSecurityGroup({
      Description: `${this.securityGroupName}-${this.conf.get('otp')}`,
      GroupName: `${this.securityGroupName}-${this.conf.get('otp')}`,
      VpcId: vpc
    }).promise();
    const securityGroupId = securityData.GroupId;
    await this.ec2.authorizeSecurityGroupIngress({
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
    this.conf.set('securityGroupId', securityGroupId);    
  }

  async createInstance() {
    this.flow.validate('otp');
    this.flow.validate('securityGroupId');
    this.flow.validate('addressId');
    if (this.conf.get('instanceId')) return;

    const data = await this.ec2.runInstances({
      ImageId: 'ami-0d3caf10672b8e870', // ubuntu 16.04LTS for us-west-1
      InstanceType: 't2.micro',
      SecurityGroupIds: [this.conf.get('securityGroupId')],
      KeyName: `${this.keyName}-${this.conf.get('otp')}`,
      MinCount: 1,
      MaxCount: 1
    }).promise();
    const instanceId = data.Instances[0].InstanceId;
    this.conf.set('instanceId', instanceId);

    await this.flow.delay(60000); // need to improve

    await this.ec2.createTags({
      Resources: [instanceId],
      Tags: [{ Key: 'Name', Value: 'Blox-Infra-Server' }]
    }).promise();

    await this.ec2.associateAddress({
      AllocationId: this.conf.get('addressId'),
      InstanceId: instanceId
    }).promise();
  }

  async uninstallItems() {
    this.flow.validate('instanceId');
    this.flow.validate('securityGroupId');
    this.flow.validate('addressId');
    this.flow.validate('publicIp');
    this.flow.validate('keyPair');

    await this.ec2.terminateInstances({ InstanceIds: [this.conf.get('instanceId')] }).promise();
    await this.ec2.waitFor('instanceTerminated', { InstanceIds: [this.conf.get('instanceId')] }, () => {}).promise();
    await this.ec2.deleteSecurityGroup({ GroupId: this.conf.get('securityGroupId'), DryRun: false }).promise();
    await this.ec2.releaseAddress({ AllocationId: this.conf.get('addressId') }).promise();
    await this.ec2.deleteKeyPair({ KeyPairId: this.conf.get('keyPair').pairId }).promise();
  }

  async install(): Promise<void> {
    const flowSteps = [
      {
        func: this.initAwsCredentials
      },
      {
        name: 'Check AWS keys permissions',
        func: this.validateAWSPermissions
      },
      {
        name: 'Create EC2 Key Pair',
        func: this.createEc2KeyPair
      },
      {
        name: 'Allocate Elastic IP',
        func: this.createElasticIp
      },
      {
        name: 'Create Security Group',
        func: this.createSecurityGroup
      },
      {
        name: 'Setup VPC Linux Instance',
        func: this.createInstance
      },
    ];
    await this.flow.run(flowSteps);
  }

  async uninstall(): Promise<void> {
    const flowSteps = [
      {
        name: 'Delete all EC2 items',
        func: this.uninstallItems
      }
    ];
    await this.flow.run(flowSteps);
  }
}

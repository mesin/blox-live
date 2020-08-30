import net from 'net';
import { StoreService, resolveStoreService } from '../store-manager/store.service';
import * as AWS from 'aws-sdk';
import { CatchClass, Step } from '../decorators';

// TODO import from .env
const tempStorePrefix = 'tmp';

@CatchClass<AwsService>()
export default class AwsService {
  private ec2!: AWS.EC2;
  private readonly storeService: StoreService;
  private readonly keyName: string = 'BLOX_INFRA_KEY_PAIR';
  private readonly securityGroupName: string = 'BLOX_INFRA_GROUP';
  private readonly defaultAwsOptions = {
    apiVersion: '2016-11-15',
    region: 'us-west-1'
  };

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);

    if (!this.ec2 && this.storeService.get('credentials')) {
      this.setAWSCredentials();
    }
  }

  @Step({
    name: 'Securely connecting to AWS...',
    requiredConfig: ['credentials']
  })
  async setAWSCredentials(): Promise<any> {
    const credentials: any = this.storeService.get('credentials');
    this.ec2 = new AWS.EC2({
      ...this.defaultAwsOptions,
      credentials
    });
  }

  @Step({
    name: 'Checking AWS keys permissions...'
  })
  async validateAWSPermissions() {
    try {
      await this.ec2.describeInstances().promise();
      await this.ec2.describeAddresses().promise();
    } catch (error) {
      this.storeService.delete('credentials');
      throw new Error(error.message);
    }
  }

  @Step({
    name: 'Creating secure EC2 key pair...',
    requiredConfig: ['uuid']
  })
  async createEc2KeyPair() {
    if (this.storeService.get('keyPair')) return;

    const {
      KeyPairId: pairId,
      KeyMaterial: privateKey
    } = await this.ec2
      .createKeyPair({ KeyName: `${this.keyName}-${this.storeService.get('uuid')}` })
      .promise();
    this.storeService.set('keyPair', { pairId, privateKey });
  }

  @Step({
    name: 'Enabling connection using Elastic IP...'
  })
  async createElasticIp() {
    if (this.storeService.get('addressId')) return;

    const {
      AllocationId: addressId,
      PublicIp: publicIp
    } = await this.ec2.allocateAddress({ Domain: 'vpc' }).promise();
    this.storeService.set('addressId', addressId);
    this.storeService.set('publicIp', publicIp);
  }

  @Step({
    name: 'Setting security group permissions...',
    requiredConfig: ['uuid']
  })
  async createSecurityGroup() {
    if (this.storeService.get('securityGroupId')) return;

    const vpcList = await this.ec2.describeVpcs().promise();
    const vpc = vpcList?.Vpcs![0].VpcId;
    const securityData = await this.ec2
      .createSecurityGroup({
        Description: `${this.securityGroupName}-${this.storeService.get('uuid')}`,
        GroupName: `${this.securityGroupName}-${this.storeService.get('uuid')}`,
        VpcId: vpc
      })
      .promise();
    const securityGroupId = securityData.GroupId;
    await this.ec2
      .authorizeSecurityGroupIngress({
        GroupId: securityGroupId,
        IpPermissions: [
          {
            IpProtocol: 'tcp',
            FromPort: 8200,
            ToPort: 8200,
            IpRanges: [{ CidrIp: '0.0.0.0/0' }]
          },
          {
            IpProtocol: 'tcp',
            FromPort: 22,
            ToPort: 22,
            IpRanges: [{ CidrIp: '0.0.0.0/0' }]
          }
        ]
      }).promise();
    this.storeService.set('securityGroupId', securityGroupId);
  }

  @Step({
    name: 'Establishing KeyVault server...',
    requiredConfig: ['uuid', 'securityGroupId', 'addressId']
  })
  async createInstance() {
    if (this.storeService.get('instanceId')) return;

    const data = await this.ec2.runInstances({
      ImageId: 'ami-0d3caf10672b8e870', // ubuntu 16.04LTS for us-west-1
      InstanceType: 't2.micro',
      SecurityGroupIds: [this.storeService.get('securityGroupId')],
      KeyName: `${this.keyName}-${this.storeService.get('uuid')}`,
      MinCount: 1,
      MaxCount: 1
    }).promise();
    const instanceId = data.Instances![0].InstanceId;
    await this.ec2
      .waitFor('instanceRunning', { InstanceIds: [instanceId] })
      .promise();
    this.storeService.set('instanceId', instanceId);

    const tagsOptions: AWS.EC2.Types.CreateTagsRequest = {
      Resources: [instanceId],
      Tags: [{ Key: 'Name', Value: 'Blox-Infra-Server' }]
    };
    await this.ec2.createTags(tagsOptions).promise();
    await this.ec2.associateAddress({
      AllocationId: this.storeService.get('addressId'),
      InstanceId: instanceId
    }).promise();
    await new Promise((resolve) => setTimeout(resolve, 25000)); // hard delay for 25sec
  }

  @Step({
    name: 'Delete all EC2 items',
    requiredConfig: ['instanceId', 'securityGroupId', 'addressId', 'keyPair']
  })
  async uninstallItems() {
    await this.ec2.terminateInstances({ InstanceIds: [this.storeService.get('instanceId')] }).promise();
    await this.ec2.waitFor('instanceTerminated', { InstanceIds: [this.storeService.get('instanceId')] }).promise();
    await this.ec2.releaseAddress({ AllocationId: this.storeService.get('addressId') }).promise();
    await this.ec2.deleteKeyPair({ KeyPairId: this.storeService.get('keyPair.pairId') }).promise();
    await this.ec2.deleteSecurityGroup({ GroupId: this.storeService.get('securityGroupId'), DryRun: false }).promise();
    this.storeService.clear();
    const storeServiceTmp = resolveStoreService(tempStorePrefix);
    storeServiceTmp.clear();
  }

  @Step({
    name: 'Removing old EC2 instance...',
    requiredConfig: ['instanceId', 'addressId']
  })
  async truncateServer() {
    await this.ec2.terminateInstances({ InstanceIds: [this.storeService.get('instanceId')] }).promise();
    await this.ec2.waitFor('instanceTerminated', { InstanceIds: [this.storeService.get('instanceId')] }).promise();
    await this.ec2.releaseAddress({ AllocationId: this.storeService.get('addressId') }).promise();
  }

  @Step({
    name: 'Establishing connection to your server...',
    requiredConfig: ['instanceId', 'publicIp']
  })
  async rebootInstance() {
    await this.ec2.rebootInstances({ InstanceIds: [this.storeService.get('instanceId')] }).promise();
    await new Promise((resolve) => {
      let totalSeconds = 0;
      const DELAY = 5000; // 5 sec
      const intervalId = setInterval(() => {
        const socket = new net.Socket();
        const onError = () => {
          socket.destroy();
          console.log('waiting', this.storeService.get('publicIp'), totalSeconds);
          if (totalSeconds >= 80000) { // 80 sec
            console.log('Reached max timeout, exiting...', intervalId);
            clearInterval(intervalId);
            resolve();
            return;
          }
          totalSeconds += DELAY;
        };
        socket.setTimeout(1000);
        socket.once('error', onError);
        socket.once('timeout', onError);
        const ip: any = this.storeService.get('publicIp');
        socket.connect(22, ip, () => {
          console.log('Server is online');
          socket.destroy();
          clearInterval(intervalId);
          resolve();
        });
      }, DELAY);
    });
  }
}

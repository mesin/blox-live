import net from 'net';
import Connection from '../../common/store-manager/connection';
import * as AWS from 'aws-sdk';
import { Catch, CatchClass, Step } from '../../decorators';
import config from '../../common/config';
import { v4 as uuidv4 } from 'uuid';
import VersionService from '../version/version.service';
import UserService from '../users/users.service';

// TODO import from .env
const defaultAwsOptions = {
  apiVersion: '2016-11-15',
  region: 'us-west-1'
};
@CatchClass<AwsService>()
export default class AwsService {
  private ec2!: AWS.EC2;
  private readonly keyName: string = 'BLOX_INFRA_KEY_PAIR';
  private readonly securityGroupName: string = 'BLOX_INFRA_GROUP';
  private storePrefix: string;
  private readonly versionService: VersionService;
  private readonly userService: UserService;

  constructor(prefix: string = '') {
    this.storePrefix = prefix;
    if (!this.ec2 && Connection.db(this.storePrefix).exists('credentials')) {
      this.setAWSCredentials();
    }
    this.versionService = new VersionService();
    this.userService = new UserService();
  }

  static async validateAWSCredentials({ accessKeyId, secretAccessKey }) {
    const ec2 = new AWS.EC2({
      ...defaultAwsOptions,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
    try {
      await ec2.describeInstances().promise();
      await ec2.describeAddresses().promise();
    } catch (error) {
      throw new Error(error.message);
    }
    return true;
  }

  @Step({
    name: 'Securely connecting to AWS...'
  })
  async setAWSCredentials(): Promise<any> {
    const credentials: any = Connection.db(this.storePrefix).get('credentials');
    this.ec2 = new AWS.EC2({
      ...defaultAwsOptions,
      credentials
    });
  }

  @Step({
    name: 'Checking AWS keys permissions...'
  })
  @Catch({
    showErrorMessage: true
  })
  async validateAWSPermissions() {
    try {
      await this.ec2.describeInstances().promise();
      await this.ec2.describeAddresses().promise();
    } catch (error) {
      Connection.db(this.storePrefix).delete('credentials');
      throw new Error(error.message);
    }
  }

  @Step({
    name: 'Creating secure EC2 key pair...'
  })
  async createEc2KeyPair() {
    console.log('KEYPAIIIIR', this.storePrefix, Connection.db(this.storePrefix).exists('keyPair'));
    if (Connection.db(this.storePrefix).exists('keyPair')) return;

    const {
      KeyPairId: pairId,
      KeyMaterial: privateKey
    } = await this.ec2
      .createKeyPair({ KeyName: `${this.keyName}-${Connection.db(this.storePrefix).get('uuid')}` })
      .promise();
      Connection.db(this.storePrefix).set('keyPair', { pairId, privateKey });
  }

  @Step({
    name: 'Enabling connection using Elastic IP...'
  })
  async createElasticIp() {
    if (Connection.db(this.storePrefix).exists('addressId')) return;

    const {
      AllocationId: addressId,
      PublicIp: publicIp
    } = await this.ec2.allocateAddress({ Domain: 'vpc' }).promise();
    Connection.db(this.storePrefix).set('addressId', addressId);
    Connection.db(this.storePrefix).set('publicIp', publicIp);
  }

  @Step({
    name: 'Setting security group permissions...'
  })
  async createSecurityGroup() {
    // validate if in main.json we have port AND port === TARGET PORT (2200)
    if (Connection.db(this.storePrefix).exists('port') && Connection.db(this.storePrefix).get('port') === config.env.TARGET_SSH_PORT) {
      Connection.db(this.storePrefix).delete('port');
      return;
    }

    const vpcList = await this.ec2.describeVpcs().promise();
    const vpc = vpcList?.Vpcs![0].VpcId;
    const uuid = uuidv4();
    const securityData = await this.ec2
      .createSecurityGroup({
        Description: `${this.securityGroupName}-${uuid}`,
        GroupName: `${this.securityGroupName}-${uuid}`,
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
          },
          {
            IpProtocol: 'tcp',
            FromPort: config.env.TARGET_SSH_PORT,
            ToPort: config.env.TARGET_SSH_PORT,
            IpRanges: [{ CidrIp: '0.0.0.0/0' }]
          }
        ]
      }).promise();
      Connection.db(this.storePrefix).set('securityGroupId', securityGroupId);
      Connection.db(this.storePrefix).delete('port');
  }

  @Step({
    name: 'Establishing KeyVault server...'
  })
  async createInstance() {
    if (Connection.db(this.storePrefix).exists('instanceId')) return;

    const data = await this.ec2.runInstances({
      ImageId: 'ami-0d3caf10672b8e870', // ubuntu 16.04LTS for us-west-1
      InstanceType: 't2.micro',
      SecurityGroupIds: [Connection.db(this.storePrefix).get('securityGroupId')],
      KeyName: `${this.keyName}-${Connection.db(this.storePrefix).get('uuid')}`,
      MinCount: 1,
      MaxCount: 1
    }).promise();
    const instanceId = data.Instances![0].InstanceId;
    await this.ec2
      .waitFor('instanceRunning', { InstanceIds: [instanceId] })
      .promise();
    Connection.db(this.storePrefix).set('instanceId', instanceId);

    const keyVaultVersion = await this.versionService.getLatestKeyVaultVersion();
    const userProfile = await this.userService.get();

    const tagsOptions: AWS.EC2.Types.CreateTagsRequest = {
      Resources: [instanceId],
      Tags: [
        { Key: 'Name', Value: 'blox-staking'},
        { Key: 'kv-version', Value: `${keyVaultVersion}` },
        { Key: 'org-id', Value: `${userProfile.organizationId}`},
      ]
    };
    await this.ec2.createTags(tagsOptions).promise();
    await this.ec2.associateAddress({
      AllocationId: Connection.db(this.storePrefix).get('addressId'),
      InstanceId: instanceId
    }).promise();
    await new Promise((resolve) => setTimeout(resolve, 25000)); // hard delay for 25sec
    throw 1;
  }

  @Step({
    name: 'Delete all EC2 items'
  })
  async uninstallItems() {
    await this.ec2.terminateInstances({ InstanceIds: [Connection.db(this.storePrefix).get('instanceId')] }).promise();
    await this.ec2.waitFor('instanceTerminated', { InstanceIds: [Connection.db(this.storePrefix).get('instanceId')] }).promise();
    await this.ec2.releaseAddress({ AllocationId: Connection.db(this.storePrefix).get('addressId') }).promise();
    const keyPair = Connection.db(this.storePrefix).get('keyPair');
    await this.ec2.deleteKeyPair({ KeyPairId: keyPair.pairId }).promise();
    await this.ec2.deleteSecurityGroup({ GroupId: Connection.db(this.storePrefix).get('securityGroupId'), DryRun: false }).promise();
    Connection.db(this.storePrefix).clear();
    /*
    if (Store.isExist(tempStorePrefix)) {
      Store.getStore(tempStorePrefix).clear();
    }
    */
  }

  @Step({
    name: 'Removing old EC2 instance...'
  })
  async truncateServer() {
    const sources: any = {
      instanceId: Connection.db(this.storePrefix).get('instanceId'),
      addressId: Connection.db(this.storePrefix).get('addressId')
    };
    await this.destroyResources(sources);
    return { isActive: true };
  }

  @Step({
    name: 'Truncate old keyvault instances...'
  })
  async truncateOldKvResources() {
    const userProfile = await this.userService.get();
    const instances = await this.ec2.describeInstances().promise();
    const addresses = (await this.ec2.describeAddresses().promise()).Addresses;
    const activeInstanceId = Connection.db(this.storePrefix).get('instanceId');
    const kvOldOrgInstances = instances.Reservations.reduce((aggr, reserv) => {
      // eslint-disable-next-line no-param-reassign
      aggr = [
        ...aggr,
        ...reserv.Instances
          .filter(instance => instance.Tags.find(tag => tag.Key === 'org-id' && tag.Value === `${userProfile.organizationId}`))
          .filter(instance => instance.InstanceId !== activeInstanceId)
      ];
      return aggr;
    }, []);
    // eslint-disable-next-line no-restricted-syntax
    for (const oldInstance of kvOldOrgInstances) {
      const instanceId = oldInstance.InstanceId;
      const filteredAssocs = addresses.filter(addr => addr.InstanceId === instanceId);
      const params = {
        instanceId,
        addressId: filteredAssocs[0]?.AllocationId,
        securityGroupId: oldInstance.SecurityGroups[0]?.GroupId
      };
      console.log('going to destroy', params);
      // eslint-disable-next-line no-await-in-loop
      await this.destroyResources(params);
    }
    return { isActive: true };
  }

  async destroyResources({ instanceId = null, addressId = null, securityGroupId = null }) {
    if (instanceId) {
      await this.ec2.terminateInstances({ InstanceIds: [instanceId] }).promise();
      await this.ec2.waitFor('instanceTerminated', { InstanceIds: [instanceId] }).promise();
    }
    addressId && await this.ec2.releaseAddress({ AllocationId: addressId }).promise();
    try {
      securityGroupId && await this.ec2.deleteSecurityGroup({ GroupId: securityGroupId }).promise();
    } catch (e) {
      console.error(e);
    }
  }

  @Step({
    name: 'Establishing connection to your server...'
  })
  async rebootInstance() {
    await this.ec2.rebootInstances({ InstanceIds: [Connection.db(this.storePrefix).get('instanceId')] }).promise();
    await new Promise((resolve, reject) => {
      let totalSeconds = 0;
      const DELAY = 5000; // 5 sec
      const intervalId = setInterval(() => {
        const socket = new net.Socket();
        const onError = () => {
          socket.destroy();
          console.log('waiting', Connection.db(this.storePrefix).get('publicIp'), totalSeconds);
          if (totalSeconds >= 80000) { // 80 sec
            console.log('Reached max timeout, exiting...', intervalId);
            clearInterval(intervalId);
            reject(new Error('Reached max timeout'));
          }
          totalSeconds += DELAY;
        };
        socket.setTimeout(1000);
        socket.once('error', onError);
        socket.once('timeout', onError);
        const ip: any = Connection.db(this.storePrefix).get('publicIp');
        socket.connect(Connection.db(this.storePrefix).get('port') || config.env.port, ip, () => {
          console.log('Server is online');
          socket.destroy();
          clearInterval(intervalId);
          resolve({});
        });
      }, DELAY);
    });
  }
}

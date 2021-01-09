import ProcessClass from './process.class';
import Connection from '../common/store-manager/connection';
import KeyVaultService from '../services/key-vault/key-vault.service';

export default class SendImagesProcess extends ProcessClass {
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;
  public readonly fallbackActions: Array<any>;
  public readonly maxRunBeforeFallback: number;

  constructor(images: { url: string }[]) {
    super();
    console.log('SendImagesProcess->constructor');
    this.keyVaultService = new KeyVaultService();
    this.maxRunBeforeFallback = 2;

    this.actions = [
      {
        instance: this.keyVaultService,
        method: 'saveImages',
        params: {
          images
        }
      }
    ];

    this.fallbackActions = [
      {
        postActions: true,
        actions: [
          {
            instance: Connection,
            method: 'clear'
          },
          {
            instance: Connection,
            method: 'remove'
          }
        ]
      }
    ];
  }
}

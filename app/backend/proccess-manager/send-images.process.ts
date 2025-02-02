import ProcessClass from './process.class';
import BaseStore from '../common/store-manager/base-store';
import Connection from '../common/store-manager/connection';
import KeyVaultService from '../services/key-vault/key-vault.service';

export type ImagesType = { url: string }[];

export default class SendImagesProcess extends ProcessClass {
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;
  public readonly fallbackActions: Array<any>;
  public readonly maxRunBeforeFallback: number;

  constructor(images: ImagesType) {
    super();
    const baseStore = new BaseStore();
    Connection.setup({
      currentUserId: baseStore.get('currentUserId'),
      authToken: baseStore.get('authToken'),
      prefix: 'CustomUserData'
    });
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

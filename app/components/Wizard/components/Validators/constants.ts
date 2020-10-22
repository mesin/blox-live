import testNetImage from '../../assets/img-validator-test-net.svg';
import mainNetImage from '../../assets/img-validator-main-net.svg';
import config from 'backend/common/config';
import Store from 'backend/common/store-manager/store';

const store: Store = Store.getStore();

export const NETWORKS = {
  test: {
    name: 'TestNet',
    title: 'Test on TestNet',
    image: testNetImage,
    label: config.env.TEST_NETWORK,
    isDisabled: false,
  },
  zinken: {
    name: 'MainNet',
    title: 'Stake on MainNet',
    image: mainNetImage,
    label: config.env.ZINKEN_NETWORK,
    isDisabled: store.get('env') === 'production',
  },
};

export const INTRO_TOOLTIP_TEXT = `GoETH are test tokens needed in order to participate in the Goerli Test Network.
  'You need at least 32 GoETH test tokens in order to stake on TestNet. GoETH have no real value!`;

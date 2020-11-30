import testNetImage from '../../assets/img-validator-test-net.svg';
import mainNetImage from '../../assets/img-validator-main-net.svg';
import config from 'backend/common/config';

export const NETWORKS = {
  pyrmont: {
    name: 'Testnet',
    title: 'Test on Testnet',
    image: testNetImage,
    label: config.env.TEST_NETWORK,
  },
  mainnet: {
    name: 'Mainnet',
    title: 'Stake on Mainnet',
    image: mainNetImage,
    label: config.env.MAINNET_NETWORK,
  },
};

export const INTRO_TOOLTIP_TEXT = `GoETH are test tokens needed in order to participate in the Goerli Test Network.
  'You need at least 32 GoETH test tokens in order to stake on TestNet. GoETH have no real value!`;

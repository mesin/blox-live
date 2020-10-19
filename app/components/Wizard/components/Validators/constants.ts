import testNetImage from '../../assets/img-validator-test-net.svg';
import mainNetImage from '../../assets/img-validator-main-net.svg';
import config from 'backend/common/config';

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
    isDisabled: false,
  },
};

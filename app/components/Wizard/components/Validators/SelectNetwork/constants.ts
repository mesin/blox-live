import testNetImage from '../../../assets/img-validator-test-net.svg';
import mainNetImage from '../../../assets/img-validator-main-net.svg';
import config from '../../../../../backend/common/config';

export const BUTTONS = [
  {
    title: 'Test on TestNet',
    image: testNetImage,
    sticker: 'Free',
    label: config.env.TEST_NETWORK,
    isDisabled: false,
  },
  {
    title: 'Stake on MainNet',
    image: mainNetImage,
    sticker: 'Zinken',
    label: config.env.ZINKEN_NETWORK,
    isDisabled: false,
  },
];

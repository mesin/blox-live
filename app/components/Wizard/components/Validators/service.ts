import config from 'backend/common/config';

export const generateDepositDataInfo = (network, depositData) => {
  const depositToValue = network === config.env.TEST_NETWORK ? '0x07b39F4fDE4A38bACe212b546dAc87C58DfE3fDC' : '0x99F0Ec06548b086E46Cb0019C78D0b9b9F36cD53';
  const amountValue = network === config.env.TEST_NETWORK ? '32 GoETH' : '32 ETH';
  return [
    {
      label: 'depositTo',
      value: depositToValue,
      title: 'To Address',
      moreInfo: 'This where your deposit transactions should be sent in order to run your validator and start staking.',
    },
    {
      label: 'txData',
      value: depositData,
      title: 'Tx Data',
      moreInfo: 'TX data holds additional information that is required for the transaction.',
    },
    {
      label: 'amount',
      value: amountValue,
      title: 'Amount',
      moreInfo: 'The transaction amount refers to the amount of Ethereum required for staking. Please send the exact amount.',
    },
  ];
};

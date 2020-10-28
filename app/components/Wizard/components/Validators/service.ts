export const generateDepositDataInfo = (depositData) => {
  const { depositTo, coin, txHash } = depositData;
  return [
    {
      label: 'depositTo',
      value: depositTo,
      title: 'To Address',
      moreInfo: 'This where your deposit transactions should be sent in order to run your validator and start staking.',
    },
    {
      label: 'txData',
      value: txHash,
      title: 'Tx Data',
      moreInfo: 'TX data holds additional information that is required for the transaction.',
    },
    {
      label: 'amount',
      value: `32 ${coin}`,
      title: 'Amount',
      moreInfo: 'The transaction amount refers to the amount of Ethereum required for staking. Please send the exact amount.',
    },
  ];
};

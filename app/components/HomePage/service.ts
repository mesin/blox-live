import moment from 'moment';

const handleChange = (currentBalance, effectiveBalance) => {
  if (currentBalance && effectiveBalance) {
    return `${currentBalance - effectiveBalance}`;
  }
  return null;
};

export const normalizeAccountsData = (accounts) =>
  accounts.map((account) => {
    const {
      id,
      publicKey,
      activationTime,
      createdAt,
      currentBalance,
      effectiveBalance,
    } = account;
    const newAccount = { ...account };

    newAccount.key = {
      publicKey,
      activationTime,
      createdAt: moment(createdAt).format('MMMM DD, YYYY'),
    };

    newAccount.change = handleChange(currentBalance, effectiveBalance);
    delete newAccount.publicKey;
    delete newAccount.activationTime;
    delete newAccount.date;

    newAccount.misc = {
      accountId: id,
      wallet: '',
    };
    return newAccount;
  });

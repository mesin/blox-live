import moment from 'moment';

const handleChange = (currentBalance) => {
  const initialBalance = 32.00; // TODO 32 hard coded. need to be a initial balance prop.
  if (currentBalance && initialBalance) {
    return `${currentBalance - initialBalance}`;
  }
  return null;
};

export const normalizeAccountsData = (accounts) => {
  return accounts.map((account) => {
    const {
      id,
      publicKey,
      activationTime,
      createdAt,
      currentBalance,
      status,
    } = account;
    const newAccount = { ...account };

    newAccount.key = {
      publicKey,
      activationTime,
      createdAt: moment(createdAt).format('MMMM DD, YYYY'),
      status
    };

    newAccount.change = handleChange(currentBalance);
    delete newAccount.publicKey;
    delete newAccount.activationTime;
    delete newAccount.date;

    newAccount.misc = {
      accountId: id,
      wallet: '',
    };
    return newAccount;
  });
};

export const summarizeAccounts = (accounts) => {
  const initialObject = {
    balance: 0.0,
    sinceStart: 0.0,
    change: 0.0,
    totalChange: 0.0,
  };
  const summary = accounts.reduce((accumulator, value, index) => {
    const { effectiveBalance, currentBalance } = value;
    if (Number.isNaN(parseFloat(effectiveBalance)) || Number.isNaN(parseFloat(currentBalance))) {
      return accumulator;
    }
    const initialBalance = '32.00'; // TODO 32 hard coded. need to be a initial balance prop.
    const difference = parseFloat(currentBalance) - parseFloat(initialBalance);
    const percentage = (difference / parseFloat(initialBalance)) * 100;
    const totalChange = accumulator.totalChange + percentage;
    return {
      balance: accumulator.balance + parseFloat(currentBalance),
      sinceStart: accumulator.sinceStart + (parseFloat(currentBalance) - parseFloat(initialBalance)),
      change: index + 1 === accounts.length ? totalChange / accounts.length : 0,
      totalChange,
    };
  }, initialObject);
  return fixNumOfDigits(summary);
};

const fixNumOfDigits = (summary) => {
  const newObject = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(summary)) {
    if (Number.isNaN(value)) { return null; }
    // @ts-ignore
    newObject[key] = value.toFixed(2);
  }
  return newObject;
};

export const normalizeEventLogs = (events) => {
  return events.map((event) => {
    const {
      createdAt,
      orgId,
      publicKey,
      type,
    } = event;
    const newEvent = { ...event };

    newEvent.createdAt = moment(createdAt).format('MMMM DD, YYYY');
    newEvent.description = {
      type,
      orgId,
      publicKey
    };
    return newEvent;
  });
};

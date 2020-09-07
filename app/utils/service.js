import moment from 'moment';

export const isActive = (to, pathname) => {
  const hasSubDir = to.lastIndexOf('/') > 0 && pathname.lastIndexOf('/') > 0;
  if (hasSubDir) {
    const toSubDirName = to.substr(1, to.lastIndexOf('/') - 1);
    const pathnameSubDirName = pathname.substr(
      1,
      pathname.lastIndexOf('/') - 1
    );
    return toSubDirName === pathnameSubDirName;
  }
  const isExact = to === pathname;
  return isExact;
};

export const isEmptyObject = (obj) => Object.entries(obj).length === 0 && obj.constructor === Object;

export const precentageCalculator = (current, overall) => {
  if (current === 0 || overall === 0) {
    return 0;
  }
  return Number(((current / overall) * 100).toFixed(0), 2);
};

export const lastDateFormat = (utcDate) => {
  if (moment(utcDate).isAfter(moment().subtract(24, 'hours'))) {
    // less than 24 hours
    if (moment(utcDate).isAfter(moment().subtract(1, 'minutes'))) {
      return 'Less than a minute ago';
    }
    if (moment(utcDate).isAfter(moment().subtract(2, 'minutes'))) {
      return 'About a minute ago';
    }

    const minutesPassed = Math.abs(moment(utcDate).diff(moment(), 'minutes'));
    return `${minutesPassed} minutes ago`;
  } if (moment(utcDate).isAfter(moment().subtract(48, 'hours'))) {
    // more than 24h but less than 48h
    return moment(utcDate).format('MMMM DD, YYYY HH:MM');
  }
    // more than 48 hours
    return moment(utcDate).format('MMMM DD, YYYY');
};

export const publicKeyFormat = (publicKey) => {
  return `${publicKey.substr(0, 6)}...${publicKey.substr(publicKey.length - 6, publicKey.length)}`;
};

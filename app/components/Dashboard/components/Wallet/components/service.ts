import keyVaultImage from '../../../../Wizard/assets/img-key-vault.svg';
import keyVaultInactiveImage from '../../../../Wizard/assets/img-key-vault-inactive.svg';


const getNumberColor = (number: number) => {
  if (number > 0) {
    return 'accent2400';
  }
  if (number < 0) {
    return 'destructive700';
  }
  return 'gray800';
};

const getWholeNumber = (floatingNumber: number) =>
  Math.floor(floatingNumber);

export const getDecimalNumber = (floatingNumber: number) =>
  (floatingNumber % 1).toFixed(2).substring(2);

export const getBoxes = (isActive: boolean, summary: Record<string, any>) => {
  return [
    {
      width: '290px',
      color: 'gray800',
      bigText: getWholeNumber(summary.balance),
      medText: `.${getDecimalNumber(summary.balance)} ETH`,
      tinyText: 'Total Balance',
    },
    {
      width: '260px',
      color: getNumberColor(summary.sinceStart),
      bigText: getWholeNumber(summary.sinceStart),
      medText: `.${getDecimalNumber(summary.sinceStart)} ETH`,
      tinyText: 'Since Start',
    },
    {
      width: '220px',
      color: getNumberColor(summary.change),
      bigText: getWholeNumber(summary.change),
      medText: `.${getDecimalNumber(summary.change)}%`,
      tinyText: 'Change',
    },
    {
      width: '330px',
      color: isActive ? 'accent2400' : 'destructive700',
      bigText: isActive ? 'Active' : 'Inactive',
      tinyText: 'KeyVault',
      image: isActive ? keyVaultImage : keyVaultInactiveImage,
    },
  ];
};

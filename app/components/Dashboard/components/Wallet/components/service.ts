import keyVaultImage from '../../../../Wizard/assets/img-key-vault.svg';
import keyVaultInactiveImage from '../../../../Wizard/assets/img-key-vault-inactive.svg';

const getNumberColor = (number: number) => {
  if (!Number.isNaN(number)) {
    if (number > 0) {
      return 'accent2400';
    }
    if (number < 0) {
      return 'destructive700';
    }
  }
  return 'gray800';
};

const trimWholeNumber = (floatingNumber: number) => {
  if (Number.isNaN(floatingNumber)) { return 'N/A'; }
  return Math.floor(floatingNumber);
};

export const trimDecimalNumber = (floatingNumber: number) => {
  if (Number.isNaN(floatingNumber)) { return 'N/A'; }
  return (floatingNumber % 1).toFixed(2).substring(2);
};

export const getBoxes = (isActive: boolean, summary: Record<string, any>) => {
  return [
    {
      width: '290px',
      color: 'gray800',
      bigText: !summary ? 'N/A' : trimWholeNumber(summary.balance),
      medText: !summary ? '' : `.${trimDecimalNumber(summary.balance)} ETH`,
      tinyText: 'Total Balance',
    },
    {
      width: '260px',
      color: !summary ? 'gray800' : getNumberColor(summary.sinceStart),
      bigText: !summary ? 'N/A' : trimWholeNumber(summary.sinceStart),
      medText: !summary ? '' : `.${trimDecimalNumber(summary.sinceStart)} ETH`,
      tinyText: 'Since Start',
    },
    {
      width: '220px',
      color: !summary ? 'gray800' : getNumberColor(summary.change),
      bigText: !summary ? 'N/A' : trimWholeNumber(summary.change),
      medText: !summary ? '' : `.${trimDecimalNumber(summary.change)}%`,
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

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
  return floatingNumber > 0 ? Math.floor(floatingNumber) : Math.ceil(floatingNumber);
};

export const trimDecimalNumber = (floatingNumber: number) => {
  if (Number.isNaN(floatingNumber)) { return 'N/A'; }
  const trimmedDecimal = (floatingNumber % 1).toFixed(2).substring(2);
  return floatingNumber >= 0 ? `.${trimmedDecimal}` : trimmedDecimal;
};
export const getBoxes = (isActive: boolean, summary: Record<string, any>) => {
  return [
    {
      name: 'totalBalance',
      width: '290px',
      color: 'gray800',
      bigText: !summary ? 'N/A' : trimWholeNumber(summary.balance),
      medText: !summary ? '' : `${trimDecimalNumber(summary.balance)}`,
      tinyText: 'Total Balance',
    },
    {
      name: 'sinceStart',
      width: '260px',
      color: !summary ? 'gray800' : getNumberColor(summary.sinceStart),
      bigText: !summary ? 'N/A' : trimWholeNumber(summary.sinceStart),
      medText: !summary ? '' : `${trimDecimalNumber(summary.sinceStart)}`,
      tinyText: 'Since Start',
    },
    {
      name: 'change',
      width: '220px',
      color: !summary ? 'gray800' : getNumberColor(summary.totalChange),
      bigText: !summary ? 'N/A' : trimWholeNumber(summary.totalChange),
      medText: !summary ? '' : `${trimDecimalNumber(summary.totalChange)}`,
      tinyText: 'Change',
    },
    {
      name: 'keyvault',
      width: '330px',
      color: isActive ? 'accent2400' : 'destructive700',
      bigText: isActive ? 'Active' : 'Inactive',
      tinyText: 'KeyVault',
      image: isActive ? keyVaultImage : keyVaultInactiveImage,
    },
  ];
};

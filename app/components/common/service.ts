import { shell } from 'electron';
import config from 'backend/common/config';
import OrganizationService from 'backend/services/organization/organization.service';
import Store from 'backend/common/store-manager/store';
import { version } from '../../package.json';
import FormData from 'form-data';

export const truncateText = (value, fromStartIndex, fromEndIndex) => {
  if (value == null || !value.length) {
    return value;
  }
  return `${value.substring(0, fromStartIndex)}...${value.substring(value.length - fromEndIndex)}`;
};

export const openExternalLink = async (url) => {
  await shell.openExternal(`${config.env.WEBSITE_URL}/${url}`);
};

export const reportCrash = async () => {
  const organizationService = new OrganizationService();
  const store = Store.getStore();
  const form = new FormData();
  const keyVaultVersion = store.get('keyVaultVersion');
  keyVaultVersion && form.append('keyVaultVersion', keyVaultVersion);
  form.append('appVersion', version);
  await organizationService.reportCrash(form);
};

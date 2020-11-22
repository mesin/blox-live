import { shell } from 'electron';
import config from 'backend/common/config';
import OrganizationService from '../../backend/services/organization/organization.service';
import Connection from '../../backend/common/store-manager/connection';
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
  const form = new FormData();
  form.append('keyVaultVersion', Connection.db().get('keyVaultVersion'));
  form.append('appVersion', version);
  await organizationService.reportCrash(form);
};

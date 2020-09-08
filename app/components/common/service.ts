import { shell } from 'electron';

export const truncateText = (value, fromStartIndex, fromEndIndex) => {
  if (value == null || !value.length) {
    return value;
  }
  return `${value.substring(0, fromStartIndex)}...${value.substring(value.length - fromEndIndex)}`;
};

export const openExternalLink = async (url) => {
  await shell.openExternal(`${process.env.WEBSITE_URL}/${url}`);
};

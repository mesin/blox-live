import path from 'path';
import { remote } from 'electron';
import getPlatform from './get-platform';

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();
const { isPackaged, getAppPath } = remote.app;

const binariesPath =
  IS_PROD && isPackaged
    ? path.join(path.dirname(getAppPath()), '..', './Resources', './bin')
    : path.join(root, './resources', getPlatform(), './bin');

export const execPath = path.resolve(path.join(binariesPath, './keyvault-cli'));

import { notification } from 'antd';

const fs = require('fs');
const querystring = require('querystring');

const onWritingSuccess = () => {
  notification.success({ message: 'File Downloaded', description: 'Find your file in \'Downloads\' directory' });
};

const onWritingFailure = (error) => notification.error({ message: 'Error', description: error.message });

const writingToFileCallBack = (error) => {
  if (error) return onWritingFailure(error);
  onWritingSuccess();
};

export const writeToTxtFile = (fileName, data) => {
  const query = querystring.parse(global.location.search);
  fs.writeFile(`${query['?dwldir']}/${fileName}.txt`, data, 'utf8', writingToFileCallBack);
};

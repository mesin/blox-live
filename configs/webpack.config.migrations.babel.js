/**
  * Webpack config for migrations
*/

import path from 'path';
import glob from 'glob';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

const migrationFiles = glob.sync('./app/backend/migrations/*');
const migrationEntries = migrationFiles.reduce((acc, migrationFile) => {
    const entryName = migrationFile.substring(
      migrationFile.lastIndexOf('/') + 1,
      migrationFile.lastIndexOf('.')
    );
    acc[entryName] = migrationFile;
    return acc;
}, {});

export default merge.smart(baseConfig, {
  target: 'node',
  entry: {
    ...migrationEntries,
  },
  output: {
    path: path.join(__dirname, '..', 'app/dist'),
    libraryTarget: 'commonjs2',
    filename: chunkData => {
      if (Object.keys(migrationEntries).includes(chunkData.chunk.name)) {
        return `migrations/${chunkData.chunk.name}.js`;
      }
      return '[name].js';
    },
  },
});

import { Migration } from '../migrate';

export const up: Migration = async ({ name }) => {
  console.log('up is done', name);
};

export const down: Migration = async ({ name }) => {
  console.log('down is done', name);
};

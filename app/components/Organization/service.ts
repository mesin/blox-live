import moment from 'moment';
import { loadLastConnection } from 'common/service';

export const normalizedActiveValidators = (eventLogs) => {
  const lastConnection = loadLastConnection();
  console.log('user last connection:', lastConnection);
  const activeValidators = eventLogs.filter((eventlog: Record<string, any>) => {
    const isActive = eventlog.type === 'validator_assigned';
    const isBefore = moment(lastConnection).isBefore(eventlog.createdAt);
    return isActive && isBefore;
  });
  return activeValidators;
};

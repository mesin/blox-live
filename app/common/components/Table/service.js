import { SORT_TYPE } from 'common/constants';

export const normalizeCellsWidth = (columns) => columns.map((column) => column.width);

export const stringifyCellsWidth = (columnsWidth) => columnsWidth.toString().replace(/,/gi, ' ');

export const handlePageClick = (data, offset, setPagedData, setPaginationInfo, pageSize) => {
  if (data) {
    setPagedData(data.slice(offset, Math.min(offset + pageSize, data.length)));
    setPaginationInfo({ offset, pageSize, total: data.length });
  }
};

const compareStrings = (key, a, b, direction) => {
  if (direction === SORT_TYPE.DESCENDING) {
    return a[key] < b[key] ? -1 : 1;
  }
  return a[key] < b[key] ? 1 : -1;
};

const compareNumbers = (key, a, b, direction) => {
  if (direction === SORT_TYPE.DESCENDING) {
    return Number(a[key]) < Number(b[key]) ? -1 : 1;
  }
  return Number(a[key]) < Number(b[key]) ? 1 : -1;
};

export const compareFunction = (key, a, b, direction, type) => {
  if (type === 'string') {
    return compareStrings(key, a, b, direction);
  }
  return compareNumbers(key, a, b, direction);
};

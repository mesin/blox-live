import {SortType} from '../../constants';

export const normalizeCellsWidth = (columns) => columns.map((column) => column.width);

export const stringifyCellsWidth = (columnsWidth) => columnsWidth.toString().replace(/,/gi, ' ');

export const handlePageClick = (data, offset, setPagedData, setPaginationInfo, pageSize) => {
  if (data) {
    setPagedData(data.slice(offset, Math.min(offset + pageSize, data.length)));
    setPaginationInfo({
      offset,
      pageSize,
      total: data.length,
    });
  }
};

export const handleSortClick = (data, sortKey, setSelectedSort, setSortType, sortType, setPagedAccounts, paginationInfo) => {
  if (data) {
    setSelectedSort(sortKey);
    setSortType(sortType === SortType.ASCENDING ? SortType.DESCENDING : SortType.ASCENDING);

    data.sort((a, b) => {
      if (sortType === SortType.DESCENDING) {
        return a.selectedSort < b.selectedSort ? -1 : 1;
      }
      return a.selectedSort < b.selectedSort ? 1 : -1;
    });

    const size = Math.min(paginationInfo.offset + paginationInfo.pageSize, data.length);
    setPagedAccounts(data.slice(paginationInfo.offset, size));
  }
};

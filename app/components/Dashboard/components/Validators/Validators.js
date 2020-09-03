import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Table} from 'common/components';
import tableColumns from './tableColumns';
import {SortType} from '../../../../common/components/Table/components/header/Sorting';
// import {PaginationAction} from '../../../../common/components/Table/components/Footer/Pagination';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 500;
  line-height: 1.69;
  color: ${({theme}) => theme.gray800};
`;

const Validators = ({accounts}) => {
  const PAGE_SIZE = 10;
  const [pagedAccounts, setPagedAccounts] = React.useState([]);
  const [paginationInfo, setPaginationInfo] = React.useState(null);
  const [selectedSort, setSelectedSort] = React.useState('key');
  const [sortType, setSortType] = React.useState(SortType.DESCENDING);

  const onPaginationClick = (offset) => {
    setPagedAccounts(accounts.slice(offset, Math.min(offset + PAGE_SIZE, accounts.length)));
    setPaginationInfo({
      offset,
      pageSize: PAGE_SIZE,
      total: accounts.length,
    });
  };

  const onSortClick = (sortKey) => {
    setSelectedSort(sortKey);
    setSortType(sortType === SortType.ASCENDING ? SortType.DESCENDING : SortType.ASCENDING);

    accounts.sort((a, b) => {
      if (sortType === SortType.DESCENDING) {
        return a[selectedSort] < b[selectedSort] ? -1 : 1;
      }
      return a[selectedSort] < b[selectedSort] ? 1 : -1;
    });

    setPagedAccounts(accounts.slice(paginationInfo.offset, Math.min(paginationInfo.offset + paginationInfo.pageSize, accounts.length)));
  };

  return (
    <Wrapper>
      <Title>Validators</Title>
      <Table columns={tableColumns} data={pagedAccounts} isLoading={false} isPagination
        selectedSorting={selectedSort} sortType={sortType} onSortClick={onSortClick}
        paginationInfo={paginationInfo} onPageClick={onPaginationClick} />
    </Wrapper>
  );
};

Validators.propTypes = {
  accounts: PropTypes.array,
};

export default Validators;

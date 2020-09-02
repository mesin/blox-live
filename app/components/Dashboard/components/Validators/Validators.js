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
  const PAGE_SIZE = 1;
  const [selectedSort, setSelectedSort] = React.useState('key');
  const [sortType, setSortType] = React.useState(SortType.DESCENDING);
  const [paginationInfo, setPaginationInfo] = React.useState(null);

  const onSortClick = (sortKey) => {
    setSelectedSort(sortKey);
    setSortType(sortType === SortType.ASCENDING ? SortType.DESCENDING : SortType.ASCENDING);

    accounts.sort((a, b) => {
      if (sortType === SortType.DESCENDING) {
        return a[selectedSort] < b[selectedSort] ? -1 : 1;
      }
      return a[selectedSort] < b[selectedSort] ? 1 : -1;
    });
  };

  const onPaginationClick = (offset) => {
    setPaginationInfo({
      offset,
      pageSize: PAGE_SIZE,
      total: accounts.length
    });
  };

  return (
    <Wrapper>
      <Title>Validators</Title>
      <Table columns={tableColumns} data={accounts} isLoading={false} isPagination
        selectedSorting={selectedSort} sortType={sortType} onSortClick={onSortClick}
        paginationInfo={paginationInfo} onPageClick={onPaginationClick} />
    </Wrapper>
  );
};

Validators.propTypes = {
  accounts: PropTypes.array,
};

export default Validators;

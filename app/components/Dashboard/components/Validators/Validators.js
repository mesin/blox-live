import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Table} from 'common/components';
import tableColumns from './tableColumns';
import { handlePageClick } from 'common/components/Table/service';
import { SORT_TYPE } from 'common/constants';

const Wrapper = styled.div`
  width: 100%;
  margin-bottom:36px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 500;
  line-height: 1.69;
  color: ${({theme}) => theme.gray800};
  margin-top:0px;
  margin-bottom:20px;
`;

const Validators = ({accounts}) => {
  const PAGE_SIZE = 10;
  const [pagedAccounts, setPagedAccounts] = React.useState([]);
  const [paginationInfo, setPaginationInfo] = React.useState(null);
  const [selectedSort, setSelectedSort] = React.useState('key');
  const [sortType, setSortType] = React.useState(SORT_TYPE.DESCENDING);

  const onPageClick = (offset) => {
    handlePageClick(accounts, offset, setPagedAccounts, setPaginationInfo, PAGE_SIZE);
  };

  const onSortClick = (sortKey, direction, compareFunction) => {
    setSelectedSort(sortKey);
    setSortType(direction);
    const sortedAccounts = accounts.sort((a, b) => compareFunction(a, b, direction));
    const size = Math.min(paginationInfo.offset + paginationInfo.pageSize, sortedAccounts.length);
    setPagedAccounts(sortedAccounts.slice(paginationInfo.offset, size));
  };

  if (paginationInfo == null) {
    onPageClick(0);
    return <Wrapper />;
  }

  return (
    <Wrapper>
      <Title>Validators</Title>
      <Table columns={tableColumns} data={pagedAccounts} withHeader isLoading={false} isPagination
        selectedSorting={selectedSort} sortType={sortType} onSortClick={onSortClick}
        paginationInfo={paginationInfo} onPageClick={onPageClick} />
    </Wrapper>
  );
};

Validators.propTypes = {
  accounts: PropTypes.array,
};

export default Validators;

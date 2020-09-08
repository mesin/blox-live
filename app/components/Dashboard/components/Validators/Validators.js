import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Table} from 'common/components';
import tableColumns from './tableColumns';
import {handlePageClick, handleSortClick} from 'common/components/Table/service';
import {SortType} from 'common/constants';

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

  const onPageClick = (offset) => {
    handlePageClick(accounts, offset, setPagedAccounts, setPaginationInfo, PAGE_SIZE);
  };

  const onSortClick = (sortKey) => {
    handleSortClick(accounts, sortKey, setSelectedSort, setSortType, sortType, setPagedAccounts, paginationInfo);
  };

  return (
    <Wrapper>
      <Title>Validators</Title>
      <Table columns={tableColumns} data={pagedAccounts} isHeader isLoading={false} isPagination
        selectedSorting={selectedSort} sortType={sortType} onSortClick={onSortClick}
        paginationInfo={paginationInfo} onPageClick={onPageClick} />
    </Wrapper>
  );
};

Validators.propTypes = {
  accounts: PropTypes.array,
};

export default Validators;

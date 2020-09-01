import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Table} from 'common/components';
import tableColumns from './tableColumns';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 500;
  line-height: 1.69;
  color: ${({theme}) => theme.gray800};
`;

export const SortType = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
};

const Validators = ({accounts}) => {
  const [selectedSort, setSelectedSort] = React.useState('key');
  const [sortType, setSortType] = React.useState(SortType.DESCENDING);

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

  return (
    <Wrapper>
      <Title>Validators</Title>
      <Table columns={tableColumns} isLoading={false} data={accounts} selectedSorting={selectedSort} sortType={sortType}
        onSortClick={onSortClick} />
    </Wrapper>
  );
};

Validators.propTypes = {
  accounts: PropTypes.array,
};

export default Validators;

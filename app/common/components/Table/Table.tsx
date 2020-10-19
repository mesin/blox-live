import React from 'react';
import styled from 'styled-components';
import { Header, Body, Footer } from './components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: solid 1px ${({theme}) => theme.gray300};
  border-radius: 8px;
  font-weight: 500;
  color: ${({theme}) => theme.gray800};
`;

const Table = (props: Props) => {
  const {data, columns, withHeader, isPagination, selectedSorting, sortType, onSortClick, paginationInfo, onPageClick} = props;
  return (
    <Wrapper>
      {withHeader && (
        <Header columns={columns} selectedSorting={selectedSorting} sortType={sortType}
          onSortClick={onSortClick} />
      )}
      <Body columns={columns} data={data} />
      <Footer isPagination={isPagination} paginationInfo={paginationInfo} onPageClick={onPageClick} />
    </Wrapper>
  );
};

type Props = {
  data: [];
  columns: [];
  withHeader: boolean;
  isPagination: boolean;
  selectedSorting: string;
  sortType: string;
  onSortClick: () => void;
  paginationInfo: Record<string, any>;
  onPageClick: () => void;
};

export default Table;

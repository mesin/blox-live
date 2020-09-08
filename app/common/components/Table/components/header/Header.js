import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sorting from './Sorting';

const EmptyWrapper = styled.div``;

const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  padding: 0px 20px;
  display: flex;
  border-bottom: solid 1px ${({theme}) => theme.gray300};
  font-size: 12px;
`;

const Cell = styled.div`
  width: ${({width}) => width};
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: ${({padding_right}) => padding_right};
`;

const Header = ({columns, isHeader, selectedSorting, sortType, onSortClick}) => {
  return isHeader ? (
    <Wrapper>
      {columns.map((column) => {
        const {key, title, width, isSort} = column;
        return isSort
          ? (
            <Cell width={width} key={key}>
              {title}
              <Sorting sortKey={key} selectedSorting={selectedSorting} sortType={sortType} onSortClick={onSortClick} />
            </Cell>
          )
          : (
            <Cell width={width} key={key}>
              {title}
            </Cell>
          );
      })}
    </Wrapper>
  ) : (
    <EmptyWrapper />
  );
};

Header.propTypes = {
  columns: PropTypes.array,
  isHeader: PropTypes.bool,
  selectedSorting: PropTypes.string,
  sortType: PropTypes.string,
  onSortClick: PropTypes.func
};

export default Header;

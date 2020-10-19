import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sorting from './Sorting';

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
  justify-content:${({justifyContent}) => justifyContent || 'flex-start'};
`;

const Header = ({columns, selectedSorting, sortType, onSortClick}) => {
  return (
    <Wrapper>
      {columns.map((column) => {
        const {key, title, width, justifyContent, compareFunction} = column;
        return compareFunction
          ? (
            <Cell width={width} key={key} justifyContent={justifyContent}>
              {title}
              <Sorting sortKey={key} selectedSorting={selectedSorting} sortType={sortType}
                onSortClick={onSortClick} compareFunction={compareFunction} />
            </Cell>
          )
          : (
            <Cell width={width} key={key} justifyContent={justifyContent}>
              {title}
            </Cell>
          );
      })}
    </Wrapper>
  );
};

Header.propTypes = {
  columns: PropTypes.array,
  selectedSorting: PropTypes.string,
  sortType: PropTypes.string,
  onSortClick: PropTypes.func,
};

export default Header;

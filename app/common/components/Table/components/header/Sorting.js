import PropTypes from 'prop-types';
import {Icon} from '../../../index';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div``;

export const SortType = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
};

const Sorting = (props) => {
  const {sortKey, selectedSorting, sortType, onSortClick} = props;
  const sortingTypeIcon = sortType === SortType.ASCENDING ? 'sorting-up' : 'sorting-down';
  return (
    <Wrapper>
      <Icon
        name={selectedSorting === sortKey ? sortingTypeIcon : 'sorting'}
        color={selectedSorting === sortKey ? 'primary800' : 'gray800'}
        fontSize="16px"
        onClick={() => onSortClick(sortKey)}
      />
    </Wrapper>
  );
};

Sorting.propTypes = {
  sortKey: PropTypes.string,
  selectedSorting: PropTypes.string,
  sortType: PropTypes.string,
  onSortClick: PropTypes.func
};

export default Sorting;

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Pagination from './Pagination';

const Wrapper = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: solid 1px ${({theme}) => theme.gray300};
`;

const Footer = ({isPagination, paginationInfo, onPageClick}) => {
  if (isPagination) {
    return (
      <Wrapper>
        <Pagination paginationInfo={paginationInfo} onPageClick={onPageClick} />
      </Wrapper>
    );
  }
  return (
    <Wrapper />
  );
};

Footer.propTypes = {
  isPagination: PropTypes.bool,
  paginationInfo: PropTypes.object,
  onPageClick: PropTypes.func
};
export default Footer;

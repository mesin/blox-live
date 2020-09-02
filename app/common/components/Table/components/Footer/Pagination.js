import PropTypes from 'prop-types';
import {Icon} from '../../../index';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 8%;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  :hover {
    color: ${({theme, color}) => (color && theme.primary700) || '#ffffff'};
  }
  :active {
    color: ${({theme, color}) => (color && theme.primary800) || '#ffffff'};
  }
`;

const Button = styled.div`
  width: 100%;
  font-size: 11px;
  border-left: solid 1px ${({theme}) => theme.gray300};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({theme, color}) => theme[color]};
`;

export const PaginationAction = {
  FIRST: 'first',
  PREVIEW: 'preview',
  NEXT: 'next',
  LAST: 'last'
};

const Pagination = ({paginationInfo, onPageClick}) => {
  if (paginationInfo == null) {
    onPageClick(1);
    return <Wrapper />;
  }
  const pageLength = (paginationInfo.offset - 1) + paginationInfo.pageSize;

  const paginationButtons = [
    {
      key: 'page',
      title: `${paginationInfo.offset} ~ ${Math.min(pageLength, paginationInfo.total)} of ${paginationInfo.total}`,
      color: 'gray600',
      reverse: true,
      clickable: false
    },
    {
      key: PaginationAction.FIRST,
      title: 'First',
      icon: 'first-page',
      iconColor: `${paginationInfo.offset > 1 ? 'primary900' : 'gray400'}`,
      color: `${paginationInfo.offset > 1 ? 'primary900' : 'gray400'}`,
      reverse: true,
      clickable: true
    },
    {
      key: PaginationAction.PREVIEW,
      title: 'Prev',
      icon: 'chevron-left',
      iconColor: `${paginationInfo.offset > 1 ? 'primary900' : 'gray400'}`,
      color: `${paginationInfo.offset > 1 ? 'primary900' : 'gray400'}`,
      reverse: true,
      clickable: true
    },
    {
      key: PaginationAction.NEXT,
      title: 'Next',
      icon: 'chevron-right',
      iconColor: `${pageLength < paginationInfo.total ? 'primary900' : 'gray400'}`,
      color: `${pageLength < paginationInfo.total ? 'primary900' : 'gray400'}`,
      reverse: false,
      clickable: true
    },
    {
      key: PaginationAction.LAST,
      title: 'Last',
      icon: 'last-page',
      iconColor: `${pageLength < paginationInfo.total ? 'primary900' : 'gray400'}`,
      color: `${pageLength < paginationInfo.total ? 'primary900' : 'gray400'}`,
      reverse: false,
      clickable: true
    }
  ];

  const onPaginationClick = (key) => {
    let offset = null;
    switch (key) {
      case PaginationAction.FIRST:
        offset = 1;
        break;
      case PaginationAction.PREVIEW:
        offset = paginationInfo.offset - paginationInfo.pageSize;
        break;
      case PaginationAction.NEXT:
        offset = paginationInfo.offset + paginationInfo.pageSize;
        break;
      case PaginationAction.LAST:
        offset = 1 + paginationInfo.pageSize *
          ((Math.ceil(paginationInfo.total / paginationInfo.pageSize)) - 1);
        break;
    }
    onPageClick(offset);
  };

  return (
    paginationButtons.map(({key, title, icon, iconColor, color, reverse, clickable}) => {
      return reverse ? (
        <Wrapper onClick={() => clickable ? onPaginationClick(key) : false}>
          <Button color={color}>
            <Icon
              name={icon}
              color={iconColor}
              fontSize="16px"
            />
            {title}
          </Button>
        </Wrapper>
      ) : (
        <Wrapper onClick={() => clickable ? onPaginationClick(key) : false}>
          <Button color={color}>
            {title}
            <Icon
              name={icon}
              color={iconColor}
              fontSize="16px"
            />
          </Button>
        </Wrapper>
      );
    })
  );
};

Pagination.propTypes = {
  paginationInfo: PropTypes.shape({
    offset: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number
  }),
  onPageClick: PropTypes.func
};

export default Pagination;

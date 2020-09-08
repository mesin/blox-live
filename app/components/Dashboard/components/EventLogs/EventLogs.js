import React from 'react';
import styled from 'styled-components';
import tableColumns from './tableColumns';
import Table from '../../../../common/components/Table';
import {handlePageClick} from '../../../../common/components/Table/service';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 500;
  line-height: 1.69;
  color: ${({theme}) => theme.gray800};
`;

const EventLogs = ({events}) => {
  const PAGE_SIZE = 10;
  const [pagedEvents, setPagedEvents] = React.useState([]);
  const [paginationInfo, setPaginationInfo] = React.useState(null);

  const onPageClick = (offset) => {
    handlePageClick(events, offset, setPagedEvents, setPaginationInfo, PAGE_SIZE);
  };

  return (
    <Wrapper>
      <Title>Latest Events</Title>
      {<Table columns={tableColumns} data={pagedEvents} isHeader={false} isLoading={false}
        isPagination paginationInfo={paginationInfo} onPageClick={onPageClick} />}
    </Wrapper>
  );
};

EventLogs.propTypes = {
  events: PropTypes.array,
};

export default EventLogs;

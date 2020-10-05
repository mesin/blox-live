import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tableColumns from './tableColumns';
import Table from 'common/components/Table';
import { handlePageClick } from 'common/components/Table/service';

const Wrapper = styled.div`
  width: 100%;
  color: ${({theme}) => theme.gray600};
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 500;
  line-height: 1.69;
  color: ${({theme}) => theme.gray800};
  margin-top:0px;
  margin-bottom:20px;
`;

const EventLogs = ({events}) => {
  const PAGE_SIZE = 10;
  const [pagedEvents, setPagedEvents] = React.useState([]);
  const [paginationInfo, setPaginationInfo] = React.useState(null);

  const onPageClick = (offset) => {
    handlePageClick(events, offset, setPagedEvents, setPaginationInfo, PAGE_SIZE);
  };

  if (paginationInfo == null) {
    onPageClick(0);
    return <Wrapper />;
  }

 return (
   <Wrapper>
     <Title>Latest Events</Title>
     {(pagedEvents && pagedEvents.length > 0) ?
        (
          <Table columns={tableColumns} data={pagedEvents} isLoading={false}
            isPagination paginationInfo={paginationInfo} onPageClick={onPageClick} />
) :
     ('There are no events to show at the moment')}
   </Wrapper>
 );
};

EventLogs.propTypes = {
  events: PropTypes.array,
};

export default EventLogs;

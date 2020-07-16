import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Header, Body, Footer } from './components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: solid 1px ${({ theme }) => theme.gray300};
  border-radius: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.gray800};
`;

const Table = (props) => {
  const { data, columns, isLoading } = props;
  return (
    <Wrapper>
      <Header columns={columns} isLoading={isLoading} />
      <Body columns={columns} isLoading={isLoading} data={data} />
      <Footer />
    </Wrapper>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default Table;

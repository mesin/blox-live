import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spinner } from '../../../../../common/components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 900;
`;

const Text = styled.div`
  margin-left: 11px;
  font-size: 12px;
  color: ${({ theme }) => theme.primary900};
`;

const Connection = ({ text }) => (
  <Wrapper>
    <Spinner width="17px" />
    <Text>{text}</Text>
  </Wrapper>
);

Connection.propTypes = {
  text: PropTypes.string,
};

export default Connection;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lastDateFormat } from 'utils/service';

const Wrapper = styled.div`
  color: ${({theme}) => theme.gray800};
`;

const Date = ({createdAt}) => (
  <Wrapper>
    {lastDateFormat(createdAt)}
  </Wrapper>
);

Date.propTypes = {
  createdAt: PropTypes.string,
};

export default Date;

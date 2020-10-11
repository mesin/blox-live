import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const Wrapper = styled.div`
  height: 20px;
  display:flex;
  font-size: 12px;
  font-weight:500;
  margin-bottom:16px;
  line-height: 1.67;
  color:${({theme}) => theme.gray600};
`;

const now = moment().format('LLL');

const DateAndTime = () => <Wrapper>{now}</Wrapper>;

export default DateAndTime;

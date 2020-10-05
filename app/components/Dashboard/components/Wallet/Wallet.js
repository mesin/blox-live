import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Boxes, StatusBar } from './components';
import UpdateBanner from './components/UpdateBanner';
import DateAndTime from '../DateAndTime';

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  margin-bottom:36px;
`;

const Wallet = (props) => {
  const { isActive, isNeedUpdate, ...rest } = props;
  return (
    <Wrapper>
      <UpdateBanner isNeedUpdate={isNeedUpdate} />
      <DateAndTime />
      <StatusBar isActive={isActive} />
      <Boxes isActive={isActive} {...rest} />
    </Wrapper>
  );
};

Wallet.propTypes = {
  isActive: PropTypes.bool,
  isNeedUpdate: PropTypes.bool,
  summary: PropTypes.object,
};

export default Wallet;

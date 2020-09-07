import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Icon} from '../../../../../common/components';

const Wrapper = styled.div``;

const Date = ({date}) => (
  <Wrapper>
    {date}
    <Icon
      name={'sorting'}
      color={'primary800'}
      fontSize="16px"
      onClick={() => false}
    /></Wrapper>
);

Date.propTypes = {
  date: PropTypes.string,
};

export default Date;

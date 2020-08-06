import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'common/components';

const Wrapper = styled.div`
  width:100%;
  padding:20px 16px;
  margin-top:37px;
  color:${({theme}) => theme.warning900};
  border:2px solid ${({theme}) => theme.warning900};
  border-radius:4px;
  display:flex;
  align-items:center;
  font-size:12px;
  font-weight:500;
`;

const IconWrapper = styled.div`
  margin-right:12px;
`;

const Text = styled.div``;

const Warning = ({text}) => (
  <Wrapper>
    <IconWrapper>
      <Icon name={'report'} fontSize={'22px'} color={'warning900'} />
    </IconWrapper>
    <Text>{text}</Text>
  </Wrapper>
);

Warning.propTypes = {
  text: PropTypes.string,
};

export default Warning;

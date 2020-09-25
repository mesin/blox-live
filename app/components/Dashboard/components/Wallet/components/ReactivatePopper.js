import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'common/components';

const tooltipText = 'Your KeyVault is inactive. Validators can\'t operate until this issue is resolved.';
const height = '80px';

const Wrapper = styled.div`
  width:450px;
  height:80px;
  background-color:${({theme}) => theme.destructive700};
  color:#ffffff;
  border-radius:8px;
  padding:16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  position:absolute;
  bottom:${`-${height}`};
  right:0px;
  transition:1s all;
  :after {
    content:'';
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 10px solid ${({theme}) => theme.destructive700};
    position:absolute;
    top:-7px;
    right:20px;
  }
`;

const Text = styled.div`
  width:73%;
  font-size:12px;
`;

const Button = styled.button`
  font-size:14px;
  font-weight:bold;
  display:flex;
  align-items:center;
  background-color:transparent;
  border:0px;
  cursor:pointer;
`;

const ReactivatePopper = ({onClick}) => {
  return (
    <Wrapper>
      <Icon name={'report'} fontSize={'20px'} />
      <Text>{tooltipText}</Text>
      <Button onClick={() => onClick()}>Reactivate <Icon name={'chevron-right'} /></Button>
    </Wrapper>
  );
};

ReactivatePopper.propTypes = {
  onClick: PropTypes.func,
};

export default ReactivatePopper;

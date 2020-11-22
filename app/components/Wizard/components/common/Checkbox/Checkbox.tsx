import React from 'react';
import styled from 'styled-components';
import { Icon } from 'common/components';

const Wrapper = styled.div<{ checked: boolean }>`
  width:18px;
  height:18px;
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  border:${({theme}) => `${theme.primary900} 1px solid`};
  background-color:${({theme, checked}) => checked ? theme.primary900 : '#ffffff'};
  color:#ffffff;
`;

const Checkbox = ({checked}: Props) => {
  return (
    <Wrapper checked={checked}>
      <Icon color={'white'} name={'check'} fontSize={'10px'} />
    </Wrapper>
  );
};

type Props = {
  checked: boolean;
};

export default Checkbox;

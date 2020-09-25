import React from 'react';
import styled from 'styled-components';
import { InfoWithTooltip } from 'common/components';
import SubTitle from '../../SubTitle';

const Wrapper = styled.div``;

const Number = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.gray800};
`;

const NumberOfValidators = ({ numOfValidators = 0 }: Props) => (
  <Wrapper>
    <SubTitle>
      Number Of Paid Validators &nbsp;
      <InfoWithTooltip
        title="Active validator on the beacon chain"
        placement="right"
      />
    </SubTitle>
    <Number>{numOfValidators}</Number>
  </Wrapper>
);

type Props = {
  numOfValidators?: number;
};

export default NumberOfValidators;

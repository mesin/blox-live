import React from 'react';
import styled from 'styled-components';
import {openExternalLink, truncateText} from '../../../../../../common/service';
import {Link} from '../../../../common/index';
import theme from '../../../../../../../theme';
import {InfoWithTooltip, Tooltip} from '../../../../../../../common/components';

const Wrapper = styled.div`
  width:100%;
  height: 100px;
  display: flex;
  align-items: center;
  background: ${({theme}) => theme.white};
  border: solid 1px ${({theme}) => theme.gray300};
  border-radius: 8px;
  padding-left: 25px;
  margin-top: 24px;
`;

const StepNumber = styled.div`
    width:10%;
    font-size: 16px;
    font-weight: 900;
    color: ${({theme}) => theme.primary900};
`;

const LeftWrapper = styled.div`
    width:30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const PriceWrapper = styled.div`
  height: 35%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const BigTitle = styled.div`
    font-size: 32px;
    font-weight: 800;
    color: ${({theme, color}) => theme[color] || theme.gray800};
    height: 100%;
    display:flex;
    align-items:baseline;
`;

const MediumTitle = styled.div`
    font-size: 18px;
    font-weight: 500;
    color: ${({theme, color}) => theme[color] || theme.gray800};
    margin-left: 4px;
    height: 100%;
    display:flex;
    align-items:flex-end;
`;

const HintTitle = styled.div`
    height: 10%;
    font-size: 12px;
    font-weight: 500;
    color: ${({theme, color}) => theme[color] || theme.gray600};
    display: flex;
    margin-top: 5px;
    // background: ${({theme}) => theme.accent1200};
`;

const InfoWrapper = styled.div`
    width:90%;
    margin-left: 5px;
    align-items: bottom;
`;

const BigInfoTitle = styled.div`
    text-align: start;
    font-size: 16px;
    font-weight: 900;
    color: ${({theme, color}) => theme[color] || theme.primary900};
`;

const ActionWrapper = styled.div`
    width:15%;
    height: 100%;
    display: flex;
    align-items: top;
    justify-content: center;
`;

const FreeTag = styled.div`
    width:40px;
    height: 20px;
    background: ${({theme}) => theme.accent2600};
    border-bottom-left-radius:4px;
    border-top-right-radius:8px;
    text-align: center;
    font-size: 12px;
    font-weight: 900;
    color: ${({theme, color}) => theme[color] || theme.gray50};
`;

const DepositStepData = (props: Props) => {
  const {step, title, isFree, amount, token, tooltip, children} = props;
  return (
    <Wrapper>
      <StepNumber>{step}</StepNumber>
      <LeftWrapper>
        <PriceWrapper>
          <BigTitle>{amount} <MediumTitle>{token}</MediumTitle></BigTitle>
        </PriceWrapper>
        <HintTitle style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>{isFree ? '0.5 ETH' : ''}</HintTitle>
      </LeftWrapper>
      <InfoWrapper>
        <BigInfoTitle>{title}</BigInfoTitle>
        {children}
      </InfoWrapper>
      <ActionWrapper style={{'align-items': isFree ? 'top' : 'center', 'justify-content': isFree ? 'flex-end' : 'center'}}>
        {
          isFree ?
            <FreeTag>Free</FreeTag> :
            (tooltip ? <InfoWithTooltip title={tooltip} placement="bottom" /> : null)
        }
      </ActionWrapper>
    </Wrapper>
  );
};

type Props = {};

export default DepositStepData;

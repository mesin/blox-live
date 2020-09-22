import React from 'react';
import styled from 'styled-components';
import { CustomModal, Button, SuccessIcon, Confetti } from 'common/components';
import { truncateText } from 'components/common/service';

const InnerWrapper = styled.div`
  width:100%;
  height:100%;
  padding:42px 86px;
  position:relative;
  overflow:hidden;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
  line-height: 1.69;
  margin: 24px 0px;
  color:${({theme}) => theme.accent2500};
`;

const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  line-height: 1.67;
`;

const Row = styled.div`
  display:flex;
  justify-content:center;
`;

const CloseButton = styled(Button)`
  margin-top:80px;
  position:relative;
  z-index:20;
`;

const ActiveValidatorModal = ({onClose, activeValidators}: Props) => {
  const [current, setCurrent] = React.useState(0);
  const last = activeValidators.length - 1;
  const setNext = () => current === last ? onClose() : setCurrent(current + 1);
  const truncatedPublicKey = truncateText(activeValidators[current].publicKey, 36, 6);
  return (
    <CustomModal width={'700px'} height={'462px'} onClose={() => setNext()}>
      <InnerWrapper>
        <Confetti />
        <Row> <SuccessIcon size={'58px'} fontSize={'50px'} /> </Row>
        <Title>You Are A Validator</Title>
        <Row>
          <SmallText>
            Your validator {truncatedPublicKey} is now approved and activated <br />
            to start staking. Please note: all validators rely on the online <br />
            connectivity and availability of KeyVault.
          </SmallText>
        </Row>
        <Row> <CloseButton onClick={() => setNext()}>View My Validator</CloseButton> </Row>
      </InnerWrapper>
    </CustomModal>
  );
};

type Props = {
  activeValidators: [{ publicKey: string }];
  onClose: () => void;
};

export default ActiveValidatorModal;

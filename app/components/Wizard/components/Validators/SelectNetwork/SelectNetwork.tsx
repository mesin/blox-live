import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setNetworkType } from '../../../actions';
import { Title, SubTitle, Paragraph } from '../../common';
import CustomButton from './CustomButton';
import { NETWORKS } from '../constants';

const Wrapper = styled.div`
  width:650px;
`;

const ButtonsWrapper = styled.div`
  width:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const onClick = ({ page, setPage, setNetwork }: Props, network) => {
  setPage(page + 1);
  setNetwork(network);
};

const Validators = (props: Props) => (
  <Wrapper>
    <Title>Select your staking network</Title>
    <Paragraph>
      Blox let’s you stake on Eth 2.0 Mainnet or run a Testnet validator to try
      our <br />
      staking services. Currently, only our Testnet is available.
    </Paragraph>
    <Paragraph>
      Please select your staking network and our wizard will guide you through the <br />
      validator creation process.
    </Paragraph>
    <SubTitle>How would you like to start?</SubTitle>
    <ButtonsWrapper>
      <CustomButton
        title={NETWORKS.test.title}
        image={NETWORKS.test.image}
        isDisabled={NETWORKS.test.isDisabled}
        onClick={() => !NETWORKS.test.isDisabled && onClick({ ...props }, NETWORKS.test.label)}
      />
      <CustomButton
        title={NETWORKS.zinken.title}
        image={NETWORKS.zinken.image}
        isDisabled={NETWORKS.zinken.isDisabled}
        onClick={() => !NETWORKS.zinken.isDisabled && onClick({ ...props }, NETWORKS.zinken.label)}
      />
    </ButtonsWrapper>
  </Wrapper>
);

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  setNetwork: (network: string) => void;
};

const mapDispatchToProps = (dispatch) => ({
  setNetwork: (network) => dispatch(setNetworkType(network)),
});

export default connect(null, mapDispatchToProps)(Validators);

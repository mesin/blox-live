import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setNetworkType } from '../../../actions';
import { getUserData } from '../../../../CallbackPage/selectors';
import { Title, SubTitle, Paragraph } from '../../common';
import CustomButton from './CustomButton';
import { NETWORKS } from '../constants';
import Store from 'backend/common/store-manager/store';

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

const canUseMainNet = () => {
  const store = Store.getStore();
  return store.exists('testPage');
};

const Validators = (props: Props) => {
  const isMainNetEnabled = canUseMainNet();
  return (
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
          title={NETWORKS.pyrmont.title}
          image={NETWORKS.pyrmont.image}
          isDisabled={false}
          onClick={() => onClick({ ...props }, NETWORKS.pyrmont.label)}
        />
        <CustomButton
          title={NETWORKS.mainnet.title}
          image={NETWORKS.mainnet.image}
          isDisabled={!isMainNetEnabled}
          onClick={() => isMainNetEnabled && onClick({ ...props }, NETWORKS.mainnet.label)}
        />
      </ButtonsWrapper>
    </Wrapper>
  );
};

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  setNetwork: (network: string) => void;
  profile: Record<string, any>;
};

const mapStateToProps = (state) => ({
  profile: getUserData(state),
});

const mapDispatchToProps = (dispatch) => ({
  setNetwork: (network) => dispatch(setNetworkType(network)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Validators);

import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CustomButton from './CustomButton';
import { CLOUD_PROVIDERS } from './constants';
import { Title, SubTitle, Paragraph, Link } from '../../common';
import { keyvaultSetCouldProvider } from '../../../../KeyVaultManagement/actions';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const ButtonsWrapper = styled.div`
  width: 42vw;
  display: flex;
  justify-content: space-between;
`;

const onClick = (args) => {
  const {setCloudProvider, label, isDisabled, setPage, page} = args;
  if (!isDisabled) {
    setCloudProvider(label);
    setPage(page + 1);
  }
};

const CloudProvider = (props: Props) => {
  const { page, setPage, setCloudProvider } = props;
  return (
    <Wrapper>
      <Title>Select your Cloud Provider</Title>
      <Paragraph>
        For maximum security and the best non-custodial experience, Blox KeyVault <br />
        must be installed on our available cloud providers. <br />
        This ensures your private keys are secured and available for a safe and <br />
        reliable staking experience.&nbsp;
        <Link href="https://www.bloxstaking.com/blox-guide-why-blox-need-access-to-my-server" target="_blank">
          Why does Blox need access to my server?
        </Link>
      </Paragraph>
      <SubTitle>Select your cloud provider:</SubTitle>
      <ButtonsWrapper>
        {CLOUD_PROVIDERS.map((cloudProvider, index) => {
          const { label, isDisabled } = cloudProvider;
          return (
            <CustomButton width={'180px'} height={'170px'} key={index} {...cloudProvider}
              onClick={() => onClick({setCloudProvider, label, isDisabled, setPage, page})} />
          );
        })}
      </ButtonsWrapper>
    </Wrapper>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCloudProvider: (label) => dispatch(keyvaultSetCouldProvider(label)),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  setCloudProvider: (label: string) => void;
};

export default connect(null, mapDispatchToProps)(CloudProvider);

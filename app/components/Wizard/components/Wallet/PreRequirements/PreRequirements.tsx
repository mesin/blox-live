import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { Title, SubTitle, Paragraph, Link, SmallButton } from '../../common';

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
  margin-top: 22px;
`;

const SmallLetters = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: ${({ theme }) => theme.gray600};
  margin: 15px 0px;
`;

const LinkWrapper = styled.div`
  margin-bottom: 15px;
`;

const PreRequirements = (props: Props) => {
  const { page, setPage } = props;
  const [userHasServer, setUserHasServer] = React.useState('noAnswer');

  const onAnswerClick = (answer) => setUserHasServer(answer);

  const onContinueClick = () => setPage(page + 1);

  return (
    <Wrapper>
      <Title>Before we start...</Title>
      <Paragraph>
        For maximum security and the best non-custodian experience, Blox
        KeyVault <br />
        is installed on selected cloud providers such as Amazon AWS. This will
        ensure <br />
        your private keys are safe and available for the best and safest staking{' '}
        <br />
        experience.{' '}
        <Link href="/" target="_blank">
          What is Amazon AWS?
        </Link>
      </Paragraph>
      <SubTitle>Do you have Amazon&apos;s AWS account?</SubTitle>

      <ButtonsWrapper>
        <Button
          isActive={userHasServer === 'yes'}
          onClick={() => onAnswerClick('yes')}
          text="Yes"
        />
        <Button
          isActive={userHasServer === 'no'}
          onClick={() => onAnswerClick('no')}
          text="No"
        />
      </ButtonsWrapper>

      {userHasServer === 'yes' && (
        <>
          <SmallLetters>
            Perfect. In the next step we will guide you through the steps of
            creating your KeyVault.
          </SmallLetters>
          <SmallButton onClick={onContinueClick}>Continue</SmallButton>
        </>
      )}

      {userHasServer === 'no' && (
        <>
          <SmallLetters>
            No worries. We will first need you to create an AWS account. Once
            created, click ‘Continue’.
          </SmallLetters>
          <LinkWrapper>
            <Link href="/" target="_blank">
              How to create an Amazon AWS account?
            </Link>
          </LinkWrapper>
          <SmallButton isDisabled>Continue</SmallButton>
        </>
      )}
    </Wrapper>
  );
};

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
};

export default PreRequirements;

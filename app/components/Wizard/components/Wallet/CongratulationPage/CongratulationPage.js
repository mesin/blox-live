import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Lottie from 'lottie-web-react';
import { Title, Paragraph, SmallButton, SuccessIcon } from '../../common';

import animationData from '../../../../../assets/animations/confetti.json';

const Wrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const Confetti = styled.div`
  position: absolute;
  top: -65px;
  z-index: 2;
  width: 100%;
`;

const defaultOptions = {
  name: 'confetti',
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
};

const confettiArray = [{ speed: 0.5 }, { speed: 0.6 }, { speed: 0.7 }];

const CongratulationPage = (props) => {
  const { setPage, page, setStep, step } = props;
  const onClick = () => {
    setStep(step + 1);
    setPage(page + 1);
  };
  return (
    <>
      {confettiArray.map((confetti, index) => (
        <Confetti key={index}>
          <Lottie
            options={defaultOptions}
            playingState="play"
            speed={confetti.speed}
          />
        </Confetti>
      ))}
      <Wrapper>
        <SuccessIcon />
        <Title color="accent2400">KeyVault created successfully!</Title>
        <Paragraph>
          Your private keys have been secured in your vault. <br />
          Now, let’s create your validator.
        </Paragraph>
        <SmallButton onClick={onClick}>Create a Validator</SmallButton>
      </Wrapper>
    </>
  );
};

CongratulationPage.propTypes = {
  page: PropTypes.number,
  setPage: PropTypes.func,
  step: PropTypes.number,
  setStep: PropTypes.func,
};

export default CongratulationPage;

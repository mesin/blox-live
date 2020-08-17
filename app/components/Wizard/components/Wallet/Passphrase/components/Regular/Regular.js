import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Spinner } from 'common/components';
import { Title, Paragraph, Warning } from '../../../../common';
import bgImage from './passphrase-bg-image.svg';

const Wrapper = styled.div`
  width: 100%;
  max-width:560px;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const BoldText = styled.span`
  font-weight:900;
  color:${({theme}) => theme.warning900};
`;

const Box = styled.div`
  width: 560px;
  height: 114px;
  padding:24px;
  margin:25px 0px 10px 0px;
  background-image:url(${bgImage});
  background-size:cover;
  background-repeat:no-repeat;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  color: ${({theme}) => theme.primary900};
  border-radius:8px;
  cursor:${({clickable}) => clickable ? 'pointer' : 'default'};
`;

const DownloadButton = styled.button`
  width:200px;
  height: 16px;
  font-size: 12px;
  font-weight: 500;
  padding:0px;
  margin:0px;
  color: ${({theme, isDisabled}) => isDisabled ? theme.gray400 : theme.primary900};
  cursor:${({isDisabled}) => isDisabled ? 'default' : 'pointer'};
  background-color:transparent;
  border:0px;
  text-align:left;
  &:hover {
    color: ${({theme, isDisabled}) => isDisabled ? theme.gray400 : theme.primary700};
  }
`;

const ButtonWrapper = styled.div`
  margin-top:45px;
`;

const Regular = (props) => {
  const { mnemonic, isLoading, onPassphraseClick, onNextButtonClick, onDownloadClick } = props;
  const isButtonDisabled = !mnemonic;
  return (
    <Wrapper>
      <Title>Backup Passphrase</Title>
      <Paragraph>
        Validator keys can be retrieved only with your unique mnemonic backup passphrase.
        This 24-word passphrase <BoldText>must be stored safely</BoldText> to withdrawal
        your funds.
      </Paragraph>
      <Warning text={'Do not share your backup passphrase with anyone.'} />
      <Box onClick={onPassphraseClick} clickable={mnemonic === ''}>
        {isLoading && !mnemonic && <Spinner />}
        {mnemonic !== '' ? mnemonic : 'Click to reveal passphrase'}
      </Box>
      <DownloadButton onClick={onDownloadClick} isDisabled={!mnemonic}>Download backup passphrase</DownloadButton>
      <ButtonWrapper>
        <Button isDisabled={isButtonDisabled} onClick={onNextButtonClick}>Next</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

Regular.propTypes = {
  mnemonic: PropTypes.string,
  onPassphraseClick: PropTypes.func,
  onNextButtonClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Regular;

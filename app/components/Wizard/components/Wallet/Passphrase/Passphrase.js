import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Spinner } from 'common/components';
import { Title, Paragraph, Warning } from '../../common';
import { keyvaultLoadMnemonic } from '../../../../KeyVaultManagement/actions';
import { getMnemonic, getIsLoading } from '../../../../KeyVaultManagement/selectors';
import saga from '../../../../KeyVaultManagement/saga';
import { useInjectSaga } from '../../../../../utils/injectSaga';
import bgImage from './passphrase-bg-image.svg';

const key = 'keyVaultManagement';

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

const Passphrase = (props) => {
  const { page, setPage, mnemonic, isLoading } = props;
  const isButtonDisabled = !mnemonic;

  useInjectSaga({ key, saga, mode: '' });

  const onPassphraseClick = () => {
    const { loadMnemonic } = props;
    if (mnemonic) { return null; }
    loadMnemonic();
  };

  const onButtonClick = () => !isButtonDisabled && setPage(page + 1);

  return (
    <Wrapper>
      <Title>Select your Cloud Provider</Title>
      <Paragraph>
        Validator keys can be retrieved only with your unique mnemonic backup passphrase.
        This 24-word passphrase <BoldText>must be stored safely</BoldText> to withdrawal
        your funds.
      </Paragraph>
      <Warning text={'Do not share your backup passphrase with anyone.'} />
      <Box onClick={onPassphraseClick} clickable={mnemonic === ''}>
        {isLoading && <Spinner />}
        {mnemonic !== '' ? mnemonic : 'Click to reveal passphrase'}
      </Box>
      <DownloadButton isDisabled={!mnemonic}>Download backup passphrase</DownloadButton>
      <ButtonWrapper>
        <Button isDisabled={isButtonDisabled} onClick={onButtonClick}>Next</Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

Passphrase.propTypes = {
  page: PropTypes.number,
  setPage: PropTypes.func,
  mnemonic: PropTypes.string,
  loadMnemonic: PropTypes.func,
  isLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  mnemonic: getMnemonic(state),
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadMnemonic: () => dispatch(keyvaultLoadMnemonic()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Passphrase);

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useInjectSaga } from 'utils/injectSaga';

import { Regular, Backup } from './components';
import { writeToTxtFile } from './service';
import { keyvaultLoadMnemonic, keyvaultSaveMnemonic } from '../../../../KeyVaultManagement/actions';
import { getMnemonic, getIsLoading } from '../../../../KeyVaultManagement/selectors';
import saga from '../../../../KeyVaultManagement/saga';

const key = 'keyvaultManagement';

const Passphrase = (props: Props) => {
  const { page, setPage, mnemonic, isLoading } = props;
  const [showBackup, toggleBackupDisplay] = useState(false);
  const [duplicatedMnemonic, setDuplicatedMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDuplicatedMnemonicError, setDuplicatedMnemonicErrorDisplay] = useState(false);
  const [showPasswordError, setPasswordErrorDisplay] = useState(false);
  const [showConfirmPasswordError, setConfirmPasswordErrorDisplay] = useState(false);
  const isButtonDisabled = !mnemonic;

  useInjectSaga({ key, saga, mode: '' });

  const onPassphraseClick = () => {
    const { loadMnemonic } = props;
    if (mnemonic) { return null; }
    loadMnemonic();
  };

  const onSaveAndConfirmClick = async () => {
    const { saveMnemonic } = props;
    if (canGenerateMnemonic()) {
      await saveMnemonic(duplicatedMnemonic, password);
      await !isButtonDisabled && setPage(page + 1);
    }
  };

  const onDownloadClick = () => {
    if (!mnemonic) { return null; }
    writeToTxtFile('Blox Secret Backup Passphrase', mnemonic);
  };

  const showBackupScreen = () => mnemonic && toggleBackupDisplay(true);

  const hideBackupScreen = () => toggleBackupDisplay(false);

  const canGenerateMnemonic = () => {
    const mnemonicsAreEqual = mnemonic === duplicatedMnemonic;
    const passwordsAreEqual = password === confirmPassword;
    const passwordshaveMoreThan8Char = password.length >= 8 && confirmPassword.length >= 8;
    return mnemonicsAreEqual && passwordsAreEqual && passwordshaveMoreThan8Char;
  };

  const onDuplicateMnemonicBlur = () => {
    if (mnemonic !== duplicatedMnemonic) {
      setDuplicatedMnemonicErrorDisplay(true);
    }
    else {
      setDuplicatedMnemonicErrorDisplay(false);
    }
  };

  const onPasswordBlur = () => {
    if (password.length < 8) {
      setPasswordErrorDisplay(true);
    }
    else {
      setPasswordErrorDisplay(false);
    }
  };

  const onConfirmPasswordBlur = () => {
    if (password !== confirmPassword && !showConfirmPasswordError) {
      setConfirmPasswordErrorDisplay(true);
    }
    if (password === confirmPassword && showConfirmPasswordError) {
      setConfirmPasswordErrorDisplay(false);
    }
  };

  return (
    <>
      {showBackup ? (
        <Backup onNextButtonClick={onSaveAndConfirmClick} onBackButtonClick={hideBackupScreen}
          password={password} setPassword={setPassword} confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword} isSaveAndConfirmEnabled={canGenerateMnemonic}
          duplicatedMnemonic={duplicatedMnemonic} setDuplicatedMnemonic={setDuplicatedMnemonic}
          showDuplicatedMnemonicError={showDuplicatedMnemonicError} onDuplicateMnemonicBlur={onDuplicateMnemonicBlur}
          isLoading={isLoading} showPasswordError={showPasswordError} showConfirmPasswordError={showConfirmPasswordError}
          onPasswordBlur={onPasswordBlur} onConfirmPasswordBlur={onConfirmPasswordBlur}
        />
      ) : (
        <Regular mnemonic={mnemonic} isLoading={isLoading} onPassphraseClick={onPassphraseClick}
          onNextButtonClick={showBackupScreen} onDownloadClick={onDownloadClick}
        />
      )}
    </>
  );
};

type Page = number;

type Props = {
  page: Page;
  setPage: (page: Page) => void;
  mnemonic: string;
  loadMnemonic: () => void;
  isLoading: boolean;
  saveMnemonic: (mnemonic: string, password: string) => void;
};

const mapStateToProps = (state) => ({
  mnemonic: getMnemonic(state),
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadMnemonic: () => dispatch(keyvaultLoadMnemonic()),
  saveMnemonic: (mnemonic, password) => dispatch(keyvaultSaveMnemonic(mnemonic, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Passphrase);

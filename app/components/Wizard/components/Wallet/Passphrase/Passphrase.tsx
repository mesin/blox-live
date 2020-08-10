import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useInjectSaga } from 'utils/injectSaga';

import { Regular, Backup } from './components';
import { writeToTxtFile } from './service';
import { keyvaultLoadMnemonic, keyvaultSaveMnemonic } from '../../../../KeyVaultManagement/actions';
import { getMnemonic, getIsLoading } from '../../../../KeyVaultManagement/selectors';
import saga from '../../../../KeyVaultManagement/saga';

const key = 'keyVaultManagement';

const Passphrase = (props: Props) => {
  const { page, setPage, mnemonic, isLoading } = props;
  const [showBackup, toggleBackupDisplay] = useState(false);
  const [duplicatedMnemonic, setDuplicatedMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isButtonDisabled = !mnemonic;

  useInjectSaga({ key, saga, mode: '' });

  const onPassphraseClick = () => {
    const { loadMnemonic } = props;
    if (mnemonic) { return null; }
    loadMnemonic();
  };

  const onSaveAndConfirmClick = async () => {
    const { saveMnemonic } = props;
    if (mnemonic === duplicatedMnemonic) {
      await saveMnemonic(duplicatedMnemonic, password);
      await !isButtonDisabled && setPage(page + 1);
    }
  };

  const onDownloadClick = () => {
    if (!mnemonic) { return null; }
    writeToTxtFile('passphrase', mnemonic);
  };

  const showBackupScreen = () => toggleBackupDisplay(true);

  const hideBackupScreen = () => toggleBackupDisplay(false);

  const isSaveAndConfirmEnabled = () => {
    if (password === '' || confirmPassword === '') { return false; }
    return password.length > 8 && confirmPassword.length > 8 && password === confirmPassword;
  };

  return (
    <>
      {showBackup ? (
        <Backup onNextButtonClick={onSaveAndConfirmClick} onBackButtonClick={hideBackupScreen}
          password={password} setPassword={setPassword} confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword} isSaveAndConfirmEnabled={isSaveAndConfirmEnabled}
          duplicatedMnemonic={duplicatedMnemonic} setDuplicatedMnemonic={setDuplicatedMnemonic}
          isLoading={isLoading}
        />
      ) : (
        <Regular mnemonic={mnemonic} isLoading={isLoading} onPassphraseClick={onPassphraseClick}
          onNextButtonClick={showBackupScreen} onDownloadClick={onDownloadClick} />
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

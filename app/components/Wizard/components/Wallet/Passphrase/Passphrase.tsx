import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useInjectSaga } from 'utils/injectSaga';

import { Regular, Backup } from './components';
import { writeToTxtFile } from './service';
import { keyvaultLoadMnemonic } from '../../../../KeyVaultManagement/actions';
import { getMnemonic, getIsLoading } from '../../../../KeyVaultManagement/selectors';
import saga from '../../../../KeyVaultManagement/saga';

const key = 'keyVaultManagement';

const Passphrase = (props: Props) => {
  const { page, setPage, mnemonic, isLoading } = props;
  const [showBackup, toggleBackupDisplay] = useState(false);
  const isButtonDisabled = !mnemonic;

  useInjectSaga({ key, saga, mode: '' });

  const onPassphraseClick = () => {
    const { loadMnemonic } = props;
    if (mnemonic) { return null; }
    loadMnemonic();
  };

  const onNextButtonClick = () => !isButtonDisabled && setPage(page + 1);

  const onDownloadClick = () => {
    if (!mnemonic) { return null; }
    writeToTxtFile('passphrase', mnemonic);
  };

  return (
    <>
      {showBackup ? (
        <Backup onNextButtonClick={onNextButtonClick} />
      ) : (
        <Regular mnemonic={mnemonic} isLoading={isLoading} onPassphraseClick={onPassphraseClick}
          onNextButtonClick={toggleBackupDisplay} onDownloadClick={onDownloadClick} />
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
};

const mapStateToProps = (state) => ({
  mnemonic: getMnemonic(state),
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadMnemonic: () => dispatch(keyvaultLoadMnemonic()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Passphrase);

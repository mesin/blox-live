import React from 'react';
import {openExternalLink, truncateText} from '../../../../../../common/service';
import styled from 'styled-components';
import {CopyToClipboard} from 'react-copy-to-clipboard/lib/index';
import {Link} from '../../../../common';
import theme from '../../../../../../../theme';

const TextInfo = styled.span`
    font-size: 12px;
    font-weight: 900;
    color: ${({color}) => theme[color] || theme.gray600};
`;

const CustomIcon = styled.i<{ fontSize: string, isDisabled: boolean }>`
  font-size: ${({fontSize}) => fontSize || '12px'};
  // display: flex;
  align-items: center;
  color: ${({color, isDisabled}) => isDisabled ? theme.gray400 : (color && theme[color]) || '#ffffff'};
  cursor: pointer;
  :hover {
    color: ${({color, isDisabled}) => isDisabled ? theme.gray400 : (color && theme.primary700) || '#ffffff'};
  }
  :active {
    color: ${({color, isDisabled}) => isDisabled ? theme.gray400 : (color && theme.primary800) || '#ffffff'};
  }
`;

const DepositText = (props: Props) => {
  const {publicKey, token, onCopy} = props;

  const truncatePubKey = truncateText(publicKey, 6, 6);
  return (
    <TextInfo>
      <TextInfo>Deposit to the {token} network to activate your validator ({truncatePubKey}</TextInfo>
      <CopyToClipboard text={publicKey} onCopy={onCopy}>
        <CustomIcon
          className={'icon-copy'}
          color={'primary900'}
          fontSize={'14px'}
          onClick={() => {
          }}
          isDisabled={false}
        />
      </CopyToClipboard>
      <TextInfo> ). Network gas fees will apply. </TextInfo>
      <Link style={{ color: theme.primary600 }} onClick={() => openExternalLink('documents/eth2/#pp-toc__heading-anchor-7')}>Learn more</Link>
    </TextInfo>
  );
};

type Props = {
  publicKey: string;
  token: string;
  onCopy: () => void;
};

export default DepositText;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { notification } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from 'common/components';
import { AddressKey, AdditionalData, AdditionalDataWrapper, Left, Right, TestNet } from './components';

const Wrapper = styled.div`
  width: 85%;
  display: flex;
`;

const onCopy = () => notification.success({message: 'Copied to clipboard!'});

const KeyCell = ({ value }) => {
  const { publicKey, createdAt, status } = value;
  return (
    <Wrapper>
      <Left>
        <AddressKey>{`${publicKey.substring(0, 31)}...${publicKey.substring(publicKey.length - 6)}`}</AddressKey>
        <AdditionalDataWrapper>
          <AdditionalData publicKey={publicKey} status={status} createdAt={createdAt} />
        </AdditionalDataWrapper>
      </Left>
      <Right>
        <CopyToClipboard text={publicKey} onCopy={onCopy}>
          <Icon name="copy" color="gray800" fontSize="16px" onClick={() => false} />
        </CopyToClipboard>
        <TestNet>TestNet</TestNet>
      </Right>
    </Wrapper>
  );
};

KeyCell.propTypes = {
  value: PropTypes.object,
};

export default KeyCell;

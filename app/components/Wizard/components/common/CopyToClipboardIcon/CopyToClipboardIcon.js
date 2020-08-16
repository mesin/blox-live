import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from 'common/components';

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CopyToClipboardIcon = (props) => {
  const { onCopy, text } = props;
  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      <IconWrapper>
        <Icon
          name="copy"
          color="primary900"
          fontSize="20px"
          onClick={() => false}
        />
      </IconWrapper>
    </CopyToClipboard>
  );
};

CopyToClipboardIcon.propTypes = {
  onCopy: PropTypes.func,
  text: PropTypes.string,
};

export default CopyToClipboardIcon;

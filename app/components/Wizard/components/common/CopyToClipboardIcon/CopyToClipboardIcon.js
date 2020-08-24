import React, { useState } from 'react';
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
  const [clicked, setClicked] = useState(false);

  const onCopyClick = () => {
    onCopy();
    setClicked(true);
  };

  return (
    <CopyToClipboard text={text} onCopy={onCopyClick}>
      <IconWrapper>
        <Icon
          name="copy"
          color={clicked ? 'gray400' : 'primary900'}
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

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Lottie from 'lottie-web-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyToClipboardIcon } from '..';

import animationData from '../../../../../assets/animations/pulsar.json';

const Wrapper = styled.div`
  width: 566px;
  min-height:90px;
  position: relative;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: solid 1px ${({ theme }) => theme.gray300};
  background-color: ${({ theme }) => theme.gray100};
  display: flex;
  flex-direction: column;
  padding: 32px 22px;
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  color: ${({ theme }) => theme.gray600};
  font-size: 11px;
  font-weight: 500;
  line-height: 1.45;
  cursor: text;
  resize: none;
`;

const Paragraph = styled.p`
  color: ${({ theme }) => theme.gray600};
  font-size: 11px;
  font-weight: 500;
  line-height: 1.45;
  cursor: text;
`;

const AnimationWrapper = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  z-index: 2;
  top: -3px;
  right: -4px;
`;

const IconWrapper = styled.div`
  position: absolute;
  z-index: 2;
  top: 8px;
  right: 6px;
`;

const defaultOptions = {
  name: 'pulsar',
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
};

const CopyToBox = (props) => {
  const { onCopy, text } = props;
  return (
    <Wrapper>
      <AnimationWrapper>
        <Lottie options={defaultOptions} playingState="play" speed={2} />
      </AnimationWrapper>
      <IconWrapper>
        <CopyToClipboardIcon onCopy={onCopy} text={text} />
      </IconWrapper>
      <CopyToClipboard text={text} onCopy={onCopy}>
        <Textarea defaultValue={text} />
      </CopyToClipboard>
      <Paragraph>{text}</Paragraph>
    </Wrapper>
  );
};

CopyToBox.propTypes = {
  onCopy: PropTypes.func,
  text: PropTypes.string,
};

export default CopyToBox;

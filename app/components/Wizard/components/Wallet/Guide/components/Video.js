import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spinner } from 'common/components';

const Wrapper = styled.div`
  width:302px;
  height:171px;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
`;

const VideoFrame = styled.iframe`
  width:100%;
  height:100%;
  position:absolute;
  z-index:1;
`;

const Video = ({ youtubeLink }) => {
  return (
    <Wrapper>
      <Spinner />
      <VideoFrame
        src={youtubeLink} width={'302px'} height={'171px'} allowFullScreen="allowFullScreen"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        >
      </VideoFrame>
    </Wrapper>
  );
};

Video.propTypes = {
  youtubeLink: PropTypes.string,
};

export default Video;

import React from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import { contentAnimation } from '..';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Content = styled.div`
  width: 81vw;
  padding: 64px 8.5vw;
  height: 100%;
  display: flex;
  position: relative;
`;

const ComponentWrapper = styled.div`
  width: 100%;
  position: relative;
  animation: ${contentAnimation} 1s ease;
`;

const BackgroundImage = styled.img`
  width: 300px;
  height: 300px;
  position: absolute;
  right: 0px;
`;

const Template = (props: Props) => {
  const { component, bgImage, ...rest } = props;
  return (
    <Wrapper>
      <Navigation {...rest} />
      <Content>
        <ComponentWrapper>{React.cloneElement(component)}</ComponentWrapper>
        {bgImage && <BackgroundImage src={bgImage} />}
      </Content>
    </Wrapper>
  );
};

type Props = {
  component: JSX.Element;
  bgImage: string;
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
};

export default Template;

import React, { useState } from 'react';
import styled from 'styled-components';

import Header from '../common/Header';
import ContentManager from './components/ContentManager';

const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.gray50};
`;

const Wizard = (props: Props) => {
  const { websocket } = props;
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(0);

  const contentManagerProps = { websocket, page, setPage, step, setStep };

  return (
    <Wrapper>
      <Header withMenu={false} />
      <ContentManager {...contentManagerProps} />
    </Wrapper>
  );
};

type Props = {
  websocket: Record<string, any>;
};

export default Wizard;

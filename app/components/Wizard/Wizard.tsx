import React, { useState } from 'react';
import styled from 'styled-components';

import Header from '../common/Header';
import ContentManager from './components/ContentManager';

const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.gray50};
`;

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(0);

  const contentManagerProps = { page, setPage, step, setStep };

  return (
    <Wrapper>
      <Header withMenu={false} />
      <ContentManager {...contentManagerProps} />
    </Wrapper>
  );
};

export default Wizard;

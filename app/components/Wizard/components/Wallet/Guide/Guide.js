import React, { useState } from 'react';
import styled from 'styled-components';
import { CloseButton, Title, StepsCounter, ContentManager, NavigationButtonsWrapper, NavigationButton } from './components';

const Wrapper = styled.div`
  width:350px;
  height:calc(100% - 70px);
  display:flex;
  position:fixed;
  right:0px;
  top:70px;
  padding:24px;
  flex-direction: column;
  background-color: white;
  z-index: 5;
`;

const lastPage = 6;

const Guide = () => {
  const [page, setPage] = useState(1);
  return (
    <Wrapper>
      <CloseButton>X</CloseButton>
      <Title>How To Create My AWS &apos;Access Key ID&apos; and &apos;Secret Access Key&apos;</Title>
      <StepsCounter>{page} of {lastPage}</StepsCounter>
      <ContentManager page={page} />
      <NavigationButtonsWrapper>
        {page > 1 && <NavigationButton onClick={() => setPage(page - 1)}>Previous</NavigationButton>}
        {page < lastPage && <NavigationButton onClick={() => setPage(page + 1)}>Next</NavigationButton>}
      </NavigationButtonsWrapper>
    </Wrapper>
  );
};

export default Guide;

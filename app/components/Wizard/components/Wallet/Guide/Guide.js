import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'common/components';
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
  box-shadow:0 4px 8px 7px rgba(72, 76, 82, 0.05);
`;

const lastPage = 6;

const Guide = ({onClose}) => {
  const [page, setPage] = useState(1);

  const onPrevClick = () => setPage(page - 1);
  const onNextClick = () => setPage(page + 1);

  return (
    <Wrapper>
      <CloseButton>
        <Icon onClick={onClose} name={'close'} color={'gray800'} fontSize={'24px'} />
      </CloseButton>
      <Title>How To Create My AWS &apos;Access Key ID&apos; and &apos;Secret Access Key&apos;</Title>
      <StepsCounter>{page} of {lastPage}</StepsCounter>
      <ContentManager page={page} />
      <NavigationButtonsWrapper>
        <NavigationButton onClick={onPrevClick} show={page > 1}>Previous</NavigationButton>
        <NavigationButton onClick={onNextClick} show={page < lastPage}>Next</NavigationButton>
      </NavigationButtonsWrapper>
    </Wrapper>
  );
};

Guide.propTypes = {
  onClose: PropTypes.func,
};

export default Guide;

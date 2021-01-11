import React from 'react';
import styled from 'styled-components';
import { CustomModal } from 'common/components';

const InnerWrapper = styled.div`
  width:100%;
  height:100%;
  padding:42px 86px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
  line-height: 1.69;
  margin: 24px 0px;
`;

const Row = styled.div`
  max-width:100%;
  display:flex;
  text-align:left;
  margin-bottom:25px;
`;

const CloseButton = styled.div`
  margin-top:80px;
  color: ${({ theme }) => theme.primary900};
  cursor:pointer;
  &:hover {
    color: ${({ theme }) => theme.primary600};
  }
`;

const ShowImagesModal = ({onClose, images}: Props) => {
  return (
    <CustomModal width={'700px'} onClose={onClose}>
      <InnerWrapper>
        <Title>Shiba Inu :-)</Title>
        {images && images.map((image, index) => {
          return (
            <Row key={index}>
              <img style={{width: '100%', display: 'block'}} alt="Image alt" srcSet={image.url} />
            </Row>
          );
        })}
        <CloseButton onClick={onClose}>Close</CloseButton>
      </InnerWrapper>
    </CustomModal>
  );
};

type Props = {
  images: Record<string, any>;
  onClose: () => void;
};

export default ShowImagesModal;

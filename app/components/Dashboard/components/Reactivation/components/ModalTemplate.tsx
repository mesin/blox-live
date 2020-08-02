import React from 'react';
import styled from 'styled-components';
import { CustomModal } from 'common/components';

const Wrapper = styled.div`
  width:100%;
  height:100%;
  display:flex;
  position:fixed;
`;

const InnerWrapper = styled.div`
  width:100%;
  height:100%;
  display:flex;
`;

const Left = styled.div`
  width: 500px;
  height:100%;
  padding:90px 32px 90px 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content:space-between;
  text-align: left;
`;

const Right = styled.div`
  width:300px;
  height:100%;
  background-color:${({theme}) => theme.gray100};
  display:flex;
  align-items:center;
  justify-content:center;
  border-bottom-right-radius:8px;
  border-top-right-radius:8px;
`;

const Image = styled.img`
  width:200px;
`;

const ModalTemplate = ({onClose, image, children}: Props) => {
  return (
    <Wrapper>
      <CustomModal width={'800px'} height={'500px'} onClose={onClose}>
        <InnerWrapper>
          <Left>{children}</Left>
          <Right>
            <Image src={image} />
          </Right>
        </InnerWrapper>
      </CustomModal>
    </Wrapper>
  );
};

type Props = {
  onClose: () => void;
  image: string;
  children: () => void;
};

export default ModalTemplate;

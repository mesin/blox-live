import React from 'react';
import styled from 'styled-components';
import SubTitle from '../../../SubTitle';
import Name from './Name';

const image = require('../../images/temp-org.svg');

const Wrapper = styled.div``;

const InnerWrapper = styled.div`
  display: flex;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 15px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(props) => props.theme.gray800};
`;

const JoinedDate = styled.span`
  font-size: 11px;
  font-weight: 500;
`;

const Organization = ({ orgProps }: Props) => {
  const { joinDate, ...rest } = orgProps;
  return (
    <Wrapper>
      <SubTitle>Organization Name</SubTitle>
      <InnerWrapper>
        <Image src={image} />
        <Details>
          <Name {...rest} />
          <JoinedDate>
            Joined on
            {joinDate}
          </JoinedDate>
        </Details>
      </InnerWrapper>
    </Wrapper>
  );
};

type Props = {
  orgProps: OrgProps;
};

type OrgProps = {
  isEditing: boolean;
  name: string;
  joinDate: string;
  onChange: (event: Record<string, any>) => void;
  onClick: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export default Organization;

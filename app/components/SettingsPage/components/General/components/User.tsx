import React from 'react';
import styled from 'styled-components';
import SubTitle from '../../SubTitle';

const Wrapper = styled.div`
  margin-bottom: 35px;
`;

const InnerWrapper = styled.div`
  display: flex;
`;

const Picture = styled.img`
  max-width: 40px;
  max-height: 40px;
  border-radius: 50%;
  margin-right: 15px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${(props) => props.theme.gray800};
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const Email = styled.span`
  font-size: 11px;
  font-weight: 500;
`;

const User = ({ profile }: Props) => (
  <Wrapper>
    <SubTitle>User</SubTitle>
    <InnerWrapper>
      <Picture src={profile.picture} alt="Profile picture" />
      <Details>
        <Name>{profile.name}</Name>
        <Email>{profile.email}</Email>
      </Details>
    </InnerWrapper>
  </Wrapper>
);

type Props = {
  profile: Record<string, any>;
};

export default User;

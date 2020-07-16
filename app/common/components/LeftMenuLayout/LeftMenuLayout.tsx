import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import MenuLink from './MenuLink';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Menu = styled.div`
  width: 16vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 75px;
  padding-right: 30px;
  position: fixed;
  top: 70px;
  left: 0px;
`;

const Content = styled.div`
  width: 84vw;
  padding: 145px 0px 75px 8vw;
  margin-left: 16vw;
  background-color: ${(props) => props.theme.gray50};
  overflow: auto;
`;

const ContentInnerWrapper = styled.div`
  width: 700px;
`;

const LeftMenuLayout = ({ location, pages, auth }: Props) => (
  <Wrapper>
    <Menu>
      {pages.map((page, index) => (
        <MenuLink key={index} page={page} location={location} />
      ))}
    </Menu>
    <Content>
      <ContentInnerWrapper>
        {pages.map((page, index) => {
          if (location.pathname === page.path) {
            return React.createElement(page.component, { key: index, auth });
          }
          return null;
        })}
      </ContentInnerWrapper>
    </Content>
  </Wrapper>
);

interface Props extends RouteComponentProps<any> {
  auth: Record<string, any>;
  pages: any;
}

export default withRouter(LeftMenuLayout);

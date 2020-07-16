import styled from 'styled-components';

const SubTitle = styled.h1`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 900;
  color: ${(props) => props.theme.gray800};
  margin-top: 0px;
  margin-bottom: 20px;
`;

export default SubTitle;

import styled from 'styled-components';

const Title = styled.h1`
  font-size: 32px;
  font-weight: 500;
  color: ${({ theme, color }) => theme[color] || theme.gray800};
  margin: 0px 0px 24px 0px;
  padding: 0px;
`;

export default Title;

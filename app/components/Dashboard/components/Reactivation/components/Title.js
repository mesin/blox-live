import styled from 'styled-components';

const Title = styled.h1`
  font-size: ${({ fontSize }) => fontSize || '26px'};
  color: ${({ theme, color }) => theme[color] || theme.gray800};
  font-weight: 900;
`;

export default Title;

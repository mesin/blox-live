import styled from 'styled-components';

const Link = styled.a`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary900};
  font-family: Avenir;
  &:hover {
    color: ${({ theme }) => theme.primary700};
  }
`;

export default Link;

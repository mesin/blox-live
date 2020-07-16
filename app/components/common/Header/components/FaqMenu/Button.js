import styled from 'styled-components';

const Button = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  color: ${({ theme, isOpen }) =>
    isOpen ? theme.accent2400 : theme.accent250};
  cursor: pointer;
  &:hover {
    color: ${({ theme, isOpen }) =>
      isOpen ? theme.accent2400 : theme.accent2200};
  }
`;

export default Button;

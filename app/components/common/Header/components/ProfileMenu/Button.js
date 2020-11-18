import styled from 'styled-components';

const Button = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, isOpen }) => isOpen ? theme.accent2400 : theme.accent250};
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  &:hover {
    background-color: ${({ theme, isOpen }) => isOpen ? theme.accent2400 : theme.accent2200};
  }
`;

export default Button;

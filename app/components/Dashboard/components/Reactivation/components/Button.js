import styled from 'styled-components';

const Button = styled.button`
  width: 175px;
  height: 32px;
  font-size: 14px;
  font-weight: 900;
  display:flex;
  align-items:center;
  justify-content:center;
  background-color: ${({theme}) => theme.primary900};
  border-radius: 6px;
  color:${({theme}) => theme.gray50};
  border:0px;
  cursor:pointer;
`;

export default Button;

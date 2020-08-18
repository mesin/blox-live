import styled from 'styled-components';

const NavigationButton = styled.div`
  display:flex;
  align-items:center;
  font-size: 14px;
  font-weight: 900;
  color: ${({theme}) => theme.primary900};
  cursor:pointer;
  visibility:${({show}) => show ? 'visible' : 'hidden'};
  display:flex;
  &:hover {
    color: ${({theme}) => theme.primary600};
    & > i {
      color: ${({theme}) => theme.primary600};
    }
  }
`;

export default NavigationButton;

import styled from 'styled-components';

const NavigationButton = styled.div`
  font-size: 14px;
  font-weight: 900;
  line-height: 1.71;
  color: ${({theme}) => theme.primary900};
  cursor:pointer;
  visibility:${({show}) => show ? 'visible' : 'hidden'};
  &:hover {
    color: ${({theme}) => theme.primary600};
  }
`;

export default NavigationButton;

import styled from 'styled-components';

const BlueButton = styled.div`
  height: 20px;
  font-family: Avenir;
  font-size: 12px;
  font-weight: 900;
  color: ${({ theme }) => theme.primary600};
  cursor:pointer;
`;

export default BlueButton;

import styled from 'styled-components';

const Text = styled.span`
  font-size: 11px;
  font-weight: 500;
  line-height: 1.45;
  color: ${({theme}) => theme.gray600};
`;

export default Text;

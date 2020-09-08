import styled from 'styled-components';

const ErrorMessage = styled.div`
  margin-top:7px;
  margin-left: 4px;
  font-size:12px;
  font-weight:900;
  color:${({theme}) => theme.destructive600};
`;

export default ErrorMessage;

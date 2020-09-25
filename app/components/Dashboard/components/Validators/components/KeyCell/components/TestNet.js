import styled from 'styled-components';

const TestNet = styled.div`
  width: 50px;
  height: 20px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.gray600};
  background-color: ${({ theme }) => theme.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export default TestNet;

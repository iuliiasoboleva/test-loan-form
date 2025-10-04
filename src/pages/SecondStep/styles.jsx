import styled from 'styled-components';

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
`;

export const Helper = styled.div`
  font-size: 14px;
  color: #666;
  margin: 6px 0 4px;
`;

export const RetryButton = styled.button`
  padding: 4px 8px;
  margin-left: 8px;
  border: none;
  border-radius: 6px;
  background: #eee;
  cursor: pointer;
  &:hover {
    background: #e2e2e2;
  }
`;

export const Form = styled.form`
  max-width: 480px;
  margin: 50px auto;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  input, select {
    padding: 8px;
    font-size: 16px;
    margin-top: 6px;
  }
`;

export const ErrorText = styled.span`
  color: red;
  font-size: 13px;
  margin-top: 4px;
`;

export const Button = styled.button`
  background-color: #007bff;
  border: none;
  color: white;
  padding: 12px;
  font-size: 16px;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

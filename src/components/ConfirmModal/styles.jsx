import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

export const Dialog = styled.div`
  width: min(560px, 92vw);
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,.2);
`;

export const Content = styled.div`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 18px;
  white-space: pre-wrap;
`;

export const CloseBtn = styled.button`
  display: inline-block;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #4e8ef7;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover { background: #3a7ae3; }
`;

import React from 'react';
import { Overlay, Dialog, Content, CloseBtn } from './styles';

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  message: string;
};

export default function ConfirmModal({ open, onClose, message }: ConfirmModalProps) {
  if (!open) return null;
  return (
    <Overlay role="dialog" aria-modal="true" onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Content>{message}</Content>
        <CloseBtn type="button" onClick={onClose}>OK</CloseBtn>
      </Dialog>
    </Overlay>
  );
}

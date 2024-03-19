import React from 'react';
import { Modal as MModal, ModalProps } from '@mui/material';

interface ExtraModalProps extends ModalProps {
  width?: number | string;
  closebuttonstyle?: React.CSSProperties;
}

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M21 7L8 20"
      stroke="#2E2E32"
      strokeWidth="1.85714"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 7L21 20"
      stroke="#2E2E32"
      strokeWidth="1.85714"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Modal = (props: ExtraModalProps) => {
  return (
    <MModal {...props}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: props.width,
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
        }}
      >
        <div
          style={{
            paddingTop: 18,
            paddingInline: 30,
            position: 'relative',
          }}
        >
          <div
            onClick={(e) => props.onClose?.(e, 'backdropClick')}
            className="absolute right-[30px] z-50 cursor-pointer"
            style={props.closebuttonstyle}
          >
            <Close />
          </div>
          {props.children}
        </div>
      </div>
    </MModal>
  );
};

export default Modal;

import React from 'react';
import { createPortal } from 'react-dom';
import { Snackbar } from '@mui/material';

import useGlobalStore from '../store/useGlobalStore';

export function success(message: string) {
  useGlobalStore.setState({
    message,
    messageType: 'succes',
    messageOpen: true,
  });
}

export function error(message: string) {
  useGlobalStore.setState({
    message,
    messageType: 'error',
    messageOpen: true,
  });
}

export default function Toaster() {
  const { message, messageType, messageOpen, closeMessage } = useGlobalStore();

  return createPortal(
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={messageOpen}
      onClose={closeMessage}
      message={message}
      key={message}
      autoHideDuration={3000}
    >
      <div
        className={`flex items-center rounded-[15px] border bg-white px-6 py-5 text-black ${
          messageType === 'succes' ? 'border-[#56B671]' : 'border-[#FF645E]'
        }`}
      >
        {messageType === 'succes' ? <Succes /> : <Error />}
        <span className="ml-1 text-[20px] font-medium">{message}</span>
      </div>
    </Snackbar>,
    document.body
  );
}

const Succes = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
    <path
      d="M15.0003 26.1109C21.1368 26.1109 26.1114 21.1363 26.1114 14.9998C26.1114 8.86328 21.1368 3.88867 15.0003 3.88867C8.86377 3.88867 3.88916 8.86328 3.88916 14.9998C3.88916 21.1363 8.86377 26.1109 15.0003 26.1109Z"
      fill="#00C566"
    />
    <path
      d="M10.5557 15.0003L13.889 18.3337L20.5557 11.667"
      stroke="white"
      strokeWidth="2.22222"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Error = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
    <path
      d="M15.0005 9.99902V14.999M15.0005 19.999H15.013M27.5005 14.999C27.5005 21.9026 21.9041 27.499 15.0005 27.499C8.09693 27.499 2.50049 21.9026 2.50049 14.999C2.50049 8.09546 8.09693 2.49902 15.0005 2.49902C21.9041 2.49902 27.5005 8.09546 27.5005 14.999Z"
      stroke="#F04438"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

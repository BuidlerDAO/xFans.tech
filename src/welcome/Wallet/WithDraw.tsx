import React from 'react';
import { styled, TextField as MTextField } from '@mui/material';
import { useToggle } from 'ahooks';

import { BasicButton, PrimaryButton } from '../../components/Button';
import Modal from '../../components/Modal';
import useGlobalUserStore from '../../store/useGlobalUserStore';
import { NumberDisplayer } from '../../components/NumberDisplayer';

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
    <g clipPath="url(#clip0_410_42042)">
      <path d="M5.00056 16.9065V12.6882L0.142822 9.63672L5.00056 16.9065Z" fill="#C7C7E0" />
      <path d="M5.0166 16.9065V12.6882L9.87443 9.63672L5.01669 16.9065H5.0166Z" fill="#A3A3D2" />
      <path d="M5.00048 11.6404V6.25684L0.0869141 8.62012L5.00048 11.6404Z" fill="#C7C7E0" />
      <path d="M5.0166 11.6404V6.25684L9.93017 8.62021L5.0166 11.6404Z" fill="#A3A3D2" />
      <path d="M0.0869141 8.62L5.00039 0.09375V6.25662L0.0869141 8.62Z" fill="#C7C7E0" />
      <path d="M9.93008 8.62L5.0166 0.09375V6.25662L9.93008 8.62Z" fill="#A3A3D2" />
    </g>
    <defs>
      <clipPath id="clip0_410_42042">
        <rect width="10" height="17" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const TextField = styled(MTextField)({
  width: '493px',
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
      borderRadius: '8px',
    },
    '&:hover fieldset': {
      borderColor: '#9A6CF9',
      borderRadius: '8px',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9A6CF9',
      borderRadius: '8px',
    },
  },
});

const Left = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.68799 8H12.438"
      stroke="#2E2E32"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.37499 11.75L3.625 8L7.37499 4.25"
      stroke="#2E2E32"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WithDraw = () => {
  const [isOpen, { setLeft: close, setRight: open }] = useToggle(false);
  const { balance, accounts } = useGlobalUserStore((state) => ({
    ...state,
  }));

  return (
    <>
      <BasicButton
        classes={{
          outlined:
            '!py-[10px] !px-[38px] !w-[170px] !text-[#0F1419] !border-[#0F1419] hover:!border-[#9A6CF9]',
        }}
        onClick={open}
      >
        <span className="text-base font-medium">Withdraw</span>
      </BasicButton>
      <Modal
        onClose={close}
        open={isOpen}
        width={553}
        closeButtonStyle={{
          marginTop: '5px',
        }}
      >
        <div className="relative flex flex-col items-center">
          <h2 className="text-[24px] font-medium text-[#2E2E32]">Withdraw</h2>
          <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>
          <p className="my-6 text-sm text-black text-opacity-50">
            Send your ETH to another wallet address on the blast network
          </p>

          <div className="mb-6 w-full space-y-6">
            <TextField label="Enter Address" />
            <TextField label="Enter Amount" />
          </div>

          <div className="flex space-x-3 self-end">
            <span className="text-sm text-[#0F1419]">Wallet Balance: </span>
            <div className="flex items-center space-x-1">
              <Icon />
              <NumberDisplayer className="text-base font-bold text-[#9A6CF9]" text={balance} />
            </div>
          </div>
          <div className="my-[30px] flex w-full justify-between">
            <BasicButton
              classes={{
                outlined: '!py-[10px] !px-[38px] !w-[170px] !text-[#0F1419] !border-[#0F1419]',
              }}
              onClick={close}
            >
              <div className="flex items-center justify-center space-x-2">
                <Left />
                <span className="text-[15px] font-medium">Go Back</span>
              </div>
            </BasicButton>
            <PrimaryButton
              classes={{
                contained: '!py-[10px] !px-[38px] !w-[170px]',
              }}
            >
              <span className="text-[15px] font-medium">Transfer</span>
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WithDraw;

import React, { useState } from 'react';

import { BasicButton, PrimaryButton } from '../../../components/Button';
import Modal from '../../../components/Modal';
import NumberInput from '../../../components/NumberInput';

type ModalProps = {
  onClose(): void;
};
export default function StackModal({ onClose }: ModalProps) {
  const [currentTab, setCurrentTab] = useState<'stack' | 'unstack'>('stack');
  const activedTabNavClassName = 'bg-[#9A6CF9] text-white';
  return (
    <Modal
      open
      onClose={onClose}
      closeButtonStyle={{
        marginTop: '5px',
      }}
    >
      <div className="relative flex flex-col items-center pb-[24px]">
        <h2 className="text-[24px] font-medium text-[#2E2E32]">Unlock Vincent ’s Community</h2>
        <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

        <p className="relative mt-[27px] pl-[25px] text-center text-sm text-[#919099]">
          <Icon /> Stake at least 5 shares to unlock the
          <br /> creator’s community
        </p>

        <ProgressBar />
        <p className="mt-[14px] w-full text-right text-sm text-[#919099]">
          Community total staked:3
        </p>
        <p className="w-full text-right text-sm text-[#919099]">you staked:2</p>

        {/* tab bar */}
        <div className="flex w-full justify-start">
          <div className="flex h-[46px] w-[296px] items-stretch justify-center overflow-hidden rounded-[38px] border-[1px] border-[#E0E2E7]">
            <div
              className={`flex w-[148px] cursor-pointer items-center justify-center ${
                currentTab === 'stack' ? activedTabNavClassName : 'text-black'
              }`}
              onClick={() => setCurrentTab('stack')}
            >
              Stake
            </div>
            <div className="w-[1px] bg-[#E0E2E7]" />
            <div
              className={`flex w-[148px] cursor-pointer items-center justify-center ${
                currentTab === 'unstack' ? activedTabNavClassName : 'text-black'
              }`}
              onClick={() => setCurrentTab('unstack')}
            >
              Unstake
            </div>
          </div>
        </div>

        {currentTab === 'stack' ? <StackPanel /> : <UnstackPanel />}

        <div className="mt-[30px] mb-0 flex w-full justify-between">
          <BasicButton
            classes={{
              outlined: '!w-[184px] !h-[46px] !text-[#0F1419] !border-[#9A6CF9] !text-[#9A6CF9]',
            }}
            onClick={onClose}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[15px] font-medium">Cancel</span>
            </div>
          </BasicButton>
          {/* TODO loading */}
          <PrimaryButton
            classes={{
              contained: '!py-[10px] !px-[38px] !w-[184px] whitespace-nowrap',
            }}
          >
            <span className="text-[15px] font-medium">Confirm unstake</span>
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

function StackPanel() {
  return (
    <div className="mt-[25px] w-full">
      <p className="flex justify-between text-base font-medium text-[#0F1419]">
        <span>Shares you hold:10</span>
        <span>Max stake:8</span>
      </p>
      <NumberInput
        className="!mt-[16px]"
        size="small"
        fullWidth
        label="Amount"
        onChange={() => undefined}
      />
    </div>
  );
}

function UnstackPanel() {
  return (
    <div className="mt-[25px] w-full">
      <p className="flex justify-between text-base font-medium text-[#0F1419]">
        <span>Shares you staked:2</span>
        <span>Max unstake:8</span>
      </p>
      <NumberInput
        className="!mt-[16px]"
        size="small"
        fullWidth
        label="Amount"
        onChange={() => undefined}
      />
    </div>
  );
}

function ProgressBar({ percentage = 0.0 }: { percentage?: number }) {
  return (
    <div className="relative mt-[30px] h-[20px] w-full rounded-[31px] bg-[#F6F5F7]">
      <div className="w-[50%]" />
      <div
        className={`item-center absolute left-0 top-0 flex h-[20px] w-[${percentage}px] rounded-full bg-[#9A6CF969] pl-[10px] pr-[10px]`}
      />
      <div className="item-center absolute right-0 top-[1px] flex h-[18px] w-[18px] justify-center rounded-full border border-[#9A6CF9] bg-white text-xs text-[#2E2E32]">
        5
      </div>
    </div>
  );
}

function Icon() {
  return (
    <svg
      className="absolute top-0 left-0"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1330_47491)">
        <path
          d="M9 16.5C11.071 16.5 12.9461 15.6605 14.3033 14.3033C15.6605 12.9461 16.5 11.071 16.5 9C16.5 6.92895 15.6605 5.05395 14.3033 3.6967C12.9461 2.33947 11.071 1.5 9 1.5C6.92895 1.5 5.05395 2.33947 3.6967 3.6967C2.33947 5.05395 1.5 6.92895 1.5 9C1.5 11.071 2.33947 12.9461 3.6967 14.3033C5.05395 15.6605 6.92895 16.5 9 16.5Z"
          stroke="#919099"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 7.15576C9.51776 7.15576 9.9375 6.73602 9.9375 6.21826C9.9375 5.7005 9.51776 5.28076 9 5.28076C8.48224 5.28076 8.0625 5.7005 8.0625 6.21826C8.0625 6.73602 8.48224 7.15576 9 7.15576Z"
          fill="#919099"
        />
        <path
          d="M9 8.68359L9 11.7563"
          stroke="#919099"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1330_47491">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useToggle } from 'ahooks';

import { BasicButton, PrimaryButton } from '../../components/Button';
import Modal from '../../components/Modal';
import TruncateText from '../../components/TruncateText';
import useGlobalStore from '../../store/useGlobalStore';
import useGlobalUserStore from '../../store/useGlobalUserStore';

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

const Deposit = () => {
  const [isOpen, { setLeft: close, setRight: open }] = useToggle(false);
  const accounts = useGlobalUserStore((state) => state.accounts);

  return (
    <>
      <BasicButton
        classes={{
          outlined:
            'text-base font-medium !py-[10px] !px-[38px] !w-[170px] !text-[#0F1419] !border-[#0F1419] hover:!border-[#9A6CF9]',
        }}
        onClick={open}
      >
        <span className="text-base font-medium">Deposit</span>
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
          <h2 className="text-[24px] font-medium text-[#2E2E32]">Deposit</h2>
          <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

          <div className="mt-6 w-full space-y-[14px]">
            <div className="flex flex-col space-y-[14px]">
              <span className="text-base font-medium text-[#919099]">Network</span>
              <div className="rounded-[8px] bg-[#F7F9FA] py-[18px] pl-[26px] text-base font-medium text-[#1A1D1F]">
                Blast
              </div>
            </div>
            <div className="flex flex-col space-y-[14px]">
              <span className="text-base font-medium text-[#919099]">Address</span>
              <div className="rounded-[8px] bg-[#F7F9FA] py-[18px] pl-[26px] text-base font-medium text-[#1A1D1F]">
                {accounts[0] ?? '0x0'}
              </div>
            </div>
            <div className="flex flex-col space-y-[14px]">
              <span className="text-base font-medium text-[#919099]">Asset</span>
              <div className="rounded-[8px] bg-[#F7F9FA] py-[18px] pl-[26px] text-base font-medium text-[#1A1D1F]">
                ETH
              </div>
            </div>
          </div>
          <div className="my-[30px] flex w-full justify-between">
            <BasicButton
              classes={{
                outlined: '!py-[10px] !px-[38px] !w-[184px] !text-[#0F1419] !border-[#0F1419]',
              }}
              onClick={close}
            >
              <div className="flex items-center justify-center space-x-2">
                <Left />
                <span className="text-[15px] font-medium">Go Back</span>
              </div>
            </BasicButton>
            <CopyToClipboard
              text={accounts[0] ?? '0x0'}
              onCopy={() => {
                useGlobalStore.setState({
                  messageOpen: true,
                  messageType: 'succes',
                  message: 'copy successfully',
                });
              }}
            >
              <PrimaryButton
                classes={{
                  contained: '!py-[10px] !px-[38px] !w-[184px]',
                }}
              >
                <span className="text-[15px] font-medium">Copy Address</span>
              </PrimaryButton>
            </CopyToClipboard>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Deposit;

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useToggle } from 'ahooks';

import { BackButton, BasicButton, PrimaryButton } from '../../components/Button';
import Modal from '../../components/Modal';
import * as toaster from '../../components/Toaster';
import TSelect from '../../components/Select';
import { chainNameMap } from '../../config/chainConfig';
import useGlobalStore from '../../store/useGlobalStore';
import useGlobalUserStore from '../../store/useGlobalUserStore';

const Deposit = () => {
  const [isOpen, { setLeft: close, setRight: open }] = useToggle(false);
  const accounts = useGlobalUserStore((state) => state.accounts);
  const { chain } = useGlobalStore();

  return (
    <>
      <BasicButton
        classes={{
          outlined:
            'text-base font-medium !py-[10px] !px-[38px] !w-[170px] !text-[#0F1419] !border-[#0F1419] hover:!border-[#9A6CF9]',
        }}
        onClick={open}
      >
        <span className="xfans-font-sf text-base font-medium">Deposit</span>
      </BasicButton>
      <Modal
        onClose={close}
        open={isOpen}
        width={553}
        closebuttonstyle={{
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
                {chainNameMap[chain]}
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
              <TSelect
                defaultValue="ETH"
                options={['ETH', 'Bera']}
                onChange={(x) => {
                  console.log('Tselect', x);
                }}
              />
            </div>
          </div>
          <div className="my-[30px] flex w-full justify-between">
            <BackButton onButtonClick={close} />
            <CopyToClipboard
              text={accounts[0] ?? '0x0'}
              onCopy={() => {
                toaster.success(toaster.ToastMessage.COPY_SUCCESS);
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

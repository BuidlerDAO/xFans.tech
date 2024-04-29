import React, { useMemo, useState } from 'react';
import { CircularProgress, styled, TextField as MTextField } from '@mui/material';
import { useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import { isAddress } from 'web3-validator';

import { BackButton, PrimaryButton } from '../../components/Button';
import ETHIcon from '../../components/icons/ETHIcon';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import { error, success } from '../../components/Toaster';
import { getCurrentChainName } from '../../config/chainConfig';
import { ContractError } from '../../constants';
import useAccount from '../../hooks/useAccount';
import { transfer as transferApi } from '../../service/contract/shares';
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

const pattern = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;

type Props = {
  onClose(): void;
};

const WithDraw = ({ onClose }: Props) => {
  const { balance, refresh } = useAccount();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const { run: transfer, loading } = useRequest(() => transferApi(address, amount), {
    manual: true,
    onSuccess() {
      success('Submitted successfully');
      refresh();
    },
  });
  const addressHelperText = useMemo(() => {
    if (address !== '' && !isAddress(address)) {
      return ContractError.InvalidAddress;
    }
  }, [address]);

  function handleAmountChange(nextAmount: string) {
    if (nextAmount === '') {
      setAmount('');
      return;
    }
    if (pattern.test(nextAmount)) {
      setAmount(nextAmount);
    }
  }

  function handleTransferClick() {
    if (new BigNumber(balance).isLessThan(amount)) {
      error('Insufficient Balance');
      return;
    }

    transfer();
  }

  const isValidAmount = useMemo(() => {
    if (amount === '') return false;
    if (amount == null) return false;
    return true;
  }, [amount]);

  return (
    <Modal
      onClose={onClose}
      open
      width={553}
      closebuttonstyle={{
        marginTop: '5px',
      }}
    >
      <div className="relative flex flex-col items-center">
        <h2 className="xfans-font-sf text-[24px] font-medium text-[#2E2E32]">Withdraw</h2>
        <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>
        <p className="xfans-font-sf my-6 text-sm text-black text-opacity-50">
          {`Send your ETH to another wallet address on the ${getCurrentChainName()}`}
        </p>

        <div className="mb-6 w-full space-y-6">
          <TextField
            label="Enter Address"
            error={address !== '' && !isAddress(address)}
            helperText={addressHelperText}
            autoComplete="off"
            onChange={(event) => setAddress(event.target.value)}
          />
          <TextField
            label="Enter Amount"
            fullWidth
            value={amount}
            autoComplete="off"
            onChange={(event) => handleAmountChange(event.target.value)}
          />
        </div>

        <div className="flex space-x-3 self-end">
          <span className="xfans-font-sf text-sm text-[#0F1419]">Wallet Balance: </span>
          <div className="flex items-center space-x-1">
            <ETHIcon />
            <NumberDisplayer
              className="text-base font-bold text-[#9A6CF9]"
              text={balance.toString()}
            />
          </div>
        </div>
        <div className="my-[30px] flex w-full justify-between">
          <BackButton onButtonClick={onClose} />
          <PrimaryButton
            classes={{
              contained: '!py-[10px] !px-[38px] !w-[170px]',
            }}
            disabled={loading || !isAddress(address) || !isValidAmount}
            startIcon={loading && <CircularProgress color="inherit" size={15} />}
            onClick={handleTransferClick}
          >
            <span className="xfans-font-sf text-[15px] font-medium">Transfer</span>
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default WithDraw;

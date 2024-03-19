import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CircularProgress, Divider } from '@mui/material';
import BigNumber from 'bignumber.js';

import { BasicButton, PrimaryButton } from '../../components/Button';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import NumberInput, { NumberInputRef } from '../../components/NumberInput';
import TruncateText from '../../components/TruncateText';
import useWallet from '../../hooks/useWallet';
import BackButton from '../../components/buttons/backButton';
import {
  getFloorPrice,
  getSellPrice,
  getSellPriceAfterFee,
  getSharesBalance,
  sellShares,
} from '../../service/contract/shares';
import { getBalance } from '../../service/contract/user';
import useGlobalStore from '../../store/useGlobalStore';
import useProfileModal from '../../store/useProfileModal';

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="24" viewBox="0 0 15 24" fill="none">
    <g clipPath="url(#clip0_365_20589)">
      <path d="M7.50072 23.8686V17.9135L0.214111 13.6055L7.50072 23.8686Z" fill="#C7C7E0" />
      <path d="M7.52466 23.8686V17.9135L14.8114 13.6055L7.52479 23.8686H7.52466Z" fill="#A3A3D2" />
      <path d="M7.50084 16.4334V8.83301L0.130493 12.1694L7.50084 16.4334Z" fill="#C7C7E0" />
      <path d="M7.52466 16.4334V8.83301L14.895 12.1695L7.52466 16.4334Z" fill="#A3A3D2" />
      <path d="M0.130493 12.1689L7.50071 0.131836V8.83236L0.130493 12.1689Z" fill="#C7C7E0" />
      <path d="M14.8951 12.1689L7.5249 0.131836V8.83236L14.8951 12.1689Z" fill="#A3A3D2" />
    </g>
    <defs>
      <clipPath id="clip0_365_20589">
        <rect width="15" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Icon1 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
    <g clipPath="url(#clip0_365_21061)">
      <path d="M5.00032 17.4065V13.1882L0.142578 10.1367L5.00032 17.4065Z" fill="#C7C7E0" />
      <path d="M5.0166 17.4065V13.1882L9.87443 10.1367L5.01669 17.4065H5.0166Z" fill="#A3A3D2" />
      <path d="M5.00048 12.1404V6.75684L0.0869141 9.12012L5.00048 12.1404Z" fill="#C7C7E0" />
      <path d="M5.0166 12.1404V6.75684L9.93017 9.12021L5.0166 12.1404Z" fill="#A3A3D2" />
      <path d="M0.0869141 9.12L5.00039 0.59375V6.75662L0.0869141 9.12Z" fill="#C7C7E0" />
      <path d="M9.93008 9.12L5.0166 0.59375V6.75662L9.93008 9.12Z" fill="#A3A3D2" />
    </g>
    <defs>
      <clipPath id="clip0_365_21061">
        <rect width="10" height="17" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

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

type SellModalProps = {
  onClose(): void;
};

const SellModal = ({ onClose }: SellModalProps) => {
  const { currentInfo } = useProfileModal();
  const wallet = useWallet();
  const [price, setPrice] = useState<string>('0');
  const [gasFee, setGasFee] = useState<string>('0');
  const [amount, setAmount] = useState<number>(0);
  const [priceAfterFee, setPriceAfterFee] = useState('0');
  const [balance, setBalance] = useState('0');
  const [shareBalance, setShareBalance] = useState('0');
  const [isSelling, setIsSelling] = useState(false);
  const [floorPrice, setFloorPrice] = useState('0');
  const numberInputRef = useRef<NumberInputRef>(null);
  useEffect(() => {
    if (amount === 0) {
      setGasFee('0');
      setPrice('0');
      setPriceAfterFee('0');
      return;
    }
    let cancel = false;
    if (currentInfo?.walletAddress != null) {
      getSellPrice(currentInfo?.walletAddress, amount).then(({ gasFee, price }) => {
        if (cancel) return;
        setGasFee(gasFee);
        setPrice(price);
      });
      getSellPriceAfterFee(currentInfo?.walletAddress, amount).then((fee) => {
        if (cancel) return;
        setPriceAfterFee(fee);
      });
    }
    return () => {
      cancel = true;
    };
  }, [amount, currentInfo?.walletAddress]);

  // Transaction fee
  const transactionFee = useMemo(() => {
    if (price !== '0' && priceAfterFee !== '0') {
      const _transactionFee = new BigNumber(price).minus(new BigNumber(priceAfterFee));
      return _transactionFee.toString();
    } else {
      return '0';
    }
  }, [price, priceAfterFee]);

  // shareBalance
  useEffect(() => {
    if (currentInfo?.walletAddress) {
      getSharesBalance(currentInfo?.walletAddress).then((balance) => {
        setShareBalance(balance);
      });
    }
  }, [currentInfo?.walletAddress]);

  useEffect(() => {
    if (wallet) {
      getBalance().then((balance) => {
        setBalance(balance.toString());
      });
    }
  }, [wallet]);

  useEffect(() => {
    if (currentInfo?.walletAddress != null) {
      getFloorPrice(currentInfo?.walletAddress).then(setFloorPrice);
    }
  }, [currentInfo?.walletAddress]);

  // 刷新数据,可能有顺序问题
  function refresh() {
    numberInputRef.current?.reset();
    if (currentInfo?.walletAddress) {
      getSharesBalance(currentInfo?.walletAddress).then((balance) => {
        setShareBalance(balance);
      });
      getBalance().then((balance) => {
        setBalance(balance.toString());
      });
      getFloorPrice(currentInfo?.walletAddress).then(setFloorPrice);
    }
  }

  function handleSellClick() {
    setIsSelling(true);
    sellShares(currentInfo!.walletAddress!, amount).then(() => {
      setIsSelling(false);
      refresh();
      useGlobalStore.setState({
        message: '出售成功！',
        messageType: 'succes',
        messageOpen: true,
      });
    });
  }

  return (
    <Modal onClose={onClose} open width={553}>
      <div className="relative flex flex-col items-center">
        <h2 className="text-[24px] font-medium text-[#2E2E32]">
          Sell Shares of {currentInfo?.username}
        </h2>
        <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

        <div className="mt-6 flex w-full items-center justify-between text-black">
          <div className="flex items-center space-x-[6px]">
            <span className="text-xl font-bold text-[#2E2E32]">Floor Price:</span>
            <Icon />
            <span className="text-xl font-medium">
              <NumberDisplayer text={floorPrice} />
            </span>
          </div>

          <div className="flex items-center space-x-[6px]">
            <span className="text-xl font-bold text-[#2E2E32]">You Own:</span>
            <span className="text-xl font-medium">{+shareBalance / 100}</span>
          </div>
        </div>

        <NumberInput
          ref={numberInputRef}
          className="!mt-6"
          fullWidth
          label="Amount"
          max={+shareBalance / 100}
          disabled={isSelling}
          onChange={(v) => {
            setAmount(v ?? 0);
          }}
        />

        <div className="mt-4 flex items-center space-x-1 self-end text-black">
          <span className="text-sm">Minimum unit: </span>
          <span className="text-sm font-medium">0.01 </span>
        </div>

        <Divider
          sx={{
            marginTop: 3,
            width: '100%',
            borderColor: '#EBEEF0',
            borderStyle: 'dashed',
          }}
        />

        <div className="mt-5 w-full space-y-4 text-black">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[#919099]">From</span>
            <span className="text-lg font-medium">{wallet && <TruncateText text={wallet} />}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[#919099]">To</span>
            <span className="text-lg font-medium">
              {currentInfo?.walletAddress && <TruncateText text={currentInfo?.walletAddress} />}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Transaction Fee</span>
            <div className="flex items-center space-x-1">
              <Icon1 />
              <span className="text-lg font-medium">
                <NumberDisplayer text={transactionFee} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Est. Gas Fee</span>
            <div className="flex items-center space-x-1">
              <Icon1 />
              <span className="text-lg font-medium">
                <NumberDisplayer text={gasFee} />
              </span>
            </div>
          </div>
        </div>

        <Divider
          sx={{
            marginTop: 3,
            width: '100%',
            borderColor: '#EBEEF0',
            borderStyle: 'dashed',
          }}
        />

        <div className="mt-5 w-full space-y-4 text-black">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">You Receive</span>
            <div className="flex items-center space-x-1">
              <Icon1 />
              <span className="text-2xl font-bold">
                <NumberDisplayer text={priceAfterFee} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[#919099]">Wallet Balance</span>
            <div className="flex items-center justify-center space-x-1 rounded-full bg-[#F5F5F5] px-5 py-1">
              <Icon1 />
              <span className="text-lg font-medium">
                <NumberDisplayer text={balance} isBigNumber={false} />
              </span>
            </div>
          </div>
        </div>

        <div className="my-[30px] flex w-full justify-between">
          <BackButton onButtonClick={onClose} />
          <PrimaryButton
            classes={{
              contained: '!py-[10px] !px-[38px] !w-[170px]',
            }}
            onClick={handleSellClick}
            disabled={isSelling || amount === 0}
            startIcon={isSelling && <CircularProgress color="inherit" size={15} />}
          >
            <span className="text-[15px] font-medium">Sell</span>
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default SellModal;

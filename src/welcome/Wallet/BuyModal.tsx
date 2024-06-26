import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CircularProgress, Divider } from '@mui/material';
import BigNumber from 'bignumber.js';

import { BackButton, PrimaryButton } from '../../components/Button';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import NumberInput, { NumberInputRef } from '../../components/NumberInput';
import * as toaster from '../../components/Toaster';
import { ContractError } from '../../constants';
import useAccount from '../../hooks/useAccount';
import { useETHPrice } from '../../hooks/useETHPrice';
import {
  buyShares,
  getBuyPrice,
  getBuyPriceAfterFee,
  getFloorPrice,
  getSupply,
} from '../../service/contract/shares';
import { getBalance } from '../../service/contract/user';
import useProfileModal from '../../store/useProfileModal';
import { formatDollar } from '../../utils';

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

type BuyModalProps = {
  onClose(): void;
};

const BuyModal = ({ onClose }: BuyModalProps) => {
  const { currentInfo } = useProfileModal();
  const { wallet, refresh: refreshAccount } = useAccount();
  const [price, setPrice] = useState<string>('0');
  const [gasFee, setGasFee] = useState<string>('0');
  const [amount, setAmount] = useState<number>(0);
  const [priceAfterFee, setPriceAfterFee] = useState('0');
  const [balance, setBalance] = useState('0');
  const [isBuying, setIsBuying] = useState(false);
  const [floorPrice, setFloorPrice] = useState('0');
  const [supply, setSupply] = useState(0);
  const numberInputRef = useRef<NumberInputRef>(null);

  const [loadingFloorPrice, setLoadingFloorPrice] = useState<boolean>(true);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [loadingPirceAfterFee, setLoadingPirceAfterFee] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [loadingSupply, setLoadingSupply] = useState<boolean>(true);

  const ethPrice = useETHPrice();

  useEffect(() => {
    if (currentInfo?.walletAddress != null) {
      setLoadingSupply(true);
      getSupply(currentInfo?.walletAddress).then((data) => {
        setLoadingSupply(false);
        setSupply(data);
      });
    }
  }, [currentInfo]);

  useEffect(() => {
    if (amount === 0) {
      setGasFee('0');
      setPriceAfterFee('0');
      setPrice('0');
      return;
    }
    let cancel = false;
    if (currentInfo?.walletAddress != null) {
      setLoadingPrice(true);
      getBuyPrice(currentInfo?.walletAddress, amount).then(({ gasFee, price }) => {
        setLoadingPrice(false);
        if (cancel) return;
        setGasFee(gasFee);
        setPrice(price);
      });
      setLoadingPirceAfterFee(true);
      getBuyPriceAfterFee(currentInfo?.walletAddress, amount).then((fee) => {
        setLoadingPirceAfterFee(false);
        if (cancel) return;
        setPriceAfterFee(fee);
      });
    }
    return () => {
      cancel = true;
    };
  }, [amount, currentInfo?.walletAddress]);

  useEffect(() => {
    if (currentInfo?.walletAddress != null) {
      setLoadingFloorPrice(true);
      getFloorPrice(currentInfo?.walletAddress).then((price) => {
        setLoadingFloorPrice(false);
        setFloorPrice(price);
      });
    }
  }, [currentInfo?.walletAddress]);

  useEffect(() => {
    if (wallet) {
      setLoadingBalance(true);
      getBalance().then((balance) => {
        setLoadingBalance(false);
        setBalance(balance);
      });
    }
  }, [wallet]);

  // Transaction fee
  const transactionFee = useMemo(() => {
    if (price !== '0' && priceAfterFee !== '0') {
      const _transactionFee = new BigNumber(priceAfterFee).minus(new BigNumber(price));
      return _transactionFee.toFixed();
    } else {
      return '0';
    }
  }, [price, priceAfterFee]);

  // total
  const total = useMemo(() => {
    if (priceAfterFee !== '0' && gasFee !== '0') {
      const _total = new BigNumber(priceAfterFee).plus(new BigNumber(gasFee));
      return _total.toFixed();
    } else {
      return '0';
    }
  }, [gasFee, priceAfterFee]);

  // 刷新数据, 可能有顺序问题
  function refresh() {
    numberInputRef.current?.reset();
    refreshAccount();
    setLoadingBalance(true);
    getBalance().then((balance) => {
      setLoadingBalance(false);
      setBalance(balance);
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setLoadingFloorPrice(true);
    getFloorPrice(currentInfo!.walletAddress!).then((price) => {
      setLoadingFloorPrice(false);
      setFloorPrice(price);
    });
  }

  function handleBuyClick() {
    if (new BigNumber(total).isGreaterThan(new BigNumber(balance))) {
      toaster.error(ContractError.InsufficientBalance);
      return;
    }
    setIsBuying(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    buyShares(currentInfo!.walletAddress!, amount)
      .then(() => {
        refresh();
        toaster.success(toaster.ToastMessage.TRAMSACTION_COMPLETED);
      })
      .finally(() => {
        setIsBuying(false);
      });
  }

  const unit = useMemo(() => {
    if (supply <= 5) return 1;
    return 0.1;
  }, [supply]);

  return (
    <Modal open onClose={onClose} width={553} closebuttonstyle={{ marginTop: '5px' }}>
      <div className="relative flex flex-col items-center">
        <h2 className="text-[24px] font-medium text-[#2E2E32]">Buy {currentInfo?.username}</h2>
        <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

        <div className="mt-6 flex items-center space-x-[6px] self-start">
          <span className="text-xl font-bold text-[#2E2E32]">Floor Price:</span>
          <Icon />
          <span className="text-xl font-medium text-black">
            <NumberDisplayer text={floorPrice} loading={loadingFloorPrice} />
          </span>
        </div>

        <NumberInput
          ref={numberInputRef}
          className="!mt-6"
          fullWidth
          label="Amount"
          integerOnly={unit === 1}
          disabled={isBuying || loadingSupply}
          onChange={(v) => {
            setAmount(v ?? 0);
          }}
        />

        <div className="mt-4 flex items-center space-x-1 self-end text-black">
          <span className="text-sm">Minimum unit: </span>
          <span className="text-sm font-medium">
            {loadingSupply ? <CircularProgress size={8} /> : unit}
          </span>
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
            <span className="text-lg font-medium">Total Price</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <Icon1 />
                <span className="text-lg font-medium">
                  <NumberDisplayer text={price} loading={loadingPrice || loadingPirceAfterFee} />
                </span>
              </div>
              <span className="text-[#919099]">{formatDollar(price, ethPrice)}</span>
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
            <span className="text-lg font-medium text-[#919099]">Transaction Fee</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <Icon1 />
                <span className="text-lg font-medium">
                  <NumberDisplayer
                    text={transactionFee}
                    loading={loadingPrice || loadingPirceAfterFee}
                  />
                </span>
              </div>
              <span className="text-[#919099]">{formatDollar(transactionFee, ethPrice)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[#919099]">Est. Gas Fee</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <Icon1 />
                <span className="text-lg font-medium">
                  <NumberDisplayer text={gasFee} loading={loadingPrice} />
                </span>
              </div>
              <span className="text-[#919099]">{formatDollar(gasFee, ethPrice)}</span>
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
            <span className="text-lg font-medium">You Pay(Including Fees)</span>
            <div className="flex items-center space-x-1">
              <Icon1 />
              <span className="text-2xl font-bold">
                <NumberDisplayer text={total} loading={loadingPrice || loadingPirceAfterFee} />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[#919099]">Wallet Balance</span>
            <div className="flex items-center justify-center space-x-1 rounded-full bg-[#F5F5F5] px-5 py-1">
              <Icon1 />
              <span className="text-lg font-medium">
                <NumberDisplayer text={balance} loading={loadingBalance} />
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
            onClick={handleBuyClick}
            disabled={
              isBuying ||
              amount === 0 ||
              loadingPrice ||
              loadingPirceAfterFee ||
              loadingBalance ||
              loadingFloorPrice
            }
            startIcon={isBuying && <CircularProgress color="inherit" size={15} />}
          >
            <span className="text-[15px] font-medium">Buy</span>
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default BuyModal;

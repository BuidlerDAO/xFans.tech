import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CircularProgress, Divider } from '@mui/material';
import BigNumber from 'bignumber.js';

import { BackButton, PrimaryButton } from '../../components/Button';
import SolanaIcon from '../../components/icons/SolanaIcon';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import NumberInput, { NumberInputRef } from '../../components/NumberInput';
import * as toaster from '../../components/Toaster';
import { ContractError, SHARE_UNIT_MODIFIER } from '../../constants';
import useAccount from '../../hooks/useAccount';
import { useChainPrice } from '../../hooks/useChainPrice';
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
import { formatDollar } from '../../utils';

type SellModalProps = {
  onClose(): void;
};

const SellModal = ({ onClose }: SellModalProps) => {
  const { chain } = useGlobalStore();
  const { currentInfo } = useProfileModal();
  const { wallet, refresh: refreshAccount } = useAccount();
  const [price, setPrice] = useState<string>('0');
  const [gasFee, setGasFee] = useState<string>('0');
  const [amount, setAmount] = useState<number>(0);
  const [priceAfterFee, setPriceAfterFee] = useState('0');
  const [balance, setBalance] = useState('0');
  const [shareBalance, setShareBalance] = useState('0');
  const [isSelling, setIsSelling] = useState(false);
  const [floorPrice, setFloorPrice] = useState('0');
  const numberInputRef = useRef<NumberInputRef>(null);

  const [loadingFloorPrice, setLoadingFloorPrice] = useState<boolean>(true);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [loadingPirceAfterFee, setLoadingPirceAfterFee] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [loadingSharesBalance, setLoadingSharesBalance] = useState<boolean>(true);

  const chainPrice = useChainPrice(chain);

  useEffect(() => {
    if (amount === 0) {
      setGasFee('0');
      setPrice('0');
      setPriceAfterFee('0');
      return;
    }
    let cancel = false;
    if (currentInfo?.walletAddress != null) {
      setLoadingPrice(true);
      getSellPrice(currentInfo?.walletAddress, amount).then(({ gasFee, price }) => {
        setLoadingPrice(false);
        if (cancel) return;
        setGasFee(gasFee);
        setPrice(price);
      });
      setLoadingPirceAfterFee(true);
      getSellPriceAfterFee(currentInfo?.walletAddress, amount).then((fee) => {
        setLoadingPirceAfterFee(false);
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
      return _transactionFee.toFixed();
    } else {
      return '0';
    }
  }, [price, priceAfterFee]);

  // shareBalance
  useEffect(() => {
    if (currentInfo?.walletAddress) {
      setLoadingSharesBalance(true);
      getSharesBalance(currentInfo?.walletAddress).then((balance) => {
        setLoadingSharesBalance(false);
        setShareBalance(balance);
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

  useEffect(() => {
    if (currentInfo?.walletAddress != null) {
      setLoadingFloorPrice(true);
      getFloorPrice(currentInfo?.walletAddress).then((price) => {
        setLoadingFloorPrice(false);
        setFloorPrice(price);
      });
    }
  }, [currentInfo?.walletAddress]);

  // 刷新数据,可能有顺序问题
  function refresh() {
    numberInputRef.current?.reset();
    refreshAccount();
    if (currentInfo?.walletAddress) {
      setLoadingSharesBalance(true);
      getSharesBalance(currentInfo?.walletAddress).then((balance) => {
        setLoadingSharesBalance(false);
        setShareBalance(balance);
      });

      setLoadingBalance(true);
      getBalance().then((balance) => {
        setLoadingBalance(false);
        setBalance(balance);
      });

      setLoadingFloorPrice(true);
      getFloorPrice(currentInfo?.walletAddress).then((price) => {
        setLoadingFloorPrice(false);
        setFloorPrice(price);
      });
    }
  }

  function handleSellClick() {
    if (new BigNumber(gasFee).isGreaterThan(new BigNumber(balance))) {
      toaster.error(ContractError.InsufficientBalance);
      return;
    }
    setIsSelling(true);
    sellShares(currentInfo!.walletAddress!, amount)
      .then(() => {
        refresh();
        toaster.success(toaster.ToastMessage.TRAMSACTION_COMPLETED);
      })
      .finally(() => {
        setIsSelling(false);
      });
  }

  return (
    <Modal onClose={onClose} open width={553} closebuttonstyle={{ marginTop: '5px' }}>
      <div className="relative flex flex-col items-center">
        <h2 className="text-[24px] font-medium text-[#2E2E32]">
          Sell Shares of {currentInfo?.username}
        </h2>
        <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

        <div className="mt-6 flex w-full items-center justify-between text-black">
          <div className="flex items-center space-x-[6px]">
            <span className="text-xl font-bold text-[#2E2E32]">Floor Price:</span>
            <SolanaIcon />
            <span className="text-xl font-medium">
              <NumberDisplayer text={floorPrice} loading={loadingFloorPrice} />
            </span>
          </div>

          <div className="flex items-center space-x-[6px]">
            <span className="text-xl font-bold text-[#2E2E32]">You Own:</span>
            <span className="text-xl font-medium">
              {loadingSharesBalance ? (
                <CircularProgress size={12} sx={{ marginTop: '6px' }} />
              ) : (
                +shareBalance / SHARE_UNIT_MODIFIER
              )}
            </span>
          </div>
        </div>

        <NumberInput
          ref={numberInputRef}
          className="!mt-6"
          fullWidth
          label="Amount"
          max={+shareBalance / SHARE_UNIT_MODIFIER}
          disabled={isSelling}
          onChange={(v) => {
            setAmount(v ?? 0);
          }}
        />

        <div className="mt-4 flex items-center space-x-1 self-end text-black">
          <span className="text-sm">Minimum unit: </span>
          <span className="text-sm font-medium">0.1 </span>
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
                <SolanaIcon />
                <span className="text-lg font-medium">
                  <NumberDisplayer text={price} loading={loadingPrice || loadingPirceAfterFee} />
                </span>
              </div>
              <span className="text-[#919099]">{formatDollar(price, chainPrice)}</span>
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
                <SolanaIcon />
                <span className="text-lg font-medium">
                  <NumberDisplayer
                    text={transactionFee}
                    loading={loadingPrice || loadingPirceAfterFee}
                  />
                </span>
              </div>
              <span className="text-[#919099]">{formatDollar(transactionFee, chainPrice)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[#919099]">Est. Gas Fee</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <SolanaIcon />
                <span className="text-lg font-medium">
                  <NumberDisplayer text={gasFee} loading={loadingPrice} />
                </span>
              </div>
              <span className="text-[#919099]">{formatDollar(gasFee, chainPrice)}</span>
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
              <SolanaIcon />
              <span className="text-2xl font-bold">
                <NumberDisplayer
                  text={priceAfterFee}
                  loading={loadingPrice || loadingPirceAfterFee}
                />
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[#919099]">Wallet Balance</span>
            <div className="flex items-center justify-center space-x-1 rounded-full bg-[#F5F5F5] px-5 py-1">
              <SolanaIcon />
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
            onClick={handleSellClick}
            disabled={
              isSelling ||
              amount === 0 ||
              loadingPrice ||
              loadingPirceAfterFee ||
              loadingBalance ||
              loadingFloorPrice
            }
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

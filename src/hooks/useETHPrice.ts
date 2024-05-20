import { useEffect } from 'react';

import { useEthPrice as useEthPriceService } from '../service/share';
import useShareStore from '../store/useShareStore';

/**
 * 获取最新 eth 价格
 */
export function useETHPrice() {
  const { run: getPrice } = useEthPriceService();
  const { ethPrice } = useShareStore((state) => ({ ...state }));

  useEffect(() => {
    getPrice();
  }, [getPrice]);

  return ethPrice?.price ?? 0;
}

/**
 * 获取最新 eth 价格
 */
export function useBeraPrice() {
  const { run: getPrice } = useEthPriceService();
  const { beraPrice } = useShareStore((state) => ({ ...state }));

  useEffect(() => {
    getPrice();
  }, [getPrice]);

  return beraPrice?.price ?? 0;
}

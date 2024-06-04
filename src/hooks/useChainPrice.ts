import { useEffect, useState } from 'react';

import { Chain } from '../config/chainConfig';
import { getChainPrices } from '../service/share';

const chainSymbolMap = {
  [Chain.Arb]: 'eth',
  [Chain.Bera]: 'bera',
  [Chain.Sol]: 'sol',
};
/**
 * 获取最新 eth 价格
 */
export function useChainPrice(chain: Chain) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    getChainPrices().then((prices) => {
      const nextPrice = prices.data.items.find((_price) => _price.symbol === chainSymbolMap[chain]);
      setPrice(nextPrice?.price ?? 0);
    });
  }, [chain]);

  return price;
}

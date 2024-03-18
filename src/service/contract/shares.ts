import BigNumber from 'bignumber.js';

import { contractRequestHttp as http } from '../request';

export async function getFloorPrice(address: string) {
  const data = await http.get<{ gasFee: string; price: string }>('/xfans/api/shares/getBuyPrice', {
    // 地板价指买 100 个最小单位 0.01 的 amount
    amount: '100',
    address,
  });
  return data.price;
}

export async function getBuyPrice(address: string, amount: number) {
  const data = await http.get<{ gasFee: string; price: string }>('/xfans/api/shares/getBuyPrice', {
    amount: BigNumber(amount).times(100).toFixed(),
    address,
  });
  return data;
}

export async function getBuyPriceAfterFee(address: string, amount: number) {
  const data = await http.get<string>('/xfans/api/shares/getBuyPriceAfterFee', {
    amount: BigNumber(amount).times(100).toFixed(),
    address,
  });
  return data;
}

export async function getSellPrice(address: string, amount: number) {
  const data = await http.get<{ gasFee: string; price: string }>('/xfans/api/shares/getSellPrice', {
    amount: BigNumber(amount).times(100).toFixed(),
    address,
  });
  return data;
}

export async function getSellPriceAfterFee(address: string, amount: number) {
  const data = await http.get<string>('/xfans/api/shares/getSellPriceAfterFee', {
    amount: BigNumber(amount).times(100).toFixed(),
    address,
  });
  return data;
}

/**
 * 钱包余额
 * @param address 对方的地址
 */
export async function getSharesBalance(address: string) {
  const data = await http.get<string>('/xfans/api/shares/sharesBalance', {
    address,
  });
  return data;
}

export async function buyShares(address: string, amount: number) {
  await http.post<null>('/xfans/api/shares/buy', {
    amount: BigNumber(amount).times(100).toFixed(),
    address,
  });
}

export async function sellShares(address: string, amount: number) {
  await http.post<null>('/xfans/api/shares/sell', {
    amount: BigNumber(amount).times(100).toFixed(),
    address,
  });
}

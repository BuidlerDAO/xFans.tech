import BigNumber from 'bignumber.js';

import { SHARE_UNIT_MODIFIER } from '../../constants';
import { contractRequestHttp as http } from '../request';

export async function getFloorPrice(address: string) {
  const data = await http.get<{ gasFee: string; price: string }>('/xfans/api/shares/getBuyPrice', {
    address,
    amount: '1',
  });
  return data.price;
}

export async function getBuyPrice(address: string, amount: number) {
  const data = await http.get<{ gasFee: string; price: string }>('/xfans/api/shares/getBuyPrice', {
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
    address,
  });
  return data;
}

export async function getBuyPriceAfterFee(address: string, amount: number) {
  const data = await http.get<string>('/xfans/api/shares/getBuyPriceAfterFee', {
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
    address,
  });
  return data;
}

export async function getSellPrice(address: string, amount: number) {
  const data = await http.get<{ gasFee: string; price: string }>('/xfans/api/shares/getSellPrice', {
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
    address,
  });
  return data;
}

export async function getSellPriceAfterFee(address: string, amount: number) {
  const data = await http.get<string>('/xfans/api/shares/getSellPriceAfterFee', {
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
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
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
    address,
  });
}

export async function sellShares(address: string, amount: number) {
  await http.post<null>('/xfans/api/shares/sell', {
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
    address,
  });
}

export async function getStakeBalance(address: string) {
  return await http.get<string>('/xfans/api/shares/stakeBalance', {
    address,
  });
}

export async function stake(address: string, amount: number) {
  return await http.post<string>('/xfans/api/shares/stake', {
    address,
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
  });
}

export async function unstake(address: string, amount: number) {
  return await http.post<string>('/xfans/api/shares/unstake', {
    address,
    amount: BigNumber(amount).times(SHARE_UNIT_MODIFIER).toFixed(),
  });
}
export async function transfer(address: string, amount: string) {
  await http.post<null>('/xfans/api/shares/transfer', {
    amount,
    address,
  });
}

export async function getSupply(address: string) {
  const supply = await http.get<string>('/xfans/api/shares/supply', {
    address,
  });

  return +supply / SHARE_UNIT_MODIFIER;
}

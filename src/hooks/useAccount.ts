import { useCallback, useEffect } from 'react';
import { useRequest } from 'ahooks';

import { getAccounts } from '../service/contract/user';
import { useUserInfo, useUserInvite } from '../service/user';
import useGlobalUserStore from '../store/useGlobalUserStore';
import useUserStore from '../store/useUserStore';

// 账户相关的全局状态
export default function useAccount() {
  const { accounts, balance } = useGlobalUserStore();
  const { userInfo, inviteInfo } = useUserStore((state) => ({ ...state }));
  const { run: getUserInfo } = useUserInfo();
  const { run: getUserInviteInfo } = useUserInvite();

  const { run: getWallet } = useRequest(() => getAccounts(), {
    manual: true,
    onSuccess(response) {
      useGlobalUserStore.setState({
        accounts: response.accounts,
        balance: response.balance,
        wETHBalance: response.weth_balance,
      });
    },
  });

  const refresh = useCallback(() => {
    getWallet();
    getUserInfo();
    getUserInviteInfo();
  }, [getUserInfo, getUserInviteInfo, getWallet]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    wallet: accounts[0],
    balance,
    userInfo,
    inviteInfo,
    refresh,
  };
}

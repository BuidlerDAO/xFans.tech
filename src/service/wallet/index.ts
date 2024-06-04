import { useRequest } from 'ahooks';

import useGlobalUserStore from '../../store/useGlobalUserStore';
import { contractRequestHttp } from '../request';

const useWalletAccounts = () => {
  const result = useRequest(() => contractRequestHttp.get('/xfans/api/user/accounts'), {
    manual: true,
    onSuccess(response: any) {
      useGlobalUserStore.setState({
        accounts: response.accounts,
        balance: response.balance,
      });
    },
  });

  return result;
};
type ClaimSuccessFunctionType = (x: any) => void;
type ClaimFailedFunctionType = () => void;

const useWalletClaimReward = (
  list: TweetRewardProps[] | null,
  success: ClaimSuccessFunctionType,
  failed: ClaimFailedFunctionType
) => {
  const result = useRequest(
    () =>
      contractRequestHttp.post('/xfans/api/pool/claim', {
        list: list,
      }),
    {
      manual: true,
      onSuccess: success,
      onError: failed,
    }
  );

  return result;
};

type PoolBalanceSuccessFunctionType = (x: any) => void;
type PoolBalanceFailedFunctionType = () => void;

const usePoolBalance = (
  success: PoolBalanceSuccessFunctionType,
  failed: PoolBalanceFailedFunctionType
) => {
  const result = useRequest(() => contractRequestHttp.post('/xfans/api/pool/getBalance'), {
    manual: true,
    onSuccess: (resp: any) => {
      if (resp.code === 0) {
        success(resp.balance ?? '0');
      } else {
        failed();
      }
    },
    onError: failed,
  });

  return result;
};

export { usePoolBalance, useWalletAccounts, useWalletClaimReward };

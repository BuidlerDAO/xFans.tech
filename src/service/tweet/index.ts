import { useRequest } from 'ahooks';

import useTweetStore from '../../store/useTweetStore';
import http, { ResultData } from '../request';

const useTweetList = () => {
  const result = useRequest<ResultData<ItemsResponse<TweetProps>>, TweetRequest[]>(
    (params) => http.get('/api/twitter/tweets', params),
    {
      manual: true,
      onSuccess(response) {
        useTweetStore.setState({
          tweetList: response.data.items,
        });
      },
    }
  );

  return result;
};

const useTweetReward = () => {
  const result = useRequest<ResultData<ItemsResponse<TweetRewardProps>>, unknown[]>(
    () => http.get('/api/twitter/rewards', { status: 1 }),
    {
      manual: true,
      onSuccess(response) {
        useTweetStore.setState({
          tweetRewardList: response.data.items,
        });
      },
    }
  );

  return result;
};

const useTweetRewardHistory = () => {
  const result = useRequest<ResultData<ItemsResponse<RewardHistoryProps>>, PageProps[]>(
    () => http.get('/api/twitter/reward/claim-history'),
    {
      manual: true,
      onSuccess(response) {
        useTweetStore.setState({
          rewardHistoryList: response.data.items,
        });
      },
    }
  );

  return result;
};

type VoteSuccessFunctionType = () => void;

const useTweetVote = (
  tweetId: string,
  tweetAuthorUsername: string,
  success: VoteSuccessFunctionType,
  error: VoteSuccessFunctionType
) => {
  const result = useRequest<ResultData<ItemsResponse<TweetRewardProps>>, unknown[]>(
    () =>
      http.post('/api/twitter/report', {
        tweetId: tweetId,
        tweetAuthorUsername: tweetAuthorUsername,
      }),
    {
      manual: true,
      onSuccess: success,
      onError: error,
    }
  );

  return result;
};

type BatchUserInfoSuccessFunctionType = (result: any) => void;
const useTweetBatchUserInfo = (
  twitterUsernames: string[],
  success: BatchUserInfoSuccessFunctionType,
  error: VoteSuccessFunctionType
) => {
  const result = useRequest<ResultData<ItemsResponse<TweetRewardProps>>, unknown[]>(
    () =>
      http.get('/api/user/batch', {
        twitterUsernames: JSON.stringify(twitterUsernames),
      }),
    {
      manual: true,
      onSuccess: success,
      onError: error,
    }
  );

  return result;
};

export { useTweetBatchUserInfo, useTweetList, useTweetReward, useTweetRewardHistory, useTweetVote };

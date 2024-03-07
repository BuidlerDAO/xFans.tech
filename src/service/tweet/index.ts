import { useRequest } from 'ahooks';

import useTweetStore from '../../store/useTweetStore';
import http, { ResultData } from '../request';

const useTweetList = () => {
  const result = useRequest<ResultData<ItemsResponse<TweetProps>>, TweetRequest[]>(
    () => http.get('/api/twitter/tweets'),
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
    () => http.get('/api/twitter/rewards'),
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

export { useTweetList, useTweetReward, useTweetRewardHistory };

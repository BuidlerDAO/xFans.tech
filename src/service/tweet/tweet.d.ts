export {};

declare global {
  export interface TweetRequest extends PageProps {
    /**
     * 推文作者的推特 id，传入将查询该作者所有推文数据
     */
    authorId?: number;
  }

  /**
   * xfans-be.internal.model.Tweet
   */
  export interface TweetProps {
    author?: TweetUserProps;
    authorId?: string;
    bookmarkCount?: number;
    createdAt?: number;
    id?: string;
    impressionCount?: number;
    likeCount?: number;
    quoteCount?: number;
    rank?: number;
    replyCount?: number;
    retweetCount?: number;
    reward?: string;
    scores?: number;
    stageId?: number;
    text?: string;
  }

  /**
   * xfans-be.internal.model.TweetReward
   */
  export interface TweetRewardProps {
    address?: string;
    createdAt?: number;
    claimedAt?: number;
    ethAmount?: string;
    isClaimed?: boolean;
    proof?: Array<string[]>;
    index?: number;
    creator?: string;
    totalRewardAmount?: string;
    tweetId?: string;
    rank?: string;
  }

  /**
   * xfans-be.internal.model.RewardHistory
   */
  export interface RewardHistoryProps {
    claimedAt?: number;
    creator?: string;
    rank?: number;
    rewardAmount?: string;
    totalRewardAmount?: string;
    ethAmount?: string;
  }

  /**
   * xfans-be.internal.model.UserProfile
   */
  export interface TweetUserProps {
    /**
     * 头像的url
     */
    avatar?: string;
    holders?: { [key: string]: any };
    holdValue?: { [key: string]: any };
    /**
     * 用户 id
     */
    id?: number;
    increaseRate24h?: { [key: string]: any };
    /**
     * 是否已激活
     */
    isActive?: boolean;
    price?: { [key: string]: any };
    rewardEarned?: { [key: string]: any };
    rewardUnClaimed?: { [key: string]: any };
    supply?: { [key: string]: any };
    tradingFeeEarned?: { [key: string]: any };
    tradingVolume?: { [key: string]: any };
    /**
     * 绑定的推特用户id
     */
    twitterId?: string;
    /**
     * 绑定的推特用户username
     */
    twitterUsername?: string;
    /**
     * 数据更新时间
     */
    updatedAt?: number;
    /**
     * 用户名
     */
    username?: string;
    /**
     * 用户钱包地址
     */
    walletAddress?: string;
  }
}

export {};

declare global {
  export interface ItemsResponse<T> {
    items: T[];
    total?: number;
  }

  export interface PageProps {
    limit?: number;
    offset?: number;
  }

  export interface ShareRequest {
    subject?: string;
    trader?: string;
  }
  /**
   * xfans-be.api.v1.GetTradesRes
   */
  export interface ShareResponse {
    items: ShareProps[];
  }

  /**
   * xfans-be.internal.model.ShareTrade
   */
  export interface ShareProps {
    createdAt?: number;
    ethAmount: string;
    isBuy?: boolean;
    network?: { [key: string]: any };
    pool?: number[];
    poolEthAmount?: { [key: string]: any };
    protocolEthAmount?: { [key: string]: any };
    shareAmount: string;
    subject?: number[];
    subjectEthAmount?: { [key: string]: any };
    subjectUser?: UserProfileProps;
    supply?: { [key: string]: any };
    trader?: number[];
    traderUser?: UserProfileProps;
    txHash?: number[];
  }

  /**
   * xfans-be.internal.model.UserProfile
   */
  export interface UserProfileProps {
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
    /**
     * 是否已激活
     */
    isActive?: boolean;
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
    [property: string]: any;
  }

  /**
   * xfans-be.internal.model.UserProfile
   */
  export interface TopUserProps {
    /**
     * 头像的url
     */
    avatar?: string;
    holders?: string;
    holdValue?: string;
    /**
     * 用户 id
     */
    id?: number;
    /**
     * 是否已激活
     */
    isActive?: boolean;
    rewardEarned?: string;
    rewardUnClaimed?: string;
    supply?: string;
    tradingFeeEarned?: string;
    tradingVolume?: string;
    price?: string;
    increaseRate24h?: string;
    /**
     * 绑定的推特用户id
     */
    twitterId?: number;
    /**
     * 绑定的推特用户username
     */
    twitterUsername?: string;
    /**
     * 数据更新时间
     */
    updatedAt?: number;
    createdAt?: number;
    /**
     * 用户名
     */
    username?: string;
    /**
     * 用户钱包地址
     */
    walletAddress?: string;
  }

  export interface HolderRequest extends PageProps {
    holder?: string;
    subject?: string;
  }

  /**
   * xfans-be.internal.model.ShareHold
   */
  export interface HolderProps {
    holder?: string;
    holderUser?: TopUserProps;
    shares?: string;
    subject?: string;
    subjectUser?: TopUserProps;
    updatedAt?: number;
    value?: string;
  }
}

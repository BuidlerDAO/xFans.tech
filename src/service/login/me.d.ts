export interface ProfileData {
  id: number;
  walletAddress: string;
  username: string;
  twitterId: string;
  twitterUsername: string;
  avatar: string;
  //   supply: Supply;
  //   holders: Holders;
  //   holdValue: HoldValue;
  //   tradingFeeEarned: TradingFeeEarned;
  //   tradingVolume: TradingVolume;
  //   rewardEarned: RewardEarned;
  //   rewardUnClaimed: RewardUnClaimed;
  isActive: boolean;
  isRegistered: boolean;
  isTaskFinished: boolean;
  updatedAt: number;
}

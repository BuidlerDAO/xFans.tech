/**
 * @file 全局状态，自动同步到 storage
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import ChainConfig, { Chain, ChainConfigType } from '../config/chainConfig';

export enum PageType {
  Login = 'login',
  Invite = 'invite',
  Congratulation = 'congratulation',
  Profile = 'profile',
  Wallet = 'wallet',
}

export interface GlobalStoreProps {
  page: PageType;
  token: string;
  isShowPrice: boolean;
  isShowDrawer: boolean;
  isGoFollow: boolean;
  isGoFollowVerify: boolean;
  isGoRetwittes: boolean;
  isGoRetwittesVerify: boolean;
  userInfo: UserInfo | null;
  goPage(page: PageType): void;
  logout(): void;
  userVote: Record<string, boolean> | null;
  chain: Chain;
}

const useGlobalStore = create<GlobalStoreProps>()(
  persist(
    (set, get) => ({
      page: PageType.Login,
      token: '',
      isShowPrice: false,
      isShowDrawer: false,
      userInfo: null,
      isGoFollow: false,
      isGoFollowVerify: false,
      isGoRetwittes: false,
      isGoRetwittesVerify: false,
      goPage(page: PageType) {
        set({ page });
      },
      logout() {
        set({
          token: '',
          page: PageType.Login,
        });
      },
      userVote: null,
      chain: Chain.Bera,
    }),
    {
      name: 'xfans-user-config',
    }
  )
);

export default useGlobalStore;

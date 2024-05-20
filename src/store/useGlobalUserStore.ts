import { create } from 'zustand';

interface GlobalUserStoreProps {
  accounts: string[];
  balance: string;
  wETHBalance: string;
}

const useGlobalUserStore = create<GlobalUserStoreProps>((set, get) => ({
  accounts: [],
  balance: '',
  wETHBalance: '',
}));

export default useGlobalUserStore;

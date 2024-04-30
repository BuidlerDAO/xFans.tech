export enum Chain {
  Arb = 'arb',
  Bera = 'bera',
}

export const chainNameMap = {
  [Chain.Arb]: 'Arb Sepolia',
  [Chain.Bera]: 'Bera Artio',
};

export interface ChainConfigType {
  vite_socket_base_url: string;
  vite_room_base_url: string;
  vite_contract_base_url: string;
  vite_base_url: string;
}

const chainConfig: Record<Chain, ChainConfigType> = {
  [Chain.Arb]: {
    vite_socket_base_url: import.meta.env.VITE_ARB_SOCKET_BASE_URL,
    vite_room_base_url: import.meta.env.VITE_ARB_ROOM_BASE_URL,
    vite_contract_base_url: import.meta.env.VITE_ARB_CONTRACT_BASE_URL,
    vite_base_url: import.meta.env.VITE_ARB_BASE_URL,
  },
  [Chain.Bera]: {
    vite_socket_base_url: import.meta.env.VITE_BERA_SOCKET_BASE_URL,
    vite_room_base_url: import.meta.env.VITE_BERA_ROOM_BASE_URL,
    vite_contract_base_url: import.meta.env.VITE_BERA_CONTRACT_BASE_URL,
    vite_base_url: import.meta.env.VITE_BERA_BASE_URL,
  },
};

export default chainConfig;

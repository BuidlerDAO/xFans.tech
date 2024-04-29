interface ChainConfigType {
  vite_socket_base_url: string;
  vite_room_base_url: string;
  vite_contract_base_url: string;
  vite_base_url: string;
}

const _chainConfig: Record<string, ChainConfigType> = {
  arb: {
    vite_socket_base_url: import.meta.env.VITE_ARB_SOCKET_BASE_URL!,
    vite_room_base_url: import.meta.env.VITE_ARB_ROOM_BASE_URL!,
    vite_contract_base_url: import.meta.env.VITE_ARB_CONTRACT_BASE_URL!,
    vite_base_url: import.meta.env.VITE_ARB_BASE_URL!,
  },
  bera: {
    vite_socket_base_url: import.meta.env.VITE_BERA_SOCKET_BASE_URL!,
    vite_room_base_url: import.meta.env.VITE_BERA_ROOM_BASE_URL!,
    vite_contract_base_url: import.meta.env.VITE_BERA_CONTRACT_BASE_URL!,
    vite_base_url: import.meta.env.VITE_BERA_BASE_URL!,
  },
};

let _currentChain = 'arb';
console.log('_chainConfig', _chainConfig);
const ChainConfig = () => {
  if (_currentChain == '') console.error('chain info undefined!');
  return _chainConfig[_currentChain];
};

export const getCurrentChain = () => _currentChain;
export const setCurrentChain = (chain: string) => {
  _currentChain = chain;
};

export default ChainConfig;

import React from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { Chain } from '../../config/chainConfig';
import useGlobalStore from '../../store/useGlobalStore';

const TSelect = () => {
  const { chain } = useGlobalStore();

  const handleInternalChange = (event: SelectChangeEvent<Chain>) => {
    const value = event.target.value as Chain;
    useGlobalStore.setState({ chain: value });
  };

  return (
    <Select<Chain>
      value={chain}
      onChange={handleInternalChange}
      style={{ minWidth: '120px', height: '60px' }}
    >
      <MenuItem value={Chain.Arb}>{Chain.Arb}</MenuItem>
      <MenuItem value={Chain.Bera}>{Chain.Bera}</MenuItem>
    </Select>
  );
};

export default TSelect;

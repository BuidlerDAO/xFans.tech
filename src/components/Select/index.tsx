import React from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { getCurrentChain } from '../../config/chainConfig';
interface TSelectProps {
  handleChange: (value: string) => void;
}

const TSelect: React.FC<TSelectProps> = ({ handleChange }) => {
  const [selectedValue, setSelectedValue] = React.useState(getCurrentChain());

  const handleInternalChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedValue(value);
    handleChange(value); // 调用传入的 handleChange 函数
  };

  return (
    <Select
      value={selectedValue}
      onChange={handleInternalChange}
      style={{ minWidth: '120px', height: '60px' }}
    >
      <MenuItem value="arb">arb</MenuItem>
      <MenuItem value="bera">bera</MenuItem>
    </Select>
  );
};

export default TSelect;

import React, { useState } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
interface TSelectProps {
  defaultValue: string;
  options: string[];
  onChange: (value: string) => void;
}

const TSelect: React.FC<TSelectProps> = ({ defaultValue, options, onChange }) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleInternalChange = (event: SelectChangeEvent<string>) => {
    const value = (event.target.value as string) ?? '';
    setCurrentValue(value);
    onChange(value);
  };

  return (
    <Select<string>
      value={currentValue}
      onChange={handleInternalChange}
      style={{
        height: '60px',
        borderRadius: 8,
        borderWidth: 0,
        borderColor: 'transparent',
        fontSize: '15px',
      }}
      className="bg-[#F7F9FA] py-[18px] pl-[10px] text-base font-medium text-[#1A1D1F]"
    >
      {options.map((option: string) => (
        <MenuItem value={option}>{option}</MenuItem>
      ))}
    </Select>
  );
};

export default TSelect;

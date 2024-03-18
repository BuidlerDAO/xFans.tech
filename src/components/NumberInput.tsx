import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { TextField } from '@mui/material';
import { debounce } from 'lodash';

const pattern = /^(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;

export type NumberInputRef = {
  reset(): void;
};

type NumberInputProps = {
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string;
  max?: number;
  min?: number;
  size?: 'small' | 'medium';
  onChange(value: number | null): void;
};
export default forwardRef<NumberInputRef, NumberInputProps>(function NumberInput(
  {
    max = Number.MAX_SAFE_INTEGER,
    min = Number.MIN_SAFE_INTEGER,
    onChange,
    ...restProps
  }: NumberInputProps,
  ref
) {
  const [value, setValue] = useState('');
  const debouncedOnChange = useRef(() => debounce(onChange, 200));
  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const nextValue = event.target.value;
    if (nextValue === '') {
      setValue('');
      if (nextValue !== value) {
        debouncedOnChange.current()(null);
      }
      return;
    }
    if (pattern.test(nextValue)) {
      const n = +nextValue;
      if (n <= max && n >= min) {
        setValue(nextValue);
        if (nextValue !== value) {
          debouncedOnChange.current()(n);
        }
      }
    }
  }
  useImperativeHandle(
    ref,
    () => {
      return {
        reset: () => {
          setValue('');
          debouncedOnChange.current()(null);
        },
      };
    },
    []
  );
  return <TextField value={value} onChange={handleChange} {...restProps} />;
});

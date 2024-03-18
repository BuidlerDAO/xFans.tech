import React from 'react';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { Button as MButton, ButtonProps } from '@mui/material/';
import { styled } from '@mui/material/styles';

const BasicStyleButton = styled(MButton)({
  border: '1px soild',
  borderColor: '#9A6CF9',
  color: '#A67CFE',
  backgroundColor: '#FFFFFF',
  borderRadius: '9999px',
  textTransform: 'none',
  lineHeight: '1.5',
  '&:hover': {
    borderColor: '#9A6CF9',
    backgroundColor: '#FFFFFF',
  },
});

const primaryStyle = {
  boxShadow: 'none',
  color: '#FFFFFF',
  backgroundColor: '#9A6CF9',
  borderRadius: '9999px',
  textTransform: 'none',
  lineHeight: '1.5',
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: '#9A6CF9',
  },
};

const PrimaryStyleButton = styled(MButton)(primaryStyle as any);

const PrimaryStyleLoadingButton = styled(LoadingButton)(primaryStyle as any);

const BasicButton = (props: ButtonProps) => {
  return (
    <BasicStyleButton variant="outlined" disableRipple {...props}>
      {props.children}
    </BasicStyleButton>
  );
};

const PrimaryButton = (props: ButtonProps) => {
  return (
    <PrimaryStyleButton variant="contained" disableRipple {...props}>
      {props.children}
    </PrimaryStyleButton>
  );
};

const PrimaryLoadingButton = (props: LoadingButtonProps) => {
  return (
    <PrimaryStyleLoadingButton variant="contained" disableRipple {...props}>
      {props.children}
    </PrimaryStyleLoadingButton>
  );
};

export { BasicButton, PrimaryButton, PrimaryLoadingButton };

export default MButton;

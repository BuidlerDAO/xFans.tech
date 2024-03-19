import React, { FC, useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { NextButton } from '../../components/buttons/loginButton';

import '../../tailwind.css';

const InviteCodeInput = styled(TextField)({
  width: '302px',
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
      borderRadius: '12px',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
      borderRadius: '12px',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
      borderRadius: '12px',
    },
  },
});

interface InvitePageProps {
  handleButtonClick: (inviteCode: string) => void; // 修改函数类型以接收邀请码作为参数
}

const InvitePage: FC<InvitePageProps> = ({ handleButtonClick }) => {
  const [inviteCode, setInviteCode] = useState(''); // 添加状态来存储邀请码

  const handleNextButtonClick = () => {
    // 在点击事件中获取输入值并调用传入的函数
    if (inviteCode.trim() !== '') {
      handleButtonClick(inviteCode); // 传递邀请码给父组件的函数
    } else {
      // 如果邀请码为空，可以在这里添加提示或者错误处理
      alert('Invite code is required.');
    }
  };
  return (
    <div className="min-h-screen w-full items-center justify-center px-[34px] text-center">
      <p className=" mt-[81px] text-center text-[32px] font-bold leading-[38px] text-[#0F1419]">
        Invite Code
      </p>
      <p className="my-[44px] mb-[44px]  text-center text-[14px] font-normal leading-[24px] text-[#5B7083]">
        To complete the registration you need to enter an invitation code, we released a small
        number of invitation codes during the beta period, see our tweets
      </p>
      <InviteCodeInput
        value={inviteCode}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInviteCode(e.target.value)}
        label="Please enter the invitation code"
        id="custom-css-outlined-input"
      />
      <div className="h-[44px]" />
      <NextButton variant="contained" disableElevation onClick={handleNextButtonClick}>
        Next
      </NextButton>
    </div>
  );
};

export default InvitePage;

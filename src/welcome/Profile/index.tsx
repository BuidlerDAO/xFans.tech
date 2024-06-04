/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

import SolanaIcon from '../../components/icons/SolanaIcon';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import useAccount from '../../hooks/useAccount';
import { useUserInfo } from '../../service/user';
import useProfileModal from '../../store/useProfileModal';

import Community from './Community';
import Explore from './Explore';
import Reward from './Reward';

const Profile = (props: { handleButtonClick?: () => void }) => {
  const [key, setKey] = useState('explore');
  const { run: getUserInfo } = useUserInfo();
  const { userInfo } = useAccount();
  const { openProfile } = useProfileModal((state) => ({ ...state }));

  const tapMap = [
    {
      title: 'explore',
      onClick: () => setKey('explore'),
    },
    {
      title: 'community',
      onClick: () => setKey('community'),
    },
    {
      title: 'reward',
      onClick: () => setKey('reward'),
    },
  ];

  function renderTabPane(key: string) {
    if (key === 'explore') return <Explore />;
    if (key === 'community') return <Community />;
    if (key === 'reward') return <Reward />;
    return null;
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between px-[15px] py-[10px]">
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn-fe.s3.amazonaws.com/xfans/20240328-153101.png"
            alt="logo"
            className="w-[32px] cursor-pointer rounded-full"
            onClick={() => window.open('https://xfans.tech', '_blank')}
          />
        </div>

        <div
          className="flex items-center text-[15px] text-[#919099] hover:cursor-pointer"
          onClick={() => openProfile(userInfo, 1)}
        >
          <span className="xfans-font-sf mr-1">Holding:</span>
          <SolanaIcon />
          <NumberDisplayer className="ml-1" text={userInfo?.holdValue} />
        </div>

        <div
          onClick={() => props.handleButtonClick?.()}
          className="flex cursor-pointer items-center justify-center rounded-full border border-black px-4 py-1 text-[15px] font-medium"
        >
          Wallet
        </div>
      </div>

      <div className="my-[14px] mx-4 flex items-center justify-between rounded-full bg-[#F8F4F0] py-[10px] px-[14px]">
        {tapMap.map((item, i) => (
          <div
            key={i}
            onClick={item.onClick}
            className={`flex w-[100px] items-center justify-center text-[15px] font-semibold capitalize ${
              key === item.title
                ? 'rounded-full bg-[#2C2A2A] px-[18px] py-[10px] text-[#FAFAFA]'
                : 'cursor-pointer text-[#0F1419]'
            }`}
          >
            {item.title}
          </div>
        ))}
      </div>

      {renderTabPane(key)}
    </div>
  );
};

export default Profile;

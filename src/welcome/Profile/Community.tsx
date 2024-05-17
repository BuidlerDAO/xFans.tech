import React, { useCallback, useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';

import { ListEmpty } from '../../components/Empty';
import { InfoCircle } from '../../components/icons/InfoCircle';
import Loading from '../../components/Loading';
import { SHARE_UNIT_MODIFIER } from '../../constants';
import useAccount from '../../hooks/useAccount';
import { getList } from '../../service/community';
import { getUnreadMessageCount, ReceiveMessage } from '../../service/room';
import { getTimeDistanceFromDate } from '../../utils';

import ChatRoomDrawer from './community/ChatRoomDrawer';
import StackModal from './community/StackModal';

type CommunityWithMessage = Community & {
  lastMsg?: ReceiveMessage;
  unreadCount?: number;
};

const Community = () => {
  const [lockedCommunities, setLockedCommunities] = useState<Community[] | null>(null);
  const [unlockedCommunities, setUnlockedCommunities] = useState<CommunityWithMessage[] | null>(
    null
  );
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const { wallet } = useAccount();

  const refresh = useCallback(() => {
    getList(0).then((data) => {
      setLockedCommunities(data);
    });
    getList(1).then((items: CommunityWithMessage[]) => {
      let len = 0;
      if (items.length === 0) {
        setUnlockedCommunities(items);
        return;
      }
      items.forEach((item) => {
        getUnreadMessageCount(wallet, item.subject).then((res) => {
          item.lastMsg = res.latestMsg;
          item.unreadCount = res.count;
          len++;
          if (len === items.length) {
            setUnlockedCommunities(items);
          }
        });
      });
    });
  }, [wallet]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleStakeModalClose(fromConfirm: boolean) {
    setSelectedCommunity(null);
    if (fromConfirm) refresh();
  }

  function renderUnlocked() {
    if (unlockedCommunities == null) return null;
    if (unlockedCommunities.length === 0)
      return (
        <div className="flex h-[250px] flex-col items-center">
          <ListEmpty className="mt-[50px]" />
          <p className="xfans-font-sf mt-[10px] text-[#00000080]">
            No unlocked communities available.
          </p>
        </div>
      );

    return (
      <ul className="min-h-[250px] flex-shrink-0">
        {unlockedCommunities.map((item, i) => (
          <li
            key={i}
            className={`px-1 py-[10px] ${
              i === unlockedCommunities.length - 1 ? '' : 'border-b border-b-[#EBEEF0]'
            }`}
            onClick={() => setSelectedCommunity(item)}
          >
            <div className="ml-3 flex cursor-pointer items-center">
              <img src={item.ownerUser.avatar} alt="" className="w-[44px] rounded-full" />
              <div className="ml-[28px] flex-1 overflow-hidden">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center">
                    <span className="w-[210px] text-sm font-medium text-black">
                      {item.ownerUser.username}&apos;s Community
                    </span>
                    <span className="ml-10 text-xs font-normal text-[#A1A1AA]">
                      {item.lastMsg?.createTime
                        ? getTimeDistanceFromDate(item.lastMsg?.createTime) + ' ago'
                        : ''}
                    </span>
                  </div>
                  <p className="h-[16px] max-w-[300px] truncate text-xs text-[#5B7083]">
                    {(item.unreadCount ?? 0) > 0 ? `[${item.unreadCount}]` : ''}
                    {item.lastMsg?.message ?? ''}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  function renderLocked() {
    if (lockedCommunities == null) return null;
    if (lockedCommunities.length === 0) return null;

    return (
      <>
        <div className="flex items-center justify-center text-center text-[15px] font-medium text-[#9A6CF9]">
          The Following Are Locked Communities
          <Tooltip title="To unlock the community features, fans need to collectively pledge more than 5 shares. Pledges can be revoked at any time, but if the total falls below 5 shares, the community will lock again while keeping chat data.">
            <span className="ml-[6px]">
              <InfoCircle />
            </span>
          </Tooltip>
        </div>

        <div>
          <ul className="mt-4 space-y-[10px]">
            {lockedCommunities.map((item, i) => (
              <li
                key={i}
                className="relative flex cursor-pointer items-center space-x-[14px] overflow-hidden rounded-[8px] bg-[#F7F9FA] py-2 px-3"
                onClick={() => setSelectedCommunity(item)}
              >
                <img src={item.ownerUser.avatar} alt="avatar" className="w-[44px] rounded-full" />
                <div className="flex w-full flex-col">
                  <span className="text-sm font-medium text-black">
                    {item.ownerUser.username}&apos;s Community
                  </span>
                  <div className="flex items-start justify-between">
                    <span className="text-xs text-[#5B7083]">
                      Unlock Requires Staking: {+item.requiredStakedShares / SHARE_UNIT_MODIFIER}
                    </span>
                    <span className="text-xs text-[#5B7083]">
                      Staked: {+item.stakedShares / SHARE_UNIT_MODIFIER}
                    </span>
                  </div>
                </div>
                <LockBackgroundIcon className="absolute top-0 left-[-14px]" />
                <LockIcon className="absolute top-[3px] left-[-11px]" />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
  if (lockedCommunities == null || unlockedCommunities == null) {
    return (
      <div className=" flex flex-1 flex-col items-center justify-center overflow-x-hidden px-4">
        <Loading />
      </div>
    );
  }
  if (lockedCommunities.length === 0 && unlockedCommunities.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <ListEmpty className="mt-[50px]" />
        <p className="xfans-font-sf mt-[10px] text-[#00000080]">
          You haven&apos;t bought any shares yet.
        </p>
      </div>
    );
  }
  return (
    <div className="xfans-scrollbar relative flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-4">
      {renderUnlocked()}
      {renderLocked()}
      {selectedCommunity && selectedCommunity.status === 0 && (
        <StackModal
          subject={selectedCommunity.subject}
          ownerName={selectedCommunity.ownerUser.username}
          onClose={handleStakeModalClose}
        />
      )}
      {
        <ChatRoomDrawer
          community={selectedCommunity && selectedCommunity.status === 1 ? selectedCommunity : null}
          open={selectedCommunity?.status === 1}
          onClose={() => {
            setSelectedCommunity(null);
            refresh();
          }}
        />
      }
    </div>
  );
};

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1007_12838)">
        <path
          d="M8.33333 4.58301H1.66667C1.43655 4.58301 1.25 4.76956 1.25 4.99967V8.74967C1.25 8.97979 1.43655 9.16634 1.66667 9.16634H8.33333C8.56345 9.16634 8.75 8.97979 8.75 8.74967V4.99967C8.75 4.76956 8.56345 4.58301 8.33333 4.58301Z"
          stroke="#0F1419"
          strokeWidth="0.833333"
          strokeLinejoin="round"
        />
        <path
          d="M2.91699 4.58301V2.91634C2.91699 1.76575 3.84974 0.833008 5.00033 0.833008C6.15091 0.833008 7.08366 1.76575 7.08366 2.91634V4.58301"
          stroke="#0F1419"
          strokeWidth="0.833333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 6.25V7.5"
          stroke="#0F1419"
          strokeWidth="0.833333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1007_12838">
          <rect width="10" height="10" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function LockBackgroundIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="17"
      viewBox="0 0 22 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0H22C22 9.38884 14.3888 17 5 17H0V0Z" fill="#BBBAFB" />
    </svg>
  );
}

export default Community;

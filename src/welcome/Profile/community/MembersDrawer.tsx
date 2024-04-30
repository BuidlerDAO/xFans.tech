/**
 * @file 成员列表
 */
import React, { useEffect } from 'react';
import { Drawer, Switch } from '@mui/material';
import { useRequest } from 'ahooks';

import ArrowBackIcon from '../../../components/icons/ArrowBackIcon';
import Loading from '../../../components/Loading';
import { success } from '../../../components/Toaster';
import { SHARE_UNIT_MODIFIER, XFANS_CONTENT_WIDTH } from '../../../constants';
import { blockUser, getUserList } from '../../../service/community';

import { ToasterMessageType } from './constants';

type Props = {
  open?: boolean;
  onClose(): void;
  subject?: string;
  isOwner: boolean;
};

export default function MembersDrawer({ isOwner = false, subject, open = false, onClose }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const {
    data: userList = [],
    loading,
    run: runGetUserList,
  } = useRequest(() => getUserList(subject!), {
    manual: true,
  });

  useEffect(() => {
    if (open) {
      runGetUserList();
    }
  }, [open, runGetUserList]);

  function renderContent() {
    if (loading) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Loading />
        </div>
      );
    }
    return (
      <div className="xfans-scrollbar flex-1 overflow-y-auto px-[16px]">
        {userList.map((item) => (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          <MemberItem
            key={item.address}
            disabled={!isOwner || item.address === subject}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            subject={subject!}
            user={item}
          />
        ))}
      </div>
    );
  }
  return (
    <Drawer
      sx={{
        width: XFANS_CONTENT_WIDTH,
        display: open ? 'block' : 'none',
        '& .MuiDrawer-paper': {
          width: XFANS_CONTENT_WIDTH,
          overflow: 'hidden',
          border: 'none',
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <div className="relative flex h-full flex-col bg-[#FDFDFD]">
        <header className="flex h-[64px] items-center justify-between px-[16px]">
          <div className="flex items-center font-bold text-[#0F1419]">
            <ArrowBackIcon className="cursor-pointer" onClick={onClose} />
            <span className="ml-[8px]">Members</span>
          </div>
        </header>
        {renderContent()}
      </div>
    </Drawer>
  );
}

function MemberItem({
  disabled,
  user,
  subject,
}: {
  disabled: boolean;
  subject: string;
  user: CommunityUserInfo;
}) {
  function handleSwitchChange(checked: boolean) {
    if (checked) {
      blockUser(subject, user.address, true).then(() => {
        success(ToasterMessageType.BlockSuccess);
      });
    } else {
      blockUser(subject, user.address, false).then(() => {
        success(ToasterMessageType.UnblockSuccess);
      });
    }
  }
  return (
    <div className="flex border-b border-[#EBEEF0] py-[8px] text-sm">
      <img className="h-[44px] w-[44px] rounded-full" src={user.avatar} alt="avatar" />
      <div className="ml-[14px] flex-1">
        <div className="font-bold text-[#0F1419]">{user.username}</div>
        <div className="text-[#919099]">
          <span className="text-sm">Holding</span>
          <span className="font- ml-[6px] text-base">{+user.shares / SHARE_UNIT_MODIFIER}</span>
        </div>
      </div>
      <div className="">
        <Switch
          disabled={disabled}
          defaultChecked={user.isBlocked}
          onChange={(_, checked) => handleSwitchChange(checked)}
        />
        <span className="font-medium text-[#0F1419]">Block</span>
      </div>
    </div>
  );
}

import React from 'react';
import { Drawer, Switch } from '@mui/material';

import ArrowBackIcon from '../../../components/icons/ArrowBackIcon';

type Props = {
  open?: boolean;
  onClose(): void;
};

export default function MembersDrawer({ open = false, onClose }: Props) {
  return (
    <Drawer
      sx={{
        width: '433px',
        '& .MuiDrawer-paper': {
          width: '433px',
          border: 'none',
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <div className="relative h-full bg-[#FDFDFD] px-[16px] pr-[13px]">
        <header className="flex h-[64px] items-center justify-between">
          <div className="flex items-center font-bold text-[#0F1419]">
            <ArrowBackIcon className="cursor-pointer" onClick={onClose} />
            <span className="ml-[8px]">Members</span>
          </div>
        </header>
        {/* TODO Search */}
        <MemberItem />
        <MemberItem />
        <MemberItem />
        <MemberItem />
        <MemberItem />
      </div>
    </Drawer>
  );
}

function MemberItem() {
  return (
    <div className="flex border-b border-[#EBEEF0] py-[8px] text-sm">
      <img
        className="h-[44px] w-[44px] rounded-full"
        src="https://cdn.oasiscircle.xyz/circle/4A5E15E2-2210-40AC-9778-FB5D7CC664A1.1706768249263.0xA0B5B5"
        alt="avatar"
      />
      <div className="ml-[14px] flex-1">
        <div className="font-bold text-[#0F1419]">Frank @frankmiao</div>
        <div className="text-[#919099]">
          <span className="text-sm">Hoinging</span>
          <span className="font- ml-[6px] text-base">5</span>
        </div>
      </div>
      <div className="">
        <Switch />
        <span className="font-medium text-[#0F1419]">Block</span>
      </div>
    </div>
  );
}

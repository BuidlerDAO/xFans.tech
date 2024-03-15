import React, { DragEvent, SVGProps, useState } from 'react';
import { Drawer } from '@mui/material';

import ArrowBackIcon from '../../../components/icons/ArrowBackIcon';

import MembersDrawer from './MembersDrawer';
import StackModal from './StackModal';

type Props = {
  open?: boolean;
  onClose(): void;
};

export default function ChatRoomDrawer({ open = false, onClose }: Props) {
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);
  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);
  return (
    <Drawer
      sx={{
        width: '433px',
        '& .MuiDrawer-paper': {
          width: '433px',
          overflow: 'hidden',
          border: 'none',
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <div className="relative h-full w-full bg-[#FDFDFD] px-[16px] pr-[13px]">
        <header className="flex h-[64px] items-center justify-between">
          <div className="flex items-center font-bold text-[#0F1419]">
            <ArrowBackIcon className="cursor-pointer" onClick={onClose} />
            <span className="ml-[8px]">Devon‘ Community</span>
          </div>
          <div className="flex leading-none">
            <div
              className="flex cursor-pointer items-center rounded-full border border-[#9A6CF9] px-[8px] py-[4px] font-medium"
              onClick={() => setIsMembersDrawerOpen(true)}
            >
              <MembersIcon /> <span className="ml-[2px] text-[#0F1419]">24</span>
            </div>
            <div
              className="ml-[18px] flex cursor-pointer items-center rounded-full border border-[#9A6CF9] px-[8px] py-[4px] font-medium"
              onClick={() => setIsStackModalOpen(true)}
            >
              <FireIcon /> <span className="ml-[2px] text-[#0F1419]">Stack</span>
            </div>
          </div>
        </header>
        <div>
          <MessageFromMeItem />
          <MessageFromOtherItem />
        </div>
        <SendMessageBox />
        {isStackModalOpen && <StackModal onClose={() => setIsStackModalOpen(false)} />}
        <MembersDrawer open={isMembersDrawerOpen} onClose={() => setIsMembersDrawerOpen(false)} />
      </div>
    </Drawer>
  );
}

function FireIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.892 4.29292C11.7389 4.79952 11.3589 6.57263 11.6123 7.58584C10.0924 5.81273 10.0924 3.91297 10.0924 1C5.27971 2.77311 6.41957 7.96579 6.29292 9.4856C5.15306 8.4724 4.89976 6.19268 4.89976 6.19268C3.63325 6.82594 3 8.59905 3 9.9922C3 13.4118 5.78632 16.0714 9.20589 16.0714C12.6255 16.0714 15.4118 13.2851 15.4118 9.9922C15.4118 7.96579 13.892 6.95259 13.892 4.29292Z"
        fill="#9A6CF9"
      />
    </svg>
  );
}

function MessageFromMeItem() {
  return (
    <div className="mt-[39px] flex items-start justify-end">
      <div className="flex flex-col items-end">
        <div className="max-w-[290px] rounded-[25px] rounded-tr-none bg-[#9A6CF9] p-[16px] text-white">
          Hello chatGPT,how are you today?
        </div>
        <span className="mt-[6px] text-xs text-[#A6A6A9]">Jan 05 2024, 14:32</span>
      </div>
      <img
        className="ml-[12px] w-[44px] rounded-full"
        src="https://cdn.oasiscircle.xyz/circle/4A5E15E2-2210-40AC-9778-FB5D7CC664A1.1706768249263.0xA0B5B5"
        alt="avatar"
      />
    </div>
  );
}
function MessageFromOtherItem() {
  return (
    <div className="mt-[39px] flex items-start">
      <img
        className="mr-[12px] w-[44px] rounded-full"
        src="https://cdn.oasiscircle.xyz/circle/4A5E15E2-2210-40AC-9778-FB5D7CC664A1.1706768249263.0xA0B5B5"
        alt="avatar"
      />
      <div className="flex flex-col">
        <div className="flex max-w-[290px] flex-col rounded-[25px] rounded-tl-none bg-[#EEEEEE] p-[16px]">
          <span className="text-xs text-[#B9B9BA]">Jan coo</span>
          <p className="text-[#505050]">
            There are many programming languages in the market that are used in designing and
            building websites, various applications and other tasks. All these languages are popular
            in their place and in the way they are used, and many programmers learn and use them.
          </p>
        </div>
        <span className="mt-[6px] text-xs text-[#A6A6A9]">Jan 05 2024, 14:32</span>
      </div>
    </div>
  );
}

function SendMessageBox() {
  const [img, setImg] = useState<string | null>(null);
  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    // 防止新窗口打开图片
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    if (files.length > 1) return;
    const file = files[0];
    const lastDotIndex = file.name.lastIndexOf('.');
    // 没有后缀的文件
    if (lastDotIndex === -1) return;
    const suffix = file.name.substring(lastDotIndex + 1);
    if (['jpg', 'png', 'jpeg'].indexOf(suffix) === -1) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImg(reader.result as string);
    };
  }
  return (
    <div
      className="w-[calc(100% - 32px)] absolute left-[16px] right-[16px] bottom-[24px] flex overflow-hidden rounded-[30px] bg-white"
      style={{ boxShadow: '5px 4px 20px 0px rgba(0, 0, 0, 0.13)' }}
      onDrop={handleDrop}
    >
      <div className="flex flex-1 flex-col py-[16px] px-[22px]">
        {img && (
          <div className="relative flex self-start">
            <img className="h-[90px] w-[90px]" src={img} alt="img" />
            <CloseIcon
              className="absolute top-0 right-0 cursor-pointer"
              onClick={() => setImg(null)}
            />
          </div>
        )}
        <textarea
          placeholder="Write your message"
          className="scrollbar-hide max-h-[180px] min-h-[56px] w-full resize-none bg-transparent p-0 outline-none"
        />
      </div>
      <div className="flex w-[80px] items-center pl-[16px]">
        <SendIcon />
      </div>
    </div>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="10" height="10" fill="black" fillOpacity="0.53" />
      <path
        d="M3.3335 3L7.00014 6.66665"
        stroke="white"
        strokeWidth="0.733329"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.3335 6.66665L7.00014 3"
        stroke="white"
        strokeWidth="0.733329"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      className="cursor-pointer"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.0703 8.51013L9.51026 4.23013C3.76026 1.35013 1.40026 3.71013 4.28026 9.46013L5.15026 11.2001C5.40026 11.7101 5.40026 12.3001 5.15026 12.8101L4.28026 14.5401C1.40026 20.2901 3.75026 22.6501 9.51026 19.7701L18.0703 15.4901C21.9103 13.5701 21.9103 10.4301 18.0703 8.51013ZM14.8403 12.7501H9.44026C9.03026 12.7501 8.69026 12.4101 8.69026 12.0001C8.69026 11.5901 9.03026 11.2501 9.44026 11.2501H14.8403C15.2503 11.2501 15.5903 11.5901 15.5903 12.0001C15.5903 12.4101 15.2503 12.7501 14.8403 12.7501Z"
        fill="#9A6CF9"
      />
    </svg>
  );
}

function MembersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.25 2.8125C13.0088 2.8125 14.4375 4.24125 14.4375 6C14.4375 7.75875 13.0088 9.1875 11.25 9.1875"
        stroke="#9A6CF9"
        strokeWidth="1.125"
        strokeMiterlimit="10"
      />
      <path
        d="M13.2744 11.4375C14.2944 11.4375 15.1832 12.12 15.4494 13.1063L16.1582 15.75"
        stroke="#9A6CF9"
        strokeWidth="1.125"
        strokeMiterlimit="10"
      />
      <path
        d="M7.125 9.1875C8.88541 9.1875 10.3125 7.76041 10.3125 6C10.3125 4.23959 8.88541 2.8125 7.125 2.8125C5.36459 2.8125 3.9375 4.23959 3.9375 6C3.9375 7.76041 5.36459 9.1875 7.125 9.1875Z"
        fill="#9A6CF9"
        stroke="#9A6CF9"
        strokeWidth="1.125"
        strokeMiterlimit="10"
      />
      <path
        d="M1.8457 15.75L2.55445 13.1063C2.81695 12.1238 3.70945 11.4375 4.72945 11.4375H9.5257C10.5457 11.4375 11.4345 12.12 11.7007 13.1063L12.4095 15.75"
        fill="#9A6CF9"
      />
      <path
        d="M1.8457 15.75L2.55445 13.1063C2.81695 12.1238 3.70945 11.4375 4.72945 11.4375H9.5257C10.5457 11.4375 11.4345 12.12 11.7007 13.1063L12.4095 15.75"
        stroke="#9A6CF9"
        strokeWidth="1.125"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

/**
 * @file 聊天室
 */
import React, { DragEvent, SVGProps, useCallback, useEffect, useRef, useState } from 'react';
import { Drawer } from '@mui/material';
import { useRequest, useThrottleFn } from 'ahooks';
import dayjs from 'dayjs';

import ArrowBackIcon from '../../../components/icons/ArrowBackIcon';
import Loading from '../../../components/Loading';
import useAccount from '../../../hooks/useAccount';
import { getMyInfo, getUserCount } from '../../../service/community';
import { ReceiveMessage, SendMessage } from '../../../service/room';
import { useTweetBatchUserInfo } from '../../../service/tweet';
import useProfileModal from '../../../store/useProfileModal';

import MembersDrawer from './MembersDrawer';
import StackModal from './StackModal';
import useRoom from './useRoom';

type Props = {
  community?: Community | null;
  open?: boolean;
  onClose(): void;
};

export default function ChatRoomDrawer({ open = false, community, onClose }: Props) {
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);
  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);
  const { wallet } = useAccount();
  const { messages, members, sendMessage, loadMessages } = useRoom(wallet, community?.subject);
  const ref = useRef<HTMLDivElement>(null);
  const { data: userCount = 0, run: runGetUserCount } = useRequest(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => getUserCount(community!.subject),
    {
      manual: true,
    }
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data: myInfo, run: runGetMyInfo } = useRequest(() => getMyInfo(community!.subject), {
    manual: true,
  });

  const [messageRendered, setMessageRendered] = useState(false);
  useEffect(() => {
    if (ref.current == null) return;
    if (messageRendered) {
      // 偷个懒，直接 timeout 等message render 完，后面换到子组件去做比较好
      setTimeout(() => {
        ref.current!.scrollTop = 999999999;
      }, 500);
      // }
    }
  }, [messageRendered, open]);
  useEffect(() => {
    if (open) {
      if (messages.length > 0 && messageRendered === false) {
        setMessageRendered(true);
      }
    } else {
      setMessageRendered(false);
    }
  }, [messageRendered, messages.length, open]);

  useEffect(() => {
    if (ref.current == null) return;
    const isNearBottom =
      // 150给的近似值
      ref.current.clientHeight + ref.current.scrollTop + 150 > ref.current.scrollHeight;
    if (messages.length > 0 && isNearBottom) {
      ref.current.scrollTop = 99999999999;
    }
  }, [messages.length]);

  useEffect(() => {
    if (open) {
      runGetUserCount();
      runGetMyInfo();
    }
  }, [open, runGetMyInfo, runGetUserCount]);

  const { run: handleScroll } = useThrottleFn(
    (env: React.UIEvent<HTMLDivElement, UIEvent>) => {
      if (ref.current == null) return;
      const modifier = 100;
      if (ref.current.scrollTop < modifier) {
        loadMessages('up', messages[0]?.id);
        return;
      }
      if (ref.current.clientHeight + ref.current.scrollTop + modifier > ref.current.scrollHeight) {
        loadMessages('down', messages[messages.length - 1]?.id);
        return;
      }
    },
    { wait: 500 }
  );

  function renderMessages() {
    if (members.length === 0) return <Loading />;
    if (members.length === 0) return <Loading />;
    return messages.map((msg) => {
      const senderUserInfo = members.find((member) => member.address === msg.sender);
      if (senderUserInfo == null) return null;
      if (msg.sender === wallet) {
        return <MessageFromMeItem key={msg.id} msg={msg} userInfo={senderUserInfo} />;
      }
      return <MessageFromOtherItem key={msg.id} msg={msg} userInfo={senderUserInfo} />;
    });
  }
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
      <div className="relative flex h-full w-full flex-col bg-[#FDFDFD]">
        <header className="flex h-[64px] items-center justify-between  px-[16px] ">
          <div className="flex items-center font-bold text-[#0F1419]">
            <ArrowBackIcon className="cursor-pointer" onClick={onClose} />
            <span className="ml-[8px]">{community?.ownerUser.username}&apos;s Community</span>
          </div>
          <div className="flex leading-none">
            <div
              className="flex cursor-pointer items-center rounded-full border border-[#9A6CF9] px-[8px] py-[4px] font-medium"
              onClick={() => setIsMembersDrawerOpen(true)}
            >
              <MembersIcon /> <span className="ml-[2px] text-[#0F1419]">{userCount}</span>
            </div>
            <div
              className="ml-[18px] flex cursor-pointer items-center rounded-full border border-[#9A6CF9] px-[8px] py-[4px] font-medium"
              onClick={() => setIsStackModalOpen(true)}
            >
              <FireIcon /> <span className="ml-[2px] text-[#0F1419]">Stake</span>
            </div>
          </div>
        </header>
        <div
          ref={ref}
          className="xfans-scrollbar relative flex flex-1 flex-col items-center justify-center overflow-y-auto px-[16px]"
          onScroll={handleScroll}
        >
          {renderMessages()}
        </div>
        <SendMessageBox disabled={myInfo?.isBlocked} sendMessage={sendMessage} />
        {isStackModalOpen && community && (
          <StackModal community={community} onClose={() => setIsStackModalOpen(false)} />
        )}
        <MembersDrawer
          isOwner={myInfo?.address === community?.subject}
          open={isMembersDrawerOpen}
          subject={community?.subject}
          onClose={() => setIsMembersDrawerOpen(false)}
        />
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

type MessageItemProps = {
  msg: ReceiveMessage;
  userInfo: CommunityUserInfo;
};

function MessageFromMeItem({ msg, userInfo }: MessageItemProps) {
  const { openProfile } = useProfileModal();
  const { run: batchUserInfo } = useTweetBatchUserInfo(
    [userInfo.username],
    (result) => {
      const twitterUserInfo = result?.data?.items?.[0];
      if (twitterUserInfo == null) return;
      openProfile(twitterUserInfo, 1);
    },
    () => undefined
  );
  function handleAvatarClick() {
    batchUserInfo();
  }
  return (
    <div className="mt-[39px] flex w-full items-start justify-end">
      <div className="flex flex-col items-end">
        <div className="max-w-[290px] rounded-[25px] rounded-tr-none bg-[#9A6CF9] p-[16px] text-sm text-white">
          {msg.image && <img src={msg.image} alt="pic" className="mb-[16px]" />}
          {msg.message}
        </div>
        <span className="mt-[6px] text-xs text-[#A6A6A9]">
          {dayjs(msg.createTime).format('YYYY/MM/DD HH:mm')}
        </span>
      </div>
      <img
        onClick={handleAvatarClick}
        className="ml-[12px] w-[44px] cursor-pointer rounded-full"
        src={userInfo.avatar}
        alt="avatar"
      />
    </div>
  );
}
function MessageFromOtherItem({ msg, userInfo }: MessageItemProps) {
  const { openProfile } = useProfileModal();
  const { run: batchUserInfo } = useTweetBatchUserInfo(
    [userInfo.username],
    (result) => {
      const twitterUserInfo = result?.data?.items?.[0];
      if (twitterUserInfo == null) return;
      openProfile(twitterUserInfo, 1);
    },
    () => undefined
  );
  function handleAvatarClick() {
    batchUserInfo();
  }
  return (
    <div className="mt-[39px] flex w-full items-start">
      <img
        onClick={handleAvatarClick}
        className="mr-[12px] w-[44px] cursor-pointer rounded-full"
        src={userInfo.avatar}
        alt="avatar"
      />
      <div className="flex flex-col">
        <div className="flex max-w-[290px] flex-col rounded-[25px] rounded-tl-none bg-[#EEEEEE] p-[16px]">
          <span className="text-xs text-[#B9B9BA]">{userInfo.username}</span>
          <div className="text-sm text-[#505050]">
            {msg.image && <img src={msg.image} alt="pic" className="mb-[16px]" />}
            {msg.message}
          </div>
        </div>
        <span className="mt-[6px] text-xs text-[#A6A6A9]">
          {dayjs(msg.createTime).format('YYYY/MM/DD HH:mm')}
        </span>
      </div>
    </div>
  );
}

type SendMessageBoxProps = {
  disabled?: boolean;
  sendMessage(message: SendMessage): void;
};
function SendMessageBox({ sendMessage, disabled = false }: SendMessageBoxProps) {
  const [img, setImg] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
  const handleSendMessage = useCallback(() => {
    if (textareaRef.current == null) return;
    const message = textareaRef.current.value.trim();
    if (message == null || message === '') return;
    sendMessage({
      message,
      image: img ?? undefined,
      timestamp: Date.now(),
    });
    textareaRef.current.value = '';
    setImg(null);
  }, [img, sendMessage]);

  function handlePast(event: React.ClipboardEvent<HTMLElement>) {
    const data = event.clipboardData;
    const items: DataTransferItem[] = [];
    for (const item of data.items) {
      if (['image/png', 'image/jpg', 'image/jpeg'].includes(item.type)) {
        items.push(item);
      }
    }
    if (items.length === 0) {
      return;
    }
    // 暂只支持第一个
    const item = items[0];
    // 如果第一个不是图片不处理
    if (item.type.indexOf('image') === -1) return;
    const reader = new FileReader();
    const file = item.getAsFile();
    if (file == null) return;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImg(reader.result as string);
    };
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea == null) return;
    function handle(env: KeyboardEvent) {
      // code 会在中文输入法按下 enter 的时候也触发，所以特地使用 keyCode，不要改动
      if (env.keyCode === 13) {
        handleSendMessage();
      }
    }
    textarea.addEventListener('keydown', handle);
    return () => {
      textarea.removeEventListener('keydown', handle);
    };
  }, [handleSendMessage]);
  return (
    <div
      className="w-[calc(100% - 32px)] relative mx-[16px] mt-[16px] mb-[24px] flex overflow-hidden rounded-[30px] bg-white"
      style={{ boxShadow: '5px 4px 20px 0px rgba(0, 0, 0, 0.13)' }}
      onDrop={handleDrop}
    >
      {disabled && (
        <div className="absolute flex h-full w-full select-none items-center bg-white/50 pl-[22px] text-[#F4245E]">
          You have been banned from speaking.
        </div>
      )}
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
          ref={textareaRef}
          placeholder={disabled ? '' : 'Write your message'}
          rows={1}
          onPaste={handlePast}
          className="scrollbar-hide max-h-[180px] w-full resize-none bg-transparent p-0 outline-none"
        />
      </div>
      <div className="flex w-[80px] items-center pl-[16px]">
        <SendIcon onClick={handleSendMessage} />
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

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
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

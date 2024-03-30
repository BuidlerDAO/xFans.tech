import { useCallback, useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';

import { error } from '../../../components/Toaster';
import { getMessagesByRoom, ReceiveMessage, SendMessage } from '../../../service/room';
import useGlobalStore from '../../../store/useGlobalStore';

import { ToasterMessageType } from './constants';

export default function useRoom(user: string, room?: string) {
  const [messages, setMessages] = useState<ReceiveMessage[]>([]);
  const [socket, setSocket] = useState<Socket>();
  const [members, setMembers] = useState<CommunityUserInfo[]>([]);

  // 建立 socket
  useEffect(() => {
    if (room == null) return;
    const socket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
      autoConnect: false,
      extraHeaders: {
        Authorization: 'Bearer ' + useGlobalStore.getState().token,
      },
      query: { user, room },
    });
    socket.connect();
    setSocket(socket);
    return () => {
      setMessages([]);
      setMembers([]);
      socket.disconnect();
    };
  }, [room, user]);

  useEffect(() => {
    function handle() {
      error(ToasterMessageType.BannedFromSpeaking);
    }
    socket?.on('unauthorized', handle);
    return () => {
      socket?.off('unauthorized', handle);
    };
  }, [socket]);

  // 处理新消息
  useEffect(() => {
    function handleMessage(data: ReceiveMessage) {
      // 标记已读
      socket?.emit('readMessage', { id: data.id });
      setMessages((msgs) => [...msgs, data].sort((a, b) => +a.id - +b.id));
    }
    socket?.on('newMessage', handleMessage);
    return () => {
      socket?.off('newMessage', handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    function handle(data: CommunityUserInfo[]) {
      setMembers(data);
    }
    socket?.on('members', handle);
    return () => {
      socket?.off('members', handle);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (nextMessage: SendMessage) => {
      socket?.emit('sendMessage', {
        ...nextMessage,
        uuid: `${room}_${nanoid()}_${Date.now()}`,
        timestamp: Date.now(),
      });
    },
    [room, socket]
  );

  const loadMessages = useCallback(
    (direction: 'up' | 'down' = 'up', messageId?: string) => {
      if (room == null) return;
      const orderMap = {
        up: 'desc',
        down: 'asc',
      } as const;
      getMessagesByRoom(room, {
        messageId,
        count: 100,
        order: orderMap[direction],
      }).then((newMsgs) => {
        if (direction === 'up') {
          setMessages((msgs) => [...msgs, ...newMsgs].sort((a, b) => +a.id - +b.id));
        } else {
          setMessages((msgs) => [...newMsgs, ...msgs].sort((a, b) => +a.id - +b.id));
        }
      });
    },
    [room]
  );

  // 进入房间先加载最新100条
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    members,
    sendMessage,
    loadMessages,
  };
}

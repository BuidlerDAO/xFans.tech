import { useCallback, useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';

import { error } from '../../../components/Toaster';
import ChainConfig from '../../../config/chainConfig';
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
    const socket = io(ChainConfig().vite_socket_base_url, {
      autoConnect: false,
      extraHeaders: {
        Authorization: 'Bearer ' + useGlobalStore.getState().token,
      },
      query: { user, room },
    });
    socket.connect();
    socket.on('connect', () => {
      setSocket(socket);
    });
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
      if (socket == null) return;
      // connected 是 false 说明不是当前 socket，等新 socket 连接上再发
      if (socket.connected === false) return;
      const orderMap = {
        up: 'desc',
        down: 'asc',
      } as const;
      getMessagesByRoom(room, {
        messageId,
        count: 50,
        order: orderMap[direction],
      }).then((newMsgs) => {
        if (newMsgs.length === 0) return;
        newMsgs.forEach((msg) => {
          socket?.emit('readMessage', { id: msg.id });
        });
        if (direction === 'up') {
          setMessages((msgs) => [...msgs, ...newMsgs].sort((a, b) => +a.id - +b.id));
        } else {
          setMessages((msgs) => [...newMsgs, ...msgs].sort((a, b) => +a.id - +b.id));
        }
      });
    },
    [room, socket]
  );

  // 进入房间先加载历史消息
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

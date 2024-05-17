import React, { ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Store } from '@eduardoac-skimlinks/webext-redux';
import { XFANS_TOKEN } from '../constants';
import { proxyStore as store } from '../app/proxyStore';
import useGlobalStore from '../store/useGlobalStore';

import { addTwitterComponent, addUserPagePriceComponent } from './addToTwitterHome';
import { FIRST_INSTALL_TASK } from '../constants';
import Content from './Content';

import '../tailwind.css';

withProxyStore(<Content />, store).then((component) => {
  const container = document.createElement('div');
  container.id = 'xfans-root';
  document.body.append(container);
  createRoot(container).render(component);

  function whereIsUser(): string {
    // 获取当前页面的 URL
    const currentUrl = window.location.href.toLowerCase();
    const urlWordLength = currentUrl.split('/').length;
    const lastWord = currentUrl.split('/')[urlWordLength - 1];

    const doNotCheckPathList = ['notifications', 'messages', 'i'];
    // 判断当前页面的 URL 是否符合一般的用户主页 URL 格式
    if (
      (currentUrl.includes('https://twitter.com/') || currentUrl.includes('https://x.com/')) &&
      urlWordLength === 4 &&
      lastWord === 'home'
    ) {
      return 'home';
    } else if (urlWordLength === 4 && !doNotCheckPathList.includes(lastWord)) {
      return 'userPage';
    } else {
      return 'unknown';
    }
  }

  // 延迟执行的代码 3000毫秒后执行，即3秒
  setTimeout(() => {
    setInterval(() => {
      // 使用示例
      const userIsOnProfilePage = whereIsUser();
      const { token } = useGlobalStore.getState();
      if (!token) return;

      if (userIsOnProfilePage === 'home') {
        addTwitterComponent();
      } else if (userIsOnProfilePage === 'userPage') {
        addTwitterComponent();
        addUserPagePriceComponent();
      }
    }, 1000); // 每秒执行一次

    // 也可以根据需要设置 clearInterval
    // clearInterval(intervalId);
  }, 3000);
});

async function withProxyStore(children: ReactElement, proxyStore: Store): Promise<ReactElement> {
  return proxyStore.ready().then(() => {
    return <Provider store={proxyStore}>{children}</Provider>;
  });
}

// 监听来自 Background 脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === FIRST_INSTALL_TASK) {
    console.log('monitoring Background script messages');
    useGlobalStore.getState().logout();
    /*
    说明：
    1. 如果在用户删除插件的时候，刚刚登陆过了插件，插件上会残留xfans_token的值，在我们的登录流程中，我们正是通过这个值，写入到globalStore的token值中。
    2. 首次登录的时候，需要移除这个上一次登录产生的xfans_token的值，不然的话会触发自动登录逻辑。
    */
    const url = new URL(window.location.href); // 获取当前URL
    url.searchParams.delete(XFANS_TOKEN); // 删除指定的查询参数
    // 使用 history.replaceState 更新 URL
    window.history.replaceState(null, '', url.toString());
  }

  // 如果消息不需要异步处理，直接返回 true
  return true; // 如果异步处理，需要调用 sendResponse
});

// content_script.js
chrome.runtime.sendMessage({ type: 'content_script_loaded' }, function (response) {
  // 其他逻辑...
  console.log('content script loaded');
});

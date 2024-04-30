import * as React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';

import * as toaster from '../../components/Toaster';
import { XFANS_CONTENT_WIDTH } from '../../constants';
import { XFANS_TOKEN } from '../../constants';
import { ProfileData } from '../../service/login/me';
import { TwitterOauth2Data } from '../../service/login/twiterOuth2';
import http, { ResultData } from '../../service/request';
import useGlobalStore, { PageType } from '../../store/useGlobalStore';
import { caculateBackWidth, caculateDrawerWidth } from '../../utils';
import Profile from '../../welcome/Profile';
import Wallet from '../../welcome/Wallet';
import ProfileModal from '../../welcome/Wallet/Profile';
import CongratulationPage from '../loginPage/congratulationPage';
import InvitePage from '../loginPage/invitePage';
import SignInWithXPage from '../loginPage/signInWithXPage';

import LogoButton from './logoButton';

import '../../tailwind.css';

export default function PersistentDrawerRight() {
  const { isShowDrawer, goPage, page, logout } = useGlobalStore((state) => ({ ...state }));

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [drawerWidth, setDrawerWidth] = React.useState(caculateDrawerWidth());
  const [backWidth, setBackWidth] = React.useState(caculateBackWidth());

  const handleDrawerOpen = () => {
    useGlobalStore.setState({
      isShowDrawer: true,
    });
  };

  const handleDrawerClose = () => {
    useGlobalStore.setState({
      isShowDrawer: false,
    });
  };

  const handleResize = () => {
    // 当窗口大小变化时，更新 width 的值
    if (drawerWidth !== caculateDrawerWidth()) {
      setDrawerWidth(caculateDrawerWidth());
    }
    if (backWidth !== caculateBackWidth()) {
      setBackWidth(caculateBackWidth());
    }
  };

  // 动态更新width
  React.useEffect(() => {
    const timer = setInterval(() => {
      handleResize();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    // 添加窗口大小变化时的事件监听器
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);

    handleResize();

    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, []);

  React.useEffect(() => {
    // 再获取url中的token 作为第一优先级
    const urlParams = new URLSearchParams(window.location.search);
    const xfansToken = urlParams.get(XFANS_TOKEN);
    if (xfansToken) {
      // 登录看是否有效，拿到 invite 状态
      useGlobalStore.setState({ token: xfansToken });
      checkProfileData();
    } else {
      // 获取 xfans_token 参数的值
      const localStorageToken = useGlobalStore.getState().token;
      if (localStorageToken && localStorageToken.length > 0) {
        // 已经有 token 的情况，登录判断 invite 状态
        useGlobalStore.setState({ token: localStorageToken });
        checkProfileData();
      }
    }

    // 检查xfans写入localStorage的twitterid跟twitter写在cookie里的twitterid是否匹配，不匹配则退出登录
    // 针对登出或者切换账号的情况
    // setInterval(() => {
    //   // 当处于登陆状态中的时候，自动logout不触发。
    //   if (
    //     window.location.href.includes(XFANS_TOKEN) ||
    //     window.location.href.includes(XFANS_CHECK_RETWEET) ||
    //     window.location.href.includes(XFANS_TWITTER_HOMEPAGE)
    //   ) {
    //     return;
    //   }
    //   const userInfo = useGlobalStore.getState().userInfo;
    //   if (userInfo && userInfo?.twitterId && userInfo?.twitterId?.length > 0) {
    //     // 读取所有的 cookie
    //     const cookies = document.cookie;
    //     // 将获取的 cookie 字符串转换为对象形式
    //     const cookieObj = Object.fromEntries(
    //       cookies.split(';').map((cookie) => cookie.trim().split('='))
    //     );
    //     const cookieTwid = decodeURIComponent(cookieObj.twid)?.split('=')?.[1];
    //     if (userInfo?.twitterId !== cookieTwid) {
    //       logout();
    //     }
    //   }
    // }, 1000);
  }, []);

  const initURLMonitor = () => {
    // 定义您要监控的 URL
    const switchUrl = 'https://api.twitter.com/1.1/account/multi/switch.json';
    const logoutUrl = 'https://api.twitter.com/1.1/account/logout.json';
    const taskUrl = 'https://api.twitter.com/1.1/account/task.json';

    // 创建 PerformanceObserver
    const observer = new PerformanceObserver((list) => {
      // 获取所有资源性能条目
      const entries = list.getEntriesByType('resource');

      // 遍历每个性能条目
      for (const entry of entries) {
        // 检查资源的 URL 是否与您关心的 URL 匹配
        if (
          entry.name.includes(switchUrl) ||
          entry.name.includes(logoutUrl) ||
          entry.name.includes(taskUrl)
        ) {
          console.log('Detected request to switch account:', entry.name);
          console.log('Timing information:', entry);
          // 登出
          logout();
        }
      }
    });

    // 开始观察 performance 对象中的 resource 类型数据
    observer.observe({ type: 'resource', buffered: true });
  };

  initURLMonitor();

  const checkProfileData = async () => {
    // https://test-xfans-api.d.buidlerdao.xyz/api/user/me
    const profileData = (await http.get(`/api/user/me`)) as ResultData<ProfileData>;
    if (profileData.code === 0) {
      if (profileData.data.isActive) {
        goPage(PageType.Profile);
        return 'active';
      } else if (!profileData.data.isRegistered) {
        goPage(PageType.Invite);
        return 'waiting invite code';
      } else if (!profileData.data.isTaskFinished) {
        goPage(PageType.Congratulation);
        return 'waiting task';
      } else {
        goPage(PageType.Congratulation);
        return 'waiting task';
      }
    }
    return profileData.message;
  };

  const clickLogin = async () => {
    setLoginLoading(true);

    // 跳转 login link https://test-xfans-api.d.buidlerdao.xyz/api/user/twitter-oauth2
    const link = (await http.get(`/api/user/twitter-oauth2`)) as ResultData<TwitterOauth2Data>;
    console.log(link);
    if (link.code === 0) {
      window.location.href = link.data.authorizationUrl;
    }
  };

  const clickRegisterInviteCode = async (inviteCode: string) => {
    const activateData = (await http.post(`api/user/register`, {
      inviteCode: inviteCode,
    })) as ResultData;
    if (activateData.code === 0) {
      toaster.success(toaster.ToastMessage.CONGRATULATION);
      goPage(PageType.Congratulation);
    } else {
      toaster.error(toaster.ToastMessage.INVITE_CODE_ERROR);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ProfileModal />
      <LogoButton aria-label="open xfans" onClick={handleDrawerOpen} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& > .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={isShowDrawer}
      >
        <div className="flex h-full w-full overflow-hidden">
          <div
            className={`mx-[2px] mt-[37px] flex h-[24px] flex-1 flex-shrink-0 justify-end`}
            style={{
              width: backWidth,
            }}
          >
            <ChevronRightIcon
              onClick={handleDrawerClose}
              className="m-0 mr-0 w-[24px] cursor-pointer"
            />
          </div>
          <Divider orientation="vertical" flexItem />
          <div
            className="min-h-screen shrink-0"
            style={{ width: XFANS_CONTENT_WIDTH + 'px', flexBasis: XFANS_CONTENT_WIDTH + 'px' }}
          >
            {page === PageType.Login && (
              <SignInWithXPage
                showLoading={loginLoading}
                handleButtonClick={() => {
                  // reset follow status
                  useGlobalStore.setState({
                    isGoFollow: false,
                    isGoFollowVerify: false,
                  });
                  clickLogin();
                }}
              />
            )}
            {page === PageType.Invite && (
              <InvitePage handleButtonClick={(inviteCode) => clickRegisterInviteCode(inviteCode)} />
            )}
            {page === PageType.Congratulation && (
              <CongratulationPage goProfile={() => goPage(PageType.Profile)} />
            )}
            {page === PageType.Profile && (
              <Profile handleButtonClick={() => goPage(PageType.Wallet)} />
            )}
            {page === PageType.Wallet && (
              <Wallet back={() => goPage(PageType.Profile)} logout={logout} />
            )}
          </div>
        </div>
      </Drawer>
    </Box>
  );
}

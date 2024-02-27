import * as React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

import XXWeb3Auth from '../../auth/Auth';
import { ProfileData } from '../../service/login/me';
import { TwitterOauth2Data } from '../../service/login/twiterOuth2';
import http, { ResultData } from '../../service/request';
import useGlobalStore from '../../store/useGlobalStore';
import Profile from '../../welcome/Profile';
import Wallet from '../../welcome/Wallet';
import ProfileModal from '../../welcome/Wallet/Profile';
import CongratulationPage from '../loginPage/congratulationPage';
import InvitePage from '../loginPage/invitePage';
import SignInWithXPage from '../loginPage/signInWithXPage';

import LogoButton from './logoButton';

import '../../tailwind.css';

const drawerWidth = 463;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  // flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: 'relative',
}));

export default function PersistentDrawerRight() {
  const [open, setOpen] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [pageState, setPageState] = React.useState('login');
  const [web3Auth, setWeb3Auth] = React.useState<XXWeb3Auth | null>(null);
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(false);

  React.useEffect(() => {
    // 获取当前 URL 中的参数
    const urlParams = new URLSearchParams(window.location.search);
    const xfansToken = urlParams.get('xfans_token');

    console.log(xfansToken);

    // 获取 xfans_token 参数的值
    const localStorageToken = localStorage.getItem('xfans-token');

    const loginState = localStorage.getItem('xfans-login-state');
    const shouldOpenStateList: string[] = ['waitingRedirect', 'waitingInvite'];

    if (shouldOpenStateList.includes(String(loginState))) {
      setOpen(true);
    }
    if (localStorageToken && localStorageToken.length > 0) {
      // 已经有 token 的情况，登录判断 invite 状态
      useGlobalStore.setState({ token: localStorageToken });
      checkProfileData();
    } else {
      // 没有 token 的状态，检查 url 是否存在 token
      if (xfansToken) {
        // 登录看是否有效，拿到 invite 状态
        useGlobalStore.setState({ token: xfansToken });
        localStorage.setItem('xfans-token', xfansToken);
        clickLogin();
      }
    }
  }, []);

  React.useEffect(() => {
    if (pageState === 'profile') {
      // 当pageState等于'profile'时执行的代码
      console.log('Page state is profile, executing specific code...');

      const initWeb3AuthIfNeeded = async () => {
        if (web3Auth === null) {
          setWeb3Auth(await new XXWeb3Auth().init());
        }
        setLoggedIn(web3Auth?.isLoggedIn() ?? false);
      };
      // 初始化web3Auth
      initWeb3AuthIfNeeded();
    }
  }, [pageState]);

  const checkProfileData = async () => {
    // https://test-xfans-api.d.buidlerdao.xyz/api/user/me
    const profileData = (await http.get(`/api/user/me`)) as ResultData<ProfileData>;
    if (profileData.code === 0) {
      if (profileData.data.isActive) {
        setPageState('profile');
        return 'active';
      } else {
        setPageState('invite');
        return 'waiting invite';
      }
    } else {
      return profileData.message;
    }
  };

  const clickLogin = async () => {
    setLoginLoading(true);
    // 设置 waiting redirect 缓存
    localStorage.setItem('xfans-login-state', 'waitingRedirect');

    // 跳转 login link https://test-xfans-api.d.buidlerdao.xyz/api/user/twitter-oauth2
    const link = (await http.get(`/api/user/twitter-oauth2`)) as ResultData<TwitterOauth2Data>;
    console.log(link);
    if (link.code === 0) {
      window.location.href = link.data.authorizationUrl;
    }
  };

  const clickActivate = async (inviteCode: string) => {
    // https://test-xfans-api.d.buidlerdao.xyz/api/user/activate
    const activateData = (await http.post(`api/user/activate`, {
      inviteCode: inviteCode,
    })) as ResultData;
    if (activateData.code === 0) {
      useGlobalStore.setState({
        message: 'congratulation!',
        messageType: 'success',
        messageOpen: true,
      });
      setPageState('congratulation');
    } else {
      useGlobalStore.setState({
        message: 'invite code error',
        messageType: 'error',
        messageOpen: true,
      });
    }
  };

  const handleWalletButtonClick = async () => {
    await web3Auth?.login();
    setLoggedIn(web3Auth?.isLoggedIn() ?? false);
    if (loggedIn) {
      setPageState('wallet');
    } else {
      console.log('wallet login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ProfileModal />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerOpen}
        disableRipple
        sx={{ ...(open && { display: 'none' }) }}
      >
        {/* <MenuIcon className="rounded-full m-0 w-[24px] h-[24px] cursor-pointer" /> */}
        <LogoButton />
      </IconButton>
      <Main open={open}></Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <div className="flex">
          <div className="h-[24px] w-[24px] mt-[37px] mx-[2px]">
            <ChevronRightIcon onClick={handleDrawerClose} className="m-0 w-[24px] cursor-pointer" />
          </div>
          <Divider orientation="vertical" flexItem />
          {pageState === 'login' && (
            <SignInWithXPage showLoading={loginLoading} handleButtonClick={() => clickLogin()} />
          )}
          {pageState === 'invite' && (
            <InvitePage handleButtonClick={(inviteCode) => clickActivate(inviteCode)} />
          )}
          {pageState === 'congratulation' && (
            <CongratulationPage handleButtonClick={() => setPageState('profile')} />
          )}
          {pageState === 'profile' && <Profile handleButtonClick={handleWalletButtonClick} />}
          {pageState === 'wallet' && <Wallet handleButtonClick={() => setPageState('profile')} />}
        </div>
      </Drawer>
    </Box>
  );
}

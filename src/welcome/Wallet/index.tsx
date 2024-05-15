import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

import { BasicButton } from '../../components/Button';
import { InfoCircle } from '../../components/icons/InfoCircle';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import * as toaster from '../../components/Toaster';
import TruncateText from '../../components/TruncateText';
import { chainNameMap } from '../../config/chainConfig';
import useAccount from '../../hooks/useAccount';
import { useUserInfo } from '../../service/user';
import { useWalletAccounts } from '../../service/wallet';
import useGlobalStore from '../../store/useGlobalStore';
import useGlobalUserStore from '../../store/useGlobalUserStore';
import useProfileModal from '../../store/useProfileModal';

import Deposit from './Deposit';
import InviteFriends from './InviteFriends';
import WithDraw from './WithDraw';

const Wallet = (props: { back?: () => void; logout?: () => void }) => {
  const { openProfile } = useProfileModal((state) => ({ ...state }));

  const { isShowPrice, chain } = useGlobalStore((state) => ({ ...state }));
  const { userInfo } = useAccount();
  const { run: getUserInfo } = useUserInfo();
  const [isWithDrawOpen, setIsWithDrawOpen] = useState(false);

  const { run: getWalletAccounts } = useWalletAccounts();
  useEffect(() => {
    getUserInfo();
  }, []);

  const { balance, accounts } = useGlobalUserStore((state) => ({
    ...state,
  }));

  useEffect(() => {
    getWalletAccounts();
  }, []);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center space-x-[10px] py-3 pl-4">
        <div className="cursor-pointer" onClick={() => props.back?.()}>
          <GoBack />
        </div>
        <span className="text-xl font-medium">Home</span>
      </div>
      <div className="px-3 py-[30px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-[14px]">
            <img
              onClick={() => openProfile(userInfo)}
              src={userInfo?.avatar}
              alt="avatar"
              className="h-[70px] w-[70px] cursor-pointer rounded-full"
            />
            <div className="flex flex-col">
              <span className="#0F1419 text-[20px] font-bold leading-[20px]">
                @{userInfo?.twitterUsername}
              </span>
              <CopyToClipboard
                text={accounts[0] ?? '0x0'}
                onCopy={() => {
                  toaster.success(toaster.ToastMessage.COPY_SUCCESS);
                }}
              >
                <div className="flex cursor-pointer items-center space-x-2">
                  <span className="text-base font-medium text-[#919099]">
                    <TruncateText text={accounts[0] ?? ''} />
                  </span>
                  <Copy />
                </div>
              </CopyToClipboard>

              <div className="flex items-center space-x-1">
                <span className="text-[#919099]">{`Network:${chainNameMap[chain]}`}</span>
                <Network />
              </div>
            </div>
          </div>
          <InviteFriends />
        </div>

        <div className="mt-10">
          <div className="space-y-[15px]">
            <div
              className="flex cursor-pointer items-center justify-between rounded-[8px] border border-[#EBECED] p-4 hover:border-[#9A6CF9]"
              onClick={() => openProfile(userInfo, 1)}
            >
              <div className="flex items-center space-x-3">
                <UserIcon />
                <span className="xfans-font-sf text-base font-medium">Portfolio Value</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon />
                <NumberDisplayer
                  className="text-base font-bold text-[#9A6CF9]"
                  text={userInfo?.holdValue}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[8px] border border-[#EBECED] p-4 hover:border-[#9A6CF9]">
              <div className="flex items-center space-x-3">
                <WalletIcon />
                <span className="xfans-font-sf text-base font-medium">Wallet Balance</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon />

                <NumberDisplayer className="text-base font-bold text-[#9A6CF9]" text={balance} />
              </div>
              <div className="flex items-center space-x-1">
                <BeraIcon />
                <NumberDisplayer className="text-base font-bold text-[#9A6CF9]" text={balance} />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[8px] border border-[#EBECED] p-4 hover:border-[#9A6CF9]">
              <div className="flex items-center space-x-3">
                <Fire />
                <span className="flex items-center text-base font-medium">
                  Trading Fee Earned
                  <Tooltip title="If fans trade your shares, you can earn a 2.5% transaction fee from each transaction.">
                    <span className="ml-[6px]">
                      <InfoCircle />
                    </span>
                  </Tooltip>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon />
                <NumberDisplayer
                  className="text-base font-bold text-[#9A6CF9]"
                  text={userInfo?.tradingFeeEarned}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[8px] border border-[#EBECED] p-4 hover:border-[#9A6CF9]">
              <div className="flex items-center space-x-3">
                <Gift />
                <span className="flex items-center text-base font-medium">
                  Reward Earned
                  <Tooltip title="If the creator you've invested in produces tweets that rank among the top 100, you can earn bonuses based on the number of shares you hold.">
                    <span className="ml-[6px]">
                      <InfoCircle />
                    </span>
                  </Tooltip>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon />
                <NumberDisplayer
                  className="text-base font-bold text-[#9A6CF9]"
                  text={userInfo?.rewardEarned}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[8px] border border-[#EBECED] p-4 hover:border-[#9A6CF9]">
              <div className="flex items-center space-x-3">
                <Setting />
                <span className="xfans-font-sf text-base font-medium">Hide Twitter Price Tags</span>
              </div>
              <div className="flex items-center space-x-1">
                <PurpleSwitch
                  checked={isShowPrice}
                  onChange={(_e, checked) => {
                    useGlobalStore.setState({
                      isShowPrice: checked,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {/* <div className="flex items-center justify-between">
            <InviteFriends />
            <ProfileModal />
          </div> */}
          <div className="flex items-center justify-between">
            <Deposit />
            <BasicButton
              classes={{
                outlined:
                  '!py-[10px] !px-[38px] !w-[170px] !text-[#0F1419] !border-[#0F1419] hover:!border-[#9A6CF9]',
              }}
              onClick={() => setIsWithDrawOpen(true)}
            >
              <span className="xfans-font-sf text-base font-medium">Withdraw</span>
            </BasicButton>
            {isWithDrawOpen && <WithDraw onClose={() => setIsWithDrawOpen(false)} />}
          </div>

          <div
            className="xfans-font-sf mt-6 flex cursor-pointer items-center justify-center rounded-full border border-[#0F1419] px-[38px] py-[14px] text-base font-medium leading-[18px] text-[#0F1419] hover:border-[#9A6CF9]"
            onClick={() => props.logout?.()}
          >
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
};

const Copy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4.33337 4.14419V2.60449C4.33337 2.08673 4.75311 1.66699 5.27087 1.66699H13.3959C13.9136 1.66699 14.3334 2.08673 14.3334 2.60449V10.7295C14.3334 11.2473 13.9136 11.667 13.3959 11.667H11.8388"
      stroke="#919099"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.7291 4.33301H2.60413C2.08636 4.33301 1.66663 4.75274 1.66663 5.27051V13.3955C1.66663 13.9133 2.08636 14.333 2.60413 14.333H10.7291C11.2469 14.333 11.6666 13.9133 11.6666 13.3955V5.27051C11.6666 4.75274 11.2469 4.33301 10.7291 4.33301Z"
      stroke="#919099"
      strokeWidth="1.33333"
      strokeLinejoin="round"
    />
  </svg>
);

const Network = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <g clipPath="url(#clip0_450_21992)">
      <path
        d="M6.99692 0.932617C3.64451 0.932617 0.932251 3.64791 0.932251 7.00032C0.932251 10.3527 3.64451 13.068 6.99692 13.068C10.3493 13.068 13.0677 10.3527 13.0677 7.00032C13.0677 3.64791 10.3493 0.932617 6.99692 0.932617ZM11.1988 4.57324H9.40882C9.21163 3.81478 8.93554 3.08665 8.57148 2.41315C9.68793 2.7954 10.6163 3.56903 11.1988 4.57324ZM6.99995 2.16739C7.5066 2.89551 7.90101 3.70555 8.15888 4.57323H5.84102C6.09889 3.70555 6.4933 2.89551 6.99995 2.16739ZM2.30355 8.21385C2.20343 7.82552 2.14579 7.41898 2.14579 7.00032C2.14579 6.58165 2.20343 6.17512 2.30355 5.78678H4.35139C4.30285 6.18421 4.26948 6.58771 4.26948 7.00032C4.26948 7.41293 4.30285 7.81643 4.35443 8.21385H2.30355ZM2.79807 9.42739H4.58804C4.78524 10.1859 5.06133 10.914 5.42539 11.5905C4.30893 11.2083 3.38056 10.4316 2.79807 9.42739ZM4.58804 4.57324H2.79807C3.38056 3.56905 4.30893 2.79238 5.42537 2.41011C5.06131 3.08665 4.78524 3.81478 4.58804 4.57324ZM6.99995 11.8332C6.49633 11.1051 6.10193 10.2951 5.84102 9.42741H8.15888C7.89796 10.2951 7.50357 11.1051 6.99995 11.8332ZM8.41979 8.21385H5.58011C5.52247 7.81643 5.48303 7.41293 5.48303 7.00032C5.48303 6.58771 5.52247 6.18421 5.58011 5.78678H8.41979C8.47743 6.18421 8.51687 6.58771 8.51687 7.00032C8.51687 7.41293 8.47743 7.81643 8.41979 8.21385ZM8.57451 11.5875C8.93857 10.9109 9.21465 10.1859 9.41186 9.42741H11.2018C10.6163 10.4316 9.68793 11.2052 8.57451 11.5875ZM9.64546 8.21385C9.69401 7.81643 9.73041 7.41293 9.73041 7.00032C9.73041 6.58771 9.69704 6.18421 9.64546 5.78678H11.6933C11.7934 6.17512 11.8541 6.58165 11.8541 7.00032C11.8541 7.41898 11.7965 7.82552 11.6933 8.21385H9.64546Z"
        fill="#919099"
      />
    </g>
    <defs>
      <clipPath id="clip0_450_21992">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10Z"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 22C21 17.0294 16.9706 13 12 13C7.02945 13 3 17.0294 3 22"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.99097 5.98445L15.8923 2L18.1985 5.99445L8.99097 5.98445Z"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 7C2 6.4477 2.44771 6 3 6H21C21.5523 6 22 6.4477 22 7V21C22 21.5523 21.5523 22 21 22H3C2.44771 22 2 21.5523 2 21V7Z"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M17.625 16.5H22V11.5H17.625C16.1753 11.5 15 12.6193 15 14C15 15.3807 16.1753 16.5 17.625 16.5Z"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M22 8.25V20.25" stroke="#2E2E32" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Fire = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22C16.1174 22 19.4999 18.7371 19.4999 14.5491C19.4999 13.5209 19.4477 12.4188 18.8778 10.7058C18.3079 8.9929 18.1931 8.7718 17.5905 7.71395C17.333 9.8727 15.9555 10.7724 15.6055 11.0413C15.6055 10.7615 14.7722 7.66795 13.5088 5.81695C12.2685 4 10.5817 2.80796 9.59265 2C9.59265 3.53489 9.16095 5.81695 8.5427 6.9797C7.92445 8.14245 7.80835 8.1848 7.0361 9.0501C6.2639 9.9154 5.90945 10.1826 5.2637 11.2325C4.61798 12.2825 4.5 13.6809 4.5 14.7091C4.5 18.8971 7.88265 22 12 22Z"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const Gift = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.5 22V10H3.5V22H20.5Z"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 22V10"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.5 22H3.5"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22 6H2V10H22V6Z" stroke="#2E2E32" strokeWidth="2" strokeLinejoin="round" />
    <path
      d="M8 2L12 6L16 2"
      stroke="#2E2E32"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Setting = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9.1419 21.5854C7.46635 21.0866 5.9749 20.1604 4.79393 18.9333C5.2345 18.4111 5.5 17.7365 5.5 16.9998C5.5 15.343 4.15685 13.9998 2.5 13.9998C2.39977 13.9998 2.3007 14.0048 2.203 14.0144C2.0699 13.3636 2 12.6899 2 11.9998C2 10.9545 2.16039 9.94666 2.4579 8.99951C2.47191 8.99971 2.48594 8.99981 2.5 8.99981C4.15685 8.99981 5.5 7.65666 5.5 5.99981C5.5 5.52416 5.3893 5.07441 5.1923 4.67481C6.34875 3.59951 7.76025 2.79477 9.32605 2.36133C9.8222 3.33385 10.8333 3.99982 12 3.99982C13.1667 3.99982 14.1778 3.33385 14.674 2.36133C16.2398 2.79477 17.6512 3.59951 18.8077 4.67481C18.6107 5.07441 18.5 5.52416 18.5 5.99981C18.5 7.65666 19.8432 8.99981 21.5 8.99981C21.5141 8.99981 21.5281 8.99971 21.5421 8.99951C21.8396 9.94666 22 10.9545 22 11.9998C22 12.6899 21.9301 13.3636 21.797 14.0144C21.6993 14.0048 21.6002 13.9998 21.5 13.9998C19.8432 13.9998 18.5 15.343 18.5 16.9998C18.5 17.7365 18.7655 18.4111 19.2061 18.9333C18.0251 20.1604 16.5336 21.0866 14.8581 21.5854C14.4714 20.3758 13.338 19.4998 12 19.4998C10.662 19.4998 9.5286 20.3758 9.1419 21.5854Z"
      stroke="#333333"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
      stroke="#333333"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
    <g clipPath="url(#clip0_450_22004)">
      <path d="M5.00044 17.4065V13.1882L0.1427 10.1367L5.00044 17.4065Z" fill="#C7C7E0" />
      <path d="M5.01648 17.4065V13.1882L9.87431 10.1367L5.01657 17.4065H5.01648Z" fill="#A3A3D2" />
      <path d="M5.00048 12.1404V6.75684L0.0869141 9.12012L5.00048 12.1404Z" fill="#C7C7E0" />
      <path d="M5.01648 12.1404V6.75684L9.93004 9.12021L5.01648 12.1404Z" fill="#A3A3D2" />
      <path d="M0.0869141 9.12L5.00039 0.59375V6.75662L0.0869141 9.12Z" fill="#C7C7E0" />
      <path d="M9.93008 9.12L5.0166 0.59375V6.75662L9.93008 9.12Z" fill="#A3A3D2" />
    </g>
    <defs>
      <clipPath id="clip0_450_22004">
        <rect width="10" height="17" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

const BeraIcon = () => (
  <img
    src="https://cdn-xfans.buidlerdao.xyz/20240513-190428.jpeg"
    className="mx-0 h-[18px] w-[18px] cursor-pointer rounded-full p-0"
    alt="Logo"
  />
);

const GoBack = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M5.95068 14H22.284"
      stroke="#2E2E32"
      strokeWidth="2.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.8334 21L5.83337 14L12.8334 7"
      stroke="#2E2E32"
      strokeWidth="2.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PurpleSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#9A6CF9',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#C5A9FF',
  },
}));

export default Wallet;

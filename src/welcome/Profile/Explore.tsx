import React, { useEffect } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import { useNewList, useRecentList, useShareList, useTopList } from '../../service/share';
import useProfileModal from '../../store/useProfileModal';
import useShareStore from '../../store/useShareStore';
import { getTimeDistanceFromDate } from '../../utils';

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="18" viewBox="0 0 10 18" fill="none">
    <g clipPath="url(#clip0_209_9369)">
      <path d="M5.00032 17.4065V13.1882L0.142578 10.1367L5.00032 17.4065Z" fill="#C7C7E0" />
      <path d="M5.0166 17.4065V13.1882L9.87443 10.1367L5.01669 17.4065H5.0166Z" fill="#A3A3D2" />
      <path d="M5.00048 12.1399V6.75635L0.0869141 9.11963L5.00048 12.1399Z" fill="#C7C7E0" />
      <path d="M5.0166 12.1399V6.75635L9.93017 9.11972L5.0166 12.1399Z" fill="#A3A3D2" />
      <path d="M0.0869141 9.12L5.00039 0.59375V6.75662L0.0869141 9.12Z" fill="#C7C7E0" />
      <path d="M9.93008 9.12L5.0166 0.59375V6.75662L9.93008 9.12Z" fill="#A3A3D2" />
    </g>
    <defs>
      <clipPath id="clip0_209_9369">
        <rect width="10" height="17" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

const Up = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M1 9.9173L3.82845 7.08885L6.02245 9.2777L11.2801 4"
      stroke="#16B364"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.28027 4H11.2803V8"
      stroke="#16B364"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Explore = () => {
  const list = Array(7).fill('');
  const { openProfile } = useProfileModal((state) => ({ ...state }));
  const { run: getShareList } = useShareList();
  const { run: getTopList } = useTopList();
  const { run: getNewList } = useNewList();
  const { run: getRecentList } = useRecentList();
  const { shareList, topList, newList, recentList } = useShareStore((state) => ({ ...state }));

  const [value, setValue] = React.useState('1');

  const fetchMap: Record<any, any> = {
    1: getTopList,
    2: getNewList,
    3: getRecentList,
    4: getShareList,
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    fetchMap[newValue]();
  };

  useEffect(() => {
    if (value === '1') {
      getTopList();
      getNewList();
      getRecentList();
      getShareList();
    }
  }, []);

  return (
    <div className="px-4">
      <TabContext value={value}>
        <Box>
          <TabList
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#9A6CF9',
              },
              '& .Mui-selected': {
                fontWeight: 700,
                color: '#9A6CF9 !important',
              },
            }}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab
              label="Top"
              value="1"
              sx={{
                width: '25%',
                fontSize: 15,
                color: '#919099',
                fontWeight: 400,
                textTransform: 'none',
              }}
            />
            <Tab
              label="New"
              value="2"
              sx={{
                width: '25%',
                fontSize: 15,
                color: '#919099',
                fontWeight: 400,
                textTransform: 'none',
              }}
            />
            <Tab
              label="24h %"
              value="3"
              sx={{
                width: '25%',
                fontSize: 15,
                color: '#919099',
                fontWeight: 400,
                textTransform: 'none',
              }}
            />
            <Tab
              label="Activites"
              value="4"
              sx={{
                width: '25%',
                fontSize: 15,
                color: '#919099',
                fontWeight: 400,
                textTransform: 'none',
              }}
            />
          </TabList>
        </Box>
        <TabPanel
          value="1"
          sx={{
            padding: 0,
          }}
        >
          <ul>
            {topList?.map((item, i) => (
              <li
                key={item.id}
                className="pt-[18px] pb-2 flex items-center border-t border-t-[#EBEEF0] cursor-pointer"
                onClick={() => openProfile(item)}
              >
                <span className="text-[#0F1419]">{i + 1}</span>
                <img
                  src={item.avatar}
                  alt="avatar"
                  className="w-[44px] h-[44px] mx-[14px] rounded-full"
                />
                <div className="flex-1 flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1419] font-bold text-sm">{item.username}</span>
                    <span className="text-[#5B7083]">@{item.twitterUsername}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-[6px]">
                      <span className="text-[#919099] text-sm">Price</span>
                      <Icon />
                      <span className="text-[#919099] text-[15px]">
                        <NumberDisplayer text={item.price} />
                      </span>
                    </div>

                    <div className="flex items-center space-x-[6px]">
                      <span className="text-[#919099] text-sm">Tweet Avg Rank:</span>
                      <span className="text-[#919099] text-[15px]">#{i + 1}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TabPanel>
        <TabPanel
          value="2"
          sx={{
            padding: 0,
          }}
        >
          <ul>
            {newList?.map((item, i) => (
              <li
                key={item.id}
                className="pt-[18px] pb-2 flex items-center border-t border-t-[#EBEEF0] cursor-pointer"
                onClick={() => openProfile(item)}
              >
                <span className="text-[#0F1419]">{i + 1}</span>
                <img
                  src={item.avatar}
                  alt="avatar"
                  className="w-[44px] h-[44px] mx-[14px] rounded-full"
                />
                <div className="flex-1 flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1419] font-bold text-sm">{item.username}</span>
                    <span className="text-[#5B7083]">@{item.twitterUsername}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-[6px]">
                      <span className="text-[#919099] text-sm">Price</span>
                      <Icon />
                      <span className="text-[#919099] text-[15px]">
                        <NumberDisplayer text={item.price} />
                      </span>
                    </div>

                    <span className="text-[#919099] text-sm">
                      {getTimeDistanceFromDate(item.createdAt)} ago
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TabPanel>
        <TabPanel
          value="3"
          sx={{
            padding: 0,
          }}
        >
          <ul>
            {recentList?.map((item, i) => (
              <li
                key={item.id}
                className="pt-[18px] pb-2 flex items-center border-t border-t-[#EBEEF0] cursor-pointer"
                onClick={() => openProfile(item)}
              >
                <span className="text-[#0F1419]">{i + 1}</span>
                <img
                  src={item.avatar}
                  alt="avatar"
                  className="w-[44px] h-[44px] mx-[14px] rounded-full"
                />
                <div className="flex-1 flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#0F1419] font-bold text-sm">{item.username}</span>
                    <span className="text-[#5B7083]">@{item.twitterUsername}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-[6px]">
                      <span className="text-[#919099] text-sm">Price</span>
                      <Icon />
                      <span className="text-[#919099] text-[15px]">
                        <NumberDisplayer text={item.price} />
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Up />
                      <span className="text-[#16B364] text-[15px]">{item.increaseRate24h}%</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TabPanel>
        <TabPanel
          value="4"
          sx={{
            padding: 0,
          }}
        >
          <ul>
            {shareList?.map((item, i: any) => (
              <li key={i} className="pt-[10px] pb-2 space-y-2 border-t border-t-[#EBEEF0]">
                <span className="text-[#A1A1AA] text-sm">
                  {dayjs(item.createdAt).format('YYYY/MM/DD HH:mm')}
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-5 items-center">
                    <div className="flex flex-col items-center w-9">
                      <img
                        onClick={() => openProfile(item)}
                        src={item.traderUser?.avatar}
                        alt="avatar"
                        className="w-9 h-9 rounded-full cursor-pointer"
                      />
                      <span className="text-[#919099] text-sm">{item.traderUser?.username}</span>
                    </div>

                    <span className="font-bold w-12 text-center text-sm">
                      {item.isBuy ? 'Bought' : 'Sold'}
                    </span>

                    <div className="flex flex-col items-center w-9">
                      <img
                        onClick={() => openProfile(item)}
                        src={item.subjectUser?.avatar}
                        alt="avatar"
                        className="w-9 h-9 rounded-full cursor-pointer"
                      />
                      <span className="text-[#919099] text-sm">{item.subjectUser?.username}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`text-base font-bold ${
                        Number(item.shareAmount) > 0 ? 'text-[#16B364]' : 'text-[#FF2E00]'
                      }`}
                    >
                      {Number(item.shareAmount) > 0 ? '+' : '-'}
                      {item.shareAmount} Shares
                    </span>
                    <div className="space-x-1 flex items-center">
                      <Icon />
                      <span
                        className={`text-xs ${
                          Number(item.ethAmount) > 0 ? 'text-[#FF2E00]' : 'text-[#16B364]'
                        }`}
                      >
                        {new BigNumber(Number(item.ethAmount))
                          .dividedBy(new BigNumber(Math.pow(10, 18)))
                          .toNumber()
                          .toLocaleString(undefined, { maximumFractionDigits: 20 })}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Explore;

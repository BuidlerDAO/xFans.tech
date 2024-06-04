import React, { useEffect } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import dayjs from 'dayjs';

import ArrowRight from '../../components/icons/ArrowRight';
import DownIcon from '../../components/icons/DownIcon';
import { InfoCircle } from '../../components/icons/InfoCircle';
import ETHIcon from '../../components/icons/SolanaIcon';
import UpIcon from '../../components/icons/UpIcon';
import Loading from '../../components/Loading';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import UserName from '../../components/User';
import { SHARE_UNIT_MODIFIER } from '../../constants';
import { useNewList, useRecentList, useShareList, useTopList } from '../../service/share';
import useProfileModal from '../../store/useProfileModal';
import useShareStore from '../../store/useShareStore';
import useUserStore from '../../store/useUserStore';
import { getTimeDistanceFromDate } from '../../utils';

const Explore = () => {
  const { openProfile } = useProfileModal((state) => ({ ...state }));
  const { run: getShareList, loading: loading4 } = useShareList();
  const { run: getTopList, loading: loading1 } = useTopList();
  const { run: getNewList, loading: loading2 } = useNewList();
  const { run: getRecentList, loading: loading3 } = useRecentList();
  const { shareList, topList, newList, recentList } = useShareStore((state) => ({ ...state }));
  const { userInfo } = useUserStore((state) => ({ ...state }));

  const [value, setValue] = React.useState('1');
  const [loadingx, setLoadingx] = React.useState(true);

  const fetchMap: Record<any, any> = {
    1: getTopList,
    2: getNewList,
    3: getRecentList,
    4: () => getShareList({ relatedAddress: userInfo?.walletAddress }),
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setLoadingx(true);
    setValue(newValue);
    fetchMap[newValue]();
  };

  useEffect(() => {
    let timeout: any;

    if (loading1 || loading2 || loading3 || loading4) {
      setLoadingx(true);
      timeout = setTimeout(() => {
        setLoadingx(false);
      }, 500);
    }
  }, [loading1, loading2, loading3, loading4]);

  useEffect(() => {
    fetchMap[value]();
  }, []);

  return (
    <div className="flex h-0 flex-1 flex-col px-4">
      <TabContext value={value}>
        <Box>
          <TabList
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#9A6CF9',
                borderRadius: '1px',
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
              icon={
                <Tooltip placement="top" title="24-hour floor price increase leaderboard.">
                  <span>
                    <InfoCircle />
                  </span>
                </Tooltip>
              }
              iconPosition="end"
              label="24h %"
              value="3"
              sx={{
                padding: 0,
                whiteSpace: 'nowrap',
                width: '25%',
                fontSize: 15,
                color: '#919099',
                fontWeight: 400,
                textTransform: 'none',
              }}
            />
            <Tab
              icon={
                <Tooltip
                  placement="top"
                  title="The list of creators for the latest registered xFans."
                >
                  <span>
                    <InfoCircle />
                  </span>
                </Tooltip>
              }
              iconPosition="end"
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
        <>
          {loading1 || loading2 || loading3 || loading4 || loadingx ? (
            <div className="flex flex-1 items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              <TabPanel
                value="1"
                sx={{
                  padding: 0,
                }}
                className="xfans-scrollbar flex-1 overflow-y-auto"
              >
                <ul>
                  {topList?.map((item, i) => (
                    <li
                      key={i}
                      className="flex cursor-pointer items-center border-t border-t-[#EBEEF0] pt-[18px] pb-2"
                      onClick={() => openProfile(item)}
                    >
                      <span className="w-[16px] text-[14px] font-medium text-[#0F1419]">
                        {i + 1}
                      </span>
                      <img
                        src={item.avatar}
                        alt="avatar"
                        className="mx-[14px] h-[44px] w-[44px] rounded-full"
                      />
                      <div className="flex flex-1 flex-col space-y-1">
                        <UserName username={item.username} twitterUsername={item.twitterUsername} />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-[6px]">
                            <span className="text-sm text-[#919099]">Price</span>
                            <ETHIcon />
                            <NumberDisplayer
                              className="text-[15px] font-bold text-[#919099]"
                              text={item.price}
                            />
                          </div>

                          <div className="mr-2 flex items-center space-x-[6px]">
                            <span className="xfans-font-sf text-sm text-[#919099]">
                              Tweet Avg Rank:
                            </span>
                            <span className="xfans-font-sf text-[15px] text-[#919099]">
                              {item.tweetAvgRank ? `${item.tweetAvgRank}` : '-'}
                            </span>
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
                className="xfans-scrollbar flex-1 overflow-y-auto"
              >
                <ul>
                  {newList?.map((item, i) => (
                    <li
                      key={item.id}
                      className="flex cursor-pointer items-center border-t border-t-[#EBEEF0] pt-[18px] pb-2"
                      onClick={() => openProfile(item)}
                    >
                      <span className="w-[16px] text-[#0F1419]">{i + 1}</span>
                      <img
                        src={item.avatar}
                        alt="avatar"
                        className="mx-[14px] h-[44px] w-[44px] rounded-full"
                      />
                      <div className="flex flex-1 flex-col space-y-1">
                        <UserName username={item.username} twitterUsername={item.twitterUsername} />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-[6px]">
                            <span className="text-sm text-[#919099]">Price</span>
                            <ETHIcon />
                            <NumberDisplayer
                              className="text-[15px] font-bold text-[#919099]"
                              text={item.price}
                            />
                          </div>

                          <span className="xfans-font-sf text-sm text-[#919099]">
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
                className="xfans-scrollbar flex-1 overflow-y-auto"
              >
                <ul>
                  {recentList?.map((item, i) => (
                    <li
                      key={item.id}
                      className="flex cursor-pointer items-center border-t border-t-[#EBEEF0] pt-[18px] pb-2"
                      onClick={() => openProfile(item)}
                    >
                      <span className="w-[16px] text-[#0F1419]">{i + 1}</span>
                      <img
                        src={item.avatar}
                        alt="avatar"
                        className="mx-[14px] h-[44px] w-[44px] rounded-full"
                      />
                      <div className="flex flex-1 flex-col space-y-1">
                        <UserName username={item.username} twitterUsername={item.twitterUsername} />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-[6px]">
                            <span className="text-sm text-[#919099]">Price</span>
                            <ETHIcon />
                            <NumberDisplayer
                              className="text-[15px] font-bold text-[#919099]"
                              text={item.price}
                            />
                          </div>

                          <div
                            className={`flex items-center space-x-1 ${
                              Number(item.increaseRate24h) > 0
                                ? 'text-[#16B364]'
                                : Number(item.increaseRate24h) < 0
                                ? 'text-[#D85550]'
                                : 'text-[#A9B9B1]'
                            }`}
                          >
                            {Number(item.increaseRate24h) > 0 ? (
                              <UpIcon />
                            ) : Number(item.increaseRate24h) < 0 ? (
                              <DownIcon />
                            ) : (
                              <ArrowRight />
                            )}
                            <span className="text-[15px]">
                              {Math.abs(Number(item.increaseRate24h))}%
                            </span>
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
                className="xfans-scrollbar flex-1 overflow-y-auto"
              >
                <ul>
                  {shareList?.map((item, i: any) => (
                    <li key={i} className="space-y-2 border-t border-t-[#EBEEF0] pt-[10px] pb-2">
                      <span className="text-[14px] font-normal text-[#A1A1AA]">
                        {dayjs(item.createdAt).format('YYYY/MM/DD HH:mm')}
                      </span>
                      <div className="flex items-center justify-between pl-6">
                        <div className="flex items-center space-x-9">
                          <div className="flex w-9 flex-col items-center">
                            <img
                              onClick={() => openProfile(item.traderUser)}
                              src={item.traderUser?.avatar}
                              alt="avatar"
                              className="h-9 w-9 cursor-pointer rounded-full"
                            />
                            <span className=" max-w-[80px] truncate text-[14px] font-normal text-[#919099]">
                              @{item.traderUser?.username}
                            </span>
                          </div>

                          <span className="xfans-font-sf h-[14px] w-12 text-center text-[14px] font-bold">
                            {item.isBuy ? 'Bought' : 'Sold'}
                          </span>

                          <div className="flex w-9 flex-col items-center">
                            <img
                              onClick={() => openProfile(item.subjectUser)}
                              src={item.subjectUser?.avatar}
                              alt="avatar"
                              className="h-9 w-9 cursor-pointer rounded-full"
                            />
                            <span className=" max-w-[80px] truncate text-[14px] font-normal text-[#919099]">
                              @{item.subjectUser?.username}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span
                            className={`text-base font-bold ${
                              item.isBuy ? 'text-[#16B364]' : 'text-[#FF2E00]'
                            }`}
                          >
                            {item.isBuy ? '+' : '-'}
                            {Number(item.shareAmount) / SHARE_UNIT_MODIFIER} Shares
                          </span>
                          <div className="flex items-center space-x-1">
                            <ETHIcon />
                            <span
                              className={`text-xs ${
                                !item.isBuy ? 'text-[#FF2E00]' : 'text-[#16B364]'
                              }`}
                            >
                              {item.isBuy ? '-' : '+'}
                              <NumberDisplayer text={item.ethAmount} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabPanel>
            </>
          )}
        </>
      </TabContext>
    </div>
  );
};

export default Explore;

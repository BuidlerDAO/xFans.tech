import React, { useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Divider, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import dayjs from 'dayjs';

import { ListEmpty } from '../../components/Empty';
import { InfoCircle } from '../../components/icons/InfoCircle';
import SolanaIcon from '../../components/icons/SolanaIcon';
import { CenterLoading } from '../../components/Loading';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import { useEthPrice } from '../../service/share';
import { useTweetList, useTweetYourRank } from '../../service/tweet';
import { usePoolBalance } from '../../service/wallet';
import useProfileModal from '../../store/useProfileModal';
import useShareStore from '../../store/useShareStore';
import useTweetStore from '../../store/useTweetStore';

import Claim from './Claim';
import History from './History';

const Reward = () => {
  const { openProfile } = useProfileModal((state) => ({ ...state }));
  const [value, setValue] = React.useState('1');
  const [poolBalance, setPoolBalance] = React.useState('0');
  const { run: getTweet, loading: loadingTweetList } = useTweetList();
  const { run: getYourRank, loading: loadingTweetYourRank } = useTweetYourRank();
  const { tweetList, tweetRewardTotalRewardAmount, tweetYourRank } = useTweetStore((state) => ({
    ...state,
  }));
  const [loadingx, setLoadingx] = useState(true);
  const { ethPrice } = useShareStore((state) => ({ ...state }));
  const { run: getPrice } = useEthPrice();

  const { run: fetchPool } = usePoolBalance(
    (balance) => {
      setPoolBalance(balance);
    },
    () => {
      setPoolBalance('0');
    }
  );

  const fetchMap: Record<any, any> = {
    1: getTweet,
    2: getYourRank,
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    fetchMap[newValue]();
  };

  useEffect(() => {
    if (value === '1') {
      getTweet();
    } else if (value === '2') {
      getYourRank();
    }
    fetchPool();
  }, []);

  useEffect(() => {
    if (loadingTweetList || loadingTweetYourRank) {
      setLoadingx(true);
      setTimeout(() => {
        setLoadingx(false);
      }, 500);
    }
  }, [loadingTweetList, loadingTweetYourRank]);

  useEffect(() => {
    getPrice();
  }, []);

  return (
    <>
      <div className="mx-6 flex items-center justify-between">
        <div className="flex space-x-[10px]">
          <div className="flex min-w-[60px] flex-col items-center space-y-1">
            <div className="flex items-center space-x-1">
              <SolanaIcon />
              <NumberDisplayer className="text-xs font-medium text-[#0F1419]" text={poolBalance} />
            </div>
            <span className="relative text-[15px] font-medium text-[#919099]">
              Pool
              <Tooltip title="The pool refers to a reward pool formed by transaction fees, which will be distributed to the creators' shareholders based on the ranking of the creators' tweets.">
                <span className="absolute top-[3px] right-[-18px] h-[14px] w-[14px]">
                  <InfoCircle />
                </span>
              </Tooltip>
            </span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1">
              <SolanaIcon />
              <NumberDisplayer
                className="text-xs font-medium text-[#0F1419]"
                text={tweetRewardTotalRewardAmount}
              />
            </div>
            <span className="relative text-[15px] font-medium text-[#919099]">
              Your Reward
              <Tooltip title="If the creator you've invested in produces tweets that rank among the top 100, you can earn bonuses based on the number of shares you hold.">
                <span className="absolute top-[3px] right-[-18px] h-[14px] w-[14px]">
                  <InfoCircle />
                </span>
              </Tooltip>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-[8px]">
          <Claim price={ethPrice?.price} />
          <History price={ethPrice?.price} />
        </div>
      </div>

      <Divider
        sx={{
          marginTop: 2,
          marginLeft: 2,
          marginRight: 2,
          borderColor: '#EBEEF0',
        }}
      />

      <div className="mx-4 flex h-0 flex-1 flex-col">
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
                icon={
                  <Tooltip title="Weekly refers to the list of tweet rankings each week, and the ranking algorithm can be found in the official documentation on our website.">
                    <span>
                      <InfoCircle />
                    </span>
                  </Tooltip>
                }
                iconPosition="end"
                label="Weekly rank"
                value="1"
                sx={{
                  width: '50%',
                  fontSize: 15,
                  color: '#919099',
                  fontWeight: 400,
                  textTransform: 'none',
                }}
              />
              <Tab
                label="Your creators"
                value="2"
                sx={{
                  width: '50%',
                  fontSize: 15,
                  color: '#919099',
                  fontWeight: 400,
                  textTransform: 'none',
                }}
              />
            </TabList>
          </Box>
          <TabPanel value="1" className="xfans-scrollbar h-0 flex-1 overflow-y-auto !p-0">
            {loadingTweetList || loadingx ? (
              <CenterLoading />
            ) : tweetList == null || tweetList.length === 0 ? (
              <div className="flex flex-col items-center">
                <ListEmpty className="mt-[50px]" />
                <p className="xfans-font-sf mt-[10px] text-[#00000080]">No records found.</p>
              </div>
            ) : (
              <ul className="border-t border-t-[#EBEEF0] py-[22px]">
                {tweetList?.map((item, i) => (
                  <li key={i} className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-[6px]">
                        <img
                          onClick={() => openProfile(item?.author)}
                          src={item.author?.avatar}
                          alt=""
                          className="w-[44px] cursor-pointer rounded-full"
                        />
                        <div className="flex flex-col space-y-[2px]">
                          <span className="text-sm font-bold">{item.author?.username}</span>
                          <span className="text-xs text-[#919099]">
                            {dayjs(item.createdAt).locale('en').format('MMM DD YYYY, HH:mm')}
                          </span>
                        </div>
                      </div>

                      <span className="text-sm font-medium text-[#0F1419]">#{item.rank}</span>
                    </div>

                    <p
                      className="cursor-pointer text-xs leading-[20px] text-black"
                      onClick={() => {
                        window.open(
                          `https://x.com/${item?.author?.twitterUsername}/status/${item?.id}`,
                          '_blank'
                        );
                      }}
                    >
                      {item.text}
                    </p>

                    <Divider
                      sx={{
                        marginTop: 3,
                        width: '100%',
                        borderColor: '#EBEEF0',
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </TabPanel>
          <TabPanel value="2" className="xfans-scrollbar h-0 flex-1 overflow-y-auto !p-0">
            {loadingTweetYourRank || loadingx ? (
              <CenterLoading />
            ) : tweetYourRank == null || tweetYourRank.length === 0 ? (
              <div className="flex flex-col items-center">
                <ListEmpty className="mt-[50px]" />
                <p className="xfans-font-sf mt-[10px] text-[#00000080]">No records found.</p>
              </div>
            ) : (
              <ul className="border-t border-t-[#EBEEF0] py-[22px]">
                {tweetYourRank?.map((item, i) => (
                  <li key={i} className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-[6px]">
                        <img
                          onClick={() => openProfile(item?.author)}
                          src={item.author?.avatar}
                          alt=""
                          className="w-[44px] cursor-pointer rounded-full"
                        />
                        <div className="flex flex-col space-y-[2px]">
                          <span className="text-sm font-bold">{item.author?.username}</span>
                          <span className="text-xs text-[#919099]">
                            {dayjs(item.createdAt).locale('en').format('MMM DD YYYY, HH:mm')}
                          </span>
                        </div>
                      </div>

                      <span className="text-sm font-medium text-[#0F1419]">#{item.rank}</span>
                    </div>

                    <p
                      className="cursor-pointer text-xs leading-[20px] text-black"
                      onClick={() => {
                        window.open(
                          `https://x.com/${item?.author?.twitterUsername}/status/${item?.id}`,
                          '_blank'
                        );
                      }}
                    >
                      {item.text}
                    </p>

                    <Divider
                      sx={{
                        marginTop: 3,
                        width: '100%',
                        borderColor: '#EBEEF0',
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </TabPanel>
        </TabContext>
      </div>
    </>
  );
};

export default Reward;

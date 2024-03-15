import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useToggle } from 'ahooks';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

import { BasicButton, PrimaryButton } from '../../components/Button';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import { useHolderList } from '../../service/share';
import { useTweetList } from '../../service/tweet';
import useProfileModal from '../../store/useProfileModal';
import useShareStore from '../../store/useShareStore';
import useTweetStore from '../../store/useTweetStore';

import BuyModal from './BuyModal';
import SellModal from './SellModal';

const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
    <g clipPath="url(#clip0_410_42042)">
      <path d="M5.00056 16.9065V12.6882L0.142822 9.63672L5.00056 16.9065Z" fill="#C7C7E0" />
      <path d="M5.0166 16.9065V12.6882L9.87443 9.63672L5.01669 16.9065H5.0166Z" fill="#A3A3D2" />
      <path d="M5.00048 11.6404V6.25684L0.0869141 8.62012L5.00048 11.6404Z" fill="#C7C7E0" />
      <path d="M5.0166 11.6404V6.25684L9.93017 8.62021L5.0166 11.6404Z" fill="#A3A3D2" />
      <path d="M0.0869141 8.62L5.00039 0.09375V6.25662L0.0869141 8.62Z" fill="#C7C7E0" />
      <path d="M9.93008 8.62L5.0166 0.09375V6.25662L9.93008 8.62Z" fill="#A3A3D2" />
    </g>
    <defs>
      <clipPath id="clip0_410_42042">
        <rect width="10" height="17" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const ProfileModal = () => {
  const { openProfile, currentInfo } = useProfileModal((state) => ({ ...state }));
  const { run: getHolderList } = useHolderList();
  const { run: getTweetList } = useTweetList();
  const { holderList, holderingList } = useShareStore((state) => ({ ...state }));
  const { tweetList } = useTweetStore((state) => ({ ...state }));
  const [isBuyModalOpen, { setLeft: closeBuyModal, setRight: openBuyModal }] = useToggle(false);
  const [isSellModalOpen, { setLeft: closeSellModal, setRight: openSellModal }] = useToggle(false);

  const rows = holderList?.map((item) => ({
    holder: (
      <div className="flex items-center space-x-1">
        <img
          onClick={() => openProfile(item)}
          src={item.holderUser?.avatar}
          alt=""
          className="w-5 cursor-pointer rounded-full"
        />
        <span className="text-xs text-[#0F1419]">{item.holderUser?.username}</span>
      </div>
    ),
    shares: Number(item.shares) / 100,
    value: (
      <div className="flex items-center space-x-1">
        <Icon />
        <NumberDisplayer className="text-xs text-[#0F1419]" text={item.value!} />
      </div>
    ),
  }));

  const holding = holderingList?.map((item) => ({
    holder: (
      <div className="flex items-center space-x-1">
        <img
          onClick={() => openProfile(item)}
          src={item.subjectUser?.avatar}
          alt=""
          className="w-5 cursor-pointer rounded-full"
        />
        <span className="text-xs text-[#0F1419]">{item.subjectUser?.username}</span>
      </div>
    ),
    shares: Number(item.shares) / 100,
    value: (
      <div className="flex items-center space-x-1">
        <Icon />
        <NumberDisplayer className="text-xs text-[#0F1419]" text={item.value!} />
      </div>
    ),
  }));

  const holder16 = [
    {
      holder: (
        <div className="flex items-center space-x-1">
          <img
            onClick={openProfile}
            src="https://s3-alpha-sig.figma.com/img/b0e6/1e6e/9e0b10bc7df7f8b016a4a4b14a72390c?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QbzfTy62BKZoEECa3NIt1~o1YdznKeE79nKfwJ2eLXuw2csMXa8DSL~AjX2hqfXcV5CaSKQgqPk0nBDdaH1QMzoyApx~2GZyLzYidWjfL~4mAjmWIyAls4NVpTdwgcLmlzONayjLLIiUCmZPGSCLRRr2uGxX1vFBf0A27xQPXL-6Em0g~ufRsv0YMPtBaOTxGxRI35ifobRhI2H7BK3fPHbXojr4L9OMRT3OAoG9FEAVYD0ik7uLeJO5FYCeFS2jb3Yswp6VoYiPKY8EbVSYEQPK-bzVvDzkS6r-lb6vEQq5TOnuvvcDVUncy3wAUSwSXj1fQA15XJhcVVA5qban9w__"
            alt=""
            className="w-5 cursor-pointer rounded-full"
          />
          <span className="text-xs text-[#0F1419]">Patricia Smith</span>
        </div>
      ),
      shares: 4,
      value: (
        <div className="flex items-center space-x-1">
          <Icon />
          <span className="text-xs text-[#0F1419]">2.132</span>
        </div>
      ),
    },
    {
      holder: (
        <div className="flex items-center space-x-1">
          <img
            onClick={openProfile}
            src="https://s3-alpha-sig.figma.com/img/a943/c456/1554d0938e310067d530a29ef6ff1664?Expires=1707696000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pJNMzft~d6XupbZFvcLHyodBsjJTxF7efO9NOhhuM3umsQ6eQgcuugzffRuin4KDl7fOI4dSwu64XS5i2UcBXCCr~jiUsqf8afYa-rcLlTkS8mIC-p2N~OxV9bK1qPFhdGEbLF6Bv8r5KtXSeK5eWnmyUjDVLKjOM-2t7uPL8Z~Uc83MuZGGWiTiF2a16x~sKBwqSuOm7cFI85vzwB2xz1zOzn~dL7fwVVm52zbOuoqMg0v-oRi238IkEOgEt0Yup4Huk47ApntDZRzENu3devBDz~fqIBwQANqBXEG1Gq0lHdl7JgDem9oUTAUZjnHHqoOYIhmvDPPt~aVS0MXnpg__"
            alt=""
            className="w-5 cursor-pointer rounded-full"
          />
          <span className="text-xs text-[#0F1419]">Brenda Wilson</span>
        </div>
      ),
      shares: 16,
      value: (
        <div className="flex items-center space-x-1">
          <Icon />
          <span className="text-xs text-[#0F1419]">3.612</span>
        </div>
      ),
    },
    {
      holder: (
        <div className="flex items-center space-x-1">
          <img
            onClick={openProfile}
            src="https://s3-alpha-sig.figma.com/img/80e2/698e/d168cf144ccafa1e4ed54123a0b6d7a3?Expires=1707696000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErPGgBW-siAsqlC7hQjIGBFbEXMKzHwZmAQKXuUYt4KlYYnkKwryJpoI~CnKN6AKqjiIyzZUP84Bmmq~qFcXDMor3hAQo6KdioyETNQeLJg3LxoKN~T3E4FeUStL99qDsUu334PMVTqgroF13-8esW7Dx3GqdnU7Dnj-lFIA0VwcfeBHZSm22qXp8Fb0Yha8PHC4XOZ2Z7jj0i1mfcxQXfMG~JU0SC-pRT2z2S19p06HUgFfKSYNemsAMVav-0hFLliWyMq5ed8uvoYlfe8XaURtDtnk59gz8cEX8nBaG-QNbCiWaDlXFqY5Kkl3XseFaRPZBacF2whoYMQfLpjFuA__"
            alt=""
            className="w-5 cursor-pointer rounded-full"
          />
          <span className="text-xs text-[#0F1419]">Laura Lewis</span>
        </div>
      ),
      shares: 23,
      value: (
        <div className="flex items-center space-x-1">
          <Icon />
          <span className="text-xs text-[#0F1419]">3.191</span>
        </div>
      ),
    },
  ];

  const ranking = [
    {
      data: 'Jan 05 2023, 14:32',
      post: 'Introducing Blast: The only Ethereum L2 with native yield for ETH and stablecoins.',
      rank: 17,
      value: (
        <div className="flex items-center space-x-1">
          <Icon />
          <span className="text-xs text-[#0F1419]">2.102</span>
        </div>
      ),
    },
    {
      data: 'Dec 07 2023, 21:36',
      post: 'Much like mastering the force of gravity in snowboarding, reflexivity serves as the gravitational force in the capital market',
      rank: 23,
      value: (
        <div className="flex items-center space-x-1">
          <Icon />
          <span className="text-xs text-[#0F1419]">1.034</span>
        </div>
      ),
    },
    {
      data: 'Apr 10 2023, 17:36',
      post: 'Singapore crypto chads wanting to work with a team, def check out the role open at Primitive- Dovey and the crew are always on the cutting edge of developments.',
      rank: 45,
      value: (
        <div className="flex items-center space-x-1">
          <Icon />
          <span className="text-xs text-[#0F1419]">1.126</span>
        </div>
      ),
    },
  ];

  const { open, closeProfile } = useProfileModal((state) => ({ ...state }));
  const [key, setKey] = useState(0);
  const list = [
    {
      text: `Holders (${holderList?.length})`,
    },
    {
      text: 'Holding',
    },
    {
      text: ' Tweet Ranking',
    },
  ];

  const fetchMap: Record<string, any> = {
    0: () =>
      getHolderList({
        subject: currentInfo?.walletAddress,
      }),
    1: () =>
      getHolderList({
        holder: currentInfo?.walletAddress,
      }),
    2: () =>
      getTweetList({
        authorId: currentInfo?.twitterId,
      }),
  };

  useEffect(() => {
    if (open) {
      getHolderList({
        subject: currentInfo?.walletAddress,
      });
    } else {
      setKey(0);
    }
  }, [open]);

  useEffect(() => {
    fetchMap[key]();
  }, [key]);

  return (
    <>
      <Modal onClose={closeProfile} open={open} width={626}>
        <div className="relative flex flex-col items-center">
          <h2 className="text-[24px] font-medium text-[#2E2E32]">Profile</h2>
          <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

          <div className="mt-6 flex w-full items-center justify-between">
            <div className="flex items-center space-x-[14px]">
              <img
                src={currentInfo?.avatar}
                alt="avatar"
                className="h-[75px] w-[75px] cursor-pointer rounded-full"
              />
              <div className="flex flex-col space-y-[6px]">
                <span className="text-[20px] font-bold leading-[20px] text-[#0F1419]">
                  {currentInfo?.username}
                </span>
                <span className="text-[16px] font-medium leading-[16px] text-[#919099]">
                  @{currentInfo?.twitterUsername}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-[14px] font-bold text-[#2E2E32]">Floor Price:</span>
                  <Icon />
                  <NumberDisplayer
                    className="text-[14px] text-[#0F1419]"
                    text={currentInfo?.price}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <PrimaryButton
                onClick={openBuyModal}
                classes={{
                  contained: '!w-[86px] !px-[30px] !py-[10px]',
                }}
              >
                Buy
              </PrimaryButton>
              <BasicButton
                onClick={openSellModal}
                classes={{
                  outlined: '!w-[86px] !px-[30px] !py-[10px]',
                }}
              >
                Sell
              </BasicButton>
              {isBuyModalOpen && <BuyModal onClose={closeBuyModal} />}
              {isSellModalOpen && <SellModal onClose={closeSellModal} />}
            </div>
          </div>

          <div className="mt-3 mb-6 h-[1px] w-full bg-[#EBEEF0]"></div>

          <div className="flex w-full space-x-[30px]">
            {list.map((item, i) => (
              <div
                onClick={() => {
                  setKey(i);
                }}
                key={item.text}
                className={`rounded-full border border-[#0F1419] py-2 px-[18px] font-medium leading-[18px] ${
                  key === i ? 'bg-[#2C2A2A] text-white' : 'cursor-pointer bg-white text-[#0F1419]'
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          {key === 0 && (
            <TableContainer
              sx={{
                marginTop: 2,
              }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Holder</TableCell>
                    <TableCell>Hold shares</TableCell>
                    <TableCell>Shares Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row, i) => (
                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row.holder}
                      </TableCell>
                      <TableCell>{row.shares}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {key === 1 && (
            <TableContainer
              sx={{
                marginTop: 2,
              }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Creator</TableCell>
                    <TableCell>Hold shares</TableCell>
                    <TableCell>Shares Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {holding?.map((row, i) => (
                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row.holder}
                      </TableCell>
                      <TableCell>{row.shares}</TableCell>
                      <TableCell>{row.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {key === 2 && (
            <TableContainer
              sx={{
                marginTop: 2,
              }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Post</TableCell>
                    <TableCell>Rank</TableCell>
                    <TableCell>Reward</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tweetList?.map((row, i) => (
                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" width={180}>
                        {dayjs(row.createdAt).format('YYYY/MM/DD HH:mm')}
                      </TableCell>
                      <TableCell>
                        <a
                          className="inline-block max-w-[200px] truncate"
                          href={`https://twitter.com/${currentInfo?.twitterUsername}/status/${currentInfo?.twitterId}`}
                        >
                          {row.text}
                        </a>
                      </TableCell>
                      <TableCell>#{row.rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Icon />
                          <span>
                            {new BigNumber(Number(row.reward))
                              .dividedBy(new BigNumber(Math.pow(10, 18)))
                              .toNumber()
                              .toLocaleString(undefined, { maximumFractionDigits: 20 })}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;

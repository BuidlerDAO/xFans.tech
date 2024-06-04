import React, { useEffect, useMemo, useState } from 'react';
import { TableFooter, TablePagination } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useToggle } from 'ahooks';
import dayjs from 'dayjs';

import { BasicButton, PrimaryButton } from '../../components/Button';
import TableEmptyWidget from '../../components/Empty';
import SolanaIcon from '../../components/icons/SolanaIcon';
import { CenterLoading } from '../../components/Loading';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import { ROWS_PER_PAGE, SHARE_UNIT_MODIFIER } from '../../constants';
import { useHolderList } from '../../service/share';
import { useTweetList } from '../../service/tweet';
import useProfileModal from '../../store/useProfileModal';
import useShareStore from '../../store/useShareStore';
import useTweetStore from '../../store/useTweetStore';

import BuyModal from './BuyModal';
import SellModal from './SellModal';

const ProfileModal = () => {
  const { openProfile, currentInfo, currentKey } = useProfileModal((state) => ({ ...state }));
  const { run: getHolderList, loading: isGetHolderListLoading } = useHolderList();
  const { run: getTweetList, loading: isGetTweetListLoading } = useTweetList();
  const { holderList, holderListTotal, holderingList, holderingListTotal } = useShareStore(
    (state) => ({ ...state })
  );
  const { tweetList, tweetListTotal } = useTweetStore((state) => ({ ...state }));
  const [isBuyModalOpen, { setLeft: closeBuyModal, setRight: openBuyModal }] = useToggle(false);
  const [isSellModalOpen, { setLeft: closeSellModal, setRight: openSellModal }] = useToggle(false);
  const [loadingx, setLoadingx] = useState(true);

  const openTwitterProfile = (username: string | undefined) =>
    username && window.open(`https://twitter.com/${username}`, '_blank');

  const rows = holderList?.map((item) => ({
    holder: (
      <div
        className="flex cursor-pointer items-center space-x-1"
        onClick={() => openTwitterProfile(item.holderUser?.twitterUsername)}
      >
        <img src={item.holderUser?.avatar} alt="" className="w-5 rounded-full" />
        <span className="text-xs text-[#0F1419]">{item.holderUser?.username}</span>
      </div>
    ),
    shares: Number(item.shares) / SHARE_UNIT_MODIFIER,
    value: (
      <div className="flex items-center space-x-1">
        <SolanaIcon />
        <NumberDisplayer className="text-xs text-[#0F1419]" text={item.value!} />
      </div>
    ),
  }));

  const holding = holderingList?.map((item) => ({
    holder: (
      <div
        className="flex cursor-pointer items-center space-x-1"
        onClick={() => openTwitterProfile(item.subjectUser?.twitterUsername)}
      >
        <img src={item.subjectUser?.avatar} alt="" className="w-5 cursor-pointer rounded-full" />
        <span className="text-xs text-[#0F1419]">{item.subjectUser?.username}</span>
      </div>
    ),
    shares: Number(item.shares) / SHARE_UNIT_MODIFIER,
    value: (
      <div className="flex items-center space-x-1">
        <SolanaIcon />
        <NumberDisplayer className="text-xs text-[#0F1419]" text={item.value!} />
      </div>
    ),
  }));

  const { open, closeProfile } = useProfileModal((state) => ({ ...state }));
  const list = [
    {
      text: `Holders (${holderListTotal})`,
    },
    {
      text: 'Holding',
    },
    {
      text: ' Tweet Ranking',
    },
  ];

  const fetchMap: Record<string, any> = useMemo(() => {
    return {
      0: (params: PageProps) =>
        getHolderList({
          subject: currentInfo?.walletAddress,
          ...params,
        }),
      1: (params: PageProps) =>
        getHolderList({
          holder: currentInfo?.walletAddress,
          ...params,
        }),
      2: (params: PageProps) =>
        getTweetList({
          authorId: currentInfo?.twitterId,
          ...params,
        }),
    };
  }, [currentInfo?.twitterId, currentInfo?.walletAddress, getHolderList, getTweetList]);

  useEffect(() => {
    if (!open) {
      useProfileModal.setState({ currentKey: 0 });
      useShareStore.setState({
        holderList: null,
        holderListTotal: 0,
        holderingList: null,
        holderingListTotal: 0,
      });
    }
  }, [open]);

  useEffect(() => {
    if (isGetHolderListLoading || isGetTweetListLoading) {
      setLoadingx(true);
      setTimeout(() => {
        setLoadingx(false);
      }, 500);
    }
  }, [isGetHolderListLoading, isGetTweetListLoading]);

  const [curPages, setCurPages] = useState([0, 0, 0]);
  function handlePageChange(nextPage: number) {
    if (open) setLoadingx(true);
    const nextPages = [...curPages];
    nextPages[currentKey] = nextPage;
    setCurPages(nextPages);
  }

  useEffect(() => {
    if (open) {
      fetchMap[currentKey]({ offset: curPages[currentKey] * ROWS_PER_PAGE, limit: ROWS_PER_PAGE });
    }
  }, [curPages, fetchMap, currentKey, open]);

  return (
    <>
      <Modal onClose={closeProfile} open={open} width={626} closebuttonstyle={{ marginTop: '5px' }}>
        <div className="relative flex flex-col items-center">
          <h2 className="text-[24px] font-medium text-[#2E2E32]">Profile</h2>
          <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

          <div className="mt-6 flex w-full items-center justify-between">
            <div className="flex items-center space-x-[14px]">
              <img
                src={currentInfo?.avatar}
                alt="avatar"
                onClick={() => openTwitterProfile(currentInfo?.twitterUsername)}
                className="xfans-font-sf h-[75px] w-[75px] cursor-pointer rounded-full"
              />
              <div className="xfans-font-sf flex flex-col space-y-[6px]">
                <span
                  onClick={() => openTwitterProfile(currentInfo?.twitterUsername)}
                  className="cursor-pointer text-[20px] font-bold leading-[20px] text-[#0F1419]"
                >
                  {currentInfo?.username}
                </span>
                <span
                  onClick={() => openTwitterProfile(currentInfo?.twitterUsername)}
                  className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#919099]"
                >
                  @{currentInfo?.twitterUsername}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="xfans-font-sf text-[14px] font-bold text-[#2E2E32]">
                    Floor Price:
                  </span>
                  <SolanaIcon />
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
                  useProfileModal.setState({
                    currentKey: i,
                  });
                }}
                key={item.text}
                className={`xfans-font-sf rounded-full border border-[#0F1419] py-2 px-[18px] font-medium leading-[18px] ${
                  currentKey === i
                    ? 'bg-[#2C2A2A] text-white'
                    : 'cursor-pointer bg-white text-[#0F1419]'
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          {currentKey === 0 && (
            <TableContainer
              sx={{
                marginTop: 2,
              }}
            >
              {isGetHolderListLoading || loadingx ? (
                <CenterLoading />
              ) : rows == null || rows?.length === 0 ? (
                <TableEmptyWidget
                  containerClassName="pt-[30px] pb-[30px]"
                  label="No holders yet."
                />
              ) : (
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
                  {holderListTotal > ROWS_PER_PAGE && (
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          disabled={isGetHolderListLoading}
                          count={holderListTotal}
                          page={curPages[0]}
                          onPageChange={(_, nextPage) => handlePageChange(nextPage)}
                          rowsPerPage={ROWS_PER_PAGE}
                          rowsPerPageOptions={[]}
                        />
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              )}
            </TableContainer>
          )}

          {currentKey === 1 && (
            <TableContainer
              sx={{
                marginTop: 2,
              }}
            >
              {isGetHolderListLoading || loadingx ? (
                <CenterLoading />
              ) : holding == null || holding.length === 0 ? (
                <TableEmptyWidget
                  containerClassName="pt-[30px] pb-[30px]"
                  label="No shares purchased yet."
                />
              ) : (
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Creator</TableCell>
                      <TableCell>Hold shares</TableCell>
                      <TableCell>Shares Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holding.map((row, i) => (
                      <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {row.holder}
                        </TableCell>
                        <TableCell>{row.shares}</TableCell>
                        <TableCell>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {holderingListTotal > ROWS_PER_PAGE && (
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          disabled={isGetHolderListLoading}
                          count={holderingListTotal}
                          page={curPages[1]}
                          onPageChange={(_, nextPage) => handlePageChange(nextPage)}
                          rowsPerPage={ROWS_PER_PAGE}
                          rowsPerPageOptions={[]}
                        />
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              )}
            </TableContainer>
          )}

          {currentKey === 2 && (
            <TableContainer
              sx={{
                marginTop: 2,
              }}
            >
              {isGetTweetListLoading || loadingx ? (
                <CenterLoading />
              ) : tweetList == null || tweetList.length === 0 ? (
                <TableEmptyWidget
                  containerClassName="pt-[30px] pb-[30px]"
                  label="No records found. Vote to join weekly rankings."
                />
              ) : (
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
                    {tweetList.map((row, i) => (
                      <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row" width={180}>
                          {dayjs(row.createdAt).format('YYYY/MM/DD HH:mm')}
                        </TableCell>
                        <TableCell>
                          <span
                            className="inline-block max-w-[200px] truncate hover:cursor-pointer"
                            onClick={() => {
                              const newTab = window.open(
                                `https://x.com/${currentInfo?.twitterUsername}/status/${currentInfo?.twitterId}`,
                                '_blank'
                              );
                              newTab?.focus();
                            }}
                          >
                            {row.text}
                          </span>
                        </TableCell>
                        <TableCell>#{row.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <SolanaIcon />
                            <NumberDisplayer className="text-xs text-[#0F1419]" text={row.reward} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {tweetListTotal > ROWS_PER_PAGE && (
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          disabled={isGetTweetListLoading}
                          count={tweetListTotal}
                          page={curPages[2]}
                          onPageChange={(_, nextPage) => handlePageChange(nextPage)}
                          rowsPerPage={ROWS_PER_PAGE}
                          rowsPerPageOptions={[]}
                        />
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              )}
            </TableContainer>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;

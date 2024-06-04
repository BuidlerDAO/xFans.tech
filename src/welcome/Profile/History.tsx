import React, { useEffect, useState } from 'react';
import { Divider, TableFooter, TablePagination } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useToggle } from 'ahooks';
import dayjs from 'dayjs';

import { BasicButton } from '../../components/Button';
import TableEmptyWidget from '../../components/Empty';
import SolanaIcon from '../../components/icons/SolanaIcon';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import { ROWS_PER_PAGE } from '../../constants';
import { useChainPrice } from '../../hooks/useChainPrice';
import { useTweetRewardHistory } from '../../service/tweet';
import useGlobalStore from '../../store/useGlobalStore';
import useTweetStore from '../../store/useTweetStore';
import { formatDollar } from '../../utils';

const History = (props: { price?: number }) => {
  const { chain } = useGlobalStore();
  const [isOpen, { setLeft: close, setRight: open }] = useToggle(false);
  const { rewardHistoryList, rewardHistoryListTotal, rewardHistoryTotalRewardAmount } =
    useTweetStore((state) => ({ ...state }));
  const [page, setPage] = useState(0);
  const chainPrice = useChainPrice(chain);

  const { run: getRewardHistory, loading } = useTweetRewardHistory();

  useEffect(() => {
    getRewardHistory({ offset: page * ROWS_PER_PAGE, limit: ROWS_PER_PAGE });
  }, [getRewardHistory, page]);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  return (
    <>
      <BasicButton
        variant="outlined"
        disableRipple
        classes={{
          outlined: '!py-1 !px-3 !w-[90px]',
        }}
        onClick={open}
      >
        History
      </BasicButton>
      <Modal onClose={close} open={isOpen} width={626} closebuttonstyle={{ marginTop: '5px' }}>
        <div className="relative flex flex-col items-center">
          <h2 className="text-[24px] font-medium text-[#2E2E32]">Claim History</h2>
          <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

          <div className="mt-6 flex w-full items-center">
            <div className="flex items-center space-x-[10px]">
              <span className="text-xl font-bold text-[#2E2E32]" style={{ letterSpacing: 1 }}>
                Reward claimed:
              </span>
              <div className="flex flex-col space-y-[6px]">
                <span className="text-xl font-medium leading-[20px] text-[#0F1419]">
                  {formatDollar(rewardHistoryTotalRewardAmount, chainPrice)}
                </span>
                <div className="flex items-center space-x-1">
                  <SolanaIcon />
                  <NumberDisplayer
                    className="text-sm font-medium text-[#919099]"
                    text={rewardHistoryTotalRewardAmount}
                  />
                </div>
              </div>
            </div>
          </div>

          <Divider
            sx={{
              marginTop: 3,
              width: '100%',
              borderColor: '#EBEEF0',
            }}
          />

          <TableContainer
            sx={{
              marginTop: 0,
            }}
          >
            {rewardHistoryList == null || rewardHistoryList.length === 0 ? (
              <TableEmptyWidget
                containerClassName="pt-[80px] pb-[80px]"
                label="No claim history found."
              />
            ) : (
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderColor: '#EBEEF0',
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        borderColor: '#EBEEF0',
                      }}
                    >
                      Creator
                    </TableCell>
                    <TableCell
                      sx={{
                        borderColor: '#EBEEF0',
                      }}
                    >
                      Rank
                    </TableCell>
                    <TableCell
                      sx={{
                        borderColor: '#EBEEF0',
                      }}
                    >
                      Total Reward
                    </TableCell>
                    <TableCell
                      sx={{
                        borderColor: '#EBEEF0',
                      }}
                    >
                      Your Reward
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewardHistoryList?.map((row, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          borderColor: '#EBEEF0',
                        }}
                      >
                        {dayjs(row.claimedAt).format('YYYY/MM/DD HH:mm')}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: '#EBEEF0',
                        }}
                      >
                        {row.creator}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: '#EBEEF0',
                        }}
                      >
                        {row.rank}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: '#EBEEF0',
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          <SolanaIcon />
                          <NumberDisplayer
                            className="text-xs text-[#0F1419]"
                            text={row.totalRewardAmount}
                          />
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderColor: '#EBEEF0',
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          <SolanaIcon />
                          <NumberDisplayer
                            className="text-xs text-[#0F1419]"
                            text={row.ethAmount}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {rewardHistoryListTotal > ROWS_PER_PAGE && (
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        disabled={loading}
                        count={rewardHistoryListTotal}
                        page={page}
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
        </div>
      </Modal>
    </>
  );
};

export default History;

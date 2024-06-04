import React, { useEffect } from 'react';
import { Divider } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useToggle } from 'ahooks';
import dayjs from 'dayjs';

import { BasicButton, PrimaryLoadingButton } from '../../components/Button';
import TableEmptyWidget from '../../components/Empty';
import SolanaIcon from '../../components/icons/SolanaIcon';
import Modal from '../../components/Modal';
import { NumberDisplayer } from '../../components/NumberDisplayer';
import * as toaster from '../../components/Toaster';
import { useChainPrice } from '../../hooks/useChainPrice';
import { useTweetReward } from '../../service/tweet';
import { useWalletClaimReward } from '../../service/wallet';
import useGlobalStore from '../../store/useGlobalStore';
import useTweetStore from '../../store/useTweetStore';
import { formatDollar } from '../../utils';

const Claim = (props: { price?: number }) => {
  const { chain } = useGlobalStore();
  const [isOpen, { setLeft: close, setRight: open }] = useToggle(false);
  const { tweetRewardList, tweetRewardTotalRewardAmount } = useTweetStore((state) => ({
    ...state,
  }));
  const { run: getReward } = useTweetReward();
  const chainPrice = useChainPrice(chain);

  const { loading, run: claimReward } = useWalletClaimReward(
    tweetRewardList,
    (resp) => {
      if (resp.code === 0) {
        toaster.success(toaster.ToastMessage.CLAIM_SUCCESS);
      } else {
        toaster.error(toaster.ToastMessage.CLAIM_FAILURE);
      }
      getReward();
    },
    () => {
      toaster.error(toaster.ToastMessage.CLAIM_FAILURE);
      getReward();
    }
  );

  useEffect(() => {
    getReward();
  }, [getReward]);

  return (
    <>
      <BasicButton
        classes={{
          outlined: '!py-1 !px-3 !w-[90px]',
        }}
        onClick={open}
      >
        Claim
      </BasicButton>
      <Modal onClose={close} open={isOpen} width={626} closebuttonstyle={{ marginTop: '5px' }}>
        <div className="relative flex flex-col items-center">
          <h2 className="text-[24px] font-medium text-[#2E2E32]">Claim Reward</h2>
          <div className="mt-[15px] h-[1px] w-[438px] bg-[#EBEEF0]"></div>

          <div className="mt-6 flex w-full items-center justify-between">
            <div className="flex items-center space-x-[10px]">
              <span className="text-xl font-bold text-[#2E2E32]" style={{ letterSpacing: 1 }}>
                Reward:
              </span>
              <div className="flex flex-col space-y-2">
                <span className="text-xl font-medium leading-[20px] text-[#0F1419]">
                  {formatDollar(tweetRewardTotalRewardAmount, chainPrice)}
                </span>
                <div className="flex items-center space-x-1">
                  <SolanaIcon />
                  <NumberDisplayer
                    className="text-sm font-medium text-[#919099]"
                    text={tweetRewardTotalRewardAmount}
                  />
                </div>
              </div>
            </div>

            <PrimaryLoadingButton
              classes={{
                contained: '!py-[14px] !px-[30px] !w-[170px]',
              }}
              onClick={() => {
                claimReward();
              }}
              disabled={loading || tweetRewardTotalRewardAmount === '0'}
              loading={loading}
              loadingPosition="end"
              endIcon={<span />}
            >
              Claim
            </PrimaryLoadingButton>
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
              maxHeight: '500px', // 设置固定高度
              overflowY: 'auto', // 添加垂直滚动
            }}
          >
            {tweetRewardList == null || tweetRewardList.length === 0 ? (
              <TableEmptyWidget
                containerClassName="pt-[80px] pb-[80px]"
                label="You have no rewards available to claim"
              />
            ) : (
              <Table aria-label="simple table" stickyHeader={true}>
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
                  {tweetRewardList?.map((row, i) => (
                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          borderColor: '#EBEEF0',
                        }}
                      >
                        {dayjs(row.createdAt).format('YYYY/MM/DD HH:mm')}
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
              </Table>
            )}
          </TableContainer>
        </div>
      </Modal>
    </>
  );
};

export default Claim;

import React, { FC, useEffect } from 'react';
import { NextButton, VerifyButton } from '../../components/buttons/loginButton';
import '../../tailwind.css';
import {
  XFANS_TWITTER_HOMEPAGE,
  XFANS_TWITTES,
  LOCALSTORAGE_TRUE,
  LOCALSTORAGE_FALSE,
  XFANS_TWITTER_GO_FOLLOW,
  XFANS_TWITTER_GO_FOLLOW_VERIFY,
  XFANS_TWITTER_GO_RETWEETS,
  XFANS_TWITTER_GO_RETWEETS_VERIFY,
  XFANS_CHECK_RETWEET,
  XFANS_DONE,
  XFANS_VERIFY,
  XFANS_GO,
} from '../../constants';
import http, { ResultData } from '../../service/request';
import useGlobalStore from '../../store/useGlobalStore';
interface CongratulationPageProps {
  goProfile: () => void; // 定义一个函数类型的属性
}

const CongratulationPage: FC<CongratulationPageProps> = ({ goProfile }) => {
  const [goFollow, setGoFollow] = React.useState(
    localStorage.getItem(XFANS_TWITTER_GO_FOLLOW) ?? LOCALSTORAGE_FALSE
  );
  const [goFollowVerify, setGoFollowVerify] = React.useState(
    localStorage.getItem(XFANS_TWITTER_GO_FOLLOW_VERIFY ?? LOCALSTORAGE_FALSE)
  );

  const [goRetwittes, setGoRetwittes] = React.useState(
    localStorage.getItem(XFANS_TWITTER_GO_RETWEETS) ?? LOCALSTORAGE_FALSE
  );
  const [goRetwittesVerify, setGoRetwittesVerify] = React.useState(
    localStorage.getItem(XFANS_TWITTER_GO_RETWEETS_VERIFY ?? LOCALSTORAGE_FALSE)
  );

  const followStatus =
    goFollow === LOCALSTORAGE_TRUE
      ? goFollowVerify === LOCALSTORAGE_TRUE
        ? XFANS_DONE
        : XFANS_VERIFY
      : XFANS_GO;
  const retweetStatus =
    goRetwittes === LOCALSTORAGE_TRUE
      ? goRetwittesVerify === LOCALSTORAGE_TRUE
        ? XFANS_DONE
        : XFANS_VERIFY
      : XFANS_GO;
  const startStatus = followStatus === XFANS_DONE && retweetStatus === XFANS_DONE;

  // 打开一个新的标签页并访问指定网页
  const openNewTab = (url: string) => {
    const newTab = window.open(url, '_blank');
    newTab?.focus();
  };

  const _setGoRetwittesVerify = (r: string) => {
    setGoRetwittesVerify(r);
    localStorage.setItem(XFANS_TWITTER_GO_RETWEETS_VERIFY, r);
  };

  const _setGoRetwittes = (r: string) => {
    setGoRetwittes(r);
    localStorage.setItem(XFANS_TWITTER_GO_RETWEETS, r);
  };

  // 再获取url中的token 作为第一优先级
  const urlParams = new URLSearchParams(window.location.search);
  const xfansCheckRetweet = urlParams.get(XFANS_CHECK_RETWEET);

  const checkTasksStatus = async () => {
    try {
      const activateData = (await http.post2(`api/user/activate/check-task`, false)) as ResultData;
      if (activateData.code === 0 && activateData.data.finished === true) {
        _setGoRetwittesVerify(LOCALSTORAGE_TRUE);
      } else {
        if (!xfansCheckRetweet) {
          _setGoRetwittes(LOCALSTORAGE_FALSE);
        } else {
          _setGoRetwittes(LOCALSTORAGE_TRUE);
        }
        _setGoRetwittesVerify(LOCALSTORAGE_FALSE);
      }
    } catch (error) {
      if (!xfansCheckRetweet) {
        _setGoRetwittes(LOCALSTORAGE_FALSE);
      } else {
        _setGoRetwittes(LOCALSTORAGE_TRUE);
      }
      _setGoRetwittesVerify(LOCALSTORAGE_FALSE);
    }
  };

  useEffect(() => {
    if (!xfansCheckRetweet) {
      checkTasksStatus();
    }
  }, []);

  return (
    <div className="min-h-screen w-full items-center justify-center text-center">
      <p className="mt-[81px] mb-[44px] text-center text-[24px] font-bold leading-[38px] text-[#0F1419]">
        Congratulations!
      </p>
      <p className="mb-[21px] text-center text-[14px] font-normal leading-[24px] text-[#5B7083]">
        Complete the following tasks to activate your account
      </p>
      <div className="flex px-[58px]">
        <svg
          width="24"
          height="23"
          viewBox="0 0 24 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0.201305H7.09819L13.6592 8.98639L21.8261 0L23.7666 0.0335508L14.6267 10.2502L24 22.7987H16.9046L10.712 14.612L3.14694 23H1.2374L9.77267 13.4153L0 0.201305ZM6.42888 1.49866H2.6801L17.678 21.4678H21.3593L6.42888 1.49866Z"
            fill="#121516"
          />
        </svg>
        <p className="mx-[16px] mb-[21px] w-[207px] text-center text-[14px] font-normal leading-[24px] text-[#5B7083]">
          Follow @xFans on X
        </p>
        <VerifyButton
          variant="contained"
          disableElevation
          disabled={followStatus === XFANS_DONE}
          onClick={() => {
            switch (followStatus) {
              case XFANS_GO:
                openNewTab(XFANS_TWITTER_HOMEPAGE);
                setGoFollow(LOCALSTORAGE_TRUE);
                localStorage.setItem(XFANS_TWITTER_GO_FOLLOW, LOCALSTORAGE_TRUE);
                break;

              case XFANS_VERIFY:
                setTimeout(() => {
                  setGoFollowVerify(LOCALSTORAGE_TRUE);
                  localStorage.setItem(XFANS_TWITTER_GO_FOLLOW_VERIFY, LOCALSTORAGE_TRUE);
                }, 1000);
                break;

              default:
                break;
            }
          }}
        >
          {followStatus}
        </VerifyButton>
      </div>
      <div className="mb-[44px] flex px-[58px]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 4C4.46244 4 2 6.46245 2 9.5C2 15 8.5 20 12 21.1631C15.5 20 22 15 22 9.5C22 6.46245 19.5375 4 16.5 4C14.6399 4 12.9954 4.92345 12 6.3369C11.0046 4.92345 9.36015 4 7.5 4Z"
            stroke="#333333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mx-[16px] mb-[21px] w-[207px] text-center text-[14px] font-normal leading-[24px] text-[#5B7083]">
          Retweet tweets on X
        </p>
        <VerifyButton
          variant="contained"
          disableElevation
          disabled={retweetStatus === XFANS_DONE}
          onClick={() => {
            switch (retweetStatus) {
              case XFANS_GO:
                _setGoRetwittes(LOCALSTORAGE_TRUE);
                openNewTab(XFANS_TWITTES);
                break;

              case XFANS_VERIFY:
                checkTasksStatus();
                break;

              default:
                break;
            }
          }}
        >
          {retweetStatus}
        </VerifyButton>
      </div>
      <NextButton
        variant="contained"
        disableElevation
        onClick={async () => {
          try {
            const activateData = (await http.post(`api/user/activate`)) as ResultData;
            if (activateData.code === 0) {
              goProfile();
            } else {
              useGlobalStore.setState({
                message: activateData?.message,
                messageType: 'error',
                messageOpen: true,
              });
            }
          } catch (error) {
            useGlobalStore.setState({
              message: '注册失败!',
              messageType: 'error',
              messageOpen: true,
            });
          }
        }}
        disabled={!startStatus}
      >
        Start
      </NextButton>
    </div>
  );
};

export default CongratulationPage;

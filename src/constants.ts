const XFANS_TWITTER_HOMEPAGE = 'https://twitter.com/BuidlerDAO';
const XFANS_TWITTES =
  'https://twitter.com/BuidlerDAO/status/1744712912537788860?xfans_check_retweet=1';
const LOCALSTORAGE_TRUE = 'true';
const LOCALSTORAGE_FALSE = 'false';
const XFANS_TWITTER_GO_FOLLOW = 'xfans-go-follow';
const XFANS_TWITTER_GO_FOLLOW_VERIFY = 'xfans-go-follow-verify';
const XFANS_TWITTER_GO_RETWEETS = 'xfans-go-retweets';
const XFANS_TWITTER_GO_RETWEETS_VERIFY = 'xfans-go-retweets-verify';
const XFANS_CHECK_RETWEET = 'xfans_check_retweet';
const XFANS_DONE = 'Done';
const XFANS_VERIFY = 'Verify';
const XFANS_GO = 'GO';

// table
const PAGE_PER_ROW = 10;

enum ContractError {
  InsufficientBalance = 'Insufficient Balance',
}

export {
  ContractError,
  LOCALSTORAGE_FALSE,
  LOCALSTORAGE_TRUE,
  PAGE_PER_ROW,
  XFANS_CHECK_RETWEET,
  XFANS_DONE,
  XFANS_GO,
  XFANS_TWITTER_GO_FOLLOW,
  XFANS_TWITTER_GO_FOLLOW_VERIFY,
  XFANS_TWITTER_GO_RETWEETS,
  XFANS_TWITTER_GO_RETWEETS_VERIFY,
  XFANS_TWITTER_HOMEPAGE,
  XFANS_TWITTES,
  XFANS_VERIFY,
};

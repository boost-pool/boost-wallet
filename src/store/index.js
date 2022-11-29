import { Store as PullStateStore } from 'pullstate';

import { BLOCKFROST_DEFAULT_URL, BLOCKFROST_TOKEN, SUBMIT_DEFAULT_URL } from '../../config';

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  notificationsOpen: false,
  currentPage: null,
  account: {},
  settings:{
    language: "English",
    currentAccount: 1,
    enableNotifications: false,
    darkTheme: false,
    network: {
      blockfrost: {
        url: BLOCKFROST_DEFAULT_URL,
        token: BLOCKFROST_TOKEN
      },
      net: "Testnet",
      submit: SUBMIT_DEFAULT_URL
    }
  }
});

export default Store;

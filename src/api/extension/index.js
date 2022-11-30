import {POPUP_WINDOW, STORAGE} from "../background/config";
import {getWhitelistInDb} from "../../db";

export const getStorage = (key) => {}
export const setStorage = (item) => {}

export const encryptWithPassword = async (password, rootKeyBytes) => {

};

export const decryptWithPassword = async (password, encryptedKeyHex) => {

};

export const getWhitelisted = async () => {

};

export const isWhitelisted = async (_origin) => {
    const whitelisted = await getWhitelistInDb();
    return whitelisted.includes(_origin);
};

export const setWhitelisted = async (origin) => {

};

export const removeWhitelisted = async (origin) => {

};

export const getCurrency = () => getStorage(STORAGE.currency);

export const setCurrency = (currency) => {}

export const getDelegation = async () => {

};

export const getBalance = async () => {

};

export const getBalanceExtended = async () => {

};

export const getFullBalance = async () => {

};

export const setBalanceWarning = async () => {

};

export const getTransactions = async (paginate = 1, count = 10) => {

};

export const getTxInfo = async (txHash) => {

};

export const getBlock = async (blockHashOrNumb) => {

};

export const getTxUTxOs = async (txHash) => {

};

export const getTxMetadata = async (txHash) => {

};

export const updateTxInfo = async (txHash) => {

};

export const setTxDetail = async (txObject) => {

};

export const getSpecificUtxo = async (txHash, txId) => {

};

/**
 *
 * @param {string} amount - cbor value
 * @param {Object} paginate
 * @param {number} paginate.page
 * @param {number} paginate.limit
 * @returns
 */
export const getUtxos = async (amount = undefined, paginate = undefined) => {

};

const checkCollateral = async (currentAccount, network, checkTx) => {

};

export const getCollateral = async () => {

};

export const getAddress = async () => {

};

export const getRewardAddress = async () => {

};

export const getCurrentAccountIndex = () => {}

export const getNetwork = () => {}

export const setNetwork = async (network) => {

};

const accountToNetworkSpecific = (account, network) => {

};

/** Returns account with network specific settings (e.g. address, reward address, etc.) */
export const getCurrentAccount = async () => {

};

/** Returns accounts with network specific settings (e.g. address, reward address, etc.) */
export const getAccounts = async () => {

};

export const setAccountName = async (name) => {

};

export const setAccountAvatar = async (avatar) => {

};

export const createPopup = async (popup) => {
    console.log("createPopup");
  let left = 0;
  let top = 0;
  try {
    const lastFocused = await new Promise((res, rej) => {
      chrome.windows.getLastFocused((windowObject) => {
        return res(windowObject);
      });
    });
    top = lastFocused.top;
    left =
      lastFocused.left +
      Math.round((lastFocused.width - POPUP_WINDOW.width) / 2);
  } catch (_) {
    // The following properties are more than likely 0, due to being
    // opened from the background chrome process for the extension that
    // has no physical dimensions
    const { screenX, screenY, outerWidth } = window;
    top = Math.max(screenY, 0);
    left = Math.max(screenX + (outerWidth - POPUP_WINDOW.width), 0);
  }

  console.log("chrome.tabs.create");
  console.log(popup);
  const { popupWindow, tab } = await new Promise((res, rej) =>
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL(popup + '.html'),
        active: false,
      },
      function (tab) {
        chrome.windows.create(
          {
            tabId: tab.id,
            type: 'popup',
            focused: true,
            ...POPUP_WINDOW,
            left,
            top,
          },
          function (newWindow) {
            return res({ popupWindow: newWindow, tab });
          }
        );
      }
    )
  );

  if (popupWindow.left !== left && popupWindow.state !== 'fullscreen') {
    await new Promise((res, rej) => {
      chrome.windows.update(popupWindow.id, { left, top }, () => {
        return res();
      });
    });
  }
  return tab;
};

export const createTab = (tab, query = '') =>
  new Promise((res, rej) =>
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL(tab + '.html' + query),
        active: true,
      },
      function (tab) {
        chrome.windows.create(
          {
            tabId: tab.id,
            focused: true,
          },
          function () {
            res(tab);
          }
        );
      }
    )
  );

export const getCurrentWebpage = () =>
  new Promise((res, rej) => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
        status: 'complete',
        windowType: 'normal',
      },
      function (tabs) {
        res({
          url: new URL(tabs[0].url).origin,
          favicon: tabs[0].favIconUrl,
          tabId: tabs[0].id,
        });
      }
    );
  });

const harden = (num) => {
  return 0x80000000 + num;
};

export const bytesAddressToBinary = (bytes) =>
  bytes.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');

export const isValidAddress = async (address) => {

};

const isValidAddressBytes = async (address) => {

};

export const isValidEthAddress = function (address) {

};

export const extractKeyHash = async (address) => {

};

export const verifySigStructure = async (sigStructure) => {

};

export const verifyPayload = (payload) => {

};

export const verifyTx = async (tx) => {

};

/**
 * @param {string} address - cbor
 * @param {string} payload - hex encoded utf8 string
 * @param {string} password
 * @param {number} accountIndex
 * @returns
 */

//deprecated soon
export const signData = async (address, payload, password, accountIndex) => {

};

export const signDataCIP30 = async (
  address,
  payload,
  password,
  accountIndex
) => {

};

/**
 *
 * @param {string} tx - cbor hex string
 * @param {Array<string>} keyHashes
 * @param {string} password
 * @returns {string} witness set as hex string
 */
export const signTx = async (
  tx,
  keyHashes,
  password,
  accountIndex,
  partialSign = false
) => {

};

export const signTxHW = async (
  tx,
  keyHashes,
  account,
  hw,
  partialSign = false
) => {
};

/**
 *
 * @param {string} tx - cbor hex string
 * @returns
 */

export const submitTx = async (tx) => {

};

const emitNetworkChange = async (networkId) => {

};

const emitAccountChange = async (addresses) => {

};

export const onAccountChange = (callback) => {

};

export const switchAccount = async (accountIndex) => {

};

export const requestAccountKey = async (password, accountIndex) => {

};

export const resetStorage = async (password) => {

};

export const createAccount = async (name, password, accountIndex = null) => {
}

export const createHWAccounts = async (accounts) => {

};

export const deleteAccount = async () => {
};

export const getNativeAccounts = (accounts) => {

};

export const indexToHw = (accountIndex) => ({

});

export const getHwAccounts = (accounts, { device, id }) => {

};

export const isHW = (accountIndex) => {}

export const initHW = async ({ device, id }) => {

};

/**
 *
 * @param {string} assetName utf8 encoded
 */
export const getAdaHandle = async (assetName) => {

};

/**
 *
 * @param {string} ethAddress
 */
export const getMilkomedaData = async (ethAddress) => {

};

export const createWallet = async (name, seedPhrase, password) => {

};

export const mnemonicToObject = (mnemonic) => {

};

export const mnemonicFromObject = (mnemonicMap) => {

};

export const avatarToImage = (avatar) => {

};

export const getAsset = async (unit) => {

};

export const updateBalance = async (currentAccount, network) => {

};

const updateTransactions = async (currentAccount, network) => {

};

export const setTransactions = async (txs) => {

};

export const setCollateral = async (collateral) => {

};

export const removeCollateral = async () => {

};

export const updateAccount = async (forceUpdate = false) => {

};

export const updateRecentSentToAddress = async (address) => {

};

export const displayUnit = (quantity, decimals = 6) => {

};

export const toUnit = (amount, decimals = 6) => {

};

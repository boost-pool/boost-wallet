import {
  enable,
  getAddress,
  getBalance,
  getCollateral,
  getNetworkId,
  getRewardAddress,
  getUtxos,
  isEnabled,
  off,
  on,
  signData,
  signDataCIP30,
  signTx,
  submitTx,
} from '../webpage';
import { EVENT } from '../../config';

//dApp connector API follows https://github.com/cardano-foundation/CIPs/pull/88

const logDeprecated = () => {
  console.warn(
    'This Boost API implementation is deprecated soon. Please follow the API under the window.cardano.boost namespace. For more information check out CIP-30: https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030'
  );
  return true;
};

//Initial version (deprecated soon)
/*
window.cardano = {
  ...(window.cardano || {}),
  enable: () => logDeprecated() && enable(),
  isEnabled: () => logDeprecated() && isEnabled(),
  getBalance: () => logDeprecated() && getBalance(),
  signData: (address, payload) => logDeprecated() && signData(address, payload),
  signTx: (tx, partialSign) => logDeprecated() && signTx(tx, partialSign),
  submitTx: (tx) => logDeprecated() && submitTx(tx),
  getUtxos: (amount, paginate) => logDeprecated() && getUtxos(amount, paginate),
  getCollateral: () => logDeprecated() && getCollateral(),
  getUsedAddresses: async () => logDeprecated() && [await getAddress()],
  getUnusedAddresses: async () => logDeprecated() && [],
  getChangeAddress: () => logDeprecated() && getAddress(),
  getRewardAddress: () => logDeprecated() && getRewardAddress(),
  getNetworkId: () => logDeprecated() && getNetworkId(),
  onAccountChange: (callback) =>
    logDeprecated() && on(EVENT.accountChange, callback),
  onNetworkChange: (callback) =>
    logDeprecated() && on(EVENT.networkChange, callback),
  off,
  _events: {},
};
*/

// // CIP-30

window.cardano = {
  ...(window.cardano || {}),
  boost: {
    enable: async () => {
      if (await enable()) {
        return {
          getBalance: () => getBalance(),
          signData: (address, payload) => signDataCIP30(address, payload),
          signTx: (tx, partialSign) => signTx(tx, partialSign),
          submitTx: (tx) => submitTx(tx),
          getUtxos: (amount, paginate) => getUtxos(amount, paginate),
          getUsedAddresses: async () => [await getAddress()],
          getUnusedAddresses: async () => [],
          getChangeAddress: () => getAddress(),
          getRewardAddresses: async () => [await getRewardAddress()],
          getNetworkId: () => getNetworkId(),
          experimental: {
            on: (eventName, callback) => on(eventName, callback),
            off: (eventName, callback) => off(eventName, callback),
            getCollateral: () => getCollateral(),
          },
        };
      }
    },
    isEnabled: () => isEnabled(),
    apiVersion: '0.1.1',
    name: 'Boost',
    icon: "data:image/png;base64,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",
    _events: {},
  },
};

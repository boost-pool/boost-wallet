import { generateMnemonic, mnemonicToEntropy, validateMnemonic as validateMne } from 'bip39';
import {
  BaseAddress,
  Bip32PrivateKey,
  NetworkIdKind,
  RewardAddress,
  StakeCredential
} from '@emurgo/cardano-serialization-lib-browser';
import {
  DERIVE_COIN_TYPE,
  DERIVE_PUROPOSE,
  GLOBAL_TAG,
  numbers,
  TESTNET_NETWORK_INDEX,
  TOTAL_ADDRESS_INDEX
} from '@lib/config';
import { NETWORK } from '../config';
import cryptoRandomString from 'crypto-random-string';
import { EmurgoModule } from '@lib/emurgo';
import { customAlphabet } from 'nanoid';
import { fromUTF8 } from '../utils';

export const generateMnemonicSeed = (size: number) => {
  return generateMnemonic(size);
};

export function validateMnemonic(mnemonic: string) {
  return validateMne(mnemonic);
}

export const harden = (num: number) => {
  return 0x80000000 + num;
};

export const createAccount = async (
  name: string,
  mnemonic: string,
  pass: string
) => {

  const privateKeyPtr = generateWalletRootKey(mnemonic);
  const privateKeyHex = Buffer.from(privateKeyPtr.as_bytes()).toString('hex');
  //const encryptedPrivateKey = "";
  const encryptedPrivateKey = await encrypt(privateKeyHex, pass);
  const publicKey = privateKeyPtr.to_public();
  const publicKeyHex = Buffer.from(publicKey.as_bytes()).toString('hex');

  const accountKey = deriveAccountKey(privateKeyPtr);

  // Stake key
  const stakeKey = accountKey.derive(
    numbers.ChainDerivations.ChimericAccount
  );
  const stakeKey2 = stakeKey.derive(numbers.StakingKeyIndex);
  const stakeKey3 = stakeKey2.to_raw_key();

  const stakeKeyPub = stakeKey3.to_public();

  const stakeAddress = (
    RewardAddress.new(
      parseInt(TESTNET_NETWORK_INDEX),
      StakeCredential.from_keyhash(stakeKeyPub.hash())
    ).to_address()
  ).to_bech32();

  const externalPubAddress = [];
  for (let i = 0; i < TOTAL_ADDRESS_INDEX; i++) {
    // eslint-disable-next-line no-await-in-loop
    const externalPubAddressM = generatePayAddress(
      accountKey,
      0,
      i,
      ["preprod", "preview", "testnet"].includes("testnet") ? NetworkIdKind.Testnet : NetworkIdKind.Mainnet,  // TODO
    );

    let tags: string[] = [];
    if (i === 0) {
      tags = [GLOBAL_TAG]
    }
    if (externalPubAddressM && externalPubAddressM.length) {
      externalPubAddress.push({
        index: i,
        network: TESTNET_NETWORK_INDEX,
        reference: '',
        tags,
        address: externalPubAddressM,
        chain: 0
      });
    }
  }
  const internalPubAddress = [];
  for (let i = 0; i < TOTAL_ADDRESS_INDEX; i++) {
    // eslint-disable-next-line no-await-in-loop
    const internalPubAddressM = generatePayAddress(
      accountKey,
      1,
      i,
      ["preprod", "preview", "testnet"].includes("testnet") ? NetworkIdKind.Testnet : NetworkIdKind.Mainnet, // TODO
    );

    let tags = [];
    if (i === 0) {
      tags = ['Global']
    }
    if (internalPubAddressM && internalPubAddressM.length) {
      internalPubAddress.push({
        index: i,
        network: TESTNET_NETWORK_INDEX,
        reference: '',
        tags: [],
        address: internalPubAddressM,
        chain: 1
      });
    }
  }

  return {
    id: undefined,
    name,
    encryptedPrivateKey,
    balance: '0',
    utxos: [],
    assets: {},
    history: [],
    pendingTxs: [],
    publicKeyHex,
    stakeAddress,
    selectedAddress: externalPubAddress[0],
    internalPubAddress,
    externalPubAddress,
    delegated: false,
    activeEpoch: 0,
    poolId: '',
    rewardsSum: 0,
    withdrawableAmount: 0,
    mode: 'Full'
  };
};

export const generateWalletRootKey = (mnemonic: string): Bip32PrivateKey => {
  const bip39entropy = mnemonicToEntropy(mnemonic);
  const EMPTY_PASSWORD = Buffer.from('');
  let rootKey;
  try {
    rootKey = Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(bip39entropy, 'hex'),
      EMPTY_PASSWORD
    );
  } catch (e) {
    console.log('error');
    console.log(e);
  }

  // @ts-ignore
  return rootKey;
}

export const deriveAccountKey = (
  key: Bip32PrivateKey,
  index: number = 0
) => {
  return (
    key.derive(harden(DERIVE_PUROPOSE)).derive(harden(DERIVE_COIN_TYPE))
  ).derive(harden(index));
}

export const generatePayAddress = (
  // @ts-ignore
  accountKey: Bip32PrivateKey,
  chain: number,
  index: number,
  networkId: number,
) => {
  let stakeKey;
  let stakeKeyPub;
  try {
    stakeKey = (
      accountKey.derive(numbers.ChainDerivations.ChimericAccount).derive(numbers.StakingKeyIndex)
    ).to_raw_key();
    stakeKeyPub = stakeKey.to_public();
  } catch (e) {
    console.log(e);
  }

  let paymentKeyPub;
  try {
    const paymentKey = (
      accountKey.derive(chain).derive(index)
    ).to_raw_key();
    paymentKeyPub = paymentKey.to_public();
  } catch (e) {
    console.log(e);
  }
  try {
    const addr = BaseAddress.new(
      networkId,
      // @ts-ignore
      StakeCredential.from_keyhash(paymentKeyPub.hash()),
      // @ts-ignore
      StakeCredential.from_keyhash(stakeKeyPub.hash())
    );
    return addr.to_address().to_bech32();
  } catch (e) {
    console.log(e);
  }
};


export const encryptWithPassword = async (
  password: string,
  data: string
) => {
  const Cardano = await EmurgoModule.CardanoWasm();
  const passwordHex = Buffer.from(password, 'utf8').toString('hex');

  const salt = cryptoRandomString(2 * 32);
  const nonce = cryptoRandomString(2 * 12);
  return Cardano.encrypt_with_password(
    passwordHex,
    salt,
    nonce,
    data
  );
}

export const decryptWithPassword = async (
  password: string,
  data: string
) => {
  const Cardano = await EmurgoModule.CardanoWasm();

  const passwordHex = Buffer.from(password, 'utf8').toString('hex');
  try {
    // Buffer.from(decryptedPassword, 'hex')
    return Cardano.decrypt_with_password(
      passwordHex,
      data
    );
  } catch (error) {
    console.log("Error on decrypt");
    console.log(error);
    throw error;
  }
}

export const encrypt = async (data: string, password: string) => {
  const Cardano = await EmurgoModule.CardanoWasm();

  const generateRandomHex = customAlphabet('0123456789abcdef');
  const salt = generateRandomHex(64);
  const nonce = generateRandomHex(24);
  return Cardano.encrypt_with_password(
    fromUTF8(password), salt, nonce, data,
  );
}

export const decrypt = async (data: string, password: string) => {
  const Cardano = await EmurgoModule.CardanoWasm();
  try {
    return Cardano.decrypt_with_password(
      fromUTF8(password), data,
    );
  } catch (error) {
    throw new Error('The password is incorrect.');
  }
}
export const requestAccountKeys = async (encryptedPrivateKey:string, password:string, chain = 0, accountIndex = 0) => {
  const Cardano = await EmurgoModule.CardanoWasm();
  let accountKey;
  try {
    const privateKey = await decrypt(encryptedPrivateKey, password);
    accountKey = ((Cardano.Bip32PrivateKey.from_hex(
      privateKey
    ).derive(harden(1852)))
      .derive(harden(1815))) // coin type;
      .derive(harden(0));
  } catch (e) {
    throw e
  }

  return {
    accountKey,
    paymentKey: (accountKey.derive(chain).derive(accountIndex)).to_raw_key(),
    stakeKey: (accountKey.derive(2).derive(0)).to_raw_key(),
  };
};
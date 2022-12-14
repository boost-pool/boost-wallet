import { createStore, get, getObject, set } from './storage';
import { BLOCKFROST_DEFAULT_URL, BLOCKFROST_TOKEN, SUBMIT_DEFAULT_URL } from '../config';

const DB_NAME = "WALLET_DB";

export const initDb = async () => {
  await createStore(DB_NAME);
}

export const getAccountsFromDb = async () => {
  return  await get("accounts");
}
export const getAccountFromDb = async (id?:number) => {
  await createStore("wallet-db");

  const settings = await getSettingsFromDb();
  let currentIndex = id ? id : settings && settings.currentAccount;
  const accounts = await get("accounts");
  if (currentIndex < 0) {
    if (accounts && accounts.length){
      currentIndex = 0;
    }
  }
  return await getObject("accounts", currentIndex || 0);

}

export const getSettingsFromDb = async () => {
  await createStore("wallet-db");

  let settings = await get("settings")

  if (settings){
    return settings;
  } else {
    return {
      language: "en",
      currentAccount: 0,
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
  }
}
export const getNetworkFromDb = async () => {

  let settings = await get("settings")

  if (settings && settings.network){
    return settings.network;
  } else {
    return {
      blockfrost: {
        url: BLOCKFROST_DEFAULT_URL,
        token: BLOCKFROST_TOKEN
      },
      net: "Testnet",
      submit: SUBMIT_DEFAULT_URL
    }
  }
}
export const setCurrentAccountInDb = async (id:number) => {

  let settings = await get("settings");

  if (settings){
    settings.currentAccount = id;
    await set("settings", settings);
  }
}

export const setBlockfrostInDb = async (url:string, token:string) => {

  let settings = await get("settings");

  if (settings){
    settings.network.blockfrost = {
      ...settings.network.blockfrost,
      url,
      token
    }
    await set("settings", settings);
  }
}

export const setNetworkInDb = async (net:string) => {

  let settings = await get("settings");

  if (settings){
    settings.network = {
      ...settings.network,
      net
    }
    await set("settings", settings);
  }
}
export const setSubmitUrlInDb = async (submitUrl:string) => {

  let settings = await get("settings");

  if (settings){
    settings.network = {
      ...settings.network,
      submit: submitUrl
    }
    await set("settings", settings);
  }
}
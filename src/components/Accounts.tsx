import Store from '../store';
import {getAccount, getSettings} from '../store/selectors';
import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import Jdenticon from 'react-jdenticon';
import {createAccount, generateMnemonicSeed, validateMnemonic} from '../lib/account';
import {setAccount, setSettings} from '../store/actions';
import {App} from '@capacitor/app';
import {get, removeObject, set} from '../db/storage';

import {getAccountFromDb, getNetworkFromDb, getSettingsFromDb, setAccountInDb, setCurrentAccountInDb} from '../db';

import BigNumber from 'bignumber.js';
import {addressSlice} from '../utils/utils';
import {writeToClipboard} from '../utils/clipboard';
import {Browser} from "@capacitor/browser";
import {useTranslation} from "react-i18next";

// @ts-ignore
const Accounts = ({}) => {

  const { t } = useTranslation();

  const account = Store.useState(getAccount);
  const [accounts, setAccounts] = useState([]);
  const [seed, setSeed] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [defaultJdenticon, setDefaultJdenticond] = useState('Cardano');
  const settings = Store.useState(getSettings);

  const disabledButton = !validateMnemonic(seed)
    || name.length <= 1
    || password.length <= 7;

  console.log("disabledButton");
  console.log(disabledButton);
  console.log("validateMnemonic(seed)");
  console.log(validateMnemonic(seed));

  const useIsMounted = () => {
    const isMounted = useRef(false)
    // @ts-ignore
    useEffect(() => {
      isMounted.current = true
      return () => (isMounted.current = false)
    }, [])
    return isMounted
  }

  const isMounted = useIsMounted();

  useEffect(() => {
    const init = async () => {
      const accounts = await get("accounts") || [];
      setAccounts(accounts);
    }
    init()
      // make sure to catch any error
      .catch(console.error)

  }, [settings.currentAccount]);

  useEffect(() => {
    App.addListener('backButton', data => {

    });
  }, []);

  const generateSeed = () => {
    const generatedSeed = generateMnemonicSeed(160);
    setSeed(generatedSeed);
    setDefaultJdenticond(generatedSeed)
  }
  const handleSeed = (seedText:string) => {
    setSeed(seedText);
  }
  const handleName = (name:string) => {
    setName(name);
    setDefaultJdenticond(name);
  }
  const handlePassword = (pass:string) => {
    console.log("handlePassword");
    setPassword(pass);
  }
  const handleSelectAccount= async (account:any) => {

    setAccount({...account[settings.network.net], name: account.name, id: account.id});
    setSettings({...settings, currentAccount: account.name});

    await setCurrentAccountInDb(account.name);
  }

  const handleRemoveAccount = async (name:string) => {
    let accss = await get("accounts");

    if (!accss || accss.length <= 1){
      await set("accounts", []);
      await setCurrentAccountInDb("");
    } else {
      await removeObject("accounts", name);
      accss = await get("accounts");

      let settings = await getSettingsFromDb();
      if (settings.currentAccount === name){
        settings.currentAccount = accss && accss.length && accss[0].name;
        await setCurrentAccountInDb(settings.currentAccount);
        setSettings(settings);
      }
    }


    const account = await getAccountFromDb();
    const network = await getNetworkFromDb();

    setAccount(account[network.net]);

    const accs = await get("accounts") || [];
    setAccounts(accs);
  }

  const onConfirm = async () => {

    console.log("on confirm");
    console.log(disabledButton);
    if (!disabledButton){
      let acc = await createAccount(name,seed,password);

      console.log("acc");
      console.log(acc);

      // @ts-ignore
      //const id = await setNewObject("accounts", acc);

      acc.id = await setAccountInDb(acc);
      setAccount({...acc[settings.network.net], id: acc.id, name: acc.name});
      await setCurrentAccountInDb(acc.name);
      // @ts-ignore
      setAccounts(prevState => [...prevState, acc])

      setSeed('');
      setName('');
      setPassword('');
      onResetState();
    }
  }

  const onResetState = () => {
    setSeed('');
    setName('');
    setPassword('');
  }


  const RenderDescription= () => {
    return <>
      <div className="container px-2 mt-6">
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {/* @ts-ignore*/}
            {t("accounts.tip1")}
          </p>
          <p className="text-sm text-gray-500">
            {/* @ts-ignore*/}
            {t("accounts.tip2")}
          </p>
        </div>
      </div>
    </>
  }
  const RenderAccountDetails = () => {
    return <>
      <div className="container px-6 md:px-12 ">
        <p style={{fontSize: 12}} className="text-gray-500 opacity-70">
          {/* @ts-ignore*/}
          {t("accounts.selected")}
        </p>
        <div className="p-2 bg-gray-100">
          <p className="text-sm text-gray-500">
            {account?.name} ₳{account?.balance ? (new BigNumber(account.balance)).div(new BigNumber(10).pow(6)).toString() : 0} {account?.assets?.length ? <>/ Assets({account?.assets?.length})</> : null} {account?.utxos?.length ? <>UTXOs({account?.utxos?.length})</> : null}
          </p>
          <p style={{fontSize: 12}} className="text-gray-500 opacity-70">
            {/* @ts-ignore*/}
            {t("accounts.stakeAddress")}
          </p>
          <p
            onClick={() => writeToClipboard(account?.stakeAddress).then(()=>{
            })}
            className="text-sm text-gray-500 cursor-pointer">
            {addressSlice(account?.stakeAddress, 15)}
          </p>
        </div>
      </div>
    </>
  }
  const RenderAccounts= () => {
    return <>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 pb-24 pt-8 mx-auto">
          <div className="lg:w-2/3 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">

              <div className="p-2 w-full flex flex-wrap mb-8">
                {
                  accounts && Object.keys(accounts).map((key, index) => {
                    // @ts-ignore
                    return <span key={index} className="mx-2 cursor-pointer" onClick={() => handleSelectAccount(accounts[key])}
                    >
                      <span
                          className="pr-4 pl-2 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease">

                        <button className="bg-transparent hover focus:outline-none">
                            {/* @ts-ignore*/}
                            <Jdenticon size="20" value={accounts[key].name} />
                          </button>
                        {/* @ts-ignore*/}
                        {accounts[key].name}
                        <button
                            // @ts-ignore
                            onClick={() =>  handleRemoveAccount(accounts[key].name)}
                            className="bg-transparent hover focus:outline-none">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times"
                                 className="w-3 ml-3" role="img" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 352 512">
                              <path fill="currentColor"
                                    d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
                              </path>
                            </svg>
                          </button>
                        </span>
                      </span>
                  })
                }
              </div>
              <div className="w-full">
                {RenderAccountDetails()}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  }
  const RenderForm = () => {
    return <>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 pb-24 pt-8 mx-auto">
          <div className="lg:w-2/3 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">

              <div className="p-2 w-full">
                <table>
                  <thead>
                  <tr className="mt-12">
                    <td>
                      <Jdenticon size="28" value={defaultJdenticon} />
                    </td>
                    <td className="mb-12 text-2xl pl-2">
                      <input
                          onChange={(e) => handleName(e.target.value)}
                          className="focus:text-gray-700 focus:outline-none w-full bg-transparent"
                          // @ts-ignore
                          placeholder={t("accounts.name")}
                      />
                    </td>
                  </tr>
                  </thead>
                </table>
                <div className="mt-2">
                  <div className="flex w-full md:justify-start justify-center items-end">
                    <div className="relative">
                      <p className="text-sm text-gray-500 mr-2">
                        {/* @ts-ignore*/}
                        {t("accounts.seedTip")}
                      </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        onClick={() => generateSeed()}
                    >
                      {/* @ts-ignore*/}
                      {t("accounts.new")}
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                <textarea
                    value={seed}
                    onChange={(e) => handleSeed(e.target.value)}
                    className="
                          resize-none
                          form-control
                          block
                          w-full
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                        "
                    id="exampleFormControlTextarea1"
                    rows={4}
                    // @ts-ignore
                    placeholder={t("accounts.enterSeed")}
                ></textarea>
                </div>
                <div className="mt-4">
                  <label className="font-medium block mb-1 mt-6 text-gray-700" htmlFor="password">
                    {/* @ts-ignore*/}
                    {t("accounts.spendingPassword")}
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 flex items-center px-2">
                      <input className="hidden js-password-toggle" id="toggle" type="checkbox" />
                      <label
                          onClick={() => setShowPassword(!showPassword)}
                          className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
                          htmlFor="toggle">
                        {
                          showPassword ?
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                              :
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                        }
                      </label>
                    </div>
                    <input
                        value={password}
                        onChange={(e) => handlePassword(e.target.value)}
                        className="appearance-none border-2 rounded w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-blue-700 focus:bg-white text-gray-700 pr-16 font-mono js-password"
                        id="password" type={showPassword ? "text" : "password"} placeholder={"send.enterPassword"} autoComplete="off"
                    />
                  </div>
                  {RenderDescription()}
                  <div className="flex justify-center my-6">
                    <button
                        data-bs-dismiss="offcanvas" aria-label="Close"
                        type="button"
                        className="mx-4 inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-orange-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      {/* @ts-ignore*/}
                      {t("accounts.cancel")}
                    </button>
                    <button
                        disabled={disabledButton}
                        type="button"

                        className="mx-4 inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-blue-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => onConfirm()}
                    >
                      {/* @ts-ignore*/}
                      {t("send.confirm")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  }

  const openCapacitorSite = async (site:string) => {
    await Browser.open({ url: site });
  };

  return (

      <>
        {
          Object.keys(accounts).length ? <>
            {RenderAccounts()}
            <div className="relative flex pt-12 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                {/* @ts-ignore*/}
                {t("accounts.addAcount")}
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          </> : null
        }

        {RenderForm()}
      </>
  );
};

export default Accounts;

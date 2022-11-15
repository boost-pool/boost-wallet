import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import Store from '../../store';
import { getAccount, getSettings } from '../../store/selectors';

import { close } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import Jdenticon from 'react-jdenticon';
import { createAccount, generateMnemonicSeed, validateMnemonic } from '@lib/account';
import { setAccount, setSettings } from '../../store/actions';
import { App } from '@capacitor/app';
import { get, removeObject, set, setNewObject } from '../../db/storage';
import { Chip } from '@material-tailwind/react';
import { getAccountFromDb, getSettingsFromDb, setCurrentAccountInDb } from '../../db';
import { useTranslation } from 'next-export-i18n';
import BigNumber from 'bignumber.js';
import { addressSlice } from '../../utils';
import { writeToClipboard } from '../../utils/clipboard';

// @ts-ignore
const AccountsModal = ({ open, onDidDismiss }) => {
  const account = Store.useState(getAccount);
  const [accounts, setAccounts] = useState([]);
  const [seed, setSeed] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [defaultJdenticon, setDefaultJdenticond] = useState('Cardano');
  const settings = Store.useState(getSettings);

  const { t } = useTranslation();

  const disabledButton = !validateMnemonic(seed)
    || name.length <= 1
    || password.length <= 7;

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
      onDidDismiss();
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
    setPassword(pass);
  }
  const handleSelectAccount= async (account:any) => {
    setAccount(account);
    let settings = await getSettingsFromDb();
    if (settings){
      settings.currentAccount = account?.id;
      setSettings(settings);
    }

    await setCurrentAccountInDb(account.id);
  }

  const handleRemoveAccount = async (id:number) => {
    let accss = await get("accounts");

    if (!accss || accss.length <= 1){
      await set("accounts", []);
      await setCurrentAccountInDb(-1);
    } else {

      await removeObject("accounts", id.toString());
      accss = await get("accounts");

      let settings = await getSettingsFromDb();
      if (settings.currentAccount === id){

        const objIndex = await accss.findIndex((a: { id: string; }) => {
          if (a !== undefined) return parseInt(a.id) >= 0;
          else return false;
        });

        settings.currentAccount = accss && accss.length  && accss[objIndex]? accss[objIndex].id : -1
        await setCurrentAccountInDb(settings.currentAccount);
        setSettings(settings);
      }
    }


    const account = await getAccountFromDb();
    setAccount(account);

    const accs = await get("accounts") || [];
    setAccounts(accs);
  }

  const onConfirm = async () => {
    if (!disabledButton){
      let acc = await createAccount(name,seed,password);

      // @ts-ignore
      acc.id = await setNewObject("accounts", acc);
      setAccount(acc);
      // @ts-ignore
      await setCurrentAccountInDb(acc.id);
      // @ts-ignore
      setAccounts(prevState => [...prevState, acc])

      setSeed('');
      setName('');
      setPassword('');
      onDismissModal();
    }
  }

  const onDismissModal = () => {
    onDidDismiss();
    setSeed('');
    setName('');
    setPassword('');
  }


  const RenderDescription= () => {
    return <>
      <div className="container px-2 mt-6">
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {t("accounts.tip1")}
          </p>
          <p className="text-sm text-gray-500">
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
          {t("accounts.selected")}
        </p>
        <div className="p-2 bg-gray-100">
          <p className="text-sm text-gray-500">
            {account?.name} ₳{account?.balance ? (new BigNumber(account.balance)).div(new BigNumber(10).pow(6)).toString() : 0} {account?.assets?.length ? <>/ Assets({account?.assets?.length})</> : null} {account?.utxos?.length ? <>UTXOs({account?.utxos?.length})</> : null}
          </p>
          <p style={{fontSize: 12}} className="text-gray-500 opacity-70">
            {t("accounts.stakeAddress")}
          </p>
          <p
            onClick={() => writeToClipboard(account?.stakeAddress).then(()=>{
            })}
            className="text-sm text-gray-500 cursor-pointer">
            {addressSlice(account?.stakeAddress, 20)}
          </p>
        </div>
      </div>
    </>
  }
  const RenderAccounts= () => {
    return <>
      <div className="flex flex-wrap p-4">

        {
          accounts && accounts.map((acc, index) => {
            return <span
              key={index}
              className="mx-2 cursor-pointer"
              onClick={() => handleSelectAccount(acc)}
            >
          <Chip
            // @ts-ignore
            value={acc.name}
            // @ts-ignore
            color={settings.currentAccount === acc.id ? "blue" : "gray"}
            icon={
              // @ts-ignore
              <Jdenticon size="20" value={acc.name} />
            }
            dismissible={{
              // @ts-ignore
              onClose: () => handleRemoveAccount(acc.id),
            }}
          />
        </span>
          })
        }

      </div>
    </>
  }
  const RenderForm = () => {
    return <>
      <div className="container px-6 md:px-12 pt-6">
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
                {t("accounts.seedTip")}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              onClick={() => generateSeed()}
            >
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
                  placeholder={t("accounts.enterSeed")}
                ></textarea>
        </div>
        <div className="mt-4">
          <label className="font-medium block mb-1 mt-6 text-gray-700" htmlFor="password">
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
              id="password" type={showPassword ? "text" : "password"} placeholder={t("send.enterPassword")} autoComplete="off"
            />
          </div>
          {RenderDescription()}
          <div className="flex justify-center my-6">
            <button
              type="button"
              className="mx-4 inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-orange-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => onDidDismiss()}
            >
              {t("accounts.cancel")}
            </button>
            <button
              disabled={disabledButton}
              type="button"
              className="mx-4 inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-blue-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => onConfirm()}
            >
              {t("send.confirm")}
            </button>
          </div>
        </div>
      </div>
    </>
  }

  return (
    <IonModal isOpen={open} onDidDismiss={onDismissModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("accounts.label")}</IonTitle>
          <IonButton slot='end' fill='clear' color='black' onClick={onDismissModal}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Create Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        {
          accounts.length ? <>
            {RenderAccounts()}
            {RenderAccountDetails()}
            <div className="relative flex pt-12 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">{t("accounts.addAcount")}</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          </> : null
        }

        {RenderForm()}
      </IonContent>
    </IonModal>
  );
};

export default AccountsModal;

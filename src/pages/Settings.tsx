import React, { Fragment, useEffect, useRef, useState } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import Store from '../store';
// @ts-ignore
import {
  setAccount,
  setBlockfrostNetwork,
  setBlockfrostToken,
  setBlockfrostUrl,
  setLanguage,
  setSettings,
  setSubmitUrl
} from '../store/actions';
import { set } from '../db/storage';
import { getSettings } from '../store/selectors';
import { getKeyByValue } from '../utils/utils';
import {getAccountFromDb, getSettingsFromDb, setBlockfrostInDb, setNetworkInDb, setSubmitUrlInDb} from '../db';
import { BLOCKFROST_DEFAULT_URL, BLOCKFROST_TOKEN } from '../../config';
import { writeToClipboard } from '../utils/clipboard';
import Toast from '../components/Toast';
import {useTranslation} from "react-i18next";

export const SUPPORTED_LANGUAGES:{[lang:string]:string} = {
  English: "en",
  Spanish: "es"
}

const Settings = () => {

  const { t, i18n } = useTranslation();

  const settings = Store.useState(getSettings);

  const [enabled, setEnabled] = useState(false);

  const [selected, setSelected] = useState(settings.language);

  const [networkSelected, setNetworkSelected] = useState(settings?.network?.net || "Testnet");

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
      getSettingsFromDb().then(settings => {
        setSelected(settings.language || "English");
      });
    }
    if (isMounted.current) {
      // call the function
      init()
        // make sure to catch any error
        .catch(console.error)
    }

  }, []);

  const onCopy = (content:string) => {
    writeToClipboard(content).then(()=>{
      Toast.info("Copy success");
    });
  }

  const handleNotifications = (checked:boolean) => {
    setEnabled(checked)
    setSettings({
      ...settings,
      enableNotifications: checked,
    });
  }

  const handleSelectNetwork = async (network:string) => {
    setNetworkSelected(network);
    setBlockfrostNetwork(network);
    const account = await getAccountFromDb();
    setAccount(account[network]);
    await setNetworkInDb(network);
  }

  const handleBlockfrostUrl = async (url:string) => {
    setBlockfrostUrl(url);
    await setBlockfrostInDb(url, settings?.network?.blockfrost?.token || BLOCKFROST_TOKEN);
  }

  const handleBlockfrostToken = async (token:string) => {
    setBlockfrostToken(token);
    await setBlockfrostInDb(settings?.network?.blockfrost?.url || BLOCKFROST_DEFAULT_URL, token);
  }

  const handleSubmitUrl = async (url:string) => {
    setSubmitUrl(url);
    await setSubmitUrlInDb(url);
  }

  const handleSelectLanguage = async (lang:string) => {

    i18n.changeLanguage(SUPPORTED_LANGUAGES[lang]).then(async _ => {
      setLanguage(lang);
      let settings = await getSettingsFromDb();
      settings.language = lang;
      await set("settings", settings);
      setSelected(lang);
    });
  };

  const RenderSettings = () => {
    return <div className="flex justify-center">
      <ul className="rounded-lg w-full text-gray-900">

        {/*
           <li className="px-8 border-b border-gray-200 w-full rounded-t-lg">
          <div className="py-4">
            <p className="inline-block text-xl">{"settings.darkMode"}</p>
            <span className="float-right mr-1">
            <Switch
              checked={settings.enableNotifications}
              onChange={(checked)=> handleNotifications(checked)}
              className={`${enabled ? 'bg-teal-900' : 'bg-teal-700'}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
            <span
              aria-hidden="true"
              className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          </span>
          </div>
        </li>
        */}

           <li className="px-8 py-2 border-b border-gray-200 w-full">
          <div className="py-4">
            <p className="text-xl mb-2">
              {/* @ts-ignore*/}
              {t("settings.language")}
            </p>
            <Listbox value={selected} onChange={handleSelectLanguage} >
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selected}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {['English','Spanish'].map((lang:string,langIdx:number) => (
                      <Listbox.Option
                        key={langIdx}
                        className={({ active }) =>
                          ` z-[999] relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-amber-100 text-amber-900  z-[999]' : 'text-gray-900 bg-white'
                          }`
                        }
                        value={lang}
                        onChange={() => {}}
                      >
                        {({ selected }) => (
                          <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {lang}
                      </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </li>

        <li className="px-8 py-2 border-b border-gray-200 w-full">
          <div className="flex w-full md:justify-start justify-center items-end">
            <div className="relative w-full pr-4">
              <div>
                <span className="text-xl mb-2 mr-2">
                  {/* @ts-ignore*/}
                  {t("settings.blockfrost")}
                </span>
                <span className="text-md mb-2">
                  <input
                    value={settings?.network?.blockfrost?.token || BLOCKFROST_TOKEN}
                    onChange={(e) => handleBlockfrostToken(e.target.value)}
                    className="mr-1 text-gray-600 focus:text-gray-700 focus:outline-none bg-transparent cursor-pointer"
                    placeholder="Token Id"
                  />
                  <svg
                    onClick={() => onCopy(settings?.network?.blockfrost?.token || BLOCKFROST_TOKEN)}
                    className="inline-block text-gray-600 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </span>
              </div>
              <input
                value={settings?.network?.blockfrost?.url || BLOCKFROST_DEFAULT_URL}
                onChange={(event) => handleBlockfrostUrl(event.target.value)}
                type="text"
                className="w-full mt-2 bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out"/>
            </div>
            <Listbox value={settings?.network?.net} onChange={handleSelectNetwork} >
              <div className="relative mt-1 py-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{networkSelected}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-24 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {['preprod', 'preview', 'mainnet'].map((net:string,netIdx:number) => (
                      <Listbox.Option
                        key={netIdx}
                        className={({ active }) =>
                          ` z-[999] relative cursor-default select-none py-2 pl-4 pr-4 ${
                            active ? 'bg-amber-100 text-amber-900  z-[999]' : 'text-gray-900 bg-white'
                          }`
                        }
                        value={net}
                        onChange={() => {}}
                      >
                        {({ selected }) => (
                          <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {net}
                      </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

          </div>
        </li>

        <li className="px-8 py-2 border-b border-gray-200 w-full">
          <div className="flex w-full md:justify-start justify-center items-end">
            <div className="relative w-full">
              <p className="text-xl mb-2">
                {/* @ts-ignore*/}
                {t("settings.submit")}
              </p>
              <input
                value={settings?.network?.submit}
                onChange={(event) => handleSubmitUrl(event.target.value)}
                type="text"
                id="hero-field"
                name="hero-field"
                className="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out"/>
            </div>
          </div>
        </li>
      </ul>
    </div>
  }

  return (
      <RenderSettings/>
  );
};

export default Settings;

import { setupIonicReact  } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

import { createStore, set } from '../db/storage';
import { useLanguageQuery } from 'next-export-i18n';
import { getAccountFromDb, getSettingsFromDb } from '../db';
import { setAccount, setSettings } from '../store/actions';


setupIonicReact({});

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

const AppWrapper = (props:any) => {

  const router = useRouter();
  // const { t } = useTranslation();
  const [query] = useLanguageQuery();

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
      await initApp();
    }
    if (isMounted.current) {
      // call the function
      init()
        // make sure to catch any error
        .catch(console.error)
    }

  }, [query]);

  const initApp = async () => {
    await createStore("wallet-db");

    const account = await getAccountFromDb();
    setAccount(account);

    let settings = await getSettingsFromDb();
    settings.currentAccount = account?.id;
    setSettings(settings);


    const lang = settings.language;
    let q = {lang: ""};
    if(query) q = query;
    if (!query || query && query.lang !== lang) {
      q.lang = lang;
      settings.lang
      await router.push({ pathname: '', query: q });
    }

    await set("settings", settings);
  }

  useEffect(() => {
    // @ts-ignore
    App.addListener('backButton', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      /*
      if (router.pathname === "/"){
        App.exitApp().then(_ =>{});
      }
       */

      router.back();
    });

  }, []);

  return (
    <>
      {props.children}
    </>
  );
};

export default AppWrapper;

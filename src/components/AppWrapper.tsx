import { setupIonicReact  } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import React, { useEffect, useRef } from 'react';
import CardanoModule from "../lib/CardanoModule";
import {createStore, set} from "../db/storage";
import {DB_NAME, getAccountFromDb, getSettingsFromDb, setSettingsInDb} from "../db";
import {setAccount, setLanguage, setSettings} from "../store/actions";
import {SUPPORTED_LANGUAGES} from "../pages/Settings";
import {useTranslation} from "react-i18next";

setupIonicReact({});

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

// @ts-ignore
const AppWrapper = (props) => {

  const { t, i18n } = useTranslation();

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

  }, []);

  const initApp = async () => {
    await createStore(DB_NAME);

    const account = await getAccountFromDb();
    setAccount(account);

    let settings = await getSettingsFromDb();
    settings.currentAccount = account?.id;
    setLanguage(settings.language);
    /*
    i18n.changeLanguage(SUPPORTED_LANGUAGES[settings.language]).then(async _ => {

    });
     */
    setSettings(settings);
    await setSettingsInDb(settings);

  }

  useEffect(() => {
    const fetchData = async () => {

      await CardanoModule.load();

      const paymentAddress = await CardanoModule.wasmV4.BaseAddress.from_address(CardanoModule.wasmV4.Address.from_bech32('addr1qy0gd5rg9v3mhf8usam98j3tk7rqgdqs0zqammwcp5nscxpm7mazwuz867mpxu2m4u4ec4gqshycdkqyc2lextajzunq2nqwdv'));
      console.log('paymentAddress');
      console.log(paymentAddress);

    }
    if (isMounted.current) {
      // call the function
      fetchData()
          // make sure to catch any error
          .catch(console.error)
    }
    //ReactGA.send({ hitType: "pageview", page: "/terms-conditions" });
  }, [])

  useEffect(() => {
    // @ts-ignore
    App.addListener('backButton', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      /*
      if (router.pathname === "/"){
        App.exitApp().then(_ =>{});
      }
       */

    });

  }, []);

  return (
    <>
      {props.children}
    </>
  );
};

export default AppWrapper;

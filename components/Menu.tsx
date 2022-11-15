import { StatusBar, Style } from '@capacitor/status-bar';
import { Browser } from '@capacitor/browser';

import {
  IonContent,
  IonHeader, IonItem, IonLabel,
  IonMenu,
  IonMenuToggle
} from '@ionic/react';
import { useEffect } from 'react';
import ComboboxList from '@components/shared/Combobox';
// @ts-ignore
import { setIsDarkTheme } from '../store/actions';
// @ts-ignore
import { getAccount, getIsDarkTheme } from '../store/selectors';
import Store from '../store';
// @ts-ignore
import { dapps } from '../mock';
import { Link } from 'react-router-dom';

const Menu = () => {
  const isDark = Store.useState(getIsDarkTheme);

  const handleOpen = async () => {
    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light,
      });
    } catch {}
  };
  const handleClose = async () => {
    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light,
      });
    } catch {}
  };

  useEffect(() => {
    setIsDarkTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, []);

  const openCapacitorSite = async (site:string) => {
    await Browser.open({ url: site });
  };

  return (
    <IonMenu
      side="start" contentId="main" onIonDidOpen={handleOpen} onIonDidClose={handleClose}>
      <IonHeader>
        <div className="mb-2">
          <Link to="/">
            <p className="text-4xl color-white-dark text-center pl-2 pt-4 font-boost">BOOST Wallet</p>
          </Link>
          <div className="text-center">
          <span
            className="text-gray-400 mt-2 inline-flex items-center leading-none text-sm italic cursor-pointer">
            <svg
              onClick={() => openCapacitorSite("https://github.com/boost-pool/boost-wallet")}
              className="w-4 h-4 mr-1 mr-2" stroke="currentColor" viewBox="0 0 24 24" fill="none"  strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <svg
              onClick={() => openCapacitorSite("https://twitter.com/AdaBooster")}
              className="w-4 h-4 mr-1" stroke="currentColor" viewBox="0 0 24 24" fill="none" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">  <path
              d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
          </span>
          </div>
        </div>
        <ComboboxList list={dapps} onSelect={(element:{id:number, name:string}) => console.log(element)}/>
      </IonHeader>
      <IonContent>
        <IonMenuToggle className="grid grid-cols-2 gap-2 mt-20">
          {dapps.map((dapp:{id:number, name:string, route:string, fav:boolean}) => (
            <div key={dapp.id} className="flex justify-center flex-col mx-1 my-1">
              <button style={{minHeight: 150}} className="bg-white p-3 w-full flex flex-col rounded-md dark:bg-gray-800 shadow">
                <div
                  style={{minHeight: 60}}
                  className="flex xl:flex-row flex-col items-center font-medium text-gray-900 dark:text-white pb-2 mb-2 xl:border-b border-gray-200 border-opacity-75 dark:border-gray-700 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
                  <Link to={dapp.route}>
                    <p  className="text-lg cursor-pointer ml-2 sm:mt-4">
                      {dapp.name}
                    </p></Link>
                </div>
                <div className="flex items-center w-full" style={{bottom: 0}}>
                  <div
                    className="text-xs py-1 px-2 leading-none dark:bg-gray-900 bg-blue-100 text-blue-500 rounded-md">Tag
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    <svg className={"h-8 w-8 py-2 float-right cursor-pointer "+(dapp.fav ? "text-yellow-600" : "text-gray-200" )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </IonMenuToggle>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

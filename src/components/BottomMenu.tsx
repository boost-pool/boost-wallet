import React, { FC, Fragment, useState } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { Share } from '@capacitor/share';

// @ts-ignore
import { setAccount, setSettings } from '../../store/actions';
import * as selectors from '../store/selectors';
import Store from '../store';
// @ts-ignore
import {setCurrentPath} from "../store/actions";
import {ROUTES} from "../App";
import {handlePath} from "./routing";

interface IBottomMenu {
  open: boolean,
  onClose: () => void
}
const BottomMenu: FC<IBottomMenu> = (props) => {
  const account = Store.useState(selectors.getAccount);

  const addresses = account && account.externalPubAddress || [];
  const [selected, setSelected] = useState(account && account.externalPubAddress && account.externalPubAddress.length
    && account.externalPubAddress[0]
    || []);

  let addr = account && account.externalPubAddress && account.externalPubAddress.length && account.externalPubAddress[0]?.address || 'nonAddr';

  return (
    <>
      <div className="h-16"/>
      <nav
          className="fixed bottom-0 inset-x-0 bg-blue-600 flex justify-between text-sm text-white uppercase shadow-lg rounded-t-xl">

        <a
            onClick={() => handlePath(ROUTES.MAIN)}
           className="w-full block py-2 px-3 text-center hover:bg-blue-200 hover:text-blue-800 transition duration-300 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </a>

        <a
            onClick={() => handlePath(ROUTES.NETWORK)}
            className="w-full block py-2 px-3 text-center hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
          Network
        </a>

        <a
            onClick={() => handlePath(ROUTES.P2P)}
            className="w-full block py-2 px-3 text-center hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          P2P
        </a>

        <a
            onClick={() => handlePath(ROUTES.SETTINGS)}
           className="w-full block py-2 px-3 text-center hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
          Settings
        </a>

      </nav>
    </>
  )
}

export default BottomMenu;


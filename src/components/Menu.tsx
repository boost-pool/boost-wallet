import React, { FC, Fragment, useState } from 'react';
import Toast from "../components/Toast";

// @ts-ignore
import { setAccount, setSettings } from '../../store/actions';
import {writeToClipboard} from "../utils/clipboard";
import {Browser} from "@capacitor/browser";

interface IMenu {

}
const Menu: FC<IMenu> = (props) => {

  const onCopy = (content:string) => {
    writeToClipboard(content).then(()=>{
      Toast.info("Copy success")
    });
  }

  const openCapacitorSite = async (site:string) => {
    await Browser.open({ url: site });
  };

  return (
    <>
      <nav
          className="relative w-full flex flex-wrap items-center justify-between py-3 bg-blue-600 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg">
        <div className="container-fluid w-full flex flex-wrap items-center justify-between px-2">
          <div className="container-fluid">
            <a className="text-xl text-black" href="#">
              <button
                className="inline-block px-3 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg  focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample"
                aria-controls="offcanvasExample">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            </button>
            </a>
          </div>
        </div>
      </nav>
      <div className="min-w-full bg-blue-600 shadow-lg">
        <div className="">
          <div
              className="offcanvas offcanvas-start fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 top-0 left-0 border-none w-96"
               id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div className="offcanvas-header flex items-center justify-between p-4">
              <h5 className="offcanvas-title mb-0 leading-normal font-semibold"
                  id="offcanvasExampleLabel"></h5>
              <button type="button"
                      className="btn-close box-content w-4 h-4 p-4 -my-5 -mr-2 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                      data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>

            <div className="offcanvas-body flex-grow p-4 overflow-y-auto">
              <footer className="text-center lg:text-left text-gray-600">
                <div className="flex justify-center items-center lg:justify-between p-6 border-b border-gray-300">
                  <div className="block">
                    <h6 className="
                        uppercase
                        font-semibold
                        mb-4

                        items-center
                        justify-center
                      ">

                      𓆉 Boost Wallet
                    </h6>
                  </div>
                  <div className="px-3">
                    <span>Get connected with us on social networks:</span>
                  </div>

                  <div className="flex justify-center">

                    <a
                        onClick={() => openCapacitorSite("https://twitter.com/BoostPool")}
                        className="mr-6 text-gray-600">
                      <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter"
                           className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                              d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                        </path>
                      </svg>
                    </a>
                    <a
                        onClick={() => openCapacitorSite("https://github.com/boost-pool/boost-wallet")}
                        className="text-gray-600">
                      <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github"
                           className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                        <path fill="currentColor"
                              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z">
                        </path>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="mx-6 py-10 text-center md:text-left">

                  <div className="grid grid-1 md:grid-cols-2 gap-8">

                    <div className="">
                      <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                        Multiplatform Stack
                      </h6>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">Typescript</a>
                      </p>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">React</a>
                      </p>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">Ionic + Capacitor</a>
                      </p>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">Webpack</a>
                      </p>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">Redux</a>
                      </p>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">IndexedDb</a>
                      </p>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">CSL + Mesh</a>
                      </p>
                      <p className="mb-2">
                        <a href="#!" className="text-gray-600">IPFS</a>
                      </p>
                      <p>
                        <a href="#!" className="text-gray-600">Tailwind</a>
                      </p>
                    </div>
                    <div className="">
                      <h6 className="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                        Contribute
                      </h6>
                      <p
                          onClick={() => openCapacitorSite("https://github.com/boost-pool/boost-wallet/pulls")}
                          className="flex items-center justify-center md:justify-start mb-4 cursor-pointer">
                       Open PR
                      </p>
                      <p
                          onClick={() => openCapacitorSite("https://cexplorer.io/pool/pool1ddghnthymd3duklvx5pfunymqg29xe4vlmy89u2efyjdktn33kz")}
                          className="flex items-center justify-center md:justify-start mb-4 cursor-pointer">
                       Stake with [BOOST]
                      </p>
                      <p
                          onClick={() => onCopy("addr1qyh8r8a78d2wjj3g83tt7vre0fs4wseee6fte53ds58ujmu6hdn8zrnp37cqzdy3lctzgls7zlvt8skvvxcy2n3pcqxsnhk20u")}
                          className="flex items-center justify-center md:justify-start mb-4 cursor-pointer">
                       Donate
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-200">
                  <p className="flex items-center justify-center">
                    With ❤️ by BOOST Stake Pool
                  </p>
                </div>
              </footer>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Menu;


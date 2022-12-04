// @ts-ignore
import React, { useEffect, useState } from 'react';

import { writeToClipboard } from '../utils/clipboard';
import { Browser } from '@capacitor/browser';
import Toast from '../components/Toast';
// @ts-ignore
import boostLogo from '../resources/img/adabooster-logo.jpeg';
import {getAccount, getRouter} from "../store/selectors";
import Store from '../store';
import {handlePath} from "../components/routing";
import {ROUTES} from "../App";
import roomSVG from "../resources/img/room.svg";


export default function P2PChat() {

   const router = Store.useState(getRouter);

   console.log("router");
   console.log(router);
   useEffect(() => {

   }, []);


   const onCopy = (content:string) => {
      writeToClipboard(content).then(()=>{
         Toast.info("Copy success")
      });
   }

   const openCapacitorSite = async (site:string) => {
      await Browser.open({ url: site });
   };

   const RenderChat = () => (
       <>

          <div
              onClick={() => handlePath(ROUTES.P2P)}
              className="flex flex-wrap text-gray-400 cursor-pointer hover:text-gray-600 py-2">
             <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
               </span>
             <span>
               Back
            </span>
          </div>
          <section
              className="flex flex-col items-center justify-center w-screen min-h-screen text-gray-800">
             <p className="text-xl shadow-xl">{router?.payload?.data}</p>
             <div
                 //style={{ backgroundImage: `url(${roomSVG})` }}
                 className="flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                      <div>
                         <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg ml-auto justify-end">
                      <div>
                         <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg ml-auto justify-end">
                      <div>
                         <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet.</p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                      <div>
                         <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg ml-auto justify-end">
                      <div>
                         <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg ml-auto justify-end">
                      <div>
                         <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg ml-auto justify-end">
                      <div>
                         <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet.</p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                      <div>
                         <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                   </div>
                   <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg ml-auto justify-end">
                      <div>
                         <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                            <p className="text-sm">Lorem ipsum dolor sit.</p>
                         </div>
                         <span className="text-xs text-gray-500 leading-none">2 min ago</span>
                      </div>
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                   </div>
                </div>

                <div
                    className="flex flex-row items-center h-16 shadow-lg bg-white w-full px-4"
                >
                   <div>
                      <button
                          className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                         <svg
                             className="w-5 h-5"
                             fill="none"
                             stroke="currentColor"
                             viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg"
                         >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            ></path>
                         </svg>
                      </button>
                   </div>
                   <div className="flex-grow ml-4">
                      <div className="relative w-full">
                         <input
                             type="text"
                             className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                         />
                      </div>
                   </div>
                   <div className="ml-4">
                      <button
                          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                      >
                         <span>Send</span>
                         <span className="ml-2">
                           <svg
                               className="w-4 h-4 transform rotate-45 -mt-px"
                               fill="none"
                               stroke="currentColor"
                               viewBox="0 0 24 24"
                               xmlns="http://www.w3.org/2000/svg"
                           >
                             <path
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                                 stroke-width="2"
                                 d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                             ></path>
                           </svg>
                         </span>
                      </button>
                   </div>
                </div>
             </div>
          </section>
       </>
   );


   return (
       <>

          <RenderChat />

       </>
   )

}

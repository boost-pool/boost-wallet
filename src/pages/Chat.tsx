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
import {Messaging} from "../api/background/messaging";
import {METHOD} from "../api/background/config";
//import roomSVG from "../resources/img/room.svg";
import {SendP2PMessage} from "../api/extension"
import {Capacitor} from "@capacitor/core";
import {addressSlice} from "../utils/utils";
import {extendMoment} from "moment-range";
import Moment from 'moment';
// @ts-ignore
const moment = extendMoment(Moment);

export default function P2PChat() {

   const router = Store.useState(getRouter);
   const [text, setText] = useState('');
   const [messages, setMessages] = useState(router?.payload?.room?.messages || []);

   console.log("messages");
   console.log(messages);

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
   const onSendMessage = async (message:string) => {

      console.log("onSendMessage");
      console.log("router?.payload?.room");
      console.log(router?.payload?.room);
      console.log("text");
      console.log(text);

      try {
         if (text.length){
            // ios or android
            if (Capacitor.isNativePlatform()) {
               console.log("you are in mobile device");

            } else if (Capacitor.getPlatform() !== 'web') {
               console.log("you are in other device");
            } else {
               console.log("you are in web device");
               try {
                  const result = await Messaging.sendToBackground({
                     method: METHOD.sendMessageP2P,
                     origin: window.origin,
                     message: text,
                     room: {name: router?.payload?.room?.name, clientAddress: router?.payload?.room?.clientAddress}
                  });

                  console.log("result sendMessageP2P");
                  console.log(result);

                  const newMessage = {
                     sender: 'SELF',
                     text: text,
                     time: moment.utc().format("YYYY-MM-DD H:mm:ss")
                  }
                  setMessages((prev: any) => [...prev, newMessage])
               } catch (e) {

               }
            }
         }
      } catch (e) {


      }
   };

   const renderSelfMessage = (msg: { time: string; sender: string, text: any }) => {
     return <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg ml-auto justify-end">
        <div>
           <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
           </div>
           <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
              <p className="text-sm">{msg.text.message}</p>
           </div>
           <span className="text-xs text-gray-500 leading-none">{msg.time}</span>
        </div>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">{msg?.sender?.length && msg.sender[0] || 'X'}</div>
     </div>

   };
   const renderMessage = (msg: { time: string; sender: string, text: any }) => {
      console.log("renderMessage");
      console.log("msg");
      console.log(msg);
     return <div className="flex w-full mt-2 space-x-3 max-w-xs md:max-w-md lg:max-w-lg">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
        </div>
        <div>
           <span className="text-xs text-gray-500 leading-none">{addressSlice(msg.sender, 7)}</span>
           <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
              <p className="text-sm">{msg.text.message}</p>
           </div>
           <span className="text-xs text-gray-500 leading-none">{msg.time}</span>
        </div>
     </div>


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
             <p className="text-xl shadow-xl">{router?.payload?.room?.name}</p>
             <div
                 //style={{ backgroundImage: `url(${roomSVG})` }}
                 className="flex flex-col flex-grow w-full bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
                   {
                      messages && messages.length ? messages.map((m: { time: string; sender: string; text: any; }) => {

                         if (m.sender === 'SELF'){
                            return renderSelfMessage(m);
                         } else {
                            return renderMessage(m);
                         }
                      }) : null
                   }
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            ></path>
                         </svg>
                      </button>
                   </div>
                   <div className="flex-grow ml-4">
                      <div className="relative w-full">
                         <input
                             value={text}
                             placeholder="Message"
                             onChange={(e) => setText(e.target.value)}
                             type="text"
                             className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                         />
                      </div>
                   </div>
                   <div className="ml-4">
                      <button
                          onClick={() => onSendMessage(text)}
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
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
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

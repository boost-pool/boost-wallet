// @ts-ignore
import React, { useEffect, useState } from 'react';

import { writeToClipboard } from '../utils/clipboard';
import { Browser } from '@capacitor/browser';
import Toast from '../components/Toast';
// @ts-ignore
import boostLogo from '../resources/img/adabooster-logo.jpeg';
import {handlePath} from "../components/routing";
import {ROUTES} from "../App";
import {getAccount, getSettings} from "../store/selectors";
import Store from '../store';
import {getAccountFromDb, updateAccountByNameAndNetworkInDb, updateAccountByNetworkInDb} from "../db";
import {setAccount} from "../store/actions";
import {addressSlice} from "../utils/utils";
import {get, set} from "../db/storage";
import {Tab} from "@headlessui/react";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import {Capacitor} from "@capacitor/core";
import {BackgroundTasks} from "../api/background/mobile/backgroundTask";
import {Messaging} from "../api/background/messaging";
import {METHOD} from "../api/background/config";
import {p2p_servers_dict} from "../api/background";

export const P2P_ROOMS_TABS = {
   CREATE: "CREATE",
   JOIN: "JOIN",
   EDIT: "EDIT"
}
// @ts-ignore
export default function Rooms(props) {

   const { t } = useTranslation();

   const settings = Store.useState(getSettings);
   const account = Store.useState(getAccount);

   const [roomAddress, setRoomAddress] = useState('');
   const [roomName, setRoomName] = useState('');
   const [joinRoomName, setJoinRoomName] = useState('');
   const [selectedTab, setSelectedTab] = useState(P2P_ROOMS_TABS.CREATE);
   const [rooms, setRooms] = useState(account?.rooms || {
      server: {},
      client: {}
   });

   useEffect(() => {
      updateState();
   }, []);


   const onCopy = (content: string) => {
      writeToClipboard(content).then(() => {
         Toast.info("Copy success")
      });
   }

   const updateState = () => {
      getAccountFromDb().then(acc => {
         setAccount({...acc[settings.network.net], id: acc.id,  name: acc.name});
         setRooms(acc[settings.network.net].rooms);
      });
   }

   const openCapacitorSite = async (site: string) => {
      await Browser.open({url: site});
   };

   const onOpenRoom = async (room: any) => {

      handlePath(ROUTES.CHAT, {room});
   }

   const handleCreateRoom = async (rName: string) => {

      if (account && account.name) {

         /*
         let currentRooms = await get("cardano-peers-server") || {};
         currentRooms[rName] = {...currentRooms[rName], name: rName, type: "server", seed: '' };
         await set("cardano-peers-server", currentRooms);
          */

         // ios or android
         if (Capacitor.isNativePlatform()) {
            console.log("you are in mobile device");

         } else if (Capacitor.getPlatform() !== 'web') {
            console.log("you are in other device");
         } else {
            console.log("you are in web");
            try {
               const result = await Messaging.sendToBackground({
                  method: METHOD.createServerP2P,
                  origin: window.origin,
                  accountName: account.name,
                  network: settings.network.net,
                  room: {name: rName}
               });
               console.log("result createServerP2P");
               console.log(result);

            } catch (e) {

            }
         }
      }
   };
   const handleJoinRoom = async (rName: string, rAddress:string) => {

      if (account && account.name) {

         // ios or android
         if (Capacitor.isNativePlatform()) {
            console.log("you are in mobile device");

         } else if (Capacitor.getPlatform() !== 'web') {
            console.log("you are in other device");
         } else {
            console.log("you are in web device");
            try {
               const result = await Messaging.sendToBackground({
                  method: METHOD.joinServerP2P,
                  origin: window.origin,
                  accountName: account.name,
                  network: settings.network.net,
                  room: {name: rName, clientAddress: rAddress}
               });
               console.log("result joinServerP2P");
               console.log(result);

            } catch (e) {

            }
         }
      }
   };

   const onRemoveRoom =  async (room:any) => {
      let acc = account;
      let serverRooms = acc?.rooms?.server || {};

      console.log("serverRooms0");
      console.log(serverRooms);
      if (serverRooms[room.name] !== undefined){
         // create a new copy
         let aux = {...serverRooms};
         // delete the copy and use newUser that thereafter.
         delete aux[room.name];
         serverRooms = aux;
      }

      let r = acc.rooms;
      r = {...r, server: serverRooms};
      acc = {...acc, rooms: r};

      await updateAccountByNameAndNetworkInDb(settings.network.net, account.name, acc);
      setAccount(acc);

      await Messaging.sendToBackground({
         method: METHOD.removeServerP2P,
         origin: window.origin,
         room: {name: room.name}
      });

      updateState();
   }

   const onRemoveJoinedRoom =  async (room:any) => {
      let acc = account;
      let clientRooms = acc?.rooms?.client || {};

      console.log("serverRooms0");
      console.log(clientRooms);
      if (clientRooms[room.name] !== undefined){
         // create a new copy
         let aux = {...clientRooms};
         // delete the copy and use newUser that thereafter.
         delete aux[room.name];
         clientRooms = aux;
      }

      let r = acc.rooms;
      r = {...r, client: clientRooms};
      acc = {...acc, rooms: r};

      await updateAccountByNameAndNetworkInDb(settings.network.net, account.name, acc);
      setAccount(acc);

      await Messaging.sendToBackground({
         method: METHOD.removeJoinedP2P,
         origin: window.origin,
         room: {name: room.name}
      });

      updateState();
   }


   const renderTabs = () => {

      return <div className="w-full mt-8">
            <Tab.Group defaultIndex={0}>
               <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                  <Tab
                      onClick={() => setSelectedTab(P2P_ROOMS_TABS.CREATE)}
                      className={({ selected }) =>
                          classNames(
                              'w-full rounded-lg py-1 text-sm font-medium leading-5',
                              'focus:outline-none',
                              selected
                                  ? 'bg-white shadow text-blue-700'
                                  : 'hover:bg-white/[0.5] text-white'
                          )
                      }
                  >
                     {/* @ts-ignore*/}
                     {t("p2p.create")}
                  </Tab>
                  <Tab
                      onClick={() => setSelectedTab(P2P_ROOMS_TABS.JOIN)}
                      className={({ selected }) =>
                          classNames(
                              'w-full rounded-lg py-1 text-sm font-medium leading-5',
                              'focus:outline-none',
                              selected
                                  ? 'bg-white shadow text-blue-700'
                                  : 'hover:bg-white/[0.5] text-white'
                          )
                      }
                  >
                     {/* @ts-ignore*/}
                     {t("p2p.join")}
                  </Tab>
               </Tab.List>
               <Tab.Panels className="mt-8">
                  {renderTab()}
               </Tab.Panels>
            </Tab.Group>
         </div>

   }
   const renderTab = () => {

      switch (selectedTab) {

         case P2P_ROOMS_TABS.CREATE:
            return <div>
               <div className="container  mx-auto flex flex-wrap items-center">
                  <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                     <h1 className="title-font font-medium text-3xl text-gray-900">
                        P2P Chat Room
                     </h1>
                     <p className="leading-relaxed mt-4">Create a new p2p servet with WebRTC and
                        WebTorrent trackers.</p>
                  </div>
                  <div
                      className="w-full bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                     <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                        Create a room</h2>
                     <div className="relative mb-4">
                        <label htmlFor="email"
                               className="leading-7 text-sm text-gray-600">Name</label>
                        <input
                            onChange={(e) => setRoomName(e.target.value)}
                            type="text" id="roomId" name="roomId"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                     </div>
                     <button
                         onClick={() => handleCreateRoom(roomName)}
                         className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
                        Create
                     </button>
                     <p className="text-xs text-gray-500 mt-3">
                        About the Room ID ...</p>
                  </div>
               </div>
            </div>
         case P2P_ROOMS_TABS.JOIN:
            return <div>
               <div className="container  mx-auto flex flex-wrap items-center">
                  <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
                     <h1 className="title-font font-medium text-3xl text-gray-900">
                        P2P Chat Room
                     </h1>
                     <p className="leading-relaxed mt-4">Connect through WebRTC and
                        WebTorrent trackers.</p>
                  </div>
                  <div
                      className="w-full bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                     <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Join a room</h2>
                     <div className="relative mb-4">
                        <label htmlFor="email"
                               className="leading-7 text-sm text-gray-600">Room Name</label>
                        <input
                            onChange={(e) => setJoinRoomName(e.target.value)}
                            type="text" id="roomId" name="roomId"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                     </div>
                     <div className="relative mb-4">
                        <label htmlFor="email"
                               className="leading-7 text-sm text-gray-600">Room Address</label>
                        <input
                            onChange={(e) => setRoomAddress(e.target.value)}
                            type="text" id="roomId" name="roomId"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                     </div>
                     <button
                         onClick={() => handleJoinRoom(joinRoomName, roomAddress)}
                         className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
                        Join
                     </button>
                     <p className="text-xs text-gray-500 mt-3">
                        About the Room ID ...</p>
                  </div>
               </div>
            </div>

         return null;
      }
   }
   const renderRooms = () => {

      //      return rooms && Object.keys(rooms).length ? Object.keys(rooms).map((room:string) => {
      return <section className="py-5">
         <div className="space-y-2">

            {
               rooms && Object.keys(rooms.server).length ? Object.keys(rooms.server).map((room:any, index:number) => {

                  return <header className="pt-6 pb-4 px-5 border-b border-gray-200">
                     <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                           <a className="inline-flex items-start p-2 mr-3 bg-blue-200 rounded-full" href="#0">
                              {rooms.server[room]?.name && rooms.server[room].name.length && rooms.server[room].name[0]}
                           </a>
                           <div className="pr-1">
                              <a className="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                                 <h2 className="text-xl leading-snug font-bold">{rooms.server[room].name}</h2>
                              </a>
                              <a
                                  onClick={() => onCopy(rooms.server[room]?.clientAddress)}
                                  className="block text-sm font-medium hover:text-indigo-500 cursor-pointer"
                              >{addressSlice(rooms.server[room]?.clientAddress || '', 7)}</a>
                           </div>
                        </div>
                        <div className="relative inline-flex flex-shrink-0">
                           <button
                               onClick={() => onOpenRoom(rooms.server[room])}
                               className="p-1 px-3 inline-flex text-gray-400 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none border-2">
                                 <span className="">
                                    OPEN
                                 </span>
                           </button>
                           <button
                               className="ml-2 p-1 px-3 inline-flex text-gray-400 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none border-2">
                                 <span
                                     onClick={() => onRemoveRoom(rooms.server[room])}
                                     className="">
                                    DELETE
                                 </span>
                           </button>

                        </div>
                     </div>
                     <div className="flex flex-wrap justify-center sm:justify-start space-x-4">
                        <div className="flex items-center">
                           <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                              <path
                                  d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z"/>
                           </svg>
                           <span className="text-sm whitespace-nowrap ml-2">Peers {account?.rooms?.server?.length || 0}</span>
                        </div>
                        <div className="flex items-center">
                           <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                              <path
                                  d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z"/>
                           </svg>
                           <a className="text-sm font-medium whitespace-nowrap text-indigo-500 hover:text-indigo-600 ml-2"
                              href="#0">Quick Link</a>
                        </div>
                     </div>
                  </header>

               }) : null
            }
            {
               rooms && Object.keys(rooms.client).length ? Object.keys(rooms.client).map((room:any, index:number) => {

                  return <header className="pt-6 pb-4 px-5 border-b border-gray-200">
                     <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                           <a className="inline-flex items-start p-2 mr-3 bg-blue-200 rounded-full" href="#0">
                              {rooms.client[room]?.name && rooms.client[room].name.length && rooms.client[room].name[0]}
                           </a>
                           <div className="pr-1">
                              <a className="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                                 <h2 className="text-xl leading-snug font-bold">{rooms.client[room].name}</h2>
                              </a>
                              <a
                                  onClick={() => onCopy(rooms.client[room]?.clientAddress)}
                                  className="block text-sm font-medium hover:text-indigo-500 cursor-pointer"
                              >{addressSlice(rooms.client[room]?.clientAddress || '', 7)}</a>
                           </div>
                        </div>
                        <div className="relative inline-flex flex-shrink-0">
                           <button
                               onClick={() => onOpenRoom(rooms.client[room])}
                               className="p-1 px-3 inline-flex text-gray-400 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none border-2">
                                 <span className="">
                                    OPEN
                                 </span>
                           </button>
                           <button
                               className="ml-2 p-1 px-3 inline-flex text-gray-400 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none border-2">
                                 <span
                                     onClick={() => onRemoveJoinedRoom(rooms.client[room])}
                                     className="">
                                    DELETE
                                 </span>
                           </button>

                        </div>
                     </div>
                     <div className="flex flex-wrap justify-center sm:justify-start space-x-4">
                        <div className="flex items-center">
                           <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                              <path
                                  d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z"/>
                           </svg>
                           <span className="text-sm whitespace-nowrap ml-2">Peers {account?.rooms?.client?.length || 0}</span>
                        </div>
                        <div className="flex items-center">
                           <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                              <path
                                  d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z"/>
                           </svg>
                           <a className="text-sm font-medium whitespace-nowrap text-indigo-500 hover:text-indigo-600 ml-2"
                              href="#0">Quick Link</a>
                        </div>
                     </div>
                  </header>

               }) : null
            }
         </div>
      </section>
   }

   return (
       <>
          <header className="pt-6 pb-4 px-5 border-b border-gray-200 bg-blue-100">
             <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                   <a className="inline-flex items-start p-2 mr-3 bg-blue-200 rounded-full" href="#0">
                      {account?.name && account.name.length && account.name[0]}
                   </a>
                   <div className="pr-1">
                      <a className="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                         <h2 className="text-xl leading-snug font-bold">{account.name}</h2>
                      </a>
                      <a
                          onClick={() => onCopy(account?.stakeAddress)}
                          className="block text-sm font-medium hover:text-indigo-500 cursor-pointer"
                      >{addressSlice(account?.stakeAddress || '', 14)}</a>
                   </div>
                </div>
                <div className="relative inline-flex flex-shrink-0">
                   <button
                       data-bs-toggle="offcanvas" data-bs-target="#newRoomBottom"
                       aria-controls="newRoomBottom"
                       className="p-1 px-3 text-gray-400 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none border-2">
                                 <span className="">
                                    New Room
                                 </span>
                   </button>
                   <div
                       className="offcanvas offcanvas-bottom fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 left-0 right-0 border-none h-4/5 max-h-full"
                       id="newRoomBottom" aria-labelledby="newRoomBottomLabel">
                      <div className="offcanvas-body flex-grow p-4 overflow-y-auto small">
                         <button type="button"
                                 className="float-right btn-close box-content w-4 h-4 p-2 mt-1 -my-5 -mr-2 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                 data-bs-dismiss="offcanvas" aria-label="Close"></button>


                         <div className="block">

                            <section className="text-gray-600 body-font">
                               <div
                                   className="container mx-auto flex px-5 md:py-24 items-center justify-center flex-col">


                                  {renderTabs()}

                               </div>
                            </section>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="flex flex-wrap justify-center sm:justify-start space-x-4">
                <div className="flex items-center">
                   <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                      <path
                          d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z"/>
                   </svg>
                   <span className="text-sm whitespace-nowrap ml-2">Peers {account?.rooms?.length || 0}</span>
                </div>
                <div className="flex items-center">
                   <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                      <path
                          d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z"/>
                   </svg>
                   <a className="text-sm font-medium whitespace-nowrap text-indigo-500 hover:text-indigo-600 ml-2"
                      href="#0">Quick Link</a>
                </div>
             </div>
          </header>


          {renderRooms()}
       </>
   )

}

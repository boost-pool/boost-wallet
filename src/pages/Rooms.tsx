// @ts-ignore
import React, { useEffect, useState } from 'react';

import { writeToClipboard } from '../utils/clipboard';
import { Browser } from '@capacitor/browser';
import Toast from '../components/Toast';
// @ts-ignore
import boostLogo from '../resources/img/adabooster-logo.jpeg';
import {handlePath} from "../components/routing";
import {ROUTES} from "../App";
// @ts-ignore
export default function Rooms(props) {

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

   const renderRoomsList = () => (
       <>
         <div>


            <section className="flex flex-col justify-center antialiased bg-gray-50 text-gray-600 p-0">
               <div className="h-full">
                  <div className="relative mx-auto bg-white shadow-lg">
                     <header className="pt-6 pb-4 px-5 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center">
                              <a className="inline-flex items-start mr-3" href="#0">
                                 <img className="rounded-full" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-48-01_nugblk.jpg" width="48" height="48" alt="Lauren Marsano" />
                              </a>
                              <div className="pr-1">
                                 <a className="inline-flex text-gray-800 hover:text-gray-900" href="#0">
                                    <h2 className="text-xl leading-snug font-bold">Lauren Marsano</h2>
                                 </a>
                                 <a className="block text-sm font-medium hover:text-indigo-500" href="#0">@lauren.mars</a>
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
                                  className="offcanvas offcanvas-bottom fixed bottom-0 flex flex-col max-w-full bg-white invisible bg-clip-padding shadow-sm outline-none transition duration-300 ease-in-out text-gray-700 left-0 right-0 border-none h-1/3 max-h-full"
                                  id="newRoomBottom" aria-labelledby="newRoomBottomLabel">
                                 <div className="offcanvas-body flex-grow p-4 overflow-y-auto small">
                                    <button type="button"
                                            className="float-right btn-close box-content w-4 h-4 p-2 mt-1 -my-5 -mr-2 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                            data-bs-dismiss="offcanvas" aria-label="Close"></button>


                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start space-x-4">
                           <div className="flex items-center">
                              <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                                 <path d="M8 8.992a2 2 0 1 1-.002-3.998A2 2 0 0 1 8 8.992Zm-.7 6.694c-.1-.1-4.2-3.696-4.2-3.796C1.7 10.69 1 8.892 1 6.994 1 3.097 4.1 0 8 0s7 3.097 7 6.994c0 1.898-.7 3.697-2.1 4.996-.1.1-4.1 3.696-4.2 3.796-.4.3-1 .3-1.4-.1Zm-2.7-4.995L8 13.688l3.4-2.997c1-1 1.6-2.198 1.6-3.597 0-2.798-2.2-4.996-5-4.996S3 4.196 3 6.994c0 1.399.6 2.698 1.6 3.697 0-.1 0-.1 0 0Z" />
                              </svg>
                              <span className="text-sm whitespace-nowrap ml-2">Milan, IT</span>
                           </div>
                           <div className="flex items-center">
                              <svg className="w-4 h-4 fill-current flex-shrink-0 text-gray-400" viewBox="0 0 16 16">
                                 <path d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z" />
                              </svg>
                              <a className="text-sm font-medium whitespace-nowrap text-indigo-500 hover:text-indigo-600 ml-2" href="#0">carolinmcneail.com</a>
                           </div>
                        </div>
                     </header>

                     <div className="py-3 px-5">
                        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">Rooms</h3>

                        <div className="divide-y divide-gray-200">
                           <button
                               onClick={() => handlePath(ROUTES.CHAT, {data: "Marie Zulfikar"})}
                               className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-01_pfck4u.jpg" width="32" height="32" alt="Marie Zulfikar" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Marie Zulfikar</h4>
                                    <div className="text-[13px]">The video chat ended · 2hrs</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-02_vll8uv.jpg" width="32" height="32" alt="Nhu Cassel" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Nhu Cassel</h4>
                                    <div className="text-[13px]">Hello Lauren 👋, · 24 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-03_uzwykl.jpg" width="32" height="32" alt="Patrick Friedman" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Patrick Friedman</h4>
                                    <div className="text-[13px]">Yes, you’re right but… · 14 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-04_ttlftd.jpg" width="32" height="32" alt="Byrne McKenzie" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Byrne McKenzie</h4>
                                    <div className="text-[13px]">Hey Lauren ✨, first of all… · 14 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                           <button className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                              <div className="flex items-center">
                                 <img className="rounded-full items-start flex-shrink-0 mr-3" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-32-05_bktgmb.jpg" width="32" height="32" alt="Scott Micheal" />
                                 <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Scott Micheal</h4>
                                    <div className="text-[13px]">No way 🤙! · 11 Mar</div>
                                 </div>
                              </div>
                           </button>
                        </div>
                     </div>


                  </div>
               </div>
            </section>
         </div>
       </>
   );


   return (
      <>

         {renderRoomsList()}

      </>
   )

}

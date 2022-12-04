import React, { FC, Fragment, useState } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { Share } from '@capacitor/share';

// @ts-ignore
import Jdenticon from 'react-jdenticon';

// @ts-ignore
import { setAccount, setSettings } from '../../store/actions';
import * as selectors from '../../store/selectors';
import Store from '../../store';
import qrCode from 'qrcode-generator';
import { writeToClipboard } from '../../utils/clipboard';
import Toast from '../Toast';
import { Browser } from '@capacitor/browser';
import {useTranslation} from "react-i18next";
import {setSelectedAddressInDb} from "../../db";

interface IReceiveModal {
  open: boolean,
  onClose: () => void
}
const ReceiveModal: FC<IReceiveModal> = (props) => {

  const { t } = useTranslation();

  const account = Store.useState(selectors.getAccount);

  const addresses = account && account.externalPubAddress || [];

  const [selected, setSelected] = useState(account && account.selectedAddress && account.selectedAddress.address || 'nonAddr');

  function closeModal() {
    props.onClose();
  }

  const renderQrView = () => {

    const qrImage = qrCode(0, 'M');
    qrImage.addData(selected);
    qrImage.make();
    return (
      <div className="grid place-items-center mt-4">
        <div
          className=""
          dangerouslySetInnerHTML={{
            __html: qrImage.createTableTag(4),
          }}
        />
      </div>
    )
  }

  const handleShare= async () => {
    try {
      await Share.share({
        title: 'Address',
        text: selected,
        dialogTitle: 'Cardano Address',
      });
    } catch (e) {
      console.log(e);
    }
  }

  const onCopy = (content:string) => {
    writeToClipboard(content).then(()=>{
      Toast.info("Copy success")
    });
  }

  const openCapacitorSite = async (site:string) => {
    await Browser.open({ url: site });
  };

  const handleSelectAddress = async (address:string) => {
    setSelected(address);
    await setSelectedAddressInDb(address)
  };

  function AddressesList(addresses:any[]) {
    return (
      <div className="grid place-items-center relative z-20">
        <div className="w-80 z-20">
          <Listbox value={selected} onChange={handleSelectAddress}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selected || 'nonAddr'}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {addresses.map((addr, addrIdx:number) => (
                    <Listbox.Option
                      key={addrIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={addr.address}
                      onChange={() => {}}
                    >
                      {({ selected }) => (
                        <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {addr.address}
                      </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          x
                        </span>
                          ) : <span className="absolute inset-y-0 left-1 flex items-center pl-3 text-amber-600">{addrIdx}</span>}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
    )
  }


  return (
    <>
      <Transition appear show={props.open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {/* @ts-ignore*/}
                    <p  className="text-2xl mb-4 text-center">
                      {t("receive.label")}{' '}
                      <a
                        onClick={() => openCapacitorSite("https://docs.cardano.org/cardano-testnet/tools/faucet")}
                        style={{fontSize: 12}} className="text-gray-500 opacity-70 cursor-pointer">
                        faucet
                      </a>
                    </p>
                    <span style={{fontSize: 12}} className="text-gray-500 opacity-70">

                    </span>
                  </Dialog.Title>

                  <div className="mt-2">
                    {AddressesList(addresses)}
                  </div>

                  {renderQrView()}

                  <div className="as-text">
                    <input
                        disabled={true}
                        onChange={(e) => {}}
                        className="focus:text-gray-700 focus:outline-none w-full bg-transparent"
                        // @ts-ignore
                        value={selected}
                    />
                  </div>


                  <div className="mt-12 container">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        className="mx-4 inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-orange-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => onCopy(selected)}
                      >
                        {/* @ts-ignore*/}
                        {t("receive.copy")}
                      </button>
                      <button
                        type="button"
                        className="mx-4 inline-flex float-right justify-end cursor-pointer rounded-md border border-transparent bg-blue-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => handleShare()}
                      >
                        {/* @ts-ignore*/}
                        {t("receive.share")}
                      </button>
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ReceiveModal;


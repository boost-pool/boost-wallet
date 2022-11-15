import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/react';
import Store from '../../store';
import { getAccount } from '../../store/selectors';
import Lottie from 'react-lottie-player';
import successAnimation from '../../public/lottie/success.json';

import { close } from 'ionicons/icons';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { addressIsValid } from '@lib/utils';
import { addressSlice, amountIsValid } from '../../utils';
import { signAndSubmit } from '@lib/transaction';
import { App } from '@capacitor/app';
import { writeToClipboard } from '../../utils/clipboard';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { useTranslation } from 'next-export-i18n';

const SendModal = ({ open, onDidDismiss }: any) => {
  const account = Store.useState(getAccount);

  const totalAda = account && account.balance ? (new BigNumber(account && account.balance)).div(new BigNumber(10).pow(6)).toString() : 0;

  const [renderOption, setRenderOption] = useState(0);
  const [feeToPay, setFeeToPay] = useState('0.0');
  const [txHash, setTxHash] = useState('');
  const [metadataToSend, setMetadataToSend] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedOutput, setSelectedOutput] = useState(0);
  const [outputs, setOutputs] = useState([
    {
      addressToSend: '',
      assets: [{ unit: 'lovelace', quantity: '' }],
      valid: true
    }
  ]);

  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { t } = useTranslation();

  let totalAmount = '0';
  outputs.map(output => {
    totalAmount = (new BigNumber(totalAmount.toString()).plus(new BigNumber(output.assets.find(asset => asset.unit === 'lovelace' && output.addressToSend !== '')?.quantity || '0'))).toString();
  });

  useEffect(() => {
    App.addListener('backButton', data => {
      onDidDismiss();
    });
  }, []);
  useEffect(() => {
    buildTx(false);
  }, [outputs]);

  const handleAddressToSend = async (address: string) => {
    if (!(await addressIsValid(address))) return;

    let outs = outputs.map((out, index) => {
      if (index === selectedOutput) out.addressToSend = address;
      return out;
    });
    setOutputs(outs);
  };
  const handleAmountToSend = (unit: string, quantity: string) => {

    if (quantity === '' || amountIsValid(quantity) || (amountIsValid(quantity.substring(0, quantity.length - 1)) && quantity[quantity.length - 1] === '.')) {
      let outs = outputs.map((out, index) => {
        if (index === selectedOutput) {
          out.assets.map(asset => {
            if (asset.unit === unit) {
              asset.quantity = quantity;
            }
            return asset;
          });
        }
        return out;
      });
      setOutputs(outs);
    }
  };
  const handleAssetToSend = (index:number, unit?: string, quantity?: string) => {

    let outs = outputs.map((out, ind) => {
      if (ind === selectedOutput) {
        out.assets.map((asset, i) => {
          if (i === index+1 && asset.unit !== "lovelace") {
            if (quantity && quantity === '' || (quantity !== undefined && (amountIsValid(quantity) || (amountIsValid(quantity.substring(0, quantity.length - 1)) && quantity[quantity.length - 1] === '.')))) {
              asset.quantity = quantity;
            }
            if (unit) {
              asset.unit = unit;
            }
          }
          return asset;
        });
      }
      return out;
    });
    setOutputs(outs);

  };


  const addAssetToSend = () => {
    const availableAssets = account && account.assets && account.assets.length && account.assets.filter((asset: { unit: string; }) => {
      return asset.unit !== 'lovelace';
    }).map((a: { unit: any; }) => a) || [];
    const outs = outputs.map((out, index) => {
      if (index === selectedOutput) {
        out.assets = [...out.assets, {
          // @ts-ignore
          unit: availableAssets.length && availableAssets[0].unit || '',
          quantity: ''
        }];
      }
      return out;
    });
    setOutputs(outs);
  };

  const onRemoveAsset = (index: number) => {
    setOutputs(outs => outs.map((out, i) => {
      if (i === selectedOutput) {
        out.assets = out.assets.filter((asset, ind) => index !== ind);
      }
      return out;
    }));
  };

  const handleMetadataToSend = (metadata: string) => {
    setMetadataToSend(metadata);
  };
  const onDismissModal = () => {
    onDidDismiss();
    setError('');
    setFeeToPay('');
    setTxHash('');
    setPassword('');
    setSubmitSuccess(false);
    setOutputs([
      {
        addressToSend: '',
        assets: [{ unit: 'lovelace', quantity: '' }],
        valid: true
      }
    ]);
  };

  const RenderMain = () => {
    switch (renderOption) {
      case 0:
        return RenderOutputsTabs();
      case 1:
        return RenderDone();
      default:
        return null;
    }
  };

  const buildTx = async (sign: boolean) => {
    setError('');
    const txDetails = await signAndSubmit(account, outputs, metadataToSend, password, sign);
    if (!txDetails) return;

    if (txDetails.error) { // @ts-ignore
      setError(txDetails.error.toString());
    }

    setFeeToPay(txDetails.fee || '0');
    if (txDetails && txDetails.transaction) {
      setSubmitSuccess(true);
      setTxHash(txDetails.transaction || '');
    }

  };
  const handleOnConfirm = async () => {
    await buildTx(true);
  };
  const handleOnDone = () => {
    onDismissModal();
    setTimeout(() => {
      setRenderOption(0);
    }, 1000);
  };

  const onCopy = (content: string) => {
    writeToClipboard(content).then(() => {
      //Toast.info("Copy success");
    });
  };

  const handlePassword = (pass: string) => {
    setPassword(pass);
  };

  const onAddOutput = () => {
    if (outputs.length < 12) {
      const newOutput = {
        addressToSend: '',
        validAddress: true,
        assets: [{ unit: 'lovelace', quantity: '' }],
        valid: true
      };
      setOutputs(prevTabs => ([...prevTabs, ...[
        newOutput
      ]]));
      setSelectedOutput(outputs.length);
    }
  };

  const onRemoveOutput = (id: number) => {
    if (outputs.length > 1) {
      setOutputs(prevTabs => prevTabs.filter((_, index) => index !== id));

      let selectedOut = id - 1;
      if (selectedOut < 0) selectedOut = 0;
      setSelectedOutput(selectedOut);
    }
  };
  const RenderAssets = () => {

    const assets = outputs[selectedOutput]?.assets.filter(asset => {
      return asset.unit !== 'lovelace';
    });
    const availableAssets = account && account.assets && account.assets.length && account.assets.filter((asset: { unit: string; }) => {
      return asset.unit !== 'lovelace';
    }).map((a: { unit: any; }) => a) || [];

    return <>
      <div>
        {
          assets?.length ?
            <>
              {assets.map((asset, index) => {
                return <div key={index} className='block relative mt-1 rounded-md shadow-sm '>
                  <div className='cursor-pointer absolute inset-y-0 left-0 flex items-center pl-1'>
              <span className='text-gray-500 hover:text-red-400 sm:text-sm '>
                <svg
                  onClick={() => onRemoveAsset(index)}
                  xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'
                  stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <rect x='3'
                              y='3'
                              width='18'
                              height='18'
                              rx='2'
                              ry='2'></rect><line
                  x1='9' y1='9' x2='15' y2='15'></line><line x1='15' y1='9' x2='9' y2='15'></line></svg>
              </span>
                  </div>
                  <input
                    value={asset.quantity}
                    onChange={(e) => handleAssetToSend(index, undefined, e.target.value)}
                    type='text'
                    className='block w-full rounded-md border-gray-300 pl-8 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    placeholder='0.00' />
                  <div className='absolute inset-y-0 right-0 flex items-center'>
                    <label htmlFor='currency' className='sr-only'>Currency</label>
                    <select
                      onChange={(e) => handleAssetToSend(index, e.target.value, undefined)}
                      id='currency' name='currency'
                      className='h-full max-w-96 rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'>
                      {
                        availableAssets.map((asset: { asset_name: string, unit:string }, index: number) => {
                          return <option key={index} value={asset.unit}>{Buffer.from(asset.asset_name,"hex").toString()}</option>
                        })
                      }
                    </select>
                  </div>
                </div>
              })}
            </>
            : null
        }
        {
          account?.assets?.length ?
            <div
              onClick={() => addAssetToSend()}>
              <p className="text-right mt-2">
                <a
                >{t("send.addAsset")}</a>
              </p>
            </div>
            : null
        }
      </div>
    </>
  }
  const RenderActions = () => (
    <>
      {
        !submitSuccess ?
          <div className="relative flex pt-12 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink ml-4 mr-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>
              </span>
              <span className="flex-shrink mr-4 text-gray-400">
                {t("send.pay")}
              </span>
            <div className="flex-grow border-t border-gray-400"></div>
        </div> : null
      }
      <div className="container px-6 mt-12">
        <div className="block px-6">
          {submitSuccess ?
            <div className="grid place-items-center my-4">
              <Lottie
                loop={false}
                animationData={successAnimation}
                play
                style={{ width: 180 }}
              />
            </div>: null}
          {
            error.length ? <p className="italic text-red-400">
              {error}
            </p> : null
          }
          <p>total
            <span className="float-right">₳{totalAmount}
              </span>
          </p>
          <p>{t("send.fee")}
            <span className="float-right">₳{ feeToPay && feeToPay.length ? (new BigNumber(feeToPay)).div(new BigNumber(10).pow(6)).toString() : 0}
              </span>
          </p>
          <p>cbor
            <span
              onClick={() => onCopy(txHash)}
              className="float-right cursor-pointer">
                {addressSlice(txHash,14)}
              </span>
          </p>
          {
            !submitSuccess ?  <div className="relative w-full mt-4">
              <div className="absolute inset-y-0 right-0 flex items-center px-2">
                <input className="hidden js-password-toggle" id="toggle" type="checkbox" />
                <label
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
                  htmlFor="toggle">
                  {
                    showPassword ?
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                  }
                </label>
              </div>
              <input
                value={password}
                onChange={(e) => handlePassword(e.target.value)}
                className="appearance-none border-2 rounded w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-blue-700 focus:bg-white text-gray-700 pr-16 font-mono js-password"
                id="password" type={showPassword ? "text" : "password"} placeholder={t("send.enterPassword")} autoComplete="off"
              />
            </div> : null
          }
          {
            submitSuccess ? <button
              type="button"
              className="
                w-full
                inline-flex
                justify-center cursor-pointer rounded-md border border-transparent bg-green-100 mt-2 px-6 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              onClick={() => handleOnDone()}
            >
              {t("send.done")}
            </button> : <button
              type="button"
              className="
                w-full
                inline-flex
                justify-center cursor-pointer rounded-md border border-transparent bg-blue-100 mt-2 mb-8 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => handleOnConfirm()}
            >
              {t("send.confirm")}
            </button>
          }

        </div>
      </div>

    </>
  )
  const RenderOutputsTabs = () => (
    <>

      {
        !submitSuccess ? <>
          <div className="w-full px-2 mt-4">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-2 mx-4">
                {outputs.map((output, index) => (
                  <Tab
                    key={index}
                    onClick={() => setSelectedOutput(index)}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-1 text-sm font-medium leading-5',
                        'focus:outline-none',
                        index === selectedOutput
                          ? 'bg-white shadow text-blue-700'
                          : 'hover:bg-white/[0.5] text-white'
                      )
                    }
                  >
                    {index+1}
                  </Tab>
                ))}
                {outputs.length < 12 ? <Tab
                  onClick={() => onAddOutput()}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-1 text-sm font-medium leading-5',
                      'focus:outline-none',
                      'hover:bg-white/[0.5] text-white'
                    )
                  }
                >
                  <svg className="inline-block p-1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                </Tab> : null}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <div className="container px-4 mt-24 md:mt-2">
                  <div className="block p-6">
                    {
                      outputs.length > 1 ? <p className="text-right">
                        <a
                          onClick={() => onRemoveOutput(selectedOutput)}
                        >{t("send.remove")}</a>
                      </p> : null
                    }
                    <form>
                      <div className="form-group mb-6">
                        <p className="mb-2">{t("send.toAddress")}</p>
                        <div className="inline-block w-full">
                          <input
                            value={outputs[selectedOutput]?.addressToSend || ''}
                            onChange={(event) => handleAddressToSend(event.target.value)}
                            type="text"
                            className="form-control block
                          inline-block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleInput8"
                            placeholder={t("send.address")} />
                        </div>
                      </div>
                      <div className="form-group mb-6">
                        <input
                          value={outputs[selectedOutput]?.assets?.find(asset => asset.unit === "lovelace")?.quantity || ''}
                          onChange={(event) => handleAmountToSend("lovelace",event.target.value)}
                          className="text-5xl focus:text-gray-700 focus:outline-none bg-transparent md:ml-32"
                          placeholder={t("send.adaToSend")}
                        />
                      </div>
                      <div className="form-group mb-6">
                        {RenderAssets()}
                      </div>
                      <div className="form-group mb-6">

                        {/*
                    <textarea
                      value={metadataToSend}
                      onChange={(event) => handleMetadataToSend(event.target.value)}
                      className="
                      form-control
                      block
                      w-full
                      px-3
                      py-1.5
                      text-base
                      font-normal
                      text-gray-700
                      bg-white bg-clip-padding
                      border border-solid border-gray-300
                      rounded
                      transition
                      ease-in-out
                      m-0
                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                    "
                      id="exampleFormControlTextarea13"
                      // @ts-ignore
                      rows="3"
                      placeholder="Message"
                    ></textarea>
                      */}
                      </div>
                    </form>
                  </div>

                </div>
              </Tab.Panels>
            </Tab.Group>
          </div>

        </>: <>

        </>
      }
      {RenderActions()}

    </>
  );

  const RenderDone = () => {
    return <>
    </>
  }

  return (
    <IonModal isOpen={open} onDidDismiss={onDismissModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("send.sendFrom")}
            <span className="font-bold text-2xl">
              {' '}{account && account.name}{' '}
              / ₳{totalAda}
              {account && account.assets && account.assets.length ?
                <>/ Assets {account && account.assets && account.assets.length}</> :
                null}
            </span>
          </IonTitle>
          <IonButton slot="end" fill="clear" color="black" onClick={onDismissModal}>
            <IonIcon icon={close} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      {/* @ts-ignore */}
      <IonContent fullscreen className="scrollbar-hide">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Send from <span className="font-bold text-2xl">{account && account.name} | ₳{totalAda} | Assets {account && account.assets && account.assets.length}</span></IonTitle>
          </IonToolbar>
        </IonHeader>
        {RenderMain()}
      </IonContent>
    </IonModal>
  );
};

export default SendModal;


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getAccount } from '../../store/selectors';
import Store from '../../store';
import { App } from '@capacitor/app';
import { Tab } from '@headlessui/react';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
// @ts-ignore
const moment = extendMoment(Moment);
import {useTranslation, useLanguageQuery } from "next-export-i18n";

import ReceiveModal from '@components/modal/ReceiveModal';
import classNames from 'classnames';
// @ts-ignore
import SendModal from '@components/modal/SendModal';
import AccountsModal from '@components/modal/AccountsModal';
import {
  fetchBlockfrost,
  getAccountState,
  getAddressesWithAssets,
  getTxInfo,
  getTxUTxOs,
  getTxUTxOsByAddress
} from '../../api/blockfrost';
import { classifyTx, mergeAssetsFromUtxosByUnit } from '@lib/tx';
import { setAccount } from '../../store/actions';
import BigNumber from 'bignumber.js';
import { setObject } from '../../db/storage';
import { addressSlice, compareObjectsByHash } from '../../utils';
import Toast from '@components/shared/Toast';
import { writeToClipboard } from '../../utils/clipboard';
import { Browser } from '@capacitor/browser';
import { EXPLORER_CARDANO_SCAN, POOL_PM_URL } from '../../config';
import { coinGeckoAPI } from '../../api';
import { IPFS_HTTP_PREFIX } from '../../config';

interface ITransaction {
  txHash: string,
  type: string,
  blockTime: string,
  status: string,
  fees: string,
  amount: {[unit: string]:string;},
  inputs: {
    otherAddresses:{
      address: string
      amount: {unit:string, quantity:string}[]
    }[],
    usedAddresses:{
      address: string
      amount: {unit:string, quantity:string}[]
    }[],
  },
  outputs: {
    otherAddresses:{
      address: string
      amount: {unit:string, quantity:string}[]
    }[],
    usedAddresses:{
      address: string
      amount: {unit:string, quantity:string}[]
    }[],
  },
}

// @ts-ignore
App.addListener('backButton', ({ isActive }) => {
  console.log('App state changed. Is active?', isActive);
});

const Home = () => {
  const [showSend, setShowSend] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [addr, setAddr] = useState('');
  const [price, setPrice] = useState({
    usd: 0,
    eur: 0,
    btc: 0
  });
  const [showReceive, setShowReceive] = useState(false);
  const account = Store.useState(getAccount);
  let categories = {
    tokens: [
      {
        id: 1,
        title: 'Does drinking coffee make you smarter?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    nft: [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
    ],
    identity: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  };

  const { t } = useTranslation();
  const [query] = useLanguageQuery();

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
    asyncFetch();
  }, [account && account.name]);

  useEffect(() => {
    try {
      coinGeckoAPI.get("simple/price?ids=cardano&vs_currencies=usd%2Ceur%2C%20gbp%2Cbtc").then((response) => {
        const p = response.data.cardano;
        setPrice(p);
      }).catch();
    } catch (e) {
      console.log(e)
    }
  }, []);

  const asyncFetch = async () => {
    let currentAccount = {...account};
    const stakeAddress = currentAccount?.stakeAddress

    if(!stakeAddress) return;

    const accountState = await getAccountState(stakeAddress);

    if (accountState){
      currentAccount.balance = accountState.controlled_amount;
      currentAccount.delegated = accountState.active;
      currentAccount.rewardsSum = accountState.rewards_sum;
      currentAccount.withdrawableAmount = accountState.withdrawabl_amount;

      const relatedAddresses = await getAddressesWithAssets(stakeAddress);

      if(!relatedAddresses) return;

      const utxos = await Promise.all(
        relatedAddresses.map(async (relatedAddress: { address: string; utxos: any; }) => {
          const utxos = await getTxUTxOsByAddress(relatedAddress.address);
          if (utxos && !utxos.error){
            relatedAddress.utxos = utxos;
            return relatedAddress;
          }
        })
      );

      if (await compareObjectsByHash(utxos,currentAccount.utxos)) return;

      currentAccount.utxos = utxos;

      const assets = mergeAssetsFromUtxosByUnit(utxos);

      const assetsWithDetails = (await Promise.all(Object.entries(assets).map(async ([unit, quantity]) => {
        if (unit !== "lovelace") {
          let asset = await fetchBlockfrost(`assets/${unit}`);
          if (!asset.error){
            asset.quantity = quantity;
            asset.unit = unit;
            return asset;
          }
        }
      }))).filter(asset => asset !== undefined);

      currentAccount.assets = assetsWithDetails;



      let addressTxsList = await Promise.all(
        relatedAddresses.map(async (addr:any) => {
          const response = await fetchBlockfrost(`addresses/${addr.address}/transactions`);
          if (!response.error){
            addr.txs = response;
            return addr;
          }
        })
      );

      let joinedTxsList:
        {
          address: string,
          block_height: number,
          block_time: number,
          tx_hash: string,
          tx_index: number,
          status: string,

        }[] = [];
      addressTxsList.map(addr => {
        // @ts-ignore
        addr.txs.map((tx: { block_time: any; address?: string; block_height?: number; tx_hash?: string; tx_index?: number; status?: string; }) => {
          tx.block_time = tx.block_time*1000;
          // @ts-ignore
          joinedTxsList.push({...tx, address: addr.address});
        })
      });

      let uniqueArrayTxsList = joinedTxsList.filter((v,i,a)=>a.findIndex(v2=>(v2.tx_hash===v.tx_hash))===i)

      let currentTxs = currentAccount && currentAccount.history || [];

      const allTxHashes:string[] = [];

      if (currentTxs){
        currentTxs.map((tx: { txHash: string; }) => {
          if (tx){
            allTxHashes.push(tx.txHash);
          }
        });

        // @ts-ignore
        uniqueArrayTxsList = uniqueArrayTxsList.map(txAddr => {
          const r = !allTxHashes.includes(txAddr.tx_hash);
          if (r){
            return txAddr;
          }
        }).filter(e => e != undefined);
      }

      if (uniqueArrayTxsList && uniqueArrayTxsList.length){

        let addrsWithTxsList = [];
        addrsWithTxsList = (await Promise.all(
          uniqueArrayTxsList.map(async tx => {
            const txInfo = await getTxInfo(tx.tx_hash);
            const utxos = await getTxUTxOs(tx.tx_hash);

            if (utxos && !utxos.error){
              // @ts-ignore
              tx.utxos = utxos;
              // @ts-ignore
              tx.fees = txInfo.fees;
              // @ts-ignore
              tx.size = txInfo.size;
              // @ts-ignore
              tx.asset_mint_or_burn_count = txInfo.asset_mint_or_burn_count;
              return tx;
            }
          })
        )).filter(tx => tx !== undefined);

        const allAddresses = [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress];
        const allTransactionsByAddr: { address: string; history: { txHash: any; blockTime: any; inputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; outputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; amount: { [unit: string]: number; }; fees: any; type: "SEND_TX"; status: string; } | { txHash: any; blockTime: any; inputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; outputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; amount: { [unit: string]: number; }; fees: any; type: "RECEIVE_TX"; status: string; } | { txHash: any; blockTime: any; inputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; outputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; amount: { [unit: string]: number; }; fees: any; type: "SELF_TX"; status: string; } | { txHash: any; blockTime: any; inputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; outputs: { usedAddresses: { amount: string; address: string; }[]; otherAddresses: { amount: string; address: string; }[]; }; amount: {}; fees: any; type: string; status?: undefined; }; }[] = [];

        await Promise.all(
          addrsWithTxsList.map(async addrObj => {
            // @ts-ignore
            let cTxs = await classifyTx(addrObj, allAddresses);
            // @ts-ignore
            allTransactionsByAddr.push({address: addrObj.address, history: cTxs });
          })
        );

        let mergedHistory: any[] = []; // All addresses
        allTransactionsByAddr.map(async addr => {
          mergedHistory.push(addr.history);
        });


        let accHistory: any[] = [];
        accHistory = currentAccount && currentAccount.history || [];

        if (accHistory){
          accHistory = [...accHistory, ...mergedHistory];
        } else {
          accHistory = mergedHistory
        }

        let pendingTxs = currentAccount && currentAccount.pendingTxs.filter((pendTx: { txHash: any; }) => {
          return !(accHistory.some(h => h.txHash === pendTx.txHash))
        }) || [];

        accHistory = accHistory.sort((a, b) => (a.blockTime < b.blockTime) ? 1 : -1);

        if (mergedHistory.length) {
          //setAccountHistory(accHistory);
          currentAccount.history = accHistory;
        }
        if (pendingTxs.length) {
          if (currentAccount && currentAccount.pendingTxs.length !== pendingTxs.length){
            /*
            Toast.show({
              type: 'success',
              text1: 'Transaction confirmed'
            });
             */
          }
          currentAccount.pendingTxs = pendingTxs;
          //setAccountPendingTxs(pendingTxs);
        }

        setAccount(currentAccount);
        await setObject("accounts", currentAccount.id.toString(),currentAccount);
    }
    }

  };

  const onCopy = (content:string) => {
    writeToClipboard(content).then(()=>{
      Toast.info("Copy success")
    });
  }

  const openCapacitorSite = async (site:string) => {
    await Browser.open({ url: site });
  };

  const RenderIdentities = () => {
      return <>
        <div className="container mx-auto">
        <div className="md:py-8">
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("home.id")}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("home.idProvider")}
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t("home.idStatus")}
                  </th>
                </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
      </>
  }
  const RenderTokens = () => {
    return <div className="container mx-auto">
      <div className="md:py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("home.nativeToken")}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("home.policyId")}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t("home.amount")}
                </th>
              </tr>
              </thead>
              <tbody>
              {
                account && account.assets && account.assets.length ? account.assets.map((asset:any[], index:number) => {
                  return <tr key={index}>
                    <td className="px-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 ">
                          <img width={32} height={32} src={"/img/nativeTokenIcon.png"} />
                        </div>
                        <div className="ml-3 cursor-pointer">
                          <p
                            // @ts-ignore
                            onClick={() => onCopy(asset.asset_name)}
                            // @ts-ignore
                            className="text-gray-900 whitespace-no-wrap">{Buffer.from(asset.asset_name,"hex").toString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                      <span
                        // @ts-ignore
                        onClick={() => onCopy(asset.asset)}
                        // @ts-ignore
                        className="relative cursor-pointer">{addressSlice(asset.asset, 4)}</span>
                    </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      { /* @ts-ignore */ }
                      <p className="text-gray-900 whitespace-no-wrap">{asset.quantity}</p>
                    </td>
                  </tr>
                })
                : null
              }

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  }
  const RenderTxIcon = (type:string) => {

    let img = "/img/txSelf.png";
    switch (type) {
      case "SEND_TX":
        img = "/img/txSend.png";
        break;
      case "RECEIVE_TX":
        img = "/img/txReceive.png";
        break;
      case "SELF_TX":
        img = "/img/txSelf.png";
    }

    // eslint-disable-next-line @next/next/no-img-element
    return <img width={40} height={20} className="" src={img}  alt=''/>
  }

  const RenderActivity = () => {

    return <section className="py-5">
      <div className="space-y-2">

        {
          account && account.history && account.history.map((tx: ITransaction, index:number) => {
            let amount = new BigNumber(tx.amount.lovelace).plus(new BigNumber(tx.fees)).dividedBy('1000000').toNumber();
            if (tx.type === "SELF_TX"){
              amount = (new BigNumber(tx.fees)).dividedBy('1000000').toNumber();
            } else if (tx.type === "RECEIVE_TX") {
              amount = (new BigNumber(tx.amount.lovelace)).dividedBy('1000000').toNumber();
            }
            return <div key={index} className="flex space-x-4 rounded-xl bg-white p-3 shadow-sm justify-between">
              <div className="flex ">
                {RenderTxIcon(tx.type)}
                <div className="ml-2 md:ml-8">
                  <h4 className="font-semibold text-gray-600">{amount}₳</h4>
                  <p className="text-sm text-slate-400">{moment.utc(tx.blockTime).format("YYYY-MM-DD h:mm:ss")}</p>
                </div>
              </div>
              <div className="pt-1/2">
                <button
                  onClick={() => openCapacitorSite(`${EXPLORER_CARDANO_SCAN}transaction/${tx.txHash}`)}
                  type="button"
                  className="rounded bg-slate-50 py-2 px-2 text-xl text-slate-500 hover:bg-slate-100 right-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
          })
        }
      </div>
    </section>
  }
  const RenderNFTs = () => {
    const availableAssets = account && account.assets && account.assets.length && account.assets.filter((asset: { unit: string; }) => {
      // @ts-ignore
      return asset.unit !== 'lovelace' && asset?.onchain_metadata?.image?.length;
    }) || [];
    return <>
      <div className="grid grid-cols-2 gap-2">
        {
          availableAssets.map((asset: any, key:number) => {
            return <div key={key}>
              <div className="w-full sm:w-96 bg-primary-800 rounded-2xl p-6 drop-shadow">
                <img src={`${IPFS_HTTP_PREFIX}${availableAssets[0].onchain_metadata.image.replace("ipfs://",'')}`} alt="" className="rounded-2xl"/>
                  <h2 className="text-primary-50 font-bold text-xl my-5">{asset?.onchain_metadata?.name}</h2>
                  <p className="text-primary-100 text-base">{asset?.onchain_metadata?.description}</p>
                  <div className="flex justify-between items-center my-5">
                    <div className="flex">
                        <p className="text-primary-200 mx-2">{asset.quantity} units</p>
                    </div>
                    <div className="flex item-center">
                      <p className="text-primary-100">{addressSlice(asset.fingerprint)}</p>
                    </div>
                  </div>
                <hr className="bg-primary-700"/>
                  <div className="flex gap-4 mt-5 items-center">
                    <div className="rounded-full border border-primary-50">
                      <img src="/img/poolpm.png" alt="" className="w-12 h-12"/>
                    </div>
                    <p className="text-primary-100">See in
                      <a
                        onClick={() => openCapacitorSite(`${POOL_PM_URL}${asset.fingerprint}`)}
                      className="text-primary-50"> pool.pm</a>
                    </p>
                  </div>
              </div>
            </div>
          })
        }
      </div>
      <div className="px-6 py-4">
        <div className="text-center text-grey">
          Total NFT 4
        </div>
      </div>
    </>
  }

  const RenderAssetsTab = (id:number) => {
    switch (id) {
      case 0:
        return RenderTokens();
      case 1:
        return <RenderNFTs/>;
      case 2:
        return RenderIdentities();
      default:
        return null;
    }
  }
  const RenderTab = (id:number) => {
    switch (id) {
      case 0:
        return RenderAssetsTabs();
      case 1:
        return RenderActivity();
      default:
        return null;
    }
  }
  const RenderMainTabs = () => (
    <>
      <div className="w-full">
        <Tab.Group defaultIndex={1}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
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
              {t("home.assets")}
            </Tab>
            <Tab
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
              {t("home.activity")}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            {Object.values(categories).map((posts, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  '',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                {RenderTab(idx)}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
  </>);

  const RenderAssetsTabs = () => (
    <>
      <div className="w-full">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-3.5 text-sm font-medium leading-5',
                    'focus:outline-none',
                    selected
                      ? 'bg-white shadow text-blue-700'
                      : 'hover:bg-white/[0.5] text-white'
                  )
                }
              >
                {t(`home.${category}`)}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {Object.values(categories).map((posts, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  '',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                )}
              >
                {/* @ts-ignore */}
                {RenderAssetsTab(idx)}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
  const HomePage = () => (
    <div className="mx-auto">
      <div className="h-full bg-gray-50">
        <div className="rounded-b-xl bg-blue-600 p-5 pb-44 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div
              onClick={() => setShowCreateAccount(true)}
              className="rounded-lg bg-indigo-50/30 p-3 hover:bg-white hover:text-indigo-500">
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.644 17.08c2.866-.662 4.539-1.241 3.246-3.682-3.932-7.427-1.042-11.398 3.111-11.398 4.235 0 7.054 4.124 3.11 11.398-1.332 2.455.437 3.034 3.242 3.682 2.483.574 2.647 1.787 2.647 3.889v1.031h-18c0-2.745-.22-4.258 2.644-4.92zm-12.644 4.92h7.809c-.035-8.177 3.436-5.313 3.436-11.127 0-2.511-1.639-3.873-3.748-3.873-3.115 0-5.282 2.979-2.333 8.549.969 1.83-1.031 2.265-3.181 2.761-1.862.43-1.983 1.34-1.983 2.917v.773z"/></svg>
            </div>
            <h1 className="text-gray-200 text-center text-3xl font-semibold">{account && account.name}</h1>
            <div className="rounded-lg bg-indigo-50/30 p-3 hover:bg-white hover:text-indigo-500">
              <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11 8h-1v-2h1v1h2v1h-1v1h-1v-1zm2 12v-1h-1v1h1zm-1-15v-1h-2v1h1v1h1v-1zm8-1v6h-1v-1h-4v-5h5zm-1 4v-3h-3v3h3zm-14 2h-1v1h2v-1h-1zm0 3h1v1h1v-3h-1v1h-2v2h1v-1zm5 1v2h1v-2h-1zm4-10h-1v3h1v-3zm0 5v-1h-1v1h1zm3-2h1v-1h-1v1zm-10-1h-1v1h1v-1zm2-2v5h-5v-5h5zm-1 1h-3v3h3v-3zm9 5v1h-1v-1h-2v1h-1v-1h-3v-1h-1v1h-1v1h1v2h1v-1h1v2h1v-2h3v1h-2v1h2v1h1v-3h1v1h1v2h1v-1h1v-1h-1v-1h-1v-1h1v-1h-2zm-11 8h1v-1h-1v1zm-2-3h5v5h-5v-5zm1 4h3v-3h-3v3zm12-3v-1h-1v1h1zm0 1h-1v1h-1v-1h-1v-1h1v-1h-2v-1h-1v2h-1v1h-1v3h1v-1h1v-1h2v2h1v-1h1v1h2v-1h1v-1h-2v-1zm-9-3h1v-1h-1v1zm10 2v1h1v1h1v-3h-1v1h-1zm2 4v-1h-1v1h1zm0-8v-1h-1v1h1zm-2-10h4v4h2v-6h-6v2zm-16 4v-4h4v-2h-6v6h2zm4 16h-4v-4h-2v6h6v-2zm16-4v4h-4v2h6v-6h-2z"/></svg>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-4xl font-bold tracking-wider">₳{account?.balance ? (new BigNumber(account.balance)).div(new BigNumber(10).pow(6)).toString() : 0}</div>
            <div className="text-slate-200">${price?.usd} / ₿{price?.btc}</div>
          </div>
        </div>
        <div className="-mt-40 p-5">
          <div className="rounded-xl bg-white p-4 font-medium text-slate-500 shadow-sm">
            <div className="mb-3 text-sm">{t("home.financialHealth")}</div>
            <div className="mb-3">
              <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              </div>
            </div>
            <div className="mb-4 flex justify-between">
              <div className="tracking-wides rounded-md bg-slate-100 py-1 px-2 text-xs font-semibold">{t("home.expenses")}</div>
              <div className="tracking-wides rounded-md bg-slate-100 py-1 px-2 text-xs font-semibold">{t("home.balanced")}</div>
              <div className="tracking-wides rounded-md bg-slate-100 py-1 px-2 text-xs font-semibold">{t("home.incomes")}</div>
            </div>
            <div className="flex">
              <button
                onClick={() => setShowSend(true)}
                className="flex w-full items-center justify-center rounded-lg bg-gray-800 py-4 mx-1 px-5 font-medium tracking-wide text-white text-opacity-90 shadow-slate-100 hover:shadow-lg">
                <span className="mr-2">{t("home.send")}</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </button>
              <button
                onClick={() => setShowReceive(!showReceive)}
                className="flex w-full items-center justify-center rounded-lg bg-gray-800 py-4 px-5 font-medium tracking-wide text-white text-opacity-90 shadow-slate-100 hover:shadow-lg">
                <span className="mr-2">{t("home.fundWallet")}</span>
              </button>
            </div>
          </div>
        </div>

        <section className="px-5 w-full">
          <RenderMainTabs/>
        </section>
        <ReceiveModal open={showReceive} onClose={() => setShowReceive(false)}/>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <p className="text-xl color-white-dark pl-2 pt-2 font-boost">BOOST Wallet</p>
          </IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => {}}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
            <IonButton onClick={() => {}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{t("home.label")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SendModal open={showSend} onDidDismiss={() => setShowSend(false)} />
        <AccountsModal open={showCreateAccount} onDidDismiss={() => setShowCreateAccount(false)} />
        <HomePage/>
      </IonContent>
      {addr}
    </IonPage>
  );
};

export default Home;

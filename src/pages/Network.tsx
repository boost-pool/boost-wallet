
import { Line } from '@ant-design/plots';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment'
import Toast from '../components/Toast';
import { App } from '@capacitor/app';

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { coinGeckoAPI } from '../api';
import { getLatestBlock } from '../api/blockfrost';
import BigNumber from 'bignumber.js';
import { writeToClipboard } from '../utils/clipboard';
import { Browser } from '@capacitor/browser';
import { EXPLORER_CARDANO_SCAN } from '../../config';
import {useTranslation} from "react-i18next";
// @ts-ignore
import boostLogo from "../resources/img/adabooster-logo.jpeg";

// @ts-ignore
App.addListener('backButton', ({ isActive }) => {
  console.log('App state changed. Is active?', isActive);
});

const Network = () => {

  const { t } = useTranslation();

  const [percentage, setPercentage] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [block, setBlock] = useState(0);
  const [blockHash, setBlockHash] = useState('');
  const [slot, setSlot] = useState(0);
  const [addr, setAddr] = useState('');
  const [data, setData] = useState([]);
  const [price, setPrice] = useState<{usd:number,eur:number,btc:number}>({
    usd: 0,
    eur: 0,
    btc: 0
  });

  const config = {
    data,
    padding: 'auto',
    xField: 'date',
    yField: 'price',
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0.0,
      end: 1,
    },
  };

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
    const fetchData = async () => {
      await asyncFetch()
    }
    if (isMounted.current) {
      // call the function
      fetchData()
        // make sure to catch any error
        .catch(console.error)
    }
  }, [])

  const asyncFetch = async () => {
    try {
      coinGeckoAPI.get("coins/cardano/market_chart?vs_currency=USD&days=2190&interval=daily").then((response) => {
        const historicalPrice = response.data.prices.map((price:number[]) => {
          return {
            date: moment(price[0]).format("YYYY-MM-DD"),
            price: parseFloat(price[1].toFixed(2))
          }
        });
        setData(historicalPrice);
      });
    } catch (e) {
      console.log(e);
    }

    try {
      coinGeckoAPI.get("simple/price?ids=cardano&vs_currencies=usd%2Ceur%2C%20gbp%2Cbtc").then((response) => {
        const p = response.data.cardano;
        setPrice(p);
      });
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {

    const fetchData = async () => {

      const latestBlock = await getLatestBlock();
      const nextEpoch = ((new BigNumber(latestBlock.epoch_slot)).multipliedBy(new BigNumber(10).pow(2))).div((new BigNumber("432000"))).toString();
      setPercentage(parseInt(parseFloat(nextEpoch).toFixed(0)));

      setEpoch(latestBlock.epoch);
      setBlock(latestBlock.height);
      setBlockHash(latestBlock.hash);
      setSlot(latestBlock.epoch_slot);

    }
    if (isMounted.current) {
      // call the function
      fetchData()
        // make sure to catch any error
        .catch(console.error)
    }
  }, []);

  const openCapacitorSite = async (site:string) => {
    await Browser.open({ url: site });
  };


  const RenderStats = () => (
    <div className="mx-auto">
      <div className="h-full bg-gray-50">
        <div className="rounded-b-xl bg-blue-600 p-5 pb-24 text-white">

          <div className="space-y-2 text-center">
            <div className="text-4xl font-bold tracking-wider">${price.usd}</div>
            <div className="text-slate-200">€{price.eur} - {price.btc}BTC</div>
            <div className="text-slate-400 opacity-50 italic">By Coingecko</div>
          </div>
        </div>
        <div className="-mt-24 p-5">
          <div className="rounded-xl bg-white p-4 font-medium text-slate-500 shadow-sm">
            {/* @ts-ignore*/}
            <Line {...config} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mx-5">
          <div className="rounded-xl bg-white p-4 font-medium text-slate-500 shadow-sm">
            <CircularProgressbarWithChildren
              value={percentage}
              styles={{
                // Customize the root svg element
                root: {},
                // Customize the path, i.e. the "completed progress"
                path: {
                  // Path color
                  stroke: `rgb(36, 99, 235, ${percentage / 100})`,
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: 'butt',
                  // Customize transition animation
                  transition: 'stroke-dashoffset 0.5s ease 0s',
                  // Rotate the path
                  //transform: 'rotate(0.25turn)',
                  transformOrigin: 'center center',
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                  // Trail color
                  stroke: '#d6d6d6',
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: 'butt',
                  // Rotate the trail
                  transform: 'rotate(0.25turn)',
                  transformOrigin: 'center center',
                },
                // Customize the text
                text: {
                  // Text color
                  fill: 'black',
                  // Text size
                  fontSize: '16px',
                },
                // Customize background - only used when the `background` prop is true
                background: {
                  fill: '#3e98c7',
                },
              }}
            >
              <div style={{marginTop: -5 }}>
                <p className="md:text-8xl text-4xl text-center">{percentage}%</p>
              </div>
          </CircularProgressbarWithChildren>
          </div>
          <div className="rounded-xl bg-white p-4 font-medium text-slate-500 shadow-sm md:text-xl">
            <div>
              <h4 className="font-semibold text-slate-400 ">
                {/* @ts-ignore*/}
                {t("stats.epoch")}
              </h4>
              <p className="text-sm text-gray-600">{epoch}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-400">
                {/* @ts-ignore*/}
                {t("stats.block")}
              </h4>
              <p className="text-sm text-gray-600">{block}{' '}{blockHash ?
                <>
                  <span
                    onClick={() => writeToClipboard(blockHash).then(()=>{
                      Toast.info("Copy success")
                    })}
                    className="cursor-pointer opacity-60 italic">#hash
                  </span>
                  <span
                    onClick={() => openCapacitorSite(`${EXPLORER_CARDANO_SCAN}block/${block}`)}
                    className="cursor-pointer opacity-60 italic"> explorer
                  </span>
                </>
                : null}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-400">
                {/* @ts-ignore*/}
                {t("stats.slot")}
              </h4>
              <p className="text-sm text-gray-600">{slot}<span className="text-slate-400 opacity-60">/432000</span></p>
            </div>
          </div>
        </div>

        <section className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="font-medium text-slate-500">
              {/* @ts-ignore*/}
              {t("stats.stakingActivity")}
            </h4>
            <div className="rounded-md bg-pink-400/70 px-2 font-semibold text-gray-900">1</div>
          </div>
          <div className="space-y-2">
            <div className="flex space-x-4 rounded-xl bg-white p-3 shadow-sm justify-between">
              <div className="flex ">
                <img className="aspect-square w-16 h-16 rounded-lg bg-center object-cover" src={boostLogo} alt="" />
                <div className="ml-2">
                  <h4 className="font-semibold text-gray-600">[BOOST]
                    {/* @ts-ignore*/}
                    {t("stats.rewards")}
                    {/* @ts-ignore*/}
                    {t("stats.epoch").toLowerCase()}
                    334</h4>
                  <p className="text-sm text-slate-400">
                    {/* @ts-ignore*/}
                    {t("stats.congratsMessage")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );

  return (
      <RenderStats/>
  );
};

export default Network;

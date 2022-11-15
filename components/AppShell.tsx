import { IonApp, IonRouterOutlet, IonSplitPane  } from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';
import { HashRouter, Redirect, Route } from 'react-router-dom';
import Menu from './Menu';

import Tabs from './pages/Tabs';
import Web3 from './pages/Web3';

import React, { useEffect, useRef } from 'react';
import AppUrlListener from '../components/deeplink/DeepLink';
import AppWrapper from '@components/AppWrapper';

const AppShell = () => {
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

  return (
    <AppWrapper>
      <IonApp>
        <IonReactRouter>
          <AppUrlListener/>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/tabs" render={() => <Tabs />} />
              <Route path="/web3" render={() => <Web3 />} />
              <Route exact path="/" render={() => <Redirect to="/tabs" />} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </AppWrapper>
  );
};

export default AppShell;

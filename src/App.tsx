import "./utils/splide.min.jsx";
import "./utils/index.jsx";
import React, {useRef} from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import {IonApp, IonContent, IonPage} from '@ionic/react';
import AppWrapper from "./components/AppWrapper";
import Home from "./pages/Home";
import Menu from "./components/Menu";
import BottomMenu from "./components/BottomMenu";
import P2PChat from "./pages/Chat";
import Settings from "./pages/Settings";
import Network from "./pages/Network";
// @ts-ignore
import {getRouter} from "./store/selectors";
import Store from './store';
import Enable from "./popup/components/Enable";

export const ROUTES = {
    MAIN: '/',
    NETWORK: "network",
    P2P: "p2p",
    SETTINGS: "settings"
}

const MainRoutes = () => {

   const location = useLocation();

    const router = Store.useState(getRouter);

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
      }
      if (isMounted.current) {
         // call the function
         fetchData()
             // make sure to catch any error
             .catch(console.error)
      }
   }, [])

   useEffect(() => {

      // Show BottomNav
      // @ts-ignore
      //setTransitionName('');
      // if (transitionName === "next") setTransitionName("");
      //if (transitionName == "prev") setTransitionName("");
   }, [location]);

    const renderPage =  () => {
        switch (router.currentPath) {
            case ROUTES.MAIN:
                return <Home />
            case ROUTES.NETWORK:
                return <Network />
            case ROUTES.P2P:
                return <P2PChat />
            case ROUTES.SETTINGS:
                return <Settings />
            default:
                return <Home />
        }
    }

   return (
       <IonApp>
           <AppWrapper>

                       <div className="h-1/10">
                           <Menu />
                       </div>
                       <div className="h-8/10">
                           <IonPage>

                           {renderPage()}

                           </IonPage>
                       </div>
                       <div className="h-1/10">
                           <BottomMenu onClose={()=>{}} open={false}/>
                       </div>

           </AppWrapper>
       </IonApp>

   );
};


function App() {
   return (
      <Router>
         <MainRoutes />
      </Router>
   );
}

export default App;

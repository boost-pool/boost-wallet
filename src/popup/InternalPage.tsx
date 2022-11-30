import "../utils/splide.min.jsx";
import "../utils/index.jsx";
import React, {useRef} from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import {IonApp, IonContent, IonPage} from '@ionic/react';
import AppWrapper from "../components/AppWrapper";
// @ts-ignore
import {getRouter} from "../store/selectors";
import {Messaging} from "../api/background/messaging";
import Enable from "./components/Enable";

export const INTERNAL_ROUTES = {
    ENABLE: 'enable',
    SIGN_DATA: "signData",
    SIGN_TX: "signTx"
}

const MainRoutes = () => {

    const controller = Messaging.createInternalController();
    const [request, setRequest] = React.useState(null);

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

    const init = async () => {
        const req = await controller.requestData();
        setRequest(request);
        console.log("req");
        console.log(req);
    };


    useEffect(() => {
      const initPage = async () => {
          await init();
      }
      if (isMounted.current) {
         // call the function
         initPage()
             // make sure to catch any error
             .catch(console.error)
      }
   }, [])

   useEffect(() => {

   }, [location]);

    const renderPage =  () => {
        console.log("renderPage");
        console.log(request);
        // @ts-ignore
        /*
        switch (request?.method) {
            case INTERNAL_ROUTES.ENABLE:
                return <Home />
            case INTERNAL_ROUTES.SIGN_DATA:
                return <Network />
            case INTERNAL_ROUTES.SIGN_TX:
                return <P2PChat />
            default:
                return <Home />
        }
         */

        return <Enable />
    }

   return (
       <IonApp>
           <AppWrapper>

               <IonPage>

               {renderPage()}

               </IonPage>

           </AppWrapper>
       </IonApp>

   );
};


function InternalApp() {
   return (
      <Router>
         <MainRoutes />
      </Router>
   );
}

export default InternalApp;

import "./utils/splide.min.jsx";
import "./utils/index.jsx";
import React, {useRef} from "react";
import { useEffect } from "react";
import { BrowserRouter, Route, useLocation, Routes } from "react-router-dom";
import AppWrapper from "./components/AppWrapper";
import Home from "./pages/Home";
import Menu from "./components/Menu";
import BottomMenu from "./components/BottomMenu";
import P2PChat from "./pages/Chat";
import Settings from "./pages/Settings";
import Network from "./pages/Network";

const MainRoutes = () => {

   const location = useLocation();

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
      //ReactGA.send({ hitType: "pageview", page: "/terms-conditions" });
   }, [])

   useEffect(() => {

      // Show BottomNav
      // @ts-ignore
      //setTransitionName('');
      // if (transitionName === "next") setTransitionName("");
      //if (transitionName == "prev") setTransitionName("");
   }, [location]);

   return (
         <AppWrapper>
            <div className="h-1/10">
               <Menu />
            </div>
            <div className="h-8/10">
               <Routes location={location}>
                  {/* @ts-ignore */}
                  <Route exact path="/" element={<Home />} />
                  {/* @ts-ignore */}
                  <Route path="/network" element={<Network />} />
                  {/* @ts-ignore */}
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/p2p" element={<P2PChat />} />
               </Routes>
            </div>
            <div className="h-1/10">
               <BottomMenu onClose={()=>{}} open={false}/>
            </div>
         </AppWrapper>
   );
};


function App() {
   return (
      <BrowserRouter>
         <MainRoutes />
      </BrowserRouter>
   );
}

export default App;

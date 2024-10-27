import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header, Alerts, IsOffline, ErrBoundary } from "./components";
import {
  HomePage,

  LoginNotFound,
} from "./pages";

import { Tooltip } from "react-tooltip";
import Me from "./pages/auth/Me";
import ImportantUserAlert from "./pages/auth/ImportantUserAlert";
import Footer from "./pages/Footer";

function App() {
  const theme = useSelector((state) => state.local.theme);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // if(theme === 'system') {
    //   const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    //   document?.body?.setAttribute('data-theme', systemTheme);
    // } else if (theme === 'dark') {
    //   document?.body?.setAttribute('data-theme', 'dark');
    // } else {
    //   document?.body?.setAttribute('data-theme', 'light');
    // }
}, [theme]);


  return (
    <Router>
      <Alerts />
      <Me/>
        <div className="flex flex-col" data-theme="light">
        {/* <div className="flex flex-col h-min-100-pct" data-theme={theme === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : theme}> */}
        <Tooltip id="tooltip-default" className="z-999 w-max-200-px d-sm-none" place="bottom" closeOnEsc closeOnScroll globalCloseEvents="click" positionStrategy="fixed" opacity="0.95" noArrow />
        <ErrBoundary>
          <ImportantUserAlert/>
        </ErrBoundary>
        <ErrBoundary>
          <Header/>
        </ErrBoundary>
        <IsOffline />
          <div className="flex-grow-1 h-min-100">
              <Routes>
                <Route path="/" element={<ErrBoundary><HomePage /></ErrBoundary>} />
                <Route path="*" element={<LoginNotFound />} />
              </Routes>
            </div>
          <Footer/>
          </div>
        <Tooltip id="tooltip-click" className="z-999 w-max-200-px" place="bottom" closeOnEsc openOnClick closeOnScroll positionStrategy="fixed" opacity="0.95" noArrow />
    </Router>
  );
}

export default App;
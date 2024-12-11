import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header, Alerts, IsOffline, ErrBoundary } from "./components";
import { Tooltip } from "react-tooltip";
import Auth from "./pages/auth/Auth";
import Login from "./pages/auth/Login";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ImportantUserAlert from "./pages/auth/ImportantUserAlert";
import Footer from "./pages/Footer";
import HomePage from "./pages/HomePage";
import Settings from "./pages/Settings";
import NavbarMobile from "./components/navigation/NavbarMobile";
import LibraryPage from "./pages/LibraryPage";
import Navbar from "./components/navigation/Navbar";
import SearchPage from "./pages/SearchPage";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import AddGame from "./pages/game/AddGame";
import UserPage from "./pages/UserPage";
import GamePage from "./pages/game/GamePage";
import CategoryPage from "./pages/game/CategoryPage";
import LogPlay from "./pages/game/LogPlay";
import { useEffect } from "react";
import PlaysPage from "./pages/PlaysPage";
import CommunityPage from "./pages/CommunityPage";
import GameSearchModal from "./pages/game/GameSearchModal";
import UserGuard from "./pages/auth/UserGuard";
import NotificationPage from "./pages/NotificationPage";
import UserHomePage from "./pages/UserHomePage";
import PublisherPage from "./pages/PublisherPage";
import PersonPage from "./pages/PersonPage";
import FooterUser from "./pages/FooterUser";
import GameCard from "./pages/game/GameCard";

function App() {
  const { user } = useSelector(state => state.auth);

  const { theme } = useSelector(state => state.local);

  useEffect(() => {
    if(theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document?.body?.setAttribute('data-theme', systemTheme);
    } else if (theme === 'dark') {
      document?.body?.setAttribute('data-theme', 'dark');
    } else {
      document?.body?.setAttribute('data-theme', 'light');
    }
}, [theme]);

  return (
    <Router>
      <Alerts />
        <div className="flex flex-col" data-theme={theme === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : theme}>
        {/* <div className="flex flex-col h-min-100-pct" data-theme={theme === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : theme}> */}
        <Tooltip id="tooltip-default" className="z-999 w-max-200-px d-sm-none" place="bottom" closeOnEsc closeOnScroll globalCloseEvents="click" positionStrategy="fixed" opacity="0.95" noArrow />
        <ErrBoundary>
          <ImportantUserAlert/>
        </ErrBoundary>
        {window.innerWidth <= 800 && user ?
          <ErrBoundary>
            <NavbarMobile/>
          </ErrBoundary>
        : null}
        <IsOffline />
        {user ?
          <UserGuard>
          <div className="content-wrapper">
              <div className="content">
                <ErrBoundary>
                  <Navbar/>
                  <AddGame/>
                  <LogPlay/>
                  <GameCard/>
                  <GameSearchModal/>
                </ErrBoundary>
                <div className="content-body">
                  <div className="flex-grow-1 h-min-100 flex flex-col">
                      <Routes>
                        <Route path="/" element={<ErrBoundary><UserHomePage /></ErrBoundary>} />
                        <Route path="/discover" element={<ErrBoundary><SearchPage /></ErrBoundary>} />
                        <Route path="/u/:username" element={<ErrBoundary><UserPage /></ErrBoundary>} />
                        <Route path="/u/:username/:tab" element={<ErrBoundary><UserPage /></ErrBoundary>} />
                        <Route path="/g/:gameId" element={<ErrBoundary><GamePage /></ErrBoundary>} />
                        <Route path="/g/:gameId/:tab" element={<ErrBoundary><GamePage /></ErrBoundary>} />
                        <Route path="/publisher/:publisherId" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PublisherPage /></div></ErrBoundary>} />
                        <Route path="/publisher/:publisherId/:tab" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PublisherPage /></div></ErrBoundary>} />
                        <Route path="/person/:personId" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PersonPage /></div></ErrBoundary>} />
                        <Route path="/person/:personId/:tab" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PersonPage /></div></ErrBoundary>} />
                        <Route path="/c/:category" element={<ErrBoundary><CategoryPage /></ErrBoundary>} />
                        <Route path="/collection/:collection" element={<ErrBoundary><CategoryPage /></ErrBoundary>} />
                        <Route path="/settings" element={<ErrBoundary><Settings/></ErrBoundary>} />
                        <Route path="/settings/:tab" element={<ErrBoundary><Settings/></ErrBoundary>} />
                        <Route path="/library" element={<ErrBoundary><LibraryPage /></ErrBoundary>} />
                        <Route path="/plays" element={<ErrBoundary><PlaysPage /></ErrBoundary>} />
                        <Route path="/notifications" element={<ErrBoundary><NotificationPage /></ErrBoundary>} />
                        <Route path="/community" element={<ErrBoundary><CommunityPage /></ErrBoundary>} />
                        <Route path="/terms" element={<ErrBoundary><Terms /></ErrBoundary>} />
                        <Route path="/privacy" element={<ErrBoundary><Privacy /></ErrBoundary>} />
                        <Route path="/*" element={<ErrBoundary><NotFound /></ErrBoundary>} />
                      </Routes>
                      </div>
                      <FooterUser/>
                    </div>
                  </div>
              </div>
          </UserGuard>
        : 
          <div>
            <ErrBoundary>
              <Header/>
            </ErrBoundary>
                <div className="flex-grow-1 h-min-100 flex flex-col">
                    <Routes>
                      <Route path="/" element={<ErrBoundary><HomePage /></ErrBoundary>} />
                      <Route path="/discover" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><SearchPage /></div></ErrBoundary>} />
                      <Route path="/u/:username" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><UserPage /></div></ErrBoundary>} />
                        <Route path="/u/:username/:tab" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><UserPage /></div></ErrBoundary>} />
                      <Route path="/g/:gameId" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><GamePage /></div></ErrBoundary>} />
                      <Route path="/g/:gameId/:tab" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><GamePage /></div></ErrBoundary>} />
                      <Route path="/publisher/:publisherId" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PublisherPage /></div></ErrBoundary>} />
                      <Route path="/publisher/:publisherId/:tab" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PublisherPage /></div></ErrBoundary>} />
                      <Route path="/person/:personId" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PersonPage /></div></ErrBoundary>} />
                      <Route path="/person/:personId/:tab" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><PersonPage /></div></ErrBoundary>} />
                      <Route path="/c/:category" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><CategoryPage /></div></ErrBoundary>} />
                      <Route path="/collection/:collection" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><CategoryPage /></div></ErrBoundary>} />
                      <Route path="/forgot-password" element={<ErrBoundary><div><Auth><ForgotPassword /></Auth></div></ErrBoundary>} />
                      <Route path="/reset-password" element={<ErrBoundary><div><Auth><ResetPassword /></Auth></div></ErrBoundary>} />
                      <Route path="/register" element={<ErrBoundary><div><Auth><Register /></Auth></div></ErrBoundary>} />
                      <Route path="/login" element={<ErrBoundary><div><Auth><Login /></Auth></div></ErrBoundary>} />
                      <Route path="/terms" element={<ErrBoundary><div className="mx-auto w-max-xl w-100"><Terms /></div></ErrBoundary>} />
                      <Route path="/privacy" element={<ErrBoundary><div className="mx-auto w-max-xl w-100"><Privacy /></div></ErrBoundary>} />
                      <Route path="/*" element={<ErrBoundary><div className="mx-auto w-max-xl offset-header w-100"><NotFound /></div></ErrBoundary>} />
                    </Routes>
                    </div>
                    <Footer/>
                </div>
              }
          </div>
        <Tooltip id="tooltip-click" className="z-999 w-max-200-px" place="bottom" closeOnEsc openOnClick closeOnScroll positionStrategy="fixed" opacity="0.95" noArrow />
    </Router>
  );
}

export default App;
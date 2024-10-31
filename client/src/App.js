import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//COMPONENTS
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AboutUs from "./components/AboutUs";
import Profile from "./components/Profile";
import GettingStarted from "./components/GettingStarted";
import Session from "./components/Session";
import NotFound from "./components/NotFound";
//CONTEXTS
import HeaderContext from "./context/HeaderContext";
import ErrorDivContext from "./context/ErrorDivContext";
import LevelUpContext from "./context/LevelUpContext";



function App() {

  const [headerUpdate, setHeaderUpdate] = useState(true);
  const [error, setError] = useState(false)
  const [levelUp, setLevelUp] = useState(null);


  return (
    <LevelUpContext.Provider value={{ levelUp, setLevelUp }}>
      <ErrorDivContext.Provider value={{ error, setError }}>
        <HeaderContext.Provider value={{ headerUpdate, setHeaderUpdate }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/getting-started" element={<GettingStarted />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/session" element={<Session />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HeaderContext.Provider>
      </ErrorDivContext.Provider>
    </LevelUpContext.Provider>

  );
}

export default App;

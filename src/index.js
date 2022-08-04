import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Main from './components/Main';
import Game from './components/Game';
import Join from './components/Join';
import Metamask from './components/Metamask';
import Lobby from './components/Lobby';
import MetamaskMobile from './components/MetamaskMobile'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/main' element={<Main />} />
        <Route path='/game' element={<Game />} />
        <Route path='/join/:roomID' element={<Join />} />
        <Route path='/lobby' element={<Lobby />} />
        <Route path='/metamask' element={<Metamask />} />
        <Route path='/metamask-mb' element={<MetamaskMobile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



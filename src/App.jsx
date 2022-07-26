import './App.css';
import {useState, useEffect} from 'react';
import { Navigate } from "react-router-dom";
// import {chessFigure, hand, repeat, wallet} from './assets/images'
import {isMobile} from 'react-device-detect';
import { FiveGRounded } from '@mui/icons-material';
// import {WalletConnectProvider} from "@walletconnect/web3-provider";
// import { providers } from "ethers";


function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  // const mobileConnect = async() => {
  //     const provider = new WalletConnectProvider({
  //       infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
  //     });

  // //  Enable session (triggers QR Code modal)
  //   await provider.enable();
  //   const web3Provider = new providers.Web3Provider(provider);

    
  // }
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if(accounts.length !== 0){
      console.log("Authorized account: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    }else{
      console.log("No accounts!")
    }
  }
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
    if(currentAccount){
     return <Navigate to="/main" replace={true} />;
    }
  }

  const check = () => {
    if(!currentAccount){
      return(
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>ChessBet</h1>
            <a>How to Play?</a>
          </div>
          <div className="main">
            <div className="left-side">
              <div className="big-text">
                <div className='text-container'>
                  <div className="text"><img className='wallet-icon' src='assets/images/wallet.png' alt='wallet' /> <span className="wallet-icon-text">BetEther</span></div>
                  <div className="text"><img src='assets/images/chess-figure.png' alt='chess-figure' /><span className="chess-figure-icon-text">PlayChess</span></div>
                  <div className="text"><img className='hand' src='assets/images/hand-ether.png' alt='hand-ether' /><span className="hand-icon-text">EarnCrypto</span></div>
                  <div className="text"><img src='assets/images/repeat.png' alt='repeat' /><span className="repeat-icon-text">Repeat</span></div>
                </div>
              </div>
              <div className="description">
                <p>Bet Ether, Play on <b>Chess.com with opponent</b> and Earn <br /> crypto on the decentralized betting platform</p>
              </div>
              <button className='app-button'>Play Now</button>
            </div>
            <div className="right-side">
              <img src="assets/chessBoard.gif" alt='Chess animated' />
            </div>
          </div>
          
        </div>
        {/* <div className='app-container'>
          <div className='app-label'>
            <img src='https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpZC7lK9.png' alt="chess" />
            <div className='label-text'>
              <label>Chess.com</label>
            </div>
            <button onClick={connectWallet}>Connect</button>
          </div>
        </div> */}
      </div>
      )
    }else{
      return <Navigate to="/main" replace={true} />
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    
  }, [])

  return (
    check()
  );
}

export default App;

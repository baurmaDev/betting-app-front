import './App.css';
import {useState, useEffect} from 'react';
import { Navigate, useNavigate } from "react-router-dom";
// import {chessFigure, hand, repeat, wallet} from './assets/images'
import {isMobile} from 'react-device-detect';
import { FiveGRounded } from '@mui/icons-material';
// import {WalletConnectProvider} from "@walletconnect/web3-provider";
// import { providers } from "ethers";


function App() {
  let navigate  = useNavigate();
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
        isMobile ? navigate("/metamask-mb", {replace:true}) :
        navigate("/metamask", {replace: true})
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
  const mobile = () => {
    if(!currentAccount){
      return(
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>ChessBet</h1>
          </div>
          <div className="main">
            <div className="left-side">
              <div className="big-text">
                <div className='text-container'>
                  <div className="text"><img className='wallet-icon' src='assets/images/wallet.png' alt='wallet' /> <span className="wallet-icon-text">Bet </span></div>
                  <div className="text"><img src='assets/images/chess-figure.png' alt='chess-figure' /><span className="chess-figure-icon-text">Play</span></div>
                  <div className="text"><img className='hand' src='assets/images/hand-ether.png' alt='hand-ether' /><span className="hand-icon-text">Earn</span></div>
                  <div className="text"><img src='assets/images/repeat.png' alt='repeat' /><span className="repeat-icon-text">Repeat</span></div>
                </div>
              </div>
              <div className="description">
                <p>Bet Ether, Play on <b>Chess.com with opponent</b><br /> and Earn  crypto on the decentralized betting platform</p>
              </div>
              <button className='app-button' onClick={connectWallet}>Play Now</button>
            </div>
            
          </div>
          
        </div>
        
      </div>
      )
    }else{
      return <Navigate to="/main" replace={true} />
    }
  }
  const desktopVersion = () => {
    if(!currentAccount){
      return(
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>ChessBet</h1>
          </div>
          <div className="main">
            <div className="left-side">
              <div className="big-text">
                <div className='text-container'>
                  <div className="text"><img className='wallet-icon' src='assets/images/wallet.png' alt='wallet' /> <span className="wallet-icon-text">Bet <span style={{color: '#D9785E'}}>Ether</span></span></div>
                  <div className="text"><img src='assets/images/chess-figure.png' alt='chess-figure' /><span className="chess-figure-icon-text">Play <span style={{color: '#F9B35B'}}>Chess</span></span></div>
                  <div className="text"><img className='hand' src='assets/images/hand-ether.png' alt='hand-ether' /><span className="hand-icon-text">Earn <span style={{color: '#F9F871'}}>Crypto</span></span></div>
                  <div className="text"><img src='assets/images/repeat.png' alt='repeat' /><span className="repeat-icon-text">Repeat</span></div>
                </div>
              </div>
              <div className="description">
                <p>Bet Ether, Play on <b>Chess.com with opponent</b> and Earn <br /> crypto on the decentralized betting platform</p>
              </div>
              <button className='app-button' onClick={connectWallet}>Play Now</button>
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
    <>{isMobile ? mobile() : desktopVersion()}</>
    
  );
}

export default App;

import axios from 'axios';
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react'
import './Join.css'
import abi from '../utils/Bet.json';
import { useNavigate, useParams } from "react-router-dom";
import Load from './Load';
import { BASE_URL } from './api';
import { localhost } from './localhost';
import Notification from './Notification'



function Join() {
  const [secondNickname, setSecondNickname] = useState('');
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [errorNick, setErrorNick] = useState('');
  const [roomId, setRoomId] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const contractAddress = '0x38Ec1CD975f53a65BC5f50Dd13736D91d1F510bD';
  const contractABI = abi.abi;
  
  let navigate = useNavigate();
  const { roomID } = useParams();
  console.log('Room ID: ', roomID);

  const checkIfWalletIsConnected = async () => {
    try{
      const { ethereum } = window;
      if (!ethereum) {
        alert("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      console.log("Before")
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("After", accounts)
      if(accounts.length !== 0){
        console.log("Authorized account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
      }else{
        console.log("No account")
        connectWallet();
      }
    }catch(e){
      console.log(e);
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
    
  }
  const sendBet = async (amount) => {

        try{
            const {ethereum} = window;
            console.log(contractAddress);
            console.log(abi.abi);
            if(ethereum){
                console.log("Process started!")
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const betContract = new ethers.Contract(contractAddress, contractABI, signer);
                const secondSigner = await signer.getAddress();

                const messageTxn = await betContract.setBet('Bet', {
                  value: ethers.utils.parseUnits(amount, "ether"),
                  gasLimit: ethers.utils.hexlify(200000)
                });
                setLoading(true);
                await messageTxn.wait();
                console.log("Betted!", secondSigner); 
                axios.post(`${BASE_URL}/api/lobby/${roomID}`, {
                    secondSigner,
                    secondNickname
                }).then(response => {
                    console.log(response);
                }).catch(err => {
                    console.log(err)
                })
                navigate("/lobby", {
                  replace: true,
                  state: {
                    id: roomID,
                    name: secondNickname
                  }
                })
                
            } 
        }catch(error){
            console.log(error);
        }
  }
  
  const onSubmit = (e) => {
    console.log("SUBMITTED!")
    e.preventDefault();
    try{
        axios.get(`https://api.chess.com/pub/player/${secondNickname}`).then((response) => {
          sendBet(amount);
          // axios.get(`${BASE_URL}/api/join/${roomID}`).then(response => {
          //   sendBet(response.data.amount); 
          // }).catch(error => {
          //     console.log("Response Error ",error);
          // })
        }

        ).catch((error) => {
          console.log(error);
          setErrorNick("The nickname is doesn't exist");
        })
    }catch(err){
        console.log("Request error ",err)
    }
  }
  useEffect(() => {
    axios.get(`${BASE_URL}/api/join/${roomID}`).then(response => {
      setAmount(response.data.amount); 
    })
    setTimeout(() => {
      console.log("Started")
      checkIfWalletIsConnected();
    }, 1000);
    
  }, [])
  const input = () => (
    <>
      <div className='app-container'>
        <label style={{
            fontFamily: 'Open-Sans-Bold',
            fontSize: '24px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>Join the bid</label>
          <div className='form1'>
              
                  <input placeholder='Enter your chess.com nickname' onChange={(e) => setSecondNickname(e.target.value)} />
                  
                  <label style={{
            fontFamily: 'Open-Sans-Bold',
            fontSize: '16px',
            padding: '10px'
          }}>Bet amount: {amount} MATIC</label>
                  {/* <p style={{color:'red'}}>{errorNick}</p> */}
              
          </div>
          {loading ? <Load /> : <span className='btn' onClick={onSubmit}><span>Join</span></span>}
          
      </div>
      <img className='chess-3d-back' src='/assets/images/chess-3d-back.png' alt='chess back' />
      <img className='chess-3d' src='/assets/images/chess-3d.png' alt='chess figure'/>
      {errorNick && <Notification message={errorNick} icon={false} />}
    </>
    
  )

  return (
    <>
    
    {currentAccount ? input() : <Load />}
    </>
  )
}

export default Join
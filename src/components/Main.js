import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { ethers } from "ethers";
import './Main.css';
import abi from '../utils/Bet.json';
// import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Load from './Load';
import { BASE_URL } from './api';
import { localhost } from './localhost';


function Main() {
  const [nickname, setNickname] = useState('');
  const [secondNickname, setSecondNickname] = useState('');
  const [link, setLink] = useState('')
  const [amount, setAmount] = useState(0);
  const [id, setId] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const contractAddress = '0x5CBc5735309FB70767f3820d9E561F1b74133473'
  const contractABI = abi.abi;
  let navigate = useNavigate();


  
  const sendBet = async () => {
    console.log(amount);
  
    try{
        const {ethereum} = window;

        if(ethereum){
          console.log("Process started!")
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const betContract = new ethers.Contract(contractAddress, contractABI, signer);
          const signerAddress = await signer.getAddress();
          console.log(signerAddress)
          const messageTxn = await betContract.setBet('Bet', {
            value: ethers.utils.parseUnits(amount, "ether")
          });
          setLoading(true);
          await messageTxn.wait();
          console.log("Betted!");
          axios
            .post(`${localhost}/api/create-game`, {
              signerAddress,
              nickname,
              secondNickname,
              // link,
              amount
            })  
            .then((response) => {
              console.log(response.data);
              navigate("/game", { replace: true, state: {id: response.data.id, name: nickname} });
            }).catch(error => {
              console.log(error)
            });
        } 
      }catch(error){
        console.log(error);
      }
  }
  
  const onSubmit = (e) => {
    e.preventDefault();
    axios.get(`https://api.chess.com/pub/player/${nickname}`).then(
      sendBet
    )
    .catch((error) => {
      setErrorMessage("This username doesn't exist");
    })
    
  }
  const loadAnimation = () => (
    <div className='load-container'>
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
    
  )
  
  return (
    <div className='app-container' style={{height: `${errorMessage ? '300px' : '400px'}`}}>
      <form className='main-form' onSubmit={onSubmit}>
        <label >Enter your Chess.com nickname</label>
        <input placeholder=''  type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        {errorMessage ? <p style={{color: 'red', fontSize: '14px', marginTop: '-12px'}}>{errorMessage}</p> : null}
        <label >Enter Chess.com nickname of your opponent</label>
        <input placeholder=''  type="text" value={secondNickname} onChange={(e) => setSecondNickname(e.target.value)} />
        {/* <label >Enter Chess.com game link</label>
        <input placeholder='Link here'  type="text"  onChange={(e) => setLink(e.target.value)} /> */}
        <label>Enter Amount of Bet</label>
        <input 
         placeholder='0.000 Ether' name='currency-field' value={amount}
         type='number' step='0.001' min='0.001' onChange={(e) => setAmount(e.target.value)}
         />
      </form>
      <span className='start-btn' style={{marginTop: `${errorMessage ? '100px' : '260px'}`}} onClick={onSubmit}>START</span>
      { loading && <Load />}
      
    </div>
  )
}

export default Main
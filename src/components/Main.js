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
import Notification from './Notification'

function Main() {
  const [nickname, setNickname] = useState('');
  const [potential, setPotential] = useState(0);
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const contractAddress = '0x583BfFcff11067F1E3783153a6009290E384b828'
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
            value: ethers.utils.parseUnits(amount, "ether"),
            gasLimit: ethers.utils.hexlify(80000)
          });
          setLoading(true);
          await messageTxn.wait();
          console.log("Betted!");
          axios
            .post(`${BASE_URL}/api/create-game`, {
              signerAddress,
              nickname,
              // secondNickname,
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
  useEffect(() => {setTimeout(() => setErrorMessage(''), 10000)}, [errorMessage])
  
  const onSubmit = (e) => {
    console.log('Submitted!')
    e.preventDefault();
    if(amount < 1) setErrorMessage('Amount of stake shoud be equal or higher then 1')
    else{
      console.log('request');
      axios.get(`https://api.chess.com/pub/player/${nickname}`).then(
        sendBet
      )
      .catch((error) => {
        setErrorMessage("This username doesn't exist");
      })
    }
    console.log(errorMessage)
    
  }
  const handleChange = (e) => {
    setAmount(e.target.value);
    setPotential((e.target.value * 2) - (e.target.value * 2) * 0.1);
  }
  
  return (
    <>
      <div className='app-container'>
        <label style={{
          fontFamily: 'Open-Sans-Bold',
          fontSize: '36px',
          marginBottom: '20px'
        }}>Place a bet</label>
        <form className='form1' onSubmit={onSubmit}>
          <input placeholder='Enter your Chess.com nickname'  type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          
          <input 
          placeholder='Enter amount of stake' name='currency-field' value={amount}
          type='number' step='1' min='1' onChange={(e) => handleChange(e)}
          />
          {potential !== 0 &&
            <div className='potential'>
              Potential winnings: {potential} MATIC
            </div>
          }
          
        </form>
        {loading ? <Load /> : <div className='btn' onClick={onSubmit}><span>BET</span></div>}
        
      </div>
      <img className='chess-3d-back' src='assets/images/chess-3d-back.png' alt='chess back' />
      <img className='chess-3d' src='assets/images/chess-3d.png' alt='chess figure'/>
      {errorMessage && <Notification message={errorMessage} icon={false} />}
      
    </>
  )
}

export default Main
import axios from 'axios';
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react'
import './Join.css'
import abi from '../utils/Bet.json';
import { useNavigate, useParams } from "react-router-dom";



function Join() {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const contractAddress = '0x5CBc5735309FB70767f3820d9E561F1b74133473'
  const contractABI = abi.abi;
  let navigate = useNavigate();
  const { roomID } = useParams();
  console.log('Room ID: ', roomID);

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
      connectWallet();
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
            console.log(amount);
            if(ethereum){
                console.log("Process started!")
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const betContract = new ethers.Contract(contractAddress, contractABI, signer);
                const secondSigner = await signer.getAddress();
                const messageTxn = await betContract.setBet('Bet', {
                    value: ethers.utils.parseUnits(amount.toString(), "ether")
                });
                await messageTxn.wait();
                console.log("Betted!", secondSigner); 
                axios.post(`http://localhost:8080/lobby/${roomID}`, {
                    secondSigner
                }).then(response => {
                    console.log(response);
                }).catch(err => {
                    console.log(err)
                })
                navigate("/lobby", {
                  replace: true,
                  state: {
                    id: roomID
                  }
                })
                
            } 
        }catch(error){
            console.log(error);
        }
  }
  
  const onSubmit = (e) => {
    e.preventDefault();
    try{
        axios.get(`http://localhost:8080/join/${roomID}`).then(response => {
            if(nickname === response.data.secondNickname){
                sendBet(response.data.amount);
                
            }
            console.log(response.data);
        }).catch(error => {
            console.log("Response Error ",error);
        })
    }catch(err){
        console.log("Request error ",err)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className='app-container'>
        <div className='input-container'>
            <div className='join-input'>
                <input placeholder='Enter your chess.com nickname' onChange={(e) => setNickname(e.target.value)} />
                {/* <input placeholder='Enter room ID' onChange={(e) => setRoomId(e.target.value)} /> */}
            </div>
        </div>

        <span className='start-btn' style={{marginTop: '0px'}} onClick={onSubmit}>START</span>
    </div>
  )
}

export default Join
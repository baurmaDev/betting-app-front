import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import Load from './Load';
import Modal from './Modal';
import { BASE_URL } from './api';
import { localhost } from './localhost';
import {isMobile} from 'react-device-detect';

const ENDPOINT = 'localhost:5000';

const Lobby = () => {
 
  const [matchLink, setMatchLink] = useState('');
  const [winnerName, setWinnerName] = useState('');
  const [loading,setLoading] = useState(false);
  const [errorLink, setErrorLink] = useState('');
  const [user, setUser] = useState({});
  const [noWinner, setNoWinner] = useState(false);

  const {state} = useLocation();
  const {id, name} = state;
  
  // const socket = io('http://localhost:5000/',{
  //   cors: {
  //       origin: "http://localhost:5000",
  //       credentials: true
  //   }
  // , transports: ['websocket']});

  const socket = io('https://chessbet.onrender.com',{
    cors: {
        origin: "https://chessbet.onrender.com",
        credentials: true
    }
  , transports: ['websocket']});
  
  useEffect(() => {
    console.log("before socket emit")
    const room = id;
    socket.emit('join',{name, room}, (error) => {
        if(error) {
            alert(error);
        }else{
          console.log("Everything is ok!")
        }
    })
    socket.on("roomData", ({ users }) => {
            console.log(users);
        });
    
    return () => {
        // socket.emit('disconnect');
        socket.off();
    }
         
  },[ENDPOINT]);
  
  const onCheck = () => {
    const {roomId, firstNick, secondNick, firstAddress, secondAddress, betAmount} = user;

    axios.get(`${BASE_URL}/api/join/${roomId}`).then(response => {
        if(response.data.secondSigner){
          axios.get(`https://api.chess.com/pub/player/${firstNick}/games/archives`).then(response => {
            axios.get(`${response.data.archives[response.data.archives.length - 1]}`).then(response => {
              console.log(response.data.games[response.data.games.length - 1].url);
              const game = response.data.games[response.data.games.length - 1].url === matchLink ? response.data.games[response.data.games.length - 1] : false;
              if(!game){
                setErrorLink('The game is not over yet or the wrong link has been entered');
              }
              else{
                setErrorLink('')
              }
              if((game.black.username === firstNick || game.white.username === firstNick) && (game.black.username === secondNick || game.white.username === secondNick)){
          if(game.white.result === 'win'){
            if(game.white.username === secondNick){
              const winner = secondAddress;
              const amount = betAmount * 2;
              setLoading(true);
              axios.post(`${BASE_URL}/api/withdraw/${roomId}`, {
                winner,
                amount
              }).then(response => {
                setLoading(false);
                setWinnerName(secondNick);
                console.log(response.data);
                setErrorLink(response.data);
              }).catch(err => {
                console.log(err);
              })
            }else{
              setWinnerName(firstNick);
            }
          }else if(game.black.result === 'win'){
            console.log("Winner: ", game.black.username);
            if(game.black.username === secondNick){
              const winner = secondAddress;
              const amount = betAmount * 2;
              setLoading(true);
              axios.post(`${BASE_URL}/api/withdraw/${roomId}`, {
                winner,
                amount
              }).then(response => {
                setLoading(false);
                setWinnerName(secondNick);
                console.log(response.data);
                setErrorLink(response.data);
              }).catch(err => {
                console.log(err);
              })
            }else{
              setWinnerName(firstNick);
            }
          }else{
                  console.log("Draw detected!")
                  const draw = true;
                  const amount = betAmount;
                  
                  setLoading(true);
                  axios.post(`${BASE_URL}/api/withdraw/${roomId}`, {
                      firstAddress,
                      secondAddress,
                      draw,
                      amount
                    }).then(response => {
                      setLoading(false);
                      setErrorLink(response.data);
                      setNoWinner(true);
                      console.log(response.data);
                    }).catch(err => {
                      console.log(err);
                    })
                }
        }else{
          setErrorLink("Not your match!!!");
        }
            })
          })

        }    
              
    }).catch(err => {
      console.log("Error request BASE_URL/api/join/roomID",err);
    });
    
  }


  useEffect(() =>  {
    setTimeout(() => {
       axios.get(`${BASE_URL}/api/join/${id}`).then(response => {
      const {_id, signerAddress, nickname, secondNickname,  amount, secondSigner} = response.data;
      setUser({
          firstAddress: signerAddress,
          secondAddress: secondSigner,
          roomId: _id,
          firstNick: nickname,
          secondNick: secondNickname,
          betAmount: amount
        })
      console.log("First signer address from get: ", signerAddress);
      console.log("Second signer address from get: ", secondSigner);
      
    }).catch(err => {
      console.log(err);
    })
    }, 3000);
   
  }, [])
  const app = () => (
    <>
      <div className='app-container'>
        <label style={{
            fontFamily: 'Open-Sans-Bold',
            fontSize: '24px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>Enter the link when the <br /> match is over</label>
        <div className="form1">
          <input placeholder='Enter game link' onChange={(e) => setMatchLink(e.target.value)} />
          {errorLink ? <p style={{fontSize: '12px', color: 'red', fontFamily:'Open-Sans-Mixed'}}>{errorLink}</p> : ''}
          {loading ? <Load /> : <span className='btn' onClick={onCheck} ><span>Get a winnings</span></span>}
        </div>
          
      </div>
      {!isMobile && 
            <>
              <img className='chessBoard-back' src='assets/images/chess-board.png.png' alt='chess-board' />
            <img className='wallet-3d' src='assets/images/wallet-3d.png' alt='wallet-3d' />
            </>}
    </>
    
    
  )
  const noDraw = () => (
    <>
       {winnerName ? <Modal nick={winnerName} winner={winnerName === user.secondNick ? true : false} betAmount={(user.betAmount * 2) - ((user.betAmount * 2) * 0.1)} draw={noWinner} />  : app()}

    </>
  )

  return (
    <>
    
      {noWinner ? <Modal draw={true} /> : noDraw()}
    </>
  )
}

export default Lobby
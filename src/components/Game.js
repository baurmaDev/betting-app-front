import React, { useEffect, useState, useRef } from 'react'
import './Game.css'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import io from 'socket.io-client';
import Load from './Load';
import Modal from './Modal';
import { localhost } from './localhost';
import { BASE_URL } from './api';

const ENDPOINT = 'chess-socket.onrender.com';


const Game = () => {
  const [loading, setLoading] = useState('');
  const [matchLink, setMatchLink] = useState('');
  const [winnerName, setWinnerName] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [errorLink, setErrorLink] = useState('');
  const [input, setInput] = useState('');
  const [user, setUser] = useState({});
  const [url, setUrl] = useState('');
  const {state} = useLocation();
  const {id, name} = state;
  const linkRef = useRef(null);
 
  const socket = io('https://chessbet.onrender.com',{
    cors: {
        origin: "https://chessbet.onrender.com",
        credentials: true
    }
  , transports: ['websocket']});
  // const socket = io('http://localhost:5000/',{
  //   cors: {
  //       origin: "http://localhost:5000",
  //       credentials: true
  //   }
  // , transports: ['websocket']});
  
  useEffect(() => {
    console.log("before socket emit")
    socket.emit('join',{name, id}, (error) => {
        if(error) {
            alert(error);
        }else{
          console.log("Everything is ok!")
        }
    })
    socket.on("roomData", ({ users }) => {
            if(users[users.length - 1].name !== name){
              alert(`${users[users.length - 1].name} has joined!`)
            }
            console.log("Hi!", users[users.length - 1].name);
        });
    
    return () => {
        // socket.emit('disconnect');
        socket.off();
    }
         
  },[ENDPOINT]);

  
  const onCheck = () => {
    console.log("Submitted!")
    const {roomId, firstNick, secondNick, firstAddress, secondAddress, betAmount, url} = user;
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
              console.log("game", game);
              if((game.black.username === firstNick || game.white.username === firstNick) && (game.black.username === secondNick || game.white.username === secondNick)){
                if(game.white.result === 'win'){
                  console.log(game.white.username);
                  if(game.white.username === firstNick){
                    setWinnerName(firstNick);
                    const winner = firstAddress;
                    console.log(winner);
                    const amount = betAmount * 2;
                    axios.post(`${BASE_URL}/api/withdraw/${roomId}`, {
                      winner,
                      amount
                    }).then(response => {
                      setLoading(false);
                      console.log(response.data);
                      setErrorLink(response.data);
                    }).catch(err => {
                      console.log(err);
                    })
                  }else{
                    setWinnerName(secondNick);
                  }
                }else if(game.black.result === 'win'){
                  console.log("Winner: ", game.black.username);
                  if(game.black.username === firstNick){
                    const winner = firstAddress;
                    setWinnerName(firstNick);
                    console.log(winner);
                    const amount = betAmount * 2;
                    axios.post(`${BASE_URL}/api/withdraw/${roomId}`, {
                      winner,
                      amount
                    }).then(response => {
                      setLoading(false);
                      setErrorLink(response.data);
                      console.log(response.data);
                    }).catch(err => {
                      console.log(err);
                    })
                  }else{
                    setWinnerName(secondNick);
                  } 
                }else{
                  console.log("Draw detected!")
                  const draw = true;
                  const amount = betAmount;
                  
                  axios.post(`${BASE_URL}/api/withdraw/${roomId}`, {
                      firstAddress,
                      secondAddress,
                      draw,
                      amount
                    }).then(response => {
                      setLoading(false);
                      setErrorLink(response.data);
                      console.log(response.data);
                    }).catch(err => {
                      console.log(err);
                    })
                }
              }else{
                setErrorLink("Not your match!!!")
              }
            })
        })}else{
          setErrorLink('The Second Player has not joined yet')
        }
    }).catch(err => {
      console.log("Error request BASE_URL/api/join/roomID",err);
    });
    
  }

  useEffect(() =>  {
    
      axios.get(`${BASE_URL}/api/join/${id}`).then(response => {
        console.log("Get request!")
        const {_id,signerAddress, nickname, secondNickname,  amount,secondSigner} = response.data;
        setUser({
          firstAddress: signerAddress,
          secondAddress: secondSigner,
          roomId: _id,
          firstNick: nickname,
          secondNick: secondNickname,
          betAmount: amount,
          url: `https://chessbet.vercel.app/join/${id}`
        })
        
    }).catch(err => {
      console.log(err);
    })
    
  }, [input])
  const copyToClipboard = (e) => {
    linkRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
    setTimeout(() => {
      setCopySuccess('');
    }, 3000);
  }
  const handleInput = (e) => {
    setMatchLink(e.target.value);
    setInput(e.target.value);
  }
  const app = () => (
    <div className='app-container' style={{width: '350px', height: '270px'}}>
      {/* {user ? <h3>{user} joined</h3> : ''} */}
      <div className='game-link'>
          <div className='generated'>
            <label>Generated link:</label>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <input value={user.url} ref={linkRef} type='text' style={{width: '315px'}}  />
              <div className='tooltip-container'>
                <span onClick={copyToClipboard}>{copySuccess ? <DoneIcon color='success' sx={{ fontSize: 30 }} /> : <ContentCopyIcon />}</span>
                {/* {copySuccess ? <span className="custom-tooltip">{copySuccess}</span> : '' } */}
              </div>
              
            </div>
            
          </div>
          <div className='generated'>
            <label>Enter match link: </label>
            <input placeholder='Enter game link' onChange={(e) => handleInput(e)} />
            {errorLink ? <p style={{fontSize: '14px', color: 'red'}}>{errorLink}</p> : ''}
          </div>
        </div>
        <span className='start-btn' onClick={onCheck} style={{marginTop: `${errorLink ? '10px' : ''}`}}>CHECK RESULT</span>
        {/* {winnerName ? <h3 style={{color: 'whitesmoke'}}>Winner is: {winnerName}</h3> : ''} */}

        {loading && <Load />}
    </div>
  )
  return (
    // <div className='app-container' style={{width: '350px', height: '270px'}}>
      <>
      {winnerName ? <div className='app-container' style={{background: 'none'}}><Modal nick={winnerName} winner={winnerName === user.firstNick ? true : false} /> </div> : app()}
      </>
        
    
  )
}

export default Game
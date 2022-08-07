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
import Notification from './Notification';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {isMobile} from 'react-device-detect';



const ENDPOINT = 'chess-socket.onrender.com';


const Game = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [noWinner, setNoWinner] = useState(false);
  const [loading, setLoading] = useState('');
  const [matchLink, setMatchLink] = useState('');
  const [winnerName, setWinnerName] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [errorLink, setErrorLink] = useState('');
  const [input, setInput] = useState('');
  const [user, setUser] = useState({});
  const [notification, setNotification] = useState({}); 
  const [notificationHandler, setNotificationHandler] = useState(false);
  const {state} = useLocation();
  const {id, name} = state;
  const [player, setPlayer] = useState('');
  const linkRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  const steps = ['step 1', 'step 2', 'step 3'];
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
    const items = JSON.parse(localStorage.getItem('joined'));
    setPlayer(items);
    const room = id;
    socket.emit('join',{name, room}, (error) => {
        if(error) {
            alert(error);
        }else{
          console.log("Everything is ok!")
        }
    })
    socket.on("roomData", ({ users }) => {
            console.log("socket connection")
            const user = users[users.length - 1].name;
            if(user !== name){
              setActiveStep(1);
              setPlayer(user);
              setDisabled(false);
              setNotification({message:`${user} has joined` , icon: true})
              setNotificationHandler(!setNotificationHandler);
                localStorage.setItem('joined', JSON.stringify(true));
              
              // alert(`${users[users.length - 1].name} has joined!`)
            }
            console.log(users);
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
                setNotification({message: 'The game is not over yet or the wrong link has been entered', icon: false});
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
                      setNotification({message: response.data, icon: true});
                      console.log(response.data);
                    }).catch(err => {
                      console.log(err);
                    })
                }
              }else{
                alert("Not your match!!!")
              }
            })
        })}else{
          console.log("The Second Player has not joined yet");
          setNotification({message: 'The Second Player has not joined yet', icon: false})
          setNotificationHandler(!setNotificationHandler);
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
  // useEffect(() => {
  //   console.log(notification)
  //   if(notification !== undefined)setTimeout(() => setNotification({}), 10000);
  // }, [notification])
  useEffect(() => {
    console.log(notification ? 'true' : 'false')
    setTimeout(() => setNotification(), 1000);
  }, [notificationHandler])
  const app = () => (
    <>
      <div className='app-container'>
        <Stepper activeStep={activeStep} style={{padding: '10px'}}>
          <Step>
            <StepLabel>Step 1</StepLabel>
          </Step>
          <Step>
            <StepLabel>Step 2</StepLabel>
          </Step>
          <Step>
            <StepLabel>Step 3</StepLabel>
          </Step>
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            
            
          </React.Fragment>
        ) : (
          <React.Fragment>
            {activeStep === 0 && 
              <Typography sx={{ mt: 2, mb: 1 }}>
              <div className='form1'> 
                <label style={{
          fontFamily: 'Open-Sans-Bold',
          fontSize: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>Copy the address and send to <br /> your opponent</label>
                <div className='copy-link'>
                  <input className='copy-link-input' value={user.url} ref={linkRef} type='text'   />
                  <button type="button" className="copy-link-button">
                    <span className="material-icons"  onClick={copyToClipboard}>{copySuccess ? <DoneIcon color='success' sx={{ fontSize: 30 }} /> : "Copy"}</span>
                  </button>
                </div>
                <label style={{
          fontFamily: 'Open-Sans-Bold',
          fontSize: '20px',
          marginTop: '25px',
          textAlign: 'center'
        }}>Wait until the opponent will join</label>
              </div>
              
              
              </Typography>
            }
            {activeStep === 1 && 
              <Typography sx={{ mt: 2, mb: 1 }}>
                <div style={{
                  padding:'15px',
                  textAlign:'center'
                }}>
                  <h3>Now Play the match on Chess.com with your opponent</h3>
                  <h3>When match will over enter a link of the match and get your winnings</h3>
                </div>
                
              </Typography>
            }
            {activeStep === 2 && 
              <Typography sx={{ mt: 2, mb: 1 }}>
                <label style={{
          fontFamily: 'Open-Sans-Bold',
          textAlign: 'center'
        }}>Enter the match link to get your winnings</label>
                <div className='form1' >
                  <input placeholder='Enter game link' onChange={(e) => handleInput(e)} />
                </div>
                {loading ? <Load /> : <span className='btn' onClick={onCheck} ><span>Get a winnings</span></span>}
              </Typography>
            }
            
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, marginTop:`${isMobile ? '20px' : '60px'}`, }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                  
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                
                {activeStep !== 2 && <Button onClick={handleNext} disabled={disabled}>
                  Next
                </Button>}
                
            </Box>
            
            {!isMobile && 
            <>
              <img className='chessBoard-back' src='assets/images/chess-board.png.png' alt='chess-board' />
            <img className='wallet-3d' src='assets/images/wallet-3d.png' alt='wallet-3d' />
            </>}
            { notification && <Notification message={notification.message} icon={notification.icon} /> }
          </React.Fragment>
        )}
    </div>
    
    </>
    
  )
  const noDraw = () => (
    <>
      {winnerName ? <Modal nick={winnerName} winner={winnerName === user.firstNick ? true : false} betAmount={(user.betAmount * 2) - ((user.betAmount * 2) * 0.1)}  />  : app()}
    </>
  )
  
  return (
      <>
      {noWinner ? <Modal draw={true} /> : noDraw()}
      </>
        
    
  )
}

export default Game
import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import Load from './Load';
import Modal from './Modal';
import { BASE_URL } from './api';

function Lobby() {
  const [firstAddress, setFirstAddress] = useState('');
  const [secondAddress, setSecondAddress] = useState('');
  const [roomId, setRoomId] = useState('');
  const [firstNick, setFirstNick] = useState('');
  const [secondNick, setSecondNick] = useState('');
  const [matchLink, setMatchLink] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  const [winnerName, setWinnerName] = useState('');
  const [loading,setLoading] = useState(false);
  const [errorLink, setErrorLink] = useState('');

  const {state} = useLocation();
  const {id, name} = state;
  

const onCheck = () => {
    
    console.log("First signer: ", firstAddress)
    console.log("Second signer: ", secondAddress)

    axios.get(`https://api.chess.com/pub/player/${firstNick}/games/archives`).then(response => {
      axios.get(`${response.data.archives[response.data.archives.length - 1]}`).then(response => {
        const game = response.data.games.find(item => item.url === matchLink);
        if(!game){
          setErrorLink('The game is not over yet or the wrong link has been entered');
        }else{
          setErrorLink('')
        }
        if((game.black.username === firstNick || game.white.username === firstNick) && (game.black.username === secondNick || game.white.username === secondNick)){
          if(game.black.result != 'win'){
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
          }else{
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
          }
        }else{
          setErrorLink("Not your match!!!");
        }
        
      })
    })
  }

  useEffect(() =>  {
    setTimeout(() => {
       axios.get(`${BASE_URL}/api/join/${id}`).then(response => {
      const {_id, signerAddress, nickname, secondNickname,  amount, secondSigner} = response.data;
      console.log("First signer address from get: ", signerAddress);
      console.log("Second signer address from get: ", secondSigner);
      setRoomId(_id);
      setFirstAddress(signerAddress);
      setSecondAddress(secondSigner);
      setFirstNick(nickname);
      // setMatchLink(link);
      setSecondNick(secondNickname);
      setBetAmount(amount);
    }).catch(err => {
      console.log(err);
    })
    }, 3000);
   
  }, [])
  const app = () => (
    <div className='app-container'>
        <input placeholder='Enter game link' onChange={(e) => setMatchLink(e.target.value)} />
        {errorLink ? <p style={{fontSize: '14px', color: 'red'}}>{errorLink}</p> : ''}
        <span className='start-btn' onClick={onCheck} >CHECK RESULT</span>
        {loading && <Load />}
    </div>
  )

  return (
    <>
    
     {winnerName ? <div className='app-container' style={{background: 'none'}}><Modal nick={winnerName} winner={winnerName === secondNick ? true : false} /> </div> : app()}

    </>
  )
}

export default Lobby
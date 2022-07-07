import React, { useEffect, useState } from 'react'
import './Game.css'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ChessWebAPI from 'chess-web-api';


function Game() {
  const [firstAddress, setFirstAddress] = useState('');
  const [secondAddress, setSecondAddress] = useState('');
  const [firstNick, setFirstNick] = useState('');
  const [secondNick, setSecondNick] = useState('');
  const [matchLink, setMatchLink] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  const [url, setUrl] = useState('');
  const {state} = useLocation();
  const {id} = state;
  
  const onCheck = () => {
    const strs = matchLink.split('/');
    const id = strs.at(-1)
    console.log(id)

    axios.get(`https://api.chess.com/pub/player/${firstNick}/games/archives`).then(response => {
      axios.get(`${response.data.archives[response.data.archives.length - 1]}`).then(response => {
        const game = response.data.games.find(item => item.url === matchLink);
        if(game.black.result != 'win'){
          console.log(game.white.username);
          if(game.white.username === firstNick){
            const winner = firstAddress;
            const amount = betAmount * 2;
            axios.post('http://localhost:8080/withdraw', {
              winner,
              amount
            })
          }
          if(game.white.username === secondNick){
            const winner = secondAddress;
            const amount = betAmount * 2;
            axios.post('http://localhost:8080/withdraw', {
              winner,
              amount
            })
          }
        }else{
          console.log(game.black.username);
        }
        
      })
    })

    // const chessAPI = new ChessWebAPI({
    //   queue: true
    // })
    // chessAPI.getGameByID(50219974297).then(response => {
    //   console.log(response.body)
    // })
    // chessAPI.getPlayer("bauka1215").then(response => console.log(response))
    
  }

  useEffect(() =>  {
    axios.get(`http://localhost:8080/join/${id}`).then(response => {
      const {signerAddress, nickname, secondNickname, link, amount, secondSigner} = response.data;
      setFirstAddress(signerAddress);
      setSecondAddress(secondSigner);
      setFirstNick(nickname);
      setMatchLink(link);
      setSecondNick(secondNickname);
      setBetAmount(amount);
      setUrl(`http://localhost:3000/join/${id}`);
    }).catch(err => {
      console.log(err);
      
    })
  }, [])

  return (
    <div className='app-container'>
        <div className='game-link'>
            <label>Generated link:</label>
            <input value={url} type='text' />
        </div>
        <span className='start-btn' onClick={onCheck}>CHECK RESULT</span>
    </div>
  )
}

export default Game
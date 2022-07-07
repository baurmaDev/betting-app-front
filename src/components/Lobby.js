import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';


function Lobby() {
    const [firstAddress, setFirstAddress] = useState('');
  const [secondAddress, setSecondAddress] = useState('');
  const [firstNick, setFirstNick] = useState('');
  const [secondNick, setSecondNick] = useState('');
  const [matchLink, setMatchLink] = useState('');
  const [betAmount, setBetAmount] = useState(0);
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
          console.log("Winner: ", game.black.username);
          if(game.black.username === firstNick){
            const winner = firstAddress;
            const amount = betAmount * 2;
            axios.post('http://localhost:8080/withdraw', {
              winner,
              amount
            })
          }
          if(game.black.username === secondNick){
            const winner = secondAddress;
            const amount = betAmount * 2;
            axios.post('http://localhost:8080/withdraw', {
              winner,
              amount
            })
          }
        }
      })
    })
  }

  useEffect(() =>  {
    
    axios.get(`http://localhost:8080/join/${id}`).then(response => {
      const {signerAddress, nickname, secondNickname,  amount, secondSigner} = response.data;
      setFirstAddress(signerAddress);
      setSecondAddress(secondSigner);
      setFirstNick(nickname);
      // setMatchLink(link);
      setSecondNick(secondNickname);
      setBetAmount(amount);
    }).catch(err => {
      console.log(err);
    })
  }, [])

  return (
    <div className='app-container'>
        <input placeholder='Enter game link' onChange={(e) => setMatchLink(e.target.value)} />
        <span className='start-btn' onClick={onCheck} >CHECK RESULT</span>
    </div>
  )
}

export default Lobby
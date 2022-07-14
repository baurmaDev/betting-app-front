import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import Load from './Load';


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
    const strs = matchLink.split('/');
    const id = strs.at(-1)
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
        if(game.black.result != 'win'){
          // if(game.white.username === firstNick){

          //   const winner = firstAddress;
          //   const amount = betAmount * 2;
          //   setLoading(true);
          //   axios.post(`http://localhost:8080/api/withdraw/${roomId}`, {
          //     winner,
          //     amount
          //   }).then(response => {
          //     setLoading(false);
          //     setWinnerName(firstNick);
          //     console.log(response.data);
          //     setErrorLink(response.data);
          //   }).catch(err => {
          //     console.log(err);
          //   })
          // }
          if(game.white.username === secondNick){
            const winner = secondAddress;
            const amount = betAmount * 2;
            setLoading(true);
            axios.post(`http://localhost:8080/api/withdraw/${roomId}`, {
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
            alert("Get away!")
          }
        }else{
          console.log("Winner: ", game.black.username);
          // if(game.black.username === firstNick){
          //   const winner = firstAddress;
            

          //   const amount = betAmount * 2;
          //   setLoading(true);
          //   axios.post(`http://localhost:8080/api/withdraw/${roomId}`, {
          //     winner,
          //     amount
          //   }).then(response => {
              
          //     setLoading(false);
          //     setWinnerName(firstNick);
          //     console.log(response.data);
          //     setErrorLink(response.data);
          //   }).catch(err => {
          //     console.log(err);
          //   })
          // }
          if(game.black.username === secondNick){
            const winner = secondAddress;
            const amount = betAmount * 2;
            setLoading(true);
            axios.post(`http://localhost:8080/api/withdraw/${roomId}`, {
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
            alert("Get away!")
          }
        }
      })
    })
  }

  useEffect(() =>  {
    setTimeout(() => {
       axios.get(`http://localhost:8080/api/join/${id}`).then(response => {
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

  return (
    <div className='app-container'>
        <input placeholder='Enter game link' onChange={(e) => setMatchLink(e.target.value)} />
        {errorLink ? <p style={{fontSize: '14px', color: 'red'}}>{errorLink}</p> : ''}
        <span className='start-btn' onClick={onCheck} >CHECK RESULT</span>
        {loading && <Load />}
        {/* {winnerName ? <h3 style={{color: 'whitesmoke'}}>Money sent to the winner: {winnerName}</h3> : ''} */}
    </div>
  )
}

export default Lobby
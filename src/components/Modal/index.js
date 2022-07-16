import React from 'react'
import './modal.css'
import loser from '../../assets/loser.png'; 
import winnerLogo from '../../assets/winner.png'; 


function Modal({nick, winner}) {
  console.log(winner);
  return (
    <div className="container">
        <div className="cookiesContent" id="cookiesPopup">
            <img src={winner ? winnerLogo : loser} alt="loooser" />
            {winner ? <h2>You are the winner YAAAY</h2> : <p>You are looser. The winner is <strong>{nick}</strong></p>}
            
        </div>
    </div>
  )
}

export default Modal
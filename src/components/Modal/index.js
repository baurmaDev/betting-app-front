import React from 'react'
import './modal.css'



function Modal({nick, winner}) {
  console.log(winner);
  return (
    <div className="container">
        <div className="cookiesContent" id="cookiesPopup">
            <img src={winner ? 'assets/images/winner.png' : 'assets/images/loser.png'} alt="loooser" />
            {winner ? <h2>You are the winner YAAAY</h2> : <p>You are looser. The winner is <strong>{nick}</strong></p>}
            
        </div>
    </div>
  )
}

export default Modal
import React from "react";
import "./modal.css";
import {useNavigate } from "react-router-dom";


function Modal({ nick, winner, betAmount, draw }) {
  console.log(winner);
  let navigate = useNavigate();

  const looserImageUrl = "assets/images/looser.png";
  const winnerImageUrl = "assets/images/winner.png";

  const noDraw = () => (
    <>
    {winner ? (
        <>
          <img src='/assets/images/win.png' />
          <div style={{fontSize: '24px', fontFamily: 'Open-Sans-Bold', marginTop:'20px'}}>{betAmount} ETH</div>
          <div className="betAmount">was sent to your wallet</div>
          
        </>
      ) : (
        <>
          
          <img src='/assets/images/lose.png' />
          <div style={{fontSize: '32px', fontFamily: 'Open-Sans-Bold', marginTop: '20px', marginBottom: '10px', color:'#4f4b41'}}>Play again</div>
          <img src='/assets/images/replay.png' style={{cursor: 'pointer'}} onClick={() => navigate('/main', {replace: true})} />
        </>
      )}
    </>
  );

  return (
    <div className="app-container">
      
      {
        draw ? (
          <>
            <img src='/assets/images/chess-game.png' />
            <div style={{fontSize: '64px', fontFamily:'Open-Sans-Bold'}}>Draw</div>  
            <div style={{fontSize:'26px', fontFamily:'Open-Sans-Bold', marginTop:'10px', padding:'10px'}}>Ether was returned to wallet</div>
            <button className="btn" style={{border: 'none', marginTop:'20px'}} onClick={() => navigate('/main', {replace:true})} ><span>Play Again</span></button>
            {/* <div style={{fontSize: '32px', fontFamily: 'Open-Sans-Bold', marginTop: '10px', marginBottom: '10px'}}>Play again</div>
          <img src='/assets/images/replay.png' style={{cursor: 'pointer'}} onClick={() => navigate('/main', {replace: true})} /> */}
          </>
          
        ) : noDraw()
      }
      

      
    </div>
  );
}

export default Modal;

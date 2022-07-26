import React from "react";
import "./modal.css";

function Modal({ nick, winner }) {
  console.log(winner);

  const looserImageUrl = "assets/images/looser.png";
  const winnerImageUrl = "assets/images/winner.png";

  return (
    <div className="container">
      <div className="cookiesContent" id="cookiesPopup">
        <img src={winner ? winnerImageUrl : looserImageUrl} alt="loooser" />
        {winner ? (
          <h2>You are the winner YAAAY</h2>
        ) : (
          <p>
            You are looser. The winner is <strong>{nick}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default Modal;

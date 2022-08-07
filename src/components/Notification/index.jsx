import React, { useEffect } from 'react'
import './Notification.css'
import ErrorIcon from '@mui/icons-material/Error';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';

const Index = ({message, icon}) => {
  console.log("Modal opened", {message, icon})
  const [close, setClose] = useState(false);
  useEffect(() => {
    if(icon !== true) setTimeout(() => setClose(!close), 5000);
  }, [])  
  return (
    <div className='notification-container' style={{
        display: (close || !message) && 'none'
    }}>
        <div className="notification-header">
          <span style={{cursor: 'pointer'}} onClick={() => setClose(!close)}><CancelIcon /></span>
        </div>
        <div className="notification-text">
            <div className="notification-icon">
              {icon ? <DoneIcon fontSize='large' sx={{ color: '#1C152E' }}  /> : <ErrorIcon fontSize='large' sx={{ color: '#1C152E' }} />}
            </div>
            <div className="notification-message">
              {message}
            </div>
        </div>
        
    </div>
  )
}

export default Index
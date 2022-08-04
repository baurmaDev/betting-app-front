import React, {useState} from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";
import {isMobile} from 'react-device-detect';



const Index = () => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['step 1', 'step 2', 'step 3'];
    let navigate = useNavigate();
    const handleNext = () => {
        if(activeStep === 2){
            navigate("/", {replace: true})
        }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

  return (
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
              <Typography sx={{ mt: 2, mb: 1 }} style={{display: 'flex', flexDirection: 'column'}}>
                <a href='https://metamask.io/download/' target="_blank" rel='noreferrer'> <img src='/assets/images/metamask.png' /></a>
                <a href='https://metamask.io/download/' target="_blank" rel='noreferrer' style={{textAlign: 'center'}}>Get Metamask</a>
              </Typography>
            }
            {activeStep === 1 && 
              <Typography sx={{ mt: 2, mb: 1 }}>
                <ul style={{marginBottom: '245px'}}>
                    <li><a href='https://user-images.githubusercontent.com/1380529/46949169-c6881b00-d080-11e8-9563-4006ac8aeab6.png' target="_blank" rel='noreferrer' >Switch to Rinkeby Test Network</a></li>
                                      
                </ul>
              </Typography>
            }
            {activeStep === 2 && 
              <Typography sx={{ mt: 2, mb: 1 }}>
                <ul style={{marginBottom: `${isMobile ? '175px' : '200px'}`}}>
                    
                    <li>Copy your wallet address</li>
                    <li>Enter your wallet address here: <a href="https://rinkebyfaucet.com/">Rinkeby Faucet</a></li>
                    <li>Then you will get 0.1 ETH for test</li>
                </ul>
              </Typography>
            }
            
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                

                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
            
            
          </React.Fragment>
        )}
    </div>
  )
}

export default Index
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import PushupDetector from './PushupDetector'
import CloseIcon from '@material-ui/icons/Close'
import CameraIcon from '@material-ui/icons/CameraAlt'

const EntryDialog = ({entryDialogOpen, closeDialog, handleEntry}) => {
  const [pushupCount, setPushupCount] = useState(0)
  const [showAi, setShowAi] = useState(false)

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      onPushupCountSubmit()
    }
  }

  const onPushupCountSubmit = () => {
    handleEntry(pushupCount)
    setPushupCount(0)
    closeDialog()
  }  

  const aiContainerStyle = {
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    top: '0',
    left: '0',
    margin: '0',
    padding: '0',
    zIndex: 99999,
    backgroundColor: 'white',
  }

  return (
    <>
    <Dialog open={entryDialogOpen} onClose={() => closeDialog()}>
      <DialogContent>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={12}>
            <Typography variant='h5' style={{textAlign:'left'}}>How many pushups did you do?</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              id="numberOfPushups"
              label="Number of pushups"
              type="number"
              value={pushupCount!=0 ? pushupCount : ''}
              onChange={(e) => setPushupCount(parseInt(e.target.value))}
              onKeyPress={(e) => handleEnter(e)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="outlined"
              onClick={() => setShowAi(!showAi)}
              startIcon={<CameraIcon />}
            >
              Try smart pushup detector
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => onPushupCountSubmit()} color="primary" variant="outlined">
          Add
        </Button>
      </DialogActions>
    </Dialog>
    {showAi &&
      <div style={aiContainerStyle}>
        <PushupDetector
          pushupCount={pushupCount}
          setPushupCount={setPushupCount}
        />
        <Fab            
          onClick={() => setShowAi(false)}
          style={{
            color: "#ffaa00",
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <CloseIcon />
        </Fab>
      </div>
    }
    </>
  )
}

export default EntryDialog

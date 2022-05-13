import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Grid, IconButton, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import PushupDetector from './PushupDetector'
import CloseIcon from '@material-ui/icons/Close'

const EntryDialog = ({entryDialogOpen, closeDialog, handleEntry}) => {
  const [pushupCount, setPushupCount] = useState(0)
  const [showAi, setShowAi] = useState(false)

  const handleEnter = (e) => {
    console.log(e.key)
    if (e.key === 'Enter') {
      onPushupCountSubmit()
    }
  }

  const onPushupCountSubmit = () => {
    handleEntry(pushupCount)
    setPushupCount(0)
    closeDialog()
  }  

  const aiDialogStyle = {
    textAlign: 'center',
    margin: '0',
    padding: '0',
    fontFamily: 'monospace',
  }

  const aiCloseButtonStyle = {
    position: 'fixed',
    bottom: '0',
    left: '50%',
    marginBottom: '5px',
    //width: '80px',
    //height: '80px',
    marginLeft: "-100px",
    color: "#ffaa00",
    width: '200px',
  }

  const aiContainerStyle = {
    height: '100%',
    width: '100%',
    margin: '0',
    padding: '0',
  }

  return (
    <>
    <Dialog open={entryDialogOpen} onClose={() => closeDialog()}>
      <DialogContent>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={12}>
            <Typography variant='h5' style={{textAlign:'left'}}>How many push ups?</Typography>
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
            >
              Switch to AI camera pushup detector
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
    <Dialog 
      open={showAi} 
      onClose={() => setShowAi(false)}
      style={aiDialogStyle}
    >
      <div style={aiContainerStyle}>
        <PushupDetector
          pushupCount={pushupCount}
          setPushupCount={setPushupCount}
        />
        <Box 
          justifyItems={'center'}
          style={aiCloseButtonStyle}
        >
          <Fab            
            onClick={() => setShowAi(false)}
            style={{
              color: "#ffaa00",
            }}
          >
            <CloseIcon />
          </Fab>
        </Box>
      </div>
    </Dialog>
    </>
  )
}

export default EntryDialog

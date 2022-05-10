import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import PushupDetector from './PushupDetector'


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

  return (
    <Dialog open={entryDialogOpen} onClose={() => closeDialog()}>
      <DialogContent>
        <DialogTitle>How many push ups?</DialogTitle>
        <TextField
          autoFocus
          fullWidth
          id="numberOfPushups"
          label="Number of pushups"
          type="number"
          value={pushupCount!=0 ? pushupCount : ''}
          onChange={(e) => setPushupCount(parseInt(e.target.value))}
          onKeyPress={(e) => handleEnter(e)}
        />
        <Button onClick={() => setShowAi(!showAi)}>Show AI pushup counter</Button>
        {showAi && <PushupDetector />}
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
  )
}

export default EntryDialog

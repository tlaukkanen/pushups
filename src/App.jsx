import { Button, createMuiTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Grid, IconButton, makeStyles, MuiThemeProvider, Paper, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import './App.css'
import DayTimeline from './components/DayTimeline'
import store from 'store'
import dayjs from 'dayjs'

/*
Theme
#faf3e0
#eabf9f
#b68973
#1e212d
*/

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#faf3e0',
      main: '#eabf9f',
      dark: '#b68973',
      //contrastText: 
    },
    secondary: {
      light: '#eabf9f',
      main: '#eabf9f',
      

    },
  }
})

const useStyles = makeStyles((theme) => ({
  page: {
    margin: theme.spacing(0),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
}))


function App() {
  const classes = useStyles()
  const [count, setCount] = useState(0)
  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  const [pushups, setPushups] = useState([])
  const [pushupCount, setPushupCount] = useState(0)

  useEffect(() => {
    const data = store.get('data')
    if (data) {
      setPushups(data)
    }
  }, [setPushups])

  const handleEntry = () => {
    const dayStamp = dayjs().format('YYYYMMDD')

    let newPushups = {
      ...pushups
    }

    let dayData = newPushups[dayStamp]
    if(dayData==null) {
      dayData = []
    }

    dayData.push(pushupCount)

    newPushups[dayStamp] = dayData

    store.set('data', newPushups)
    setPushups(newPushups)

    setEntryDialogOpen(false)
    setPushupCount(0)
  }

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Grid container>
          <Grid item xs={12}>
            <DayTimeline 
              data={pushups}
            />
            <Fab
              onClick={() => setEntryDialogOpen(true)}
              color="primary"
              className={classes.fab}
            >
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
      </MuiThemeProvider>
      <Dialog open={entryDialogOpen} onClose={() => setEntryDialogOpen(false)}>
        <DialogContent>
          <DialogContentText>
            Enter number of pushups done in one set.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="numberOfPushups"
            label="Number of pushups"
            type="number"
            value={pushupCount!=0 ? pushupCount : ''}
            onChange={(e) => setPushupCount(parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEntryDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEntry} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default App

import {
  Button, createMuiTheme, createTheme, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Fab, Grid, IconButton, makeStyles, MuiThemeProvider,
  Paper, TextField, Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import './App.css'
import DayTimeline from './components/DayTimeline'
import store from 'store'
import dayjs from 'dayjs'
import EntryDialog from './components/EntryDialog'

/*
Theme
#faf3e0
#eabf9f
#b68973
#1e212d
*/

/*
Theme v2
#E5EDB8
#ADB85F
#837B47
#5A3D31
#300018
*/



const theme = createTheme({
  palette: {
    primary: {
      light: '#E5EDB8',
      main: '#ADB85F',
      dark: '#300018',
      //contrastText: 
    },
    secondary: {
      light: '#E5EDB8',
      main: '#ADB85F',
    },
    text: {
      secondary: '#5A3D31',
    }
  }
})

const useStyles = makeStyles((theme) => ({
  page: {
    margin: theme.spacing(0),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
}))


function App() {
  const classes = useStyles()
  const [count, setCount] = useState(0)
  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  const [pushups, setPushups] = useState([])

  useEffect(() => {
    const data = store.get('data')
    if (data) {
      setPushups(data)
    }
  }, [setPushups])

  const handleEntry = (pushupCount) => {
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
  }

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='h6' style={{textAlign:'center'}}>Pushups Last 10 Days</Typography>
          </Grid>
          <Grid item xs={12}>
            
            <DayTimeline 
              data={pushups}
            />
          </Grid>
        </Grid>
        <Fab
          onClick={() => setEntryDialogOpen(true)}
          color="primary"
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
        <EntryDialog
          entryDialogOpen={entryDialogOpen}
          closeDialog={() => setEntryDialogOpen(false)}
          handleEntry={(count) => handleEntry(count)}
        />
      </MuiThemeProvider>
    </>
  )
}

export default App

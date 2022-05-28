import {
  BottomNavigation,
  BottomNavigationAction,
  Button, createMuiTheme, createTheme, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Fab, Grid, IconButton, makeStyles, MuiThemeProvider,
  Paper, TextField, Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import './App.css'
import DayTimeline from './components/DayTimeline'
import Stats from './components/Stats'
import store from 'store'
import dayjs from 'dayjs'
import EntryDialog from './components/EntryDialog'
import ListIcon from '@material-ui/icons/List'
import CalendarIcon from '@material-ui/icons/CalendarToday'

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

/*
Theme v3
#68A7AD
#99C4C8
#E5CB9F
#EEE4AB

*/


const theme = createTheme({
  palette: {
    primary: {
      light: '#99C4C8',
      main: '#68A7AD',
      dark: '#300018',
      //contrastText: 
    },
    secondary: {
      light: '#99C4C8',
      main: '#68A7AD',
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
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20
  },
  navigation: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 10,
  }
}))

const RECENT_VIEW = 0;
const STATS_VIEW = 1;

function App() {
  const classes = useStyles()
  const [count, setCount] = useState(0)
  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  const [pushups, setPushups] = useState()
  const [currentView, setCurrentView] = useState(RECENT_VIEW)

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
    <MuiThemeProvider theme={theme}>
      <Grid container>
        {currentView === RECENT_VIEW &&
        <>
          <Grid item xs={12}>
            <Typography variant='h6' style={{textAlign:'center'}}>Pushups Last 10 Days</Typography>
          </Grid>
          <Grid item xs={12}>
            <DayTimeline 
              data={pushups}
            />
          </Grid>
        </>
        }
        {currentView === STATS_VIEW &&
          <Grid item xs={12}>
            <Stats />
          </Grid>
        }
       </Grid>
      <EntryDialog
        entryDialogOpen={entryDialogOpen}
        closeDialog={() => setEntryDialogOpen(false)}
        handleEntry={(count) => handleEntry(count)}
      />
      <BottomNavigation
        showLabels
        className={classes.navigation}
      >
        <BottomNavigationAction
          label="Recent"
          icon={<ListIcon />} 
          onClick={() => setCurrentView(RECENT_VIEW)}
        />
        <BottomNavigationAction
          label="Stats"
          icon={<CalendarIcon />}
          onClick={() => setCurrentView(STATS_VIEW)}
        />
      </BottomNavigation>
      <Fab
        onClick={() => setEntryDialogOpen(true)}
        color="primary"
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
    </MuiThemeProvider>
  )
}

export default App

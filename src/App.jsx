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
import store from 'store'
import dayjs from 'dayjs'
import EntryDialog from './components/EntryDialog'
import ListIcon from '@material-ui/icons/List'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import ReactPWAInstallProvider, { useReactPWAInstall } from 'react-pwa-install'
import logo from '/icon_192x192.png'

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


function App() {
  const classes = useStyles()
  const [count, setCount] = useState(0)
  const [entryDialogOpen, setEntryDialogOpen] = useState(false)
  const [pushups, setPushups] = useState([])
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall()

  const handleInstallClick = () => {
    if(!supported) {
      alert('Your browser does not support PWA installation')
      return
    }
    pwaInstall({
      title: 'Pushups',
      logo: logo,
      features: (
        <ul>
          <li>Track your pushups</li>
          <li>AI pushup counter</li>
          <li>Progress statistics</li>
        </ul>
      ),
      description: "Track your pushups and see how you progress over time",
    })
    .then(() => alert('Install successful'))
    .catch(() => alert('Install failed'))
  };

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
    <ReactPWAInstallProvider>
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
        <EntryDialog
          entryDialogOpen={entryDialogOpen}
          closeDialog={() => setEntryDialogOpen(false)}
          handleEntry={(count) => handleEntry(count)}
        />
        <BottomNavigation
          showLabels
          className={classes.navigation}
        >
          <BottomNavigationAction label="Recent" icon={<ListIcon />} />
          <BottomNavigationAction
            label="PWA test"
            icon={<CalendarIcon />}
            onClick={handleInstallClick}
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
    </ReactPWAInstallProvider>
  )
}

export default App

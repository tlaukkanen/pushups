import { Box, Button, Grid, Paper, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import store from 'store'
import AddIcon from '@material-ui/icons/Add'

const workoutStyle = {
  padding: '1em',
  margin: '1em',
}

const addStyle = {
  margin: '1em',
}

const Settings = () => {
  const [workoutTypes, setWorkoutTypes] = useState([])

  useEffect(() => {
    const types = store.get('workoutTypes')
    if(types) {
      setWorkoutTypes(types)
    } else {
      const defaultTypes = [
        {
          name: 'Pushups',
          mode: 'count',
        },
        {
          name: 'Plank',
          mode: 'time',
        }
      ]
      store.set('workoutTypes', defaultTypes)
      setWorkoutTypes(defaultTypes)
    }
  }, [])

  return (
    <Box>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Typography variant='h6' style={{textAlign:'center'}}>Settings</Typography>
        </Grid>
        <Grid item xs={12} spacing={3}>
          <Typography variant='body1' style={{textAlign:'center'}}>
            Workout types
          </Typography>
          {workoutTypes.map((type, index) => (
            <Paper key={index} style={workoutStyle}>
              <Typography key={index} variant='body1'>
                {type.name}
              </Typography>
            </Paper>
          ))}
          <Paper style={addStyle}>
          <Button startIcon={<AddIcon/>} fullWidth>
          Add new
          </Button>
          </Paper>
          
        </Grid>
      </Grid>
    </Box>
  )
}

export default Settings

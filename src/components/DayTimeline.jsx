import React, { useState } from 'react'
import { Card, CardContent, Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import { 
  Timeline, TimelineConnector, TimelineContent,
  TimelineDot, TimelineItem, TimelineOppositeContent,
  TimelineSeparator
} from "@material-ui/lab";
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const useStyles = makeStyles((theme) => ({
  dateContent: {
    width: '200px',
  },
  pushupList: {
    padding: theme.spacing(1),
  }
}))

export default function DayTimeline(props) {
  const classes = useStyles()
  const { data } = props
  const days = [
    dayjs().format('YYYYMMDD'),
    dayjs().subtract(1, 'day').format('YYYYMMDD'),
    dayjs().subtract(2, 'day').format('YYYYMMDD'),
    dayjs().subtract(3, 'day').format('YYYYMMDD'),
    dayjs().subtract(4, 'day').format('YYYYMMDD'),
    dayjs().subtract(5, 'day').format('YYYYMMDD'),
    dayjs().subtract(6, 'day').format('YYYYMMDD'),
    dayjs().subtract(7, 'day').format('YYYYMMDD'),
    dayjs().subtract(8, 'day').format('YYYYMMDD'),
    dayjs().subtract(9, 'day').format('YYYYMMDD'),
  ]

  const formatDay = (dayStamp) => (
    dayjs(dayStamp, 'YYYYMMDD').format('DD/MM/YYYY')
  )

  const formatRelativeDay = (dayStamp) => {
    const now = dayjs()
    const day = dayjs(dayStamp, 'YYYYMMDD')
    const diffDays = now.diff(day, 'day')
    if(diffDays==0) {
      return "Today"
    //} else if(diffDays==1) {
    //  return "Yesterday"
    } else {
      return "" //`${diffDays} days ago`
    }
  }

  return (
<>
{days.map((day, index) => (
  <div key={day}>
  <Divider />
  <Grid 
    container 
    className={classes.pushupList} 
    spacing={0}
    justifyContent="space-evenly"
  >
    <Grid item xs={3}>
    {formatDay(day)}
    <br/>
    {dayjs(day, 'YYYYMMDD').format('dddd')}
    <br/>
    {formatRelativeDay(day)}
    </Grid>
    <Grid item xs={4}>
    
      <Typography variant="body2">
      <b>{data[day] ? Math.max.apply(Math, data[day]) : 0}</b> max/set
      </Typography>
      <Typography variant="body2">
        <b>{data[day] ? data[day].length : 0}</b>  sets
      </Typography>
    </Grid>
    <Grid item xs={2}
    style={{ justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column" }}
    >
      {index === 0 &&
        <Card variant="elevation">
          <CardContent style={{ justifyContent:"center", alignItems:"center", display:"flex", flexDirection:"column" }}>
            <Typography variant="h4">
              {data[day] ? data[day].reduce((a,b) => a+b,0) : 0}
            </Typography>
            <span>total</span>
          </CardContent>
        </Card>
      }
      {index > 0 &&
        <Typography variant="h4">
          {data[day] ? data[day].reduce((a,b) => a+b,0) : 0}
        </Typography>
      }
    </Grid>
  </Grid>
  </div>
))}
</>
  )
}

DayTimeline.defaultProps = {
  data: {}
}

DayTimeline.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.any
  ),
}

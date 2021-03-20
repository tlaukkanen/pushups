import React, { useState } from 'react'
import { Card, CardContent, makeStyles, Typography } from "@material-ui/core"
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
}))

export default function DayTimeline(props) {
  const classes = useStyles()
  const { data } = props
  const days = [
    dayjs().format('YYYYMMDD'),
    dayjs().subtract(1, 'day'),
    dayjs().subtract(2, 'day'),
    dayjs().subtract(3, 'day'),
    dayjs().subtract(4, 'day'),
    dayjs().subtract(5, 'day'),
  ]

  const formatDay = (dayStamp) => (
    dayjs(dayStamp, 'YYYYMMDD').format('DD/MM/YYYY')
  )

  const formatRelativeDay = (dayStamp) => (
    dayjs(dayStamp, 'YYYYMMDD').fromNow()
  )

  return (
    <Timeline
    >
      {days.map((day) => (
        data[day] &&
      <TimelineItem key={day}>
        <TimelineOppositeContent
          className={classes.dateContent}
        >
          <Typography color="textSecondary" gutterBottom>
            {formatDay(day)}
            <br/>
            {formatRelativeDay(day)}
          </Typography>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot/>
          <TimelineConnector/>
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" component="h4">
            {data[day] && data[day].reduce((a,b) => a+b,0)} total
          </Typography>
          <Typography variant="body2">
            <b>{data[day].length}</b> sets - max <b>{Math.max.apply(Math, data[day])}</b> per set
          </Typography>
        </TimelineContent>
      </TimelineItem>
        
      ))}
    </Timeline>        
  )
}

DayTimeline.defaultProps = {
  data: []
}

DayTimeline.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.objectOf({
      date: PropTypes.string,
      sets: PropTypes.arrayOf(
        PropTypes.number
      ),
    }),
  ),
}
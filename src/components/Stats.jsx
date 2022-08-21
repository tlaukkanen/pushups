import React, { useState, useEffect } from 'react'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import dayjs from 'dayjs'
import { Line } from 'react-chartjs-2'
import InstallPWAButton from './InstallPWAButton'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const Stats = (props) => {
  const { data } = props
  const [days, setDays] = useState([])
  const [pushups, setPushups] = useState([])

  const formatDay = (dayStamp) => (
    dayjs(dayStamp, 'YYYYMMDD').format('DD/MM/YYYY')
  )

  const createDays = () => {
    // Create days for past 30 days
    const pastDays = []
    for (let i = 30; i >= 0; i--) {
      const dayStamp = dayjs().subtract(i, 'day').format('YYYYMMDD')
      const formattedDay = formatDay(dayStamp)
      pastDays.push(formattedDay)
    }
    setDays(pastDays)
  }

  useEffect(() => {
    createDays()
  }, [])

  useEffect(() => {
    if(!data) {
      return
    }
    const pushupsPerDay = []
    for (let i = 30; i >= 0; i--) {
      const dayStamp = dayjs().subtract(i, 'day').format('YYYYMMDD')
      const count = data[dayStamp] ? data[dayStamp].reduce((a,b) => a+b,0) : 0
      pushupsPerDay.push(count)
    }
    setPushups(pushupsPerDay)
  }, [data])

  return (
    <div>
      <Line
        
        data={{
          labels: days,
          datasets: [{
            label: 'Pushups ' + data,
            data: pushups
          }]
        }}
      />
      <InstallPWAButton />
    </div>
  )
}

export default Stats

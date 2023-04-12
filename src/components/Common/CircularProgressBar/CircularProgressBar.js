import React from 'react'
// import "./circularProgressBar.scss";
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {getCircularProgressColor} from '../../../utils/Helpers'

export default function CircularProgressBar({type, value}) {
  const barVariants = ['w-16 h-16', 'w-12 h-12']
  const color = getCircularProgressColor(value)

  return (
    <div className={barVariants[type]}>
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({textColor: '#6B82AB', pathColor: color})}
      />
    </div>
  )
}

import React from 'react'
import {getLastWeekDays} from '../../../utils/Helpers'
import {Bar} from 'react-chartjs-2'

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
}

export default function BarChart({title, attendance}) {
  const dataset = {
    labels: getLastWeekDays(),
    datasets: [
      {
        label: title,
        backgroundColor: '#1DA1F2',
        borderColor: '#1DA1F2',
        borderRadius: 6,
        borderWidth: 1,
        data: attendance,
      },
    ],
  }

  return (
    <div className="w-full">
      <div className="tm-para1 mb-3">{title}</div>
      <Bar data={dataset} className="w-full" options={options} />
    </div>
  )
}

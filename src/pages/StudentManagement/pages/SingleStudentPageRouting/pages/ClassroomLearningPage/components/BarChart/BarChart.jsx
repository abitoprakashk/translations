import React from 'react'
import styles from './BarChart.module.css'
import {Bar} from 'react-chartjs-2'
import {Para, PARA_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'

export default function BarChart({
  chartTitle,
  lengends,
  labels,
  datasets,
  scalesMax,
}) {
  const options = {
    plugins: {title: {display: false}, legend: {display: false}},
    responsive: true,
    interaction: {mode: 'index', intersect: false},
    scales: {
      x: {stacked: true, grid: {display: false}},
      y: {stacked: false, ...(scalesMax ? {max: 100} : {}), min: 0},
    },
  }

  const legendItems = [
    {label: lengends[0], styleClass: styles.bar1},
    {label: lengends[1], styleClass: styles.bar2},
  ]

  const data = {
    labels,
    datasets: [
      {
        label: lengends[0],
        data: datasets[0],
        backgroundColor: '#987FE1',
        stack: 'Stack 0',
        borderRadius: '4',
        barThickness: '20',
      },
      {
        label: lengends[1],
        data: datasets[1],
        backgroundColor: '#DBD3F4',
        stack: 'Stack 1',
        borderRadius: '4',
        barThickness: '20',
      },
    ],
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>{chartTitle}</Para>

        <div className={styles.legendWrapper}>
          {legendItems?.map(({label, styleClass}, i) => (
            <div key={i} className={styles.legendItem}>
              <div
                className={classNames(styles.legendItemColor, styleClass)}
              ></div>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{label}</Para>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

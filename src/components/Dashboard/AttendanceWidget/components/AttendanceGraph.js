import React, {useEffect, useRef, useState} from 'react'
import {Bar} from 'react-chartjs-2'
import styles from './AttendanceGraph.module.css'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import {useTranslation} from 'react-i18next'
import {EmptyData} from '../constants'
import {useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const AttedanceGraph = ({
  graphData,
  setShowTable,
  setTableData,
  filledData,
  setDateIndex,
  graphLoaded,
}) => {
  const [days, setDays] = useState([])
  const [markedData, setMarkedData] = useState([])
  const [unMarkedData, setUnMarkedData] = useState([])
  const [totalClasses, setTotalClasses] = useState([])
  const [noClasses, setNoClasses] = useState([])
  const {t} = useTranslation()
  const chartRef = useRef(null)
  const {eventManager} = useSelector((state) => state)

  const last7Days = () => {
    let result = []
    for (let i = 0; i < 7; i++) {
      let d = new Date()
      d.setDate(d.getDate() - i)
      let c = d.toLocaleDateString('en-US', {weekday: 'long'}).slice(0, 2)
      result.push(c)
    }

    setDays(result.reverse())
  }
  const options = {
    plugins: {
      legend: {
        display: graphLoaded,
        position: 'bottom',
        align: 'start',
        labels: {
          width: 12,
          height: 12,
          usePointStyle: true,
          pointStyle: 'rect',
        },
        onClick: () => {
          setShowTable(false)
        },
      },
      tooltip: {
        enabled: ({datasetIndex}) => (datasetIndex === 1 ? false : true),
        boxWidth: ({datasetIndex}) => (datasetIndex ? 0 : 0),
        yAlign: 'bottom',
        usePointStyle: true,
        callbacks: {
          title: () => false,
          label: (context) => {
            let label = context.dataset.label || ''
            if (label === t('classesMarked')) {
              return `${markedData[context.dataIndex]}/${
                markedData[context.dataIndex] + unMarkedData[context.dataIndex]
              } ${t('classesMarkedLowerCase')}`
            } else if (label === t('classesNotMarked')) {
              return `${unMarkedData[context.dataIndex] || 0}/${
                markedData[context.dataIndex] + unMarkedData[context.dataIndex]
              } ${t('classesNotMarkedLowerCase')}`
            } else {
              return `${markedData[context.dataIndex]}/${
                noClasses[context.dataIndex] || 0
              } ${t('classesMarkedLowerCase')}`
            }
          },
          labelPointStyle: () => {
            return {
              pointStyle: 'triangle',
              rotation: 0,
            }
          },
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        gridLine: {
          display: false,
        },
        display: false,
      },
    },
  }

  const labels = days

  const data = {
    labels,
    datasets: [
      {
        label: t('classesMarked'),
        data: markedData,
        backgroundColor: '#B8A7EA',
        hoverBackgroundColor: '#B8A7EA',
        borderRadius: 8,
      },
      {
        label: t('classesNotMarked'),
        data: totalClasses,
        backgroundColor: '#DBD3F4',
        hoverBackgroundColor: '#DBD3F4',
        borderRadius: 8,
      },
      {
        label: t(''),
        data: noClasses,
        backgroundColor: '#F4F4F4',
        hoverBackgroundColor: '#F4F4F4',
        borderRadius: 8,
      },
    ],
  }
  useEffect(() => {
    !days.length && last7Days()
  }, [days])

  useEffect(() => {
    if (graphData?.length > 0) {
      setMarkedData([...graphData?.map((data) => data?.marked || 0)])
      setUnMarkedData([...graphData?.map((data) => data?.not_marked || 0)])
      setTotalClasses([
        ...graphData?.map(
          (data) => (data?.not_marked || 0) + (data?.marked || 0)
        ),
      ])
    }
  }, [graphData])

  useEffect(() => {
    if (totalClasses.length > 0) {
      setNoClasses([
        ...graphData?.map((data) => {
          if (data?.not_marked + data?.marked === 0) {
            return Math.max(...totalClasses)
          } else return 0
        }),
      ])
    }
  }, [totalClasses])

  const onBarClick = () => {
    setTableData({...EmptyData})
    setShowTable(true)
    let dateIndex =
      chartRef?.current?.tooltip &&
      chartRef?.current?.tooltip?.dataPoints &&
      chartRef?.current?.tooltip?.dataPoints[0]?.dataIndex
    setDateIndex(dateIndex)
    setTableData(filledData[dateIndex])
    eventManager.send_event(events.STUDENT_ATTENDANCE_DATE_SELECTED_TFI, {
      screen_name: 'dashboard',
      date: filledData[dateIndex]?.day,
    })
  }

  return (
    <div className={styles.attedanceGraphContainer}>
      <div className={styles.graphHeader}>{t('weeklySummary')}</div>
      {graphData?.length === 0 && (
        <div className={styles.graphNoDataAvailable}>
          {t('noDataAvailable')}
        </div>
      )}
      <Bar
        onClick={() => {
          if (graphLoaded) {
            onBarClick()
          } else {
            return
          }
        }}
        ref={chartRef}
        data={data}
        options={options}
      />
    </div>
  )
}

export default AttedanceGraph

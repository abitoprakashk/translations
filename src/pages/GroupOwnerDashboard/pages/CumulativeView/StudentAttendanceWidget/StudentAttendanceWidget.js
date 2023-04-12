import React, {useEffect, useState} from 'react'
import AttendanceCard from '../components/AttendanceCard'
import styles from './StudentAttendanceWidget.module.css'
import {Datepicker, EmptyState, Widget} from '@teachmint/krayon'
import {t} from 'i18next'
import {DownloadReport} from '../../../components/DownloadReport'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {STUDENT_CSV_FILE_NAME, STUDENT_CSV_HEADERS} from '../../Constants'
import {DateTime} from 'luxon'

export default function StudentAttendanceWidget({getCsvData}) {
  const dispatch = useDispatch()
  const cardsDataStr = {
    total: {
      value: 0,
      title: t('total'),
      subText: null,
    },
    present: {
      value: 0,
      title: t('present'),
      subText: null,
      className: styles.presentValue,
    },
    absent: {
      value: 0,
      title: t('absent'),
      subText: null,
      className: styles.absentValue,
    },
    not_marked: {
      value: 0,
      title: t('notMarked'),
      subText: null,
    },
  }

  const [attendanceApiData, setAttendanceApiData] = useState([])
  const [cumulativeData, setCumulativeData] = useState(cardsDataStr)
  const [showWidget, setShowWidget] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${DateTime.now().plus({days: -1}).toISODate()}`)
  )
  const maxDate = new Date(`${DateTime.now().plus({days: -1}).toISODate()}`)

  const orgOverviewDetails = useSelector(
    (state) => state.globalData.orgOverviewDetails?.data
  )
  const orgStudentAttendanceReport = useSelector(
    (state) => state.globalData.orgStudentAttendanceReport?.data
  )

  useEffect(() => {
    if (orgStudentAttendanceReport) {
      setAttendanceApiData(orgStudentAttendanceReport)
    }
  }, [orgStudentAttendanceReport])

  useEffect(() => {
    //call staff-attendance api for data
    dispatch(
      globalActions?.getOrgStudentAttendanceReport?.request({
        start_date: DateTime.fromJSDate(selectedDate).toISODate(),
        end_date: DateTime.fromJSDate(selectedDate).plus({days: 1}).toISODate(),
      })
    )
  }, [selectedDate])

  useEffect(() => {
    if (orgOverviewDetails) {
      let csvLines = [[...STUDENT_CSV_HEADERS]]
      let parsedData = attendanceApiData.reduce((aggregated, current) => {
        const total =
          orgOverviewDetails?.find(
            (stats) => stats.institute_id === current?.institute_id
          )?.no_of_students || 0
        const notMarked = Math.max(
          0,
          total - current?.present - current?.absent
        )

        csvLines.push([
          current?.institute_id,
          total,
          current?.absent,
          current?.present,
          notMarked,
        ])
        return {
          total: (aggregated?.total || 0) + total,
          present: (aggregated?.present || 0) + current?.present,
          absent: (aggregated?.absent || 0) + current?.absent,
          not_marked: (aggregated?.not_marked || 0) + notMarked,
        }
      }, {})
      let draft = {...cumulativeData}
      Object.keys(draft).forEach((key) => {
        draft[key].value = parsedData[key]
        if (key !== 'total') {
          draft[key].subText =
            parsedData.total === 0
              ? '0%'
              : `${((parsedData[key] / parsedData.total) * 100).toFixed(2)}%`
        }
      })
      csvLines.push([
        t('total'),
        parsedData.total,
        parsedData.absent,
        parsedData.present,
        parsedData.not_marked,
      ])
      setCsvData(csvLines)
      setCumulativeData(draft)
      setShowWidget(true)
    }
  }, [attendanceApiData, orgOverviewDetails])

  return (
    <Widget
      header={{title: 'Student Attendance', icon: 'people2'}}
      classes={{iconFrame: styles.iconBgColor}}
      actionButtons={[
        <DownloadReport
          fileName={STUDENT_CSV_FILE_NAME}
          data={getCsvData(csvData)}
          key={STUDENT_CSV_FILE_NAME}
        />,
      ]}
      body={
        !showWidget ? (
          <EmptyState
            content={t('noDataAvailable')}
            iconName="formatListBulleted"
            button={null}
            classes={{
              wrapper: styles.emptyState,
              iconFrame: styles.emptyStateIconFrame,
            }}
          ></EmptyState>
        ) : (
          <div>
            <div>
              <Datepicker
                value={selectedDate}
                onChange={(val) => {
                  setSelectedDate(val)
                }}
                maxDate={maxDate}
                closeOnChange
                classes={{input: styles.dateInput}}
              />
            </div>
            <div className={styles.studentWidget}>
              {Object.values(cumulativeData).map((card) => (
                <AttendanceCard {...card} key={card.title} />
              ))}
            </div>
          </div>
        )
      }
    />
  )
}

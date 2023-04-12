import classNames from 'classnames'
import {DateTime} from 'luxon'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Icon} from '@teachmint/common'
import {
  showLoadingAction,
  showToast,
} from '../../../../redux/actions/commonAction'
import {utilsGetInstituteStudentAttendanceOverview} from '../../../../routes/attendance.route'
import {utilsGetInstituteSectionList} from '../../../../routes/instituteSystem'
import {events} from '../../../../utils/EventsConstants'
import DateField from '../../../Common/DateField/DateField'
import AttendanceOverview from '../AttendanceOverview/AttendanceOverview'
import TodaysAttendanceSection from '../TodaysAttendanceSection/TodaysAttendanceSection'
import styles from './StudentAttendance.module.css'

export default function StudentAttendance() {
  const {t} = useTranslation()
  const [selectedDate, setSelectedDate] = useState(
    DateTime.now().toFormat('yyyy-MM-dd')
  )
  const [slotList, setSlotList] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(0)
  const [attendanceData, setAttendanceData] = useState(null)
  const [isAttendanceAvailable, setIsAttendanceAvailable] = useState(false)

  const dispatch = useDispatch()
  const {instituteActiveAcademicSessionId, eventManager} = useSelector(
    (state) => state
  )

  useEffect(() => {
    getInstituteStudentAttendanceOverview()
  }, [selectedDate, instituteActiveAcademicSessionId])

  const getInstituteStudentAttendanceOverview = async () => {
    setSlotList([])
    setSelectedSlot(0)
    dispatch(showLoadingAction(true))
    const sectionList = await utilsGetInstituteSectionList().catch(() => {})

    if (sectionList?.status) {
      utilsGetInstituteStudentAttendanceOverview(
        DateTime.fromFormat(selectedDate, 'yyyy-MM-dd').toUnixInteger()
      )
        .then(({status, obj, error_code}) => {
          setIsAttendanceAvailable(status)

          if (status || error_code === 7023) {
            const attendanceData = {}

            Object.keys(sectionList?.obj)?.forEach((section) => {
              if (obj?.[section]) {
                Object.values(obj[section])?.forEach((item, index) => {
                  if (!attendanceData[index])
                    attendanceData[index] = {
                      present: 0,
                      absent: 0,
                      sectionEntries: [],
                      totalStudents: 0,
                    }
                  attendanceData[index].present += item?.present_students
                  attendanceData[index].absent += item?.absent_students
                  attendanceData[index].sectionEntries?.push({
                    _id: section,
                    ...item,
                    ...sectionList?.obj?.[section],
                  })
                  attendanceData[index].totalStudents +=
                    sectionList?.obj?.[section]?.no_of_students
                })
              } else {
                if (!attendanceData[0])
                  attendanceData[0] = {
                    present: 0,
                    absent: 0,
                    sectionEntries: [],
                    totalStudents: 0,
                  }
                attendanceData[0].sectionEntries?.push({
                  _id: section,
                  ...sectionList?.obj?.[section],
                })
                attendanceData[0].totalStudents +=
                  sectionList?.obj?.[section]?.no_of_students
              }
            })

            setAttendanceData(attendanceData)
            setSlotList(Object.keys(attendanceData))
          } else throw ''
        })
        .catch(() =>
          dispatch(
            showToast({type: 'error', message: 'Unable to get attendance'})
          )
        )
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  return (
    <div className="p-5">
      <div className={styles.headerWrapper}>
        <div className="tm-hdg tm-hdg-24">{t('studentAttendanceTitle')}</div>

        <div className={styles.dateField}>
          <DateField
            value={selectedDate}
            handleChange={(_, value) => {
              eventManager.send_event(events.ATTENDANCE_DATE_CLICKED_TFI, {
                attendance_date: value,
              })

              setSelectedDate(value)
            }}
            fieldName="selectedDate"
            max={DateTime.now().toFormat('yyyy-MM-dd')}
          />
        </div>
      </div>

      {slotList?.filter((v, i) => i === 0)?.length > 1 ? (
        <div className={styles.slotCon}>
          {slotList
            ?.filter((v, i) => i === 0)
            ?.map((item, index) => (
              <div
                onClick={() => setSelectedSlot(item)}
                key={index}
                className={classNames(
                  styles.slotItem,
                  item == selectedSlot ? styles.slotItemSelected : ''
                )}
              >
                Slot {index + 1}
              </div>
            ))}
        </div>
      ) : null}

      {!isAttendanceAvailable && (
        <div className={styles.notMarkedSection}>
          <Icon
            color="warning"
            name="inactive"
            size="xs"
            className={styles.notMarkedSectionImg}
          />
          <div className="tm-hdg tm-hdg-16">
            {t('attendanceNotMarkedForToday')}
          </div>
        </div>
      )}

      <TodaysAttendanceSection
        isAttendanceAvailable={isAttendanceAvailable}
        attendanceData={attendanceData}
        selectedSlot={selectedSlot}
      />

      <hr />

      <AttendanceOverview
        attendanceData={attendanceData?.[selectedSlot]}
        selectedDate={selectedDate}
      />
    </div>
  )
}

import {
  Table,
  Icon,
  ToggleSwitch,
  Button,
  ErrorBoundary,
} from '@teachmint/common'
import {DateTime} from 'luxon'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ATTENDANCE_SECTION_TABLE_HEADERS} from '../../../../constants/attendance.constants'
import {
  showLoadingAction,
  showToast,
} from '../../../../redux/actions/commonAction'
import {
  markStudentAttendance,
  utilsGetSectionStudentAttendanceOverview,
  utilsGetSectionStudentAttendanceSlots,
} from '../../../../routes/attendance.route'
import SliderScreen from '../../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../Common/SliderScreenHeader/SliderScreenHeader'
import styles from './SliderSectionAttendance.module.css'
import classNames from 'classnames'
import UserProfile from '../../../Common/UserProfile/UserProfile'
import AttendanceStats from '../AttendanceStats/AttendanceStats'
import DateField from '../../../Common/DateField/DateField'
import {events} from '../../../../utils/EventsConstants'
import {Trans, useTranslation} from 'react-i18next'
import {useMemo} from 'react'
import {IS_MOBILE} from '../../../../constants'
import Permission from '../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

const sortByTimeStampAndDuration = (a, b) =>
  a.ts - b.ts || a.duration - b.duration

const PRESENT = 'P'
const ABSENT = 'A'

export default function SliderSectionAttendance({
  setSliderScreen,
  sectionDetails,
  initialDate = DateTime.now().toFormat('yyyy-MM-dd'),
}) {
  const {t} = useTranslation()

  const [editingAttendance, setEditingAttendance] = useState(false)
  const [markedAttendance, setMarkedAttendance] = useState({})
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [attendanceData, setAttendanceData] = useState(null)

  const [sectionStudentsList, setSectionStudentsList] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(0)
  const [availableSlots, setAvailableSlots] = useState([])
  const [slots, setSlots] = useState([])
  const [slotAttendance, setSlotAttendance] = useState({})
  const [slotAttendanceStats, setSlotAttendanceStats] = useState({})

  const manageAttendanceFor = (
    <Trans i18nKey={'manageAttendanceFor'}>
      Manage attendance for {{class: sectionDetails?.parent?.name}} -{' '}
      {{section: sectionDetails?.name}}
    </Trans>
  )

  const dispatch = useDispatch()
  const {instituteActiveAcademicSessionId, instituteStudentList, eventManager} =
    useSelector((state) => state)

  // filter current section students from institute student list
  useEffect(() => {
    setSectionStudentsList(
      instituteStudentList?.filter(({details}) =>
        details?.sections?.includes(sectionDetails?.id)
      )
    )
  }, [instituteStudentList])

  useEffect(() => {
    const selectedDateDT = DateTime.fromFormat(selectedDate, 'yyyy-MM-dd')
    const slotIndex = (selectedDateDT.weekday - 1) % 7

    const slotFromAttendance = Object.entries(attendanceData || []).map(
      ([ts, {slot_duration}]) => ({
        ts: Number(ts.split('.')[0]),
        duration: slot_duration,
      })
    )

    setSlots(
      (availableSlots[slotIndex] || [])
        .map((item) => {
          const [hour, minute, second] = item.st.split(':')
          const {year, month, day} = selectedDateDT.c
          return {
            ...item,
            ts: DateTime.utc(
              year,
              month,
              day,
              +hour,
              +minute,
              +second,
              0
            ).toUnixInteger(),
          }
        })
        .concat(...slotFromAttendance)
        .sort(sortByTimeStampAndDuration)
        // filter duplicate entries
        .filter(({ts, duration}, index, arr) => {
          if (index == 0) return true
          else {
            return !(
              ts == arr[index - 1].ts && duration == arr[index - 1].duration
            )
          }
        })
    )
  }, [selectedDate, availableSlots, attendanceData])

  useEffect(() => {
    setSelectedSlot(0)
    getSectionStudentAttendanceOverview()
  }, [selectedDate])

  useEffect(() => {
    if (editingAttendance) {
      if (!slotAttendanceStats.marked) {
        const allPresent = instituteStudentList.reduce((acc, curr) => {
          acc[curr._id] = PRESENT
          return acc
        }, {})
        setMarkedAttendance(allPresent)
      } else {
        setMarkedAttendance(slotAttendance)
      }
    }
  }, [
    slotAttendance,
    editingAttendance,
    instituteStudentList,
    slotAttendanceStats.marked,
  ])

  useEffect(() => {
    utilsGetSectionStudentAttendanceSlots(sectionDetails?.id)
      .then(({status, obj}) => {
        if (status) {
          setAvailableSlots(obj || [])
        } else throw ''
      })
      .catch(() =>
        dispatch(showToast({type: 'error', message: 'Unable to get slots'}))
      )
  }, [])

  useEffect(() => {
    const slotAttendance = attendanceData?.[slots?.[selectedSlot]?.ts] || {}

    const existingAttendance = {}

    sectionStudentsList?.forEach(({_id}) => {
      existingAttendance[_id] = 0
    })

    // possible there could be data of students which is not in the system anymore
    if (slotAttendance.slot_duration == slots?.[selectedSlot]?.duration) {
      slotAttendance.absent_students?.forEach((id) => {
        existingAttendance[id] = ABSENT
      })
      slotAttendance.present_students?.forEach((id) => {
        existingAttendance[id] = PRESENT
      })
    }

    setSlotAttendanceStats({
      totalStudents: sectionStudentsList?.length,
      totalPresent: sectionStudentsList?.filter(
        ({_id}) => existingAttendance[_id] == PRESENT
      ).length,
      totalAbsent: sectionStudentsList?.filter(
        ({_id}) => existingAttendance[_id] == ABSENT
      ).length,
      marked: !!attendanceData?.[slots?.[selectedSlot]?.ts],
    })
    setSlotAttendance(existingAttendance)
  }, [selectedSlot, slots, attendanceData, sectionStudentsList])

  const getSectionStudentAttendanceOverview = () => {
    setAttendanceData(null)

    dispatch(showLoadingAction(true))
    utilsGetSectionStudentAttendanceOverview(
      sectionDetails?.id,
      DateTime.fromFormat(selectedDate, 'yyyy-MM-dd')
        .startOf('day')
        .toUnixInteger(),
      DateTime.fromFormat(selectedDate, 'yyyy-MM-dd')
        .endOf('day')
        .toUnixInteger()
    )
      .then(({status, obj, error_code}) => {
        if (status) {
          setAttendanceData(
            // trim '.0' from keys of timestamp
            Object.entries(obj).reduce((acc, [ts, data]) => {
              acc[Number(ts)] = data
              return acc
            }, {})
          )
        } else if (error_code === 7023) setAttendanceData(null)
        else throw ''
      })
      .catch(() =>
        dispatch(
          showToast({type: 'error', message: t('unableToGetAttendance')})
        )
      )
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const saveAttendance = () => {
    const payload = {
      section_id: sectionDetails.id,
      institute_id: instituteActiveAcademicSessionId,
      timestamp: slots?.[selectedSlot]?.ts,
      date: selectedDate,
      class_duration: slots?.[selectedSlot]?.duration,
      update_dict: sectionStudentsList.reduce((acc, curr) => {
        acc[curr._id] = [
          markedAttendance[curr._id] == PRESENT ? PRESENT : ABSENT,
          curr.user_id || '',
        ]
        return acc
      }, {}),
    }

    dispatch(showLoadingAction(true))

    markStudentAttendance(payload)
      .then(({status, obj, error_code, msg}) => {
        if (status === true) {
          getSectionStudentAttendanceOverview()
          dispatch(
            showToast({
              type: 'success',
              message: 'Attendance marked successfully',
            })
          )
          eventManager.send_event(events.SAVE_ATTENDANCE_CLICKED_TFI, {
            screen_name: 'manage_classroom_attendance',
            type: slotAttendanceStats.marked ? 'edit' : 'mark',
            section_id: sectionDetails?.id,
            present: sectionStudentsList
              .filter(({_id}) => markedAttendance[_id] == PRESENT)
              .map(({_id}) => _id),
            slot: payload.timestamp,
            slot_duration: payload.class_duration,
          })
        } else if (status == false && error_code == 7098) {
          dispatch(
            showToast({
              type: 'error',
              message: msg,
            })
          )
        } else throw new Error(obj)
        setEditingAttendance(false)
      })
      .catch(() => {
        dispatch(
          showToast({type: 'error', message: 'Failed to mark attendance'})
        )
      })
      .finally(() => {
        dispatch(showLoadingAction(false))
      })
  }

  const rows = useMemo(() => {
    return sectionStudentsList
      ?.map((student) => ({
        id: student._id,
        name: (
          <UserProfile
            image={student?.img_url}
            name={student?.name}
            phoneNumber={
              student?.enrollment_number?.trim()
                ? `${student?.enrollment_number}`
                : student?.phone_number
            }
            joinedState={IS_MOBILE ? null : student?.verification_status}
          />
        ),
        enrollment_number: student?.enrollment_number || '-',
        roll_number: student?.roll_number || '-',
        attendance: (
          <div className={`tm-hdg-14`}>
            {editingAttendance ? (
              <>
                {ABSENT}
                <ToggleSwitch
                  id={student._id}
                  checked={markedAttendance[student._id] == PRESENT}
                  onChange={(checked) => {
                    setMarkedAttendance((marked) => ({
                      ...marked,
                      [student._id]: checked ? PRESENT : ABSENT,
                    }))
                  }}
                  className={styles.toggleMargin}
                />
                {PRESENT}
              </>
            ) : !slotAttendanceStats.marked ? (
              '-'
            ) : slotAttendance[student._id] == PRESENT ? (
              PRESENT
            ) : (
              ABSENT
            )}
          </div>
        ),
        sortingKey: student?.name,
      }))
      .sort((a, b) => a?.sortingKey?.localeCompare(b?.sortingKey))
  }, [
    selectedSlot,
    selectedDate,
    attendanceData,
    editingAttendance,
    markedAttendance,
    slotAttendance,
    sectionStudentsList,
  ])

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width={900}>
      <ErrorBoundary>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/attendance-primary.svg"
          title={manageAttendanceFor}
        />

        <div className="tm-bkcr-gy-5 px-5 lg:px-10 h-4/5 overflow-y-auto min-h-screen pb-40 relative">
          <div className={styles.inputCon}>
            <div className={styles.dateRangeCon}>
              <div className={styles.dateField}>
                <DateField
                  value={selectedDate}
                  handleChange={(_, value) => {
                    setSelectedDate(value)
                    eventManager.send_event(
                      events.ATTENDANCE_DATE_ENTERED_TFI,
                      {
                        class_id: sectionDetails?.id,
                        date_from: value,
                        date_to: value,
                      }
                    )
                  }}
                  fieldName="selectedDate"
                  max={DateTime.now().toFormat('yyyy-MM-dd')}
                />
              </div>
            </div>

            <div className={classNames(styles.flex, styles.attendanceBtns)}>
              {editingAttendance && (
                <Button
                  size={IS_MOBILE ? 'medium' : 'large'}
                  onClick={() => {
                    saveAttendance()
                    eventManager.send_event(
                      events.SAVE_ATTENDANCE_CLICKED_TFI,
                      {
                        screen_name: 'manage_classroom_attendance',
                        type: slotAttendanceStats.marked ? 'edit' : 'mark',
                        section_id: sectionDetails?.id,
                      }
                    )
                  }}
                >
                  {t('save')}
                </Button>
              )}
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.manualAttendanceController_mark_attendance_update
                }
              >
                <Button
                  size={IS_MOBILE ? 'medium' : 'large'}
                  onClick={() => {
                    setEditingAttendance(!editingAttendance)
                    eventManager.send_event(
                      events.MARK_ATTENDANCE_CLICKED_TFI,
                      {
                        screen_name: 'manage_classroom_attendance',
                        type: slotAttendanceStats.marked ? 'edit' : 'mark',
                        section_id: sectionDetails?.id,
                      }
                    )
                  }}
                  type={editingAttendance ? 'border' : 'fill'}
                >
                  {editingAttendance
                    ? t('cancel')
                    : slotAttendanceStats.marked
                    ? t('editAttendance')
                    : t('markAttendance')}
                </Button>
              </Permission>
            </div>
          </div>

          <div className={styles.slotCon}>
            {slots?.map((item, index) => (
              <Button
                onClick={() => setSelectedSlot(index)}
                key={index}
                className={classNames(
                  styles.slotItem,
                  index == selectedSlot ? styles.slotItemSelected : ''
                )}
                disabled={editingAttendance}
              >
                Slot {index + 1}
              </Button>
            ))}
          </div>

          {!slotAttendanceStats.marked && (
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

          <AttendanceStats
            totalStudents={slotAttendanceStats.totalStudents}
            totalPresent={slotAttendanceStats.totalPresent || 0}
            totalAbsent={slotAttendanceStats.totalAbsent || 0}
            isAttendanceAvailable={slotAttendanceStats.marked || false}
            selectedDate={selectedDate}
          />

          <div className={styles.studentTable}>
            <Table rows={rows} cols={ATTENDANCE_SECTION_TABLE_HEADERS} />
          </div>
        </div>
      </ErrorBoundary>
    </SliderScreen>
  )
}

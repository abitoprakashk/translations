import React, {useState, useEffect} from 'react'
import styles from './ClassAttendanceModal.module.css'
import reportStyles from '../../Reports.module.css'
import classNames from 'classnames'
import {
  Button,
  ErrorBoundary,
  Icon,
  Input,
  Modal,
  Notice,
} from '@teachmint/common'
import {
  CLASS,
  DEPARTMENT,
  DOWNLOADING,
  DOWNLOAD_ATTENDANCE_REPORT,
  DOWNLOAD_REPORT,
  FROM,
  SECTION,
  SECTION_UPERCASE_TEXT,
  TO,
  // UNABLE_TO_GET_ATTENDANCE,
  UNABLE_TO_GET_SECTION_DETAILS,
} from '../../constant'
import {useSelector, useDispatch} from 'react-redux'
import {DateTime} from 'luxon'
import {utilsGetSectionStudentAttendanceOverview} from '../../../../../routes/attendance.route'
import {
  createAndDownloadCSV,
  getTotalDaysPresent,
} from '../../../../../utils/Helpers'
import {
  showErrorOccuredAction,
  showErrorToast,
  showSuccessToast,
} from '../../../../../redux/actions/commonAction'
import DateField from '../../../../Common/DateField/DateField'
import {utilsGetSectionDetails} from '../../../../../routes/instituteSystem'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../../utils/EventsConstants'
import {
  ATTENDANCE_DATA_IS_NOT_AVAILABLE_FOR_THIS_DATE_RANGE,
  FILE_HAS_BEEN_DOWNLOADED,
} from '../../../../../pages/fee/fees.constants'
// import InstituteTree from '../../../../../pages/fee/components/tfi-common/InstituteTree/InstituteTree'

export default function ClassAttendanceModal({
  showClassAttendanceReportModal,
  setShowClassAttendanceReportModal,
  trackEvent,
}) {
  const {t} = useTranslation()

  const dispatch = useDispatch()

  const {
    instituteInfo,
    instituteActiveAcademicSessionId,
    instituteAcademicSessionInfo,
    instituteStudentList,
    instituteHierarchy,
  } = useSelector((state) => state)
  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )

  const sessionStartDate = DateTime.fromMillis(
    parseInt(sessionRange.start_time)
  ).toFormat('yyyy-MM-dd')

  const sessionEndDate = DateTime.fromMillis(
    parseInt(sessionRange.end_time)
  ).toFormat('yyyy-MM-dd')

  const todayDate = DateTime.now().toFormat('yyyy-MM-dd')

  const maxReportDate = todayDate <= sessionEndDate ? todayDate : sessionEndDate

  let filteredClasses = []
  instituteHierarchy?.children.forEach((dept) => {
    if (dept.type === DEPARTMENT) {
      dept.children.map((std) => {
        filteredClasses.push(std)
      })
    }
  })

  let instituteClasses = []
  filteredClasses.map((std) => {
    instituteClasses.push({value: std.id, label: std.name})
  })

  const [selectedClass, setSelectedClass] = useState(null)
  const [sectionOptions, setSectionOptions] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [sectionDetails, setSectionDetails] = useState(null)
  const [classDetails, setClassDetails] = useState(null)
  const [fromDate, setFromDate] = useState(
    sessionEndDate >= todayDate ? todayDate : sessionStartDate
  )
  const [toDate, setToDate] = useState(
    sessionEndDate >= todayDate ? todayDate : sessionEndDate
  )
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [attendanceData, setAttendanceData] = useState(null)
  const [startDownload, setStartDownd] = useState(false)
  const [showDownloadingText, setShowDownloadingText] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  // using in next release
  //   const getSelectedNodes = (nodes) => {
  //     const classIds = {}
  //     Object.keys(nodes).map((node) => {
  //       if (nodes[node].type === 'SECTION') {
  //         classIds[node] = true
  //       }
  //     })
  //   }

  useEffect(() => {
    if (selectedClass && selectedSection && fromDate && toDate) {
      setIsButtonDisabled(false)
    }
  }, [selectedClass, selectedSection, fromDate, toDate])

  useEffect(() => {
    if (startDownload) {
      trackEvent(events.CLASS_ATTENDANCE_REPORT_POPUP_CLICKED_TFI)
      downloadReport()
    }
  }, [startDownload])

  const handleClassSelection = (classId) => {
    setSelectedClass(classId)

    let classSelected = filteredClasses.find(
      (selectedClass) => selectedClass.id === classId
    )

    setClassDetails(classSelected)

    let secOptions = classSelected?.children
      .filter((section) => section.type === SECTION_UPERCASE_TEXT)
      .map((section) => {
        return {value: section.id, label: section.name}
      })

    setSectionOptions(secOptions)
  }

  const handleSectionSelection = (sectionId) => {
    setSelectedSection(sectionId)
    getSectionDetails(sectionId)
  }

  const handleFromDateChange = (date) => {
    setFromDate(date)
  }

  const handleToDateChange = (date) => {
    setToDate(date)
  }

  const getSectionDetails = (sectionID) => {
    if (instituteInfo?._id && sectionID) {
      utilsGetSectionDetails(instituteInfo._id, sectionID)
        .then(({status, obj}) => {
          if (status) setSectionDetails(obj)
          else showErrorToast(t(UNABLE_TO_GET_SECTION_DETAILS))
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => {})
    }
  }

  const getDayWiseData = (data) => {
    const dateWiseAttendance = {}

    let startTime = DateTime.fromFormat(fromDate, 'yyyy-MM-dd')
    let endTime = DateTime.fromFormat(toDate, 'yyyy-MM-dd').endOf('day')
    let maxSlots = 0

    while (startTime < endTime) {
      const startTimeTimestamp = startTime.toUnixInteger()
      startTime = startTime.plus({days: 1})
      const endTimeTimestamp = startTime.toUnixInteger()
      let maxSlotsForDay = 0

      Object.keys(data)?.map((item) => {
        if (item >= startTimeTimestamp && item < endTimeTimestamp) {
          maxSlotsForDay++
          if (!dateWiseAttendance[startTimeTimestamp])
            dateWiseAttendance[startTimeTimestamp] = []

          dateWiseAttendance[startTimeTimestamp].push({
            time: item,
            data: data[item],
          })
        }
      })

      maxSlots = Math.max(maxSlots, maxSlotsForDay)
    }

    return [dateWiseAttendance, maxSlots]
  }

  const downloadReport = () => {
    const [dayWiseAttendance, maxSlots] = getDayWiseData(attendanceData)

    // Get global students list from attendance data
    const globalStudents = {}
    const calssroomNames = []

    Object.values(dayWiseAttendance)?.forEach((day) => {
      day?.forEach((slot) => {
        slot?.data?.present_students?.forEach((student) => {
          if (!globalStudents[student]) {
            const studentData = instituteStudentList?.find(
              ({_id}) => _id === student
            )
            if (studentData) globalStudents[student] = studentData
          }
        })

        slot?.data?.absent_students?.forEach((student) => {
          if (!globalStudents[student]) {
            const studentData = instituteStudentList?.find(
              ({_id}) => _id === student
            )
            if (studentData) globalStudents[student] = studentData
          }
        })
      })
    })

    let CSVRows = []
    CSVRows.push([`Institute: ${instituteInfo?.name}`])

    // Get active session name
    const selectedSession = instituteAcademicSessionInfo?.find(
      ({_id}) => instituteActiveAcademicSessionId === _id
    )
    CSVRows.push([`Academic Session: ${selectedSession?.name}`])
    // CSVRows.push([`Class: ${classDetails?.name} ${sectionDetails?.name}`])
    // CSVRows.push([`Teacher: ${sectionDetails?.class_teacher?.name}`])
    CSVRows.push([
      `Class: ${sectionDetails?.parent?.name} ${sectionDetails?.name}`,
    ])
    CSVRows.push([`Teacher: ${sectionDetails?.class_teacher?.name}`])

    CSVRows.push([])

    calssroomNames.push(`${classDetails?.name}${sectionDetails?.name}`)

    const dateRange = []

    // Get all days
    let startTime = DateTime.fromFormat(fromDate, 'yyyy-MM-dd')
    let endTime = DateTime.fromFormat(toDate, 'yyyy-MM-dd').endOf('day')
    while (startTime < endTime) {
      dateRange.push(startTime)
      startTime = startTime.plus({days: 1})
    }

    for (let i = 0; i < maxSlots; i++) {
      // Add Date(Day) row in CSV
      CSVRows.push(['Slot ' + (i + 1)])

      // // Add Slot row in CSV
      CSVRows.push([
        'Student Name',
        'Enrollment Number',
        'Roll Number',
        'Phone Number',
        'Total Present Days',
        ...dateRange?.map((time) => time.toFormat('dd LLL y')),
      ])

      // Add students data
      Object.values(globalStudents)?.map((student) => {
        CSVRows.push([
          student?.name,
          student?.enrollment_number || '-',
          student?.roll_number || '-',
          student?.phone_number,
          dateRange &&
            getTotalDaysPresent({
              dateRange,
              student,
              i,
              dayWiseAttendance,
            }).toString(),
          ...dateRange?.map((day) => {
            const studentAttenadnce =
              dayWiseAttendance?.[day?.toSeconds()]?.[i]?.data

            if (
              studentAttenadnce?.present_students?.find(
                (item) => item === student?._id
              )
            )
              return 'P'

            if (
              studentAttenadnce?.absent_students?.find(
                (item) => item === student?._id
              )
            )
              return 'A'
            return '-'
          }),
        ])
      })

      CSVRows.push([])
    }

    // Craete CSV
    CSVRows = CSVRows.map((item) => {
      let advanceItems = item.map((element) => {
        if (!element) element = 'NA'
        return String('"' + element.replace(/"/g, '""') + '"')
      })
      return advanceItems.join(',')
    })
    CSVRows = CSVRows.join('\n')
    createAndDownloadCSV(`Attendance-report-${fromDate}-${toDate}`, CSVRows)

    dispatch(showSuccessToast(t(FILE_HAS_BEEN_DOWNLOADED)))

    trackEvent(events.CLASS_ATTENDANCE_REPORT_DOWNLOADED_TFI, {
      class_id: classDetails?._id,
      section_id: sectionDetails?._id,
      attendance_date: `${fromDate} / ${toDate}`,
    })
  }

  const getSectionStudentAttendanceOverview = () => {
    setShowDownloadingText(true)
    setIsButtonDisabled(true)
    setStartDownd(false)
    setErrorMsg(null)
    utilsGetSectionStudentAttendanceOverview(
      selectedSection,
      DateTime.fromFormat(fromDate, 'yyyy-MM-dd').toUnixInteger(),
      DateTime.fromFormat(toDate, 'yyyy-MM-dd').endOf('day').toUnixInteger()
    )
      .then((res) => {
        // console.log('res', res)
        if (res.status) {
          if (res?.obj && Object.keys(res.obj).length) {
            setAttendanceData(res.obj)
            setStartDownd(true)
            setShowClassAttendanceReportModal(false)
          }
        } else {
          setIsButtonDisabled(false)
          setStartDownd(false)
          setShowDownloadingText(false)
          throw ''
        }
      })
      .catch((_err) => {
        setErrorMsg(t(ATTENDANCE_DATA_IS_NOT_AVAILABLE_FOR_THIS_DATE_RANGE))
        setIsButtonDisabled(false)
        setStartDownd(false)
        setShowDownloadingText(false)
      })
  }

  return (
    <ErrorBoundary>
      <Modal
        show={showClassAttendanceReportModal}
        className={classNames(
          styles.classAttendanceDownloadReportModal,
          styles.modalMain
        )}
      >
        <div className={reportStyles.modalSection}>
          <div className={reportStyles.modalHeadingSection}>
            <div className={reportStyles.modalIconAndHeadingSection}>
              <div
                className={classNames(
                  reportStyles.iconBg,
                  reportStyles.classAttandanceIconBg
                )}
              >
                <Icon color="warning" name="handRaise" size="m" type="filled" />
              </div>
              <div className={reportStyles.modalHeadingText}>
                {t(DOWNLOAD_ATTENDANCE_REPORT)}
              </div>
            </div>
            <div>
              <button
                onClick={() =>
                  setShowClassAttendanceReportModal(
                    !showClassAttendanceReportModal
                  )
                }
              >
                <Icon
                  color="basic"
                  name="close"
                  size="xs"
                  type="filled"
                  className={reportStyles.crossBtn}
                />
              </button>
            </div>
          </div>

          {/* <div className={reportStyles.modalContentSection}>
          <InstituteTree
            isVertical={false}
            getSelectedNodes={getSelectedNodes}
            hierarchyTypes={['DEPARTMENT', 'STANDARD', 'SECTION']}
          />
        </div> */}

          {errorMsg && (
            <div className={styles.errorMsgSection}>
              <Notice type="error" onCloseClick={() => setErrorMsg(null)}>
                {errorMsg}
              </Notice>
            </div>
          )}

          <div className={styles.modalContentSection}>
            <Input
              type="select"
              title={t(CLASS)}
              fieldName="class"
              value={selectedClass}
              options={instituteClasses}
              placeholder={'10'}
              onChange={(obj) => handleClassSelection(obj.value)}
              classes={{title: 'tm-para'}}
            />
            <Input
              type="select"
              title={t(SECTION)}
              fieldName="section"
              value={selectedSection}
              options={sectionOptions}
              onChange={(obj) => handleSectionSelection(obj.value)}
              disabled={!selectedClass}
              classes={{title: 'tm-para'}}
            />

            <div className={styles.dateField}>
              <div className={styles.dateFieldLabel}>{t(FROM)}</div>
              <DateField
                value={fromDate}
                handleChange={(_, value) => {
                  handleFromDateChange(value)
                }}
                fieldName="from_date"
                min={sessionStartDate}
                max={maxReportDate}
              />
            </div>

            <div className={styles.dateField}>
              <div className={styles.dateFieldLabel}>{t(TO)}</div>
              <DateField
                value={toDate}
                handleChange={(_, value) => {
                  handleToDateChange(value)
                }}
                fieldName="to_date"
                min={sessionStartDate}
                max={maxReportDate}
              />
            </div>
          </div>

          <div className={reportStyles.modalFooterSection}>
            <Button
              size="big"
              className={classNames(
                styles.higherspecifisity,
                styles.downloadBtn
              )}
              disabled={isButtonDisabled}
              onClick={getSectionStudentAttendanceOverview}
            >
              <Icon
                color="inverted"
                name="download"
                size={'xs'}
                type="filled"
              />
              {showDownloadingText ? t(DOWNLOADING) : t(DOWNLOAD_REPORT)}
            </Button>
          </div>
        </div>
      </Modal>
    </ErrorBoundary>
  )
}

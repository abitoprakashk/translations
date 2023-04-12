import React, {useEffect, useState} from 'react'
import styles from './AttendanceOverview.module.css'
import {
  ATTENDANCE_INSTITUTE_TABLE_HEADERS,
  ATTENDANCE_INSTITUTE_TABLE_MOBILE_HEADERS,
} from '../../../../constants/attendance.constants'
import {Table} from '@teachmint/common'
import UserProfile from '../../../Common/UserProfile/UserProfile'
import {useDispatch, useSelector} from 'react-redux'
import {instituteHierarchyAction} from '../../../../redux/actions/instituteInfoActions'
import {handleHierarchyOpenClose} from '../../../../utils/HierarchyHelpers'
import {schoolSystemScreenSelectedAction} from '../../../../redux/actions/schoolSystemAction'
import {SCN_SECTION} from '../../../../utils/SchoolSetupConstants'
import {sidebarData} from '../../../../utils/SidebarItems'
import history from '../../../../history'
import SearchBox from '../../../Common/SearchBox/SearchBox'
import {events} from '../../../../utils/EventsConstants'
import appStyles from '../../../../App.module.css'
import {getRequestStatusLabel} from '../../../../utils/Helpers'
import SliderSectionAttendance from '../../../SchoolSystem/SectionDetails/SliderSectionAttendance/SliderSectionAttendance'
import {utilsGetSectionDetails} from '../../../../routes/instituteSystem'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../../redux/actions/commonAction'
import {useTranslation} from 'react-i18next'
import ErrorBoundary from '../../../ErrorBoundary/ErrorBoundary'
import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'
import {IS_MOBILE} from '../../../../constants'
import {STUDENT_ATTENDANCE_REPORT_CLICK_FROM_CLASSROOM_ATTENDANCE} from '../../../../pages/AttendanceReport/AttendanceReport.events.constant'
import Permission from '../../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'

export default function AttendanceOverview({attendanceData, selectedDate}) {
  const [filteredData, setFilteredData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [sliderScreen, setSliderScreen] = useState(null)
  const [sectionDetails, setSectionDetails] = useState({})
  const {t} = useTranslation()

  const dispatch = useDispatch()
  const {instituteInfo, instituteHierarchy, eventManager} = useSelector(
    (state) => state
  )
  useEffect(() => {
    setFilteredData(attendanceData?.sectionEntries)
  }, [attendanceData])

  const setToastData = (type, message) => dispatch(showToast({type, message}))

  const openSectionDetails = (sectionId) => {
    history.push(sidebarData.SCHOOL_SETUP.route)
    dispatch(schoolSystemScreenSelectedAction(SCN_SECTION))
    dispatch(
      instituteHierarchyAction(
        handleHierarchyOpenClose(instituteHierarchy, sectionId)
      )
    )
  }

  const getSectionDetails = (sectionID) => {
    if (instituteInfo?._id && sectionID) {
      dispatch(showLoadingAction(true))
      utilsGetSectionDetails(instituteInfo._id, sectionID)
        .then(({status, obj}) => {
          if (status) {
            setSectionDetails(obj)
          } else setToastData('error', t('unableToGetSectionDetails'))
        })
        .then(() => {
          setSliderScreen(true)
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  let inactiveClasses = []
  instituteHierarchy?.children
    .filter((ele) => ele.type === 'DEPARTMENT')
    .forEach(({children}) =>
      children.forEach(({name, status}) => {
        if (status === 2) inactiveClasses.push(name)
      })
    )

  const getRows = (attendance) => {
    let rows = []

    let classesWithStudents = attendance?.filter(
      ({present_students, absent_students, no_of_students}) =>
        present_students + absent_students > 0 || no_of_students > 0
    )
    let classesWithoutAttendance = classesWithStudents?.filter(
      ({present_students, absent_students}) =>
        (present_students || 0) + (absent_students || 0) === 0
    )
    let classesWithAttendance = classesWithStudents?.filter(
      ({present_students, absent_students}) =>
        (present_students || 0) + (absent_students || 0) > 0
    )

    const getSortedClasses = (unsortedClasses) => {
      return unsortedClasses?.sort((a, b) => {
        return `${a?.section_info?.class_name} - ${a?.section_info?.section_name}`?.localeCompare(
          `${b?.section_info?.class_name} - ${b?.section_info?.section_name}`,
          undefined,
          {
            numeric: true,
            sensitivity: 'base',
          }
        )
      })
    }

    getSortedClasses(classesWithAttendance)
    getSortedClasses(classesWithoutAttendance)
    let classesToShow = classesWithoutAttendance?.concat(classesWithAttendance)

    classesToShow?.forEach(
      ({
        _id,
        class_teacher,
        present_students,
        absent_students,
        section_info,
        no_of_students,
      }) => {
        const totalAttendedStudents =
          (present_students || 0) + (absent_students || 0)

        rows.push({
          _id,
          classSection: !inactiveClasses.includes(section_info?.class_name) ? (
            <div className="tm-hdg tm-hdg-14">{`${section_info?.class_name} - ${section_info?.section_name}`}</div>
          ) : (
            <div className="flex items-center mt-1">
              <div className="tm-hdg tm-hdg-14">{`${section_info?.class_name} - ${section_info?.section_name}`}</div>
              {
                <>
                  <span className={appStyles.dotDiv}></span>
                  {getRequestStatusLabel(4)}
                </>
              }
            </div>
          ),
          classTeacher: class_teacher?._id ? (
            <UserProfile
              image={class_teacher?.img_url}
              name={class_teacher?.name}
              phoneNumber={class_teacher?.phone_number}
              joinedState={class_teacher?.verification_status}
            />
          ) : (
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.instituteClassController_assignClassTeacher_update
              }
            >
              <div
                className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
                onClick={() => {
                  openSectionDetails(_id)
                  eventManager.send_event(
                    events.ADD_CLASS_TEACHER_CLICKED_TFI,
                    {
                      screen: 'classroom_attendance_overview',
                    }
                  )
                }}
              >
                + Add class teacher
              </div>
            </Permission>
          ),
          totalStudents: (
            <div className="tm-hdg tm-hdg-14">
              {totalAttendedStudents || no_of_students}
            </div>
          ),
          attendancePersent:
            totalAttendedStudents > 0 ? (
              <div className="tm-hdg tm-hdg-14">
                {(
                  ((present_students || 0) /
                    Math.max(totalAttendedStudents, 1)) *
                  100
                ).toFixed(0)}
                %
              </div>
            ) : (
              <div className="flex items-center">
                <img
                  src="https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg"
                  alt=""
                  className="w-4 h-4 mr-2"
                />
                <div className="tm-hdg-14 tm-cr-rd-1">{t('notMarked')}</div>
              </div>
            ),
          settings: (
            <div
              className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
              onClick={() => {
                eventManager.send_event(events.VIEW_ATTENDANCE_CLICKED_TFI, {
                  class_id: _id,
                })
                getSectionDetails(_id)
              }}
            >
              {totalAttendedStudents > 0 ? 'View' : 'Mark'}
            </div>
          ),
        })
      }
    )
    return rows
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)
    if (text === '') setFilteredData(attendanceData?.sectionEntries)
    else {
      let tempArray = attendanceData?.sectionEntries?.filter(
        ({section_info, class_teacher}) =>
          `${section_info?.class_name} - ${section_info?.section_name}`
            ?.toLowerCase()
            ?.includes(text?.toLowerCase()) ||
          class_teacher?.name?.toLowerCase()?.includes(text?.toLowerCase())
      )
      setFilteredData(tempArray)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        <div>
          <div className="tm-hdg tm-hdg-18">{t('detailedReport')}</div>
          <div className="tm-para tm-para-14">
            {t('overallAttendanceForSection')}
          </div>
        </div>
        <div>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.attendanceReportController_report_read
            }
          >
            <Button
              size={BUTTON_CONSTANTS.SIZE.SMALL}
              onClick={() => {
                history.push(sidebarData.ATTENDANCE_REPORTS.route)
                eventManager.send_event(
                  STUDENT_ATTENDANCE_REPORT_CLICK_FROM_CLASSROOM_ATTENDANCE
                )
              }}
              prefixIcon="graph1"
              type="outline"
              prefixIconVersion={BUTTON_CONSTANTS.ICON_VERSION.FILLED}
              classes={{
                button: styles.reportButton,
                prefixIcon: styles.prefixIcon,
              }}
            >
              {IS_MOBILE ? t('reports') : t('viewReports')}
            </Button>
          </Permission>
        </div>
      </div>

      <div className="w-full lg:w-96 mt-3">
        <SearchBox
          value={searchText}
          placeholder={t('searchForClassSectionOrClassTeacher')}
          handleSearchFilter={handleSearchFilter}
        />
      </div>

      <div className="hidden lg:block">
        <Table
          rows={getRows(filteredData)}
          cols={ATTENDANCE_INSTITUTE_TABLE_HEADERS}
        />
      </div>

      <div className="lg:hidden">
        <Table
          rows={getRows(filteredData)}
          cols={ATTENDANCE_INSTITUTE_TABLE_MOBILE_HEADERS}
        />
      </div>

      {sliderScreen && (
        <ErrorBoundary>
          <SliderSectionAttendance
            setSliderScreen={setSliderScreen}
            sectionDetails={sectionDetails}
            initialDate={selectedDate}
          />
        </ErrorBoundary>
      )}
    </div>
  )
}

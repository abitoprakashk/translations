import React, {useEffect, useState} from 'react'
import {DateTime} from 'luxon'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {checkSubscriptionType} from '../../../utils/Helpers'
import {DASHBOARD} from '../../../utils/SidebarItems'
import {events} from '../../../utils/EventsConstants'
import {
  showFeatureLockAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {utilsGetInstituteSectionList} from '../../../routes/instituteSystem'
import {utilsGetInstituteStudentAttendanceOverview} from '../../../routes/attendance.route'
import {
  getNodesListOfSimilarType,
  isHierarchyAvailable,
} from '../../../utils/HierarchyHelpers'

export default function AttendanceStatistics() {
  const {eventManager, instituteAllClasses, instituteHierarchy, instituteInfo} =
    useSelector((state) => state)
  const [attendanceData, setAttendanceData] = useState(null)
  const [isAttendanceAvailable, setIsAttendanceAvailable] = useState(false)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const isPremium = checkSubscriptionType(instituteInfo)

  const allClassrooms = isHierarchyAvailable(instituteHierarchy)
    ? getNodesListOfSimilarType(instituteHierarchy, SHC.NODE_SECTION)?.length
    : instituteAllClasses?.length

  const getInstituteStudentAttendanceOverview = async () => {
    dispatch(showLoadingAction(true))
    const sectionList = await utilsGetInstituteSectionList().catch(() => {})

    if (sectionList?.status) {
      utilsGetInstituteStudentAttendanceOverview(
        DateTime.fromFormat(
          DateTime.now().toFormat('yyyy-MM-dd'),
          'yyyy-MM-dd'
        ).toUnixInteger()
      )
        .then(({status, obj, error_code}) => {
          setIsAttendanceAvailable(status)
          if (status || error_code === 7023) {
            let attendance = {
              present: 0,
              absent: 0,
              sectionEntries: [],
              totalStudents: 0,
              captured_sections_count: Object.keys(obj).length,
            }
            Object.keys(sectionList?.obj)?.forEach((section) => {
              if (obj?.[section]) {
                const key = Object.keys(obj?.[section])[0]
                const item = obj?.[section][key]
                attendance.present += item?.present_students
                attendance.absent += item?.absent_students
                attendance.sectionEntries?.push({
                  _id: section,
                  ...item,
                  ...sectionList?.obj?.[section],
                })
                attendance.totalStudents +=
                  sectionList?.obj?.[section]?.no_of_students
              } else {
                attendance.sectionEntries?.push({
                  _id: section,
                  ...sectionList?.obj?.[section],
                })
                attendance.totalStudents +=
                  sectionList?.obj?.[section]?.no_of_students
              }
            })
            setAttendanceData({...attendance})
          } else throw ''
        })
        .catch(() => {})
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  useEffect(() => {
    getInstituteStudentAttendanceOverview()
  }, [])

  const attendanceStats = [
    {
      title: t('classesMarked'),
      value:
        (attendanceData?.captured_sections_count || 0) + '/' + allClassrooms,
    },
    {
      title: t('totalPresent'),
      value: isAttendanceAvailable ? attendanceData?.present : '-',
    },
    {
      title: t('totalAbsent'),
      value: isAttendanceAvailable ? attendanceData?.absent : '-',
    },
    {
      title: t('overallAttendance'),
      value: isAttendanceAvailable
        ? `${(
            (attendanceData?.present /
              Math.max(attendanceData?.present + attendanceData?.absent, 1)) *
            100
          ).toFixed(0)}%`
        : '-',
    },
  ]

  const handleOnClickViewDetails = () => {
    if (isPremium)
      trackEvent(events.VIEW_ATTENDANCE_DETAILS_TFI, null, 'UNLOCKED')
    else {
      trackEvent(events.VIEW_FEES_DETAILS_TFI, null, 'LOCKED')
      dispatch(showFeatureLockAction(true))
    }
  }

  const trackEvent = (type, status) => {
    let payload = {
      status,
      screen_name: 'DASHBOARD_STATISTICS',
    }
    if (type) {
      payload = {...payload, type}
    }
    eventManager.send_event(
      events.VIEW_ATTENDANCE_STATISTICS_CLICKED_TFI,
      payload
    )
  }

  return (
    <div className="w-full justify-between px-4 py-1 lg:px-0 lg:pt-0">
      <div className="w-full flex flex-row justify-between items-end">
        <div className="flex items-center">
          <div className="tm-h7 flex justify-start">
            {t('studentAttendanceTitle')}
          </div>
        </div>
        <div className="relative">
          <Link
            className="tm-para3 tm-color-blue"
            to={
              isPremium
                ? '/institute/dashboard/attendance/classroom'
                : DASHBOARD
            }
            onClick={handleOnClickViewDetails}
          >
            <div className="flex items-center">
              {!isPremium && (
                <img
                  className="h-4 lg:mr-2 mb-0.5 w-3.5"
                  alt="card-icon"
                  src="https://storage.googleapis.com/tm-assets/icons/secondary/lock-secondary.svg"
                />
              )}
              <div>{t('viewDetails')}</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-white my-4 tm-border-radius1 tm-box-shadow1">
        <div
          className={`flex flex-row flex-wrap justify-between ${
            !isPremium ? 'cursor-pointer relative' : ''
          }`}
          onClick={() => {
            if (isPremium) trackEvent(null, 'UNLOCKED')
            else {
              trackEvent(null, 'LOCKED')
              dispatch(showFeatureLockAction(true))
            }
          }}
        >
          {attendanceStats.map(({title, value}) => (
            <div
              className="tm-dashboard-statistics-card w-6/12 px-3 my-3 lg:w-1/4"
              key={title}
            >
              <div className="w-full flex flex-row">
                <div className="tm-h4">{value}</div>
                <div className=""></div>
              </div>
              <div className="tm-para3">{title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

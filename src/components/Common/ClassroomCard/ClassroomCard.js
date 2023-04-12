import React from 'react'
import ImgText from '../ImgText/ImgText'
import clockIcon from '../../../assets/images/icons/clock-gray.svg'
import classroomIcon from '../../../assets/images/icons/classroom-gray.svg'
import studentOrangeIcon from '../../../assets/images/icons/student-orange.svg'
import studentIcon from '../../../assets/images/icons/sidebar/students.svg'
import calendarIcon from '../../../assets/images/icons/calendar-gray.svg'
import studentGreenIcon from '../../../assets/images/icons/student-green.svg'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../redux/actions/commonAction'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {
  getBrowserName,
  getClassroomDays,
  getRequestStatusLabel,
  getTodayTiming,
  getUniqueItems,
} from '../../../utils/Helpers'
import arrowIcon from '../../../assets/images/icons/right-arrow-blue.svg'
import {events} from '../../../utils/EventsConstants'
import Label from '../Label/Label'
import {utilsGetLiveClassDetails} from '../../../routes/dashboard'
import {getFromSessionStorage} from '../../../utils/Helpers'
import {BROWSER_STORAGE_KEYS} from '../../../constants/institute.constants'

const {REACT_APP_BASE_URL} = process.env

export default function ClassroomCard({
  item,
  isTime = true,
  instituteId,
  activeTab,
}) {
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()

  const {t} = useTranslation()

  const trackEvent = (eventName, classId, screenName) => {
    let data = {}
    if (classId) data = {classId}
    if (screenName) data = {...data, screen_name: screenName}
    eventManager.send_event(eventName, data)
  }

  const weekDaysDiv = (
    <ImgText
      icon={isTime ? clockIcon : calendarIcon}
      text={
        isTime
          ? getTodayTiming(item.timetable)
          : getClassroomDays(item.timetable)
      }
    />
  )

  const openLiveClass = (classroomId) => {
    dispatch(showLoadingAction(true))
    utilsGetLiveClassDetails(instituteInfo?._id, classroomId)
      .then(({status, obj}) => {
        if (status && obj?.url) window.open(obj.url)
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const studentsCountDiv =
    activeTab === 'COMPLETED' ? (
      <ImgText
        icon={studentGreenIcon}
        // text={`${item?.attended_students || 0}/${
        //   item.no_of_students + item.no_of_pending_students || 0
        // } Attended`}

        // text={
        //   <Trans i18nKey="studentCountCompletedGreeIcon">
        //     {item?.attended_students || 0} /
        //     {item.no_of_students + item.no_of_pending_students || 0} Attended
        //   </Trans>
        // }

        text={`${item?.attended_students || 0}/${
          item.no_of_students + item.no_of_pending_students || 0
        } ${t('attended')}`}
        textStyle={'tm-color-green'}
      />
    ) : (
      <ImgText
        icon={studentOrangeIcon}
        // text={`${item.no_of_students + item.no_of_pending_students} Students`}

        // text={
        //   <Trans i18nKey="studentCountOrangeIcon">
        //     {item.no_of_students + item.no_of_pending_students} Students
        //   </Trans>
        // }

        text={`${item.no_of_students + item.no_of_pending_students} ${t(
          'students'
        )}`}
        textStyle={'tm-color-orange'}
      />
    )

  return (
    <div className="bg-white tm-border-radius1 px-3 py-3 mb-3 lg:p-4">
      <div className="lg:flex lg:flex-row lg:justify-between lg:items-start">
        <div>
          <div className="tm-para1 tm-color-text-primary">{item.name}</div>
          <div className="flex flex-row mt-2 flex-wrap">
            {(
              (item.subject && getUniqueItems(item.subject.split(','))) ||
              []
            ).map((item, index) => (
              <div className="tm-subject-tag mr-2 mb-2" key={index}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row lg:justify-between mt-1 lg:mt-0">
          {item.no_of_pending_students > 0 && (
            <>
              <ImgText
                icon={studentIcon}
                // text={`${item.no_of_pending_students}/${
                //   item.no_of_students + item.no_of_pending_students
                // } Students`}

                // text={
                //   <Trans i18nKey="noOfPendingStudent">
                //     {item.no_of_pending_students}/
                //     {item.no_of_students + item.no_of_pending_students} Students
                //   </Trans>
                // }

                text={`${item.no_of_pending_students}/${
                  item.no_of_students + item.no_of_pending_students
                } ${t('students')}`}
              />
              <div className="ml-3">
                <Label
                  text={t('pendingLabel')}
                  textStyle="tm-color-red tm-bg-light-red"
                />
              </div>
            </>
          )}

          <div className="ml-6 hidden lg:block">{studentsCountDiv}</div>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-3 lg:mt-1">
        <div className="flex items-center">
          <ImgText
            icon={classroomIcon}
            text={(item.teacher && item.teacher.name) || item.teacher_name}
          />
          <div className="ml-3">
            {item &&
              item.teacher &&
              getRequestStatusLabel(item.teacher.verification_status)}
          </div>
          <div className="hidden ml-6 lg:block"> {weekDaysDiv}</div>
        </div>
        <div className="flex items-center">
          <div
            className="items-center hidden lg:flex cursor-pointer"
            onClick={() => {
              trackEvent(events.VIEW_CLASSROOM_CLICKED, null, 'CLASSROOM_PAGE')
              window.open(
                `${REACT_APP_BASE_URL}classroom/${instituteId}/${
                  item._id
                }?admin_uuid=${getFromSessionStorage(
                  BROWSER_STORAGE_KEYS.ADMIN_UUID
                )}`
              )
            }}
          >
            <div className="tm-h6 tm-color-blue">{t('viewClassroom')}</div>

            <img src={arrowIcon} alt="view" className="w-4 h-4" />
          </div>
          {item.is_live && (
            <div
              className={`tm-btn2-white-blue hidden lg:flex flex-row items-center ml-4 ${
                ['Chrome', 'Edge'].includes(getBrowserName())
                  ? ''
                  : 'opacity-40'
              }`}
              onClick={() => {
                trackEvent(events.JOIN_LIVE_CLASS_CLICKED_TFI, item._id)
                if (['Chrome', 'Edge'].includes(getBrowserName()))
                  openLiveClass(item._id)
              }}
            >
              <div className="tm-red-dot mr-2"></div>
              {t('joinLive')}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row mt-3 lg:m-0 justify-between">
        <div className="lg:hidden"> {weekDaysDiv}</div>
        <div className="ml-4 lg:hidden">{studentsCountDiv}</div>
      </div>
    </div>
  )
}

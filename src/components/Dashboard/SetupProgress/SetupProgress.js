import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './SetupProgress.module.css'
import {t} from 'i18next'
import PendingTeachers from './PendingTeachers/PendingTeachers'
import PendingStudents from './PendingStudents/PendingStudents'
import PendingAdmins from './PendingAdmins/PendingAdmins'
import ClassteachersNotAssigned from './ClassteachersNotAssigned/ClassteachersNotAssigned'
import {SLIDERS_NAME} from './constants'
import classNames from 'classnames'
import {events} from '../../../utils/EventsConstants'
import {getActiveTeachers} from '../../../redux/reducers/CommonSelectors'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {BUTTON_CONSTANTS, EmptyState, Icon, Tooltip} from '@teachmint/krayon'
import {sidebarData} from '../../../utils/SidebarItems'
import WidgetShimmer from '../WidgetShimmer/WidgetShimmer'
import NoSetupComponent from './ClassteachersNotAssigned/components/NoSetupComponent'
import {Link} from 'react-router-dom'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import {checkSubscriptionType} from '../../../utils/Helpers'
import Permission from '../../Common/Permission/Permission'

export default function SetupProgress({getData}) {
  const [setupProgressSlider, setSetupProgressSlider] = useState(null)
  const {eventManager, sidebar, instituteInfo} = useSelector((state) => state)
  const usersPermission = useSelector(
    (state) => state?.globalData?.userRolePermission?.data?.permission_ids
  )
  const {data, error, loaded} = useSelector(
    (state) => state?.globalData?.getSetupProgressWidget
  )
  const dispatch = useDispatch()
  const instituteTeacherList = getActiveTeachers(true)
  const isPremium = checkSubscriptionType(instituteInfo)
  const checkPermission = (permissionId) => {
    return usersPermission?.includes(permissionId) ? true : false
  }

  const totalPendingItems = {
    pendingTeachers: {
      num: 1,
      title: t('notJoined'),
      titleComplete: t('allJoined'),
      value: data?.pending_teachers?.length,
      joinedValue: data?.active_teachers?.length,
      totalValue:
        data?.pending_teachers?.length + data?.active_teachers?.length,
      audience: t('teachers'),
      noSetupMsg: t('pleaseAddTeachersMsg'),
      isVisible:
        sidebar?.allowedMenus?.has(sidebarData.TEACHER_DIRECTORY.id) &&
        data?.pending_teachers &&
        data?.pending_teachers?.length,
      onClick: () => {
        setSetupProgressSlider(SLIDERS_NAME.PENDING_TEACHERS)
        eventManager.send_event(events.TEACHER_ONBOARDING_CLICKED_TFI)
      },
      widgetCardRedirectLink: sidebarData.TEACHER_DIRECTORY.route,
      redirectEventName: events.TEACHERS_CLICKED_TFI,

      permissionId:
        PERMISSION_CONSTANTS.InstituteUserController_getTeacherDirectory_read, // based on user's permission this button will be disabled
    },
    pendingStudents: {
      num: 2,
      title: t('notJoined'),
      titleComplete: t('allJoined'),
      value: data?.pending_students?.length,
      joinedValue: data?.active_students?.length,
      totalValue:
        data?.pending_students?.length + data?.active_students?.length,
      audience: t('students'),
      noSetupMsg: t('pleaseAddStudentsMsg'),
      isVisible:
        sidebar?.allowedMenus?.has(sidebarData.STUDENT_DIRECTORY.id) &&
        data?.pending_students &&
        data?.pending_students?.length,
      onClick: () => {
        setSetupProgressSlider(SLIDERS_NAME.PENDING_STUDENTS)
        eventManager.send_event(events.STUDENTS_ONBOARDING_CLICKED_TFI)
      },
      widgetCardRedirectLink: sidebarData.STUDENT_DIRECTORY.route,
      redirectEventName: events.STUDENTS_CLICKED_TFI,

      permissionId:
        PERMISSION_CONSTANTS.InstituteUserController_getStudentDirectory_read,
    },
    classteacherNotAssigned: {
      num: 3,
      title: t('notAssigned'),
      titleComplete: t('allAssigned'),
      value: (data && Object.keys(data?.unassigned_sections)?.length) || 0,
      joinedValue: (data && Object.keys(data?.remaining_sections)?.length) || 0,
      totalValue:
        data &&
        Object.keys(data?.unassigned_sections)?.length +
          Object.keys(data?.remaining_sections)?.length,
      audience: t('classTeachers'),
      noSetupMsg: t('pleaseClassTeachersMsg'),
      isVisible:
        data &&
        Object.keys(data?.unassigned_sections)?.length +
          Object.keys(data?.remaining_sections) &&
        instituteTeacherList.length,
      onClick: () => {
        setSetupProgressSlider(SLIDERS_NAME.CLASSTEACHERS_NOT_ASSIGNED)
        eventManager.send_event(events.CLASS_TEACHER_ONBOARDING_CLICKED_TFI)
      },
      widgetCardRedirectLink: sidebarData.SCHOOL_SETUP.route,
      redirectEventName: events.ACADEMICS_CLICKED_TFI,
      permissionId:
        PERMISSION_CONSTANTS.instituteClassController_assignClassTeacher_update,
    },
    pendingAdmins: {
      num: 4,
      title: t('notJoined'),
      titleComplete: t('allJoined'),
      value: data?.pending_admins?.length,
      joinedValue: data?.active_admins?.length,
      totalValue: data?.pending_admins?.length + data?.active_admins?.length,
      audience: t('admins'),
      noSetupMsg: t('pleaseAddAdminsMsg'),
      isVisible: sidebar?.allowedMenus?.has(sidebarData.ADMIN.id),
      onClick: () => {
        setSetupProgressSlider(SLIDERS_NAME.PENDING_ADMINS)
        eventManager.send_event(events.ADMINS_ONBOARDING_CLICKED_TFI, {
          screen_name: 'dashboard',
          no_of_pending_admins: data?.pending_admins?.length,
        })
      },
      widgetCardRedirectLink: sidebarData.ADMIN.route,
      redirectEventName: events.PEOPLE_CLICKED_TFI,

      permissionId:
        isPremium && PERMISSION_CONSTANTS.InstituteAdminController_get_read, // based on user's permission this button will be disabled
    },
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case SLIDERS_NAME.PENDING_TEACHERS:
        return (
          <PendingTeachers
            setSliderScreen={setSetupProgressSlider}
            pendingTeachers={data?.pending_teachers}
          />
        )
      case SLIDERS_NAME.PENDING_STUDENTS:
        return (
          <PendingStudents
            setSliderScreen={setSetupProgressSlider}
            pendingStudents={data?.pending_student_sections}
            allPendingTeachersIds={Object.keys(
              data?.pending_student_sections
            ).map(
              (sectionId) =>
                data?.pending_student_sections[sectionId].class_teacher._id
            )}
            getPendingStudentList={data?.pending_student_sections}
            getSliderScreen={getSliderScreen}
          />
        )
      case SLIDERS_NAME.CLASSTEACHERS_NOT_ASSIGNED:
        return (
          <ClassteachersNotAssigned
            setSliderScreen={setSetupProgressSlider}
            getUnassignedClassTeachersToSection={data?.unassigned_sections}
            getData={getData}
          />
        )
      case SLIDERS_NAME.PENDING_ADMINS:
        return (
          <PendingAdmins
            setSliderScreen={setSetupProgressSlider}
            pendingAdmins={data?.pending_admins}
          />
        )
      default:
        break
    }
  }

  const getContent = () => {
    if (!isPremium) {
      showFeatureLockAction()
    }
    if (error) {
      return (
        <div className={styles.errorWrapper}>
          <EmptyState
            iconName="error"
            content={t('unableToLoadData')}
            button={{
              size: BUTTON_CONSTANTS.SIZE.SMALL,
              version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
              children: t('tryAgain'),
              type: BUTTON_CONSTANTS.TYPE.TEXT,
              prefixIcon: 'refresh',
              onClick: () => getData(),
            }}
            classes={{iconFrame: styles.iconFrame}}
          />
        </div>
      )
    } else {
      if (!loaded) {
        return (
          <div className={styles.setupShimmerContainer}>
            <WidgetShimmer shimmerCount={4} />
          </div>
        )
      } else if (loaded) {
        return Object.keys(totalPendingItems).map((key) =>
          totalPendingItems[key]?.totalValue > 0 ? (
            <div
              key={totalPendingItems[key].title}
              className={classNames(
                `tm-border-radius1 tm-box-shadow1`,
                styles.setup_card
              )}
            >
              <Permission
                key={key}
                permissionId={totalPendingItems[key].permissionId}
              >
                <Link
                  className={classNames(
                    styles.setup_card_content_numbers_container
                  )}
                  to={
                    checkPermission(totalPendingItems[key].permissionId)
                      ? totalPendingItems[key].widgetCardRedirectLink
                      : '#'
                  }
                  onClick={() => {
                    !checkPermission(totalPendingItems[key].permissionId)
                      ? dispatch(showFeatureLockAction(true))
                      : eventManager.send_event(
                          totalPendingItems[key].redirectEventName,
                          {screen_name: 'dashboard'}
                        )
                  }}
                >
                  <div
                    className={classNames(
                      'tm-h4',
                      styles.setup_card_content_numbers
                    )}
                  >
                    {totalPendingItems[key].joinedValue || 0}
                    <div
                      className={classNames(
                        'tm-h6',
                        styles.setup_card_content_numbers,
                        styles.setup_card_content_numbers_secondary
                      )}
                    >
                      {totalPendingItems[key].value
                        ? '/' + (totalPendingItems[key].totalValue || 0)
                        : ''}
                    </div>
                  </div>
                  <div className="tm-para1 tm-color-text-primary">
                    <Icon
                      className={styles.setup_card_content_img}
                      name="forwardArrow"
                      size="large"
                    />
                  </div>
                </Link>
                <div>
                  <div className={`${styles.audienceText} tm-para4`}>
                    {totalPendingItems[key].audience}
                  </div>
                </div>
                <div
                  className={styles.setup_card_content_text}
                  onClick={
                    checkPermission(totalPendingItems[key].permissionId) &&
                    totalPendingItems[key].value
                      ? totalPendingItems[key].onClick
                      : () => {}
                  }
                >
                  <div
                    data-tip
                    data-for={key}
                    className={`tm-para4 ${
                      totalPendingItems[key].value
                        ? styles.color_caution
                        : styles.color_joined
                    }`}
                  >
                    {`${
                      totalPendingItems[key].value
                        ? `${totalPendingItems[key].value} ${totalPendingItems[key].title}`
                        : `${totalPendingItems[key].titleComplete}`
                    }`}
                    {totalPendingItems[key].value ? (
                      <Tooltip
                        toolTipId={key}
                        toolTipBody={t('viewList')}
                        className={styles.toolTipCustom}
                        place="top"
                        effect="solid"
                      />
                    ) : null}
                  </div>
                </div>
              </Permission>
            </div>
          ) : (
            <div key={key} className={classNames(styles.setup_card)}>
              <Permission permissionId={totalPendingItems[key].permissionId}>
                <NoSetupComponent
                  message={totalPendingItems[key].noSetupMsg}
                  path={totalPendingItems[key].widgetCardRedirectLink}
                />
              </Permission>
            </div>
          )
        )
      }
    }
  }

  useEffect(() => {
    getContent()
  }, [loaded])

  return (
    <>
      <div className={`${styles.setup_container}`}>{getContent()}</div>
      <div>{getSliderScreen(setupProgressSlider)}</div>
    </>
  )
}

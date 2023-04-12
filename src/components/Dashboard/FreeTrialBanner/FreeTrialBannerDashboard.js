import freeTrialBannerImage from '../../../assets/images/dashboard/free-trial-banner.svg'
import {useDispatch, useSelector} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {
  utilsRegisterForFreeTrial,
  utilsResendReminder,
  utilsGetInstituteList,
} from '../../../routes/dashboard'
import {
  instituteHierarchyAction,
  instituteInfoAction,
} from '../../../redux/actions/instituteInfoActions'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {showFreeTrialCongratsAction} from '../../../redux/actions/commonAction'
import {events} from '../../../utils/EventsConstants'
import {useState, useEffect} from 'react'
import {sidebarData} from '../../../utils/SidebarItems'
import history from '../../../history'
import successIcon from '../../../assets/images/icons/tick-bg-green.svg'
import AcknowledgementPopup from '../../Common/AcknowledgementPopup/AcknowledgementPopup'
import {
  getUpdatedInstituteInfoFromInstituteList,
  getDifferenceBetweenDateNToday,
  getTeacherInviteMsg,
} from '../../../utils/Helpers'
import {
  getNodesListOfSimilarType,
  handleHierarchyOpenClose,
  isHierarchyAvailable,
} from '../../../utils/HierarchyHelpers'
import {NODE_SUBJECT} from '../../../utils/SchoolSetupConstants'
import {schoolSystemScreenSelectedAction} from '../../../redux/actions/schoolSystemAction'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import * as SHC from '../../../utils/SchoolSetupConstants'
import styles from './FreeTrialBannerDashboard.module.css'
import classNames from 'classnames'

export default function FreeTrialBannerDashboard() {
  const [bannerType, setBannerType] = useState(-1)
  const [showRemindPopup, setShowRemindPopup] = useState(false)
  const {
    instituteInfo,
    adminInfo,
    eventManager,
    instituteTeacherList,
    instituteAllClasses,
    instituteStudentList,
    instituteHierarchy,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  let [totalTeachers, totalClassrooms, totalTeachersJoined, totalStudents] = [
    null,
    null,
    null,
    null,
  ]

  if (instituteTeacherList && instituteAllClasses && instituteStudentList) {
    totalTeachers = instituteTeacherList.length
    totalClassrooms = instituteAllClasses.length
    totalTeachersJoined = instituteTeacherList.filter((item) => {
      return !(item.verification_status === 2 || item.verification_status === 3)
    }).length
    totalStudents = instituteStudentList.length
  }

  const redirectToRoutes = (type) => {
    let pageId = ''
    switch (type) {
      case 'teacher':
        pageId = SHC.SCN_TEACHER_DIRECTORY
        history.push(sidebarData.TEACHER_DIRECTORY.route)
        break
      case 'student':
        pageId = SHC.SCN_STUDENT_DIRECTORY
        history.push(sidebarData.STUDENT_DIRECTORY.route)
        break
      case 'classroom':
        if (isHierarchyAvailable(instituteHierarchy))
          pageId = SHC.SCN_SCHOOL_SETUP
        else pageId = SHC.SCN_CLASSROOM_PAGE
        history.push(sidebarData.SCHOOL_SETUP.route)
        break
      default:
        break
    }

    dispatch(schoolSystemScreenSelectedAction(pageId))
    if (isHierarchyAvailable(instituteHierarchy))
      dispatch(
        instituteHierarchyAction(
          handleHierarchyOpenClose(
            instituteHierarchy,
            SHC.NODE_SCHOOL_SYSTEM_OVERVIEW
          )
        )
      )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      getTeacherInviteMsg(
        adminInfo.name,
        instituteInfo._id,
        instituteInfo.name,
        adminInfo._id,
        instituteInfo.institute_type
      )
    )
    dispatch(
      showToast({
        type: 'success',
        // message: CONSTS_DASHBOARD.LINK_COPIED,{t('linkCopied')}
        message: t('linkCopied'),
      })
    )
  }

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        text: getTeacherInviteMsg(
          adminInfo.name,
          instituteInfo._id,
          instituteInfo.name,
          adminInfo._id,
          instituteInfo.institute_type
        ),
      })
    } else {
      handleCopyLink()
    }
  }

  const bannerTypes = [
    {
      title: t('setupYourDigitalInstitute'),
      desc: t('bannerTypesAddTeacherDesc'),
      btnText: t('addTeacher'),
      onClick: () => redirectToRoutes('teacher'),
      eventName: events.ADD_TEACHER_CLICKED,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('setupYourDigitalInstitute'),
      desc: t('bannerTypesRemindTeachersDesc'),
      btnText: t('remindTeachers'),
      onClick: () => {
        utilsResendReminder(instituteInfo._id)
        setShowRemindPopup(true)
      },
      eventName: events.REMIND_TEACHER_TFI,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('setupYourDigitalInstitute'),
      desc: t('bannerTypesAddStudentsDesc'),
      btnText: t('addStudents'),
      onClick: () => redirectToRoutes('student'),
      eventName: events.ADD_STUDENT_CLICKED_TFI,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('setupYourDigitalInstitute'),
      desc:
        totalTeachersJoined > 0 ? (
          <Trans i18nKey="bannerTypesCreateClassroomDynamicDesc">
            Congratulations!! {{totalTeachersJoined}} out of {{totalTeachers}}{' '}
            teacher{totalTeachers > 1 ? 's ' : ' '}
            {totalTeachersJoined > 1 ? 'have' : 'has'} joined your digital
            institute. Create your first digital classroom. You can also add
            more teachers in the Teachers section
          </Trans>
        ) : (
          t('bannerTypesCreateClassroomDesc')
        ),
      btnText: t('createClassroom'),
      onClick: () => redirectToRoutes('classroom'),
      eventName: events.ADD_CLASSROOM_CLICKED,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('setupYourDigitalInstitute'),
      desc:
        totalTeachersJoined > 0 ? (
          <Trans i18nKey="bannerTypesAddAllYourTeachersToExpandDynamicDesc">
            {{totalTeachersJoined}} out of {{totalTeachers}} teacher
            {totalTeachers > 1 ? 's ' : ' '}
            {totalTeachersJoined > 1 ? 'have' : 'has'} joined your digital
            institute. Add all your teachers to expand your digital institute.`
          </Trans>
        ) : (
          t('addAllYourTeachersToExpandYourDigitalInstitute')
        ),

      btnText: t('addTeacher'),
      onClick: () => redirectToRoutes('teacher'),
      eventName: events.ADD_TEACHER_CLICKED,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('upgradeYourInstitute'),
      desc: t('bannerTypesTryItFreeDesc'),
      btnText: t('tryItFreeFor14Days'),
      onClick: () => handleFreeTrailClicked(),
      eventName: events.START_FREE_TRIAL_CLICKED_TFI,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('setupYourDigitalInstitute'),
      desc: t('bannerTypesStartSetupDesc'),
      btnText: t('startSetup'),
      onClick: () => redirectToRoutes('classroom'),
      eventName: events.SCHOOL_SETUP_CLICKED_TFI,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('continueSettingUpYourDigitalInstitute'),
      desc: t('bannerTypesContinueSetupDesc'),
      btnText: t('continueSetup'),
      onClick: () => redirectToRoutes('classroom'),
      eventName: events.SCHOOL_SETUP_CLICKED_TFI,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
    {
      title: t('inviteYourTeachersAndStudents'),
      desc: t('bannerTypesInviteYourTeachersAndStudentsDesc'),
      btnText: t('copyLink'),
      phnBtnText: t('inviteTeachersAndStudents'),
      onClick: handleCopyLink,
      onPhnClick: handleShareLink,
      eventName: events.LINK_COPIED_VIA_BANNER,
      eventOptions: {screen_name: 'TOP_BANNER'},
    },
  ]

  useEffect(() => {
    getCondition()
  }, [instituteTeacherList, instituteAllClasses, instituteStudentList])

  const getCondition = () => {
    let num = -1

    let diff = getDifferenceBetweenDateNToday(instituteInfo.c)
    if (diff < 15) {
      num = 8
    } else if (isHierarchyAvailable(instituteHierarchy)) {
      const subjectWithTeachers =
        getNodesListOfSimilarType(instituteHierarchy, NODE_SUBJECT)?.filter(
          ({meta}) => meta?.teacher
        )?.length || 0

      if (subjectWithTeachers === 0) num = 6
      else if (subjectWithTeachers < 10) num = 7
    } else if (
      instituteTeacherList &&
      instituteAllClasses &&
      instituteStudentList
    ) {
      if (totalTeachers === 0) num = 0
      else if (totalTeachers > 0 && totalStudents < 20) num = 2
      else if (totalClassrooms === 0) num = 3
      else if (totalTeachers < 5 && totalClassrooms > 0) num = 4
    }
    setBannerType(num)
  }

  const handleFreeTrailClicked = () => {
    dispatch(showLoadingAction(true))
    utilsRegisterForFreeTrial(instituteInfo._id)
      .then(({status}) => {
        if (status) {
          utilsGetInstituteList().then(({institutes}) =>
            dispatch(
              instituteInfoAction(
                getUpdatedInstituteInfoFromInstituteList(
                  instituteInfo,
                  institutes
                )
              )
            )
          )
          dispatch(showFreeTrialCongratsAction(true))
        }
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  if (bannerType !== -1)
    return (
      <>
        <div className="w-full justify-between px-4 py-1 lg:px-0">
          <ErrorBoundary>
            {showRemindPopup && (
              <AcknowledgementPopup
                onClose={setShowRemindPopup}
                onAction={() => setShowRemindPopup(false)}
                icon={successIcon}
                title={t('ackPopupSMSSent')}
                desc={t('ackPopupDesc')}
                primaryBtnText={t('ackPopupBtnText')}
              />
            )}
          </ErrorBoundary>
          <div
            className={classNames(
              {
                [styles.hideBannerOnPhnIfShowShareLink]:
                  bannerTypes[bannerType].phnBtnText,
              },
              'lg:flex w-full style-5'
            )}
          >
            <div className="flex pt-4 pl-8">
              <div className="lg:w-8/12 pb-2">
                <div className="tm-h1 tm-color-white">
                  {bannerTypes[bannerType].title}
                </div>
                <div className="pt-2">{bannerTypes[bannerType].desc}</div>
                {bannerTypes[bannerType].btnText && (
                  <div
                    className="tm-btn2-white-border-shadow mt-5 lg:w-56 mr-6"
                    onClick={() => {
                      bannerTypes[bannerType].onClick()
                      eventManager.send_event(
                        bannerTypes[bannerType].eventName,
                        {...bannerTypes[bannerType].eventOptions}
                      )
                    }}
                  >
                    {bannerTypes[bannerType].btnText}
                  </div>
                )}
              </div>
              <div className="w-4/12 justify-center hidden lg:flex">
                <img src={freeTrialBannerImage} height="100%" alt="" />
              </div>
            </div>
          </div>

          <div
            className={classNames(
              {
                [styles.hideBannerOnPhnIfShowShareLink]:
                  !bannerTypes[bannerType].phnBtnText,
              },
              'lg:hidden tm-btn2-blue mt-5 lg:w-56 m-auto tm-bgcr-bl-3'
            )}
            onClick={() => {
              bannerTypes[bannerType].onPhnClick()
              eventManager.send_event(bannerTypes[bannerType].eventName, {
                ...bannerTypes[bannerType].eventOptions,
              })
            }}
          >
            {bannerTypes[bannerType].phnBtnText}
          </div>
        </div>
      </>
    )
  return <></>
}

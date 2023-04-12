import React, {useRef, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Trans, useTranslation} from 'react-i18next'
import {events} from '../../../utils/EventsConstants'
import {
  checkSubscriptionType,
  getAdminSpecificFromLocalStorage,
  getTeacherInviteMsg,
} from '../../../utils/Helpers'
import instituteDefaultImg from '../../../assets/images/icons/sidebar/institute-default.svg'
import profileImg from '../../../assets/images/icons/user-profile.svg'
import {
  showErrorOccuredAction,
  showFeatureLockAction,
  showLoadingAction,
  showNotificationAction,
  showProfileDropdownAction,
  showSidebarAction,
  showToast,
  switchAdminAction,
} from '../../../redux/actions/commonAction'
import {teacherListLoadingAction} from '../../../redux/actions/instituteInfoActions'
import Notice from '../Notice/Notice'
import {
  utilsGetUsersList,
  utilsGetSupportTicketUrl,
} from './../../../routes/dashboard'
import InstituteListPopup from '../../Common/InstituteList/InsituteListPopup'
import UserProfileComponent from '../../../pages/user-profile/UserProfileComponent'
import {DASHBOARD} from '../../../utils/SidebarItems'
import {
  BROWSER_STORAGE_KEYS,
  INSTITUTE_MEMBER_TYPE,
} from '../../../constants/institute.constants'
import history from '../../../history'
import AcademicSession from './components/AcademicSession'
import OrgAcademicSession from './components/OrgAcademicSession'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown'
import {useOutsideClickHandler, isMobile} from '@teachmint/common'
import {
  Icon,
  ICON_CONSTANTS,
  Tooltip,
  TOOLTIP_CONSTANTS,
} from '@teachmint/krayon'
import styles from './Navbar.module.css'
import {Link} from 'react-router-dom'
import classNames from 'classnames'
import SubscriptionBanners from './components/SubscriptionBanners/SubscriptionBanners'
import SubscriptionPopups from './components/SubscriptionPopups/SubscriptionPopups'

export default function Navbar() {
  const [showNotice, setShowNotice] = useState(true)
  const [showInstituteListPopup, setShowInstituteListPopup] = useState(false)
  const [showInstituteProfile, setShowInstituteProfile] = useState(false)

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {
    instituteInfo,
    organisationInfo,
    adminInfo,
    eventManager,
    showProfileDropdown,
    showNotification,
    showInstituteList,
  } = useSelector((state) => state)

  const CurrentOrgId = getAdminSpecificFromLocalStorage(
    BROWSER_STORAGE_KEYS.CURRENT_ORG_ID
  )
  const instituteId = instituteInfo?._id || organisationInfo?._id

  const closeActive = true

  const showSidebar = (flag) => dispatch(showSidebarAction(flag))
  const setShowProfileDropdown = (flag) =>
    dispatch(showProfileDropdownAction(flag))
  const setShowNotification = (flag) => dispatch(showNotificationAction(flag))

  const isPremium = checkSubscriptionType(instituteInfo)

  const handleCopy = () => {
    dispatch(showToast({type: 'success', message: t('successfullyCopied')}))
    navigator &&
      navigator.clipboard.writeText(
        getTeacherInviteMsg(
          adminInfo.name,
          instituteInfo._id,
          instituteInfo.name,
          adminInfo._id,
          instituteInfo.institute_type
        )
      )
  }

  window.addEventListener('click', () => {
    if (showNotification) setShowNotification(false)
    if (showProfileDropdown) setShowProfileDropdown(false)
  })

  const handleRedirect = (props) => {
    if (isPremium) {
      dispatch(showLoadingAction(true))
      utilsGetSupportTicketUrl()
        .then(({data}) => {
          if (props) {
            window.open(data + props)
          } else {
            window.open(data)
          }
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    } else dispatch(showFeatureLockAction(true))
  }

  // const getRolesList = async (instituteId) => {
  //   dispatch(showLoadingAction(true))
  //   const response = await utilsGetAllRoles(instituteId)
  //     .catch((_err) => dispatch(showErrorOccuredAction(true)))
  //     .finally(() => dispatch(showLoadingAction(false)))
  //   return response?.data
  // }

  // const getCurrentAdminInfo = async (instituteId) => {
  //   dispatch(showLoadingAction(true))
  //   const response = await utilsGetCurrentAdmin(instituteId)
  //     .catch((_err) => dispatch(showErrorOccuredAction(true)))
  //     .finally(() => dispatch(showLoadingAction(false)))
  //   return response?.data
  // }
  const [isNavbarHelpClicked, setIsNavbarHelpClicked] = useState(false)
  const setHadleNavbarChatClick = () => {
    setIsNavbarHelpClicked(!isNavbarHelpClicked)
    window.Verloop(function () {
      this.openWidget()
    })
  }

  const handleNavbarHelpClick = () => {
    setIsNavbarHelpClicked(!isNavbarHelpClicked)
  }

  const getTeacherExist = async (instituteId, instituteType, hierarchyId) => {
    if (hierarchyId) history.push(DASHBOARD)
    else if (instituteId) {
      dispatch(teacherListLoadingAction(true))
      utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.TEACHER]})
        .then(({status, obj}) => {
          if (status && obj?.length > 0) this.setState({redirect: true})
          else this.setState({pageNum: 6})
        })
        .finally(() => dispatch(teacherListLoadingAction(false)))
    }
  }

  const wrapperRef = useRef(null)
  useOutsideClickHandler(wrapperRef, () => {
    setShowInstituteListPopup(false)
  })

  const helpWrapperRef = useRef(null)
  useOutsideClickHandler(helpWrapperRef, () => {
    setIsNavbarHelpClicked(false)
  })
  return (
    <>
      <SubscriptionBanners />
      <SubscriptionPopups />

      {showNotice && (
        <Notice
          type="warning"
          endDateTime={new Date('January 30, 2022 02:00:00')}
          onCloseClick={() => setShowNotice(false)}
        >
          {t('navBarWarningNotice')}
        </Notice>
      )}

      <div
        className={`flex items-start sm:items-center justify-between tm-border1-bottom topnav ${styles.navbar}`}
      >
        <div className={`flex-row sm:flex items-center ${styles.schoolName}`}>
          <div
            className={classNames(
              styles.instituteInfoWrapper,
              'flex items-center mb-4 sm:mb-0'
            )}
          >
            {CurrentOrgId ? (
              ''
            ) : (
              <img
                src="https://storage.googleapis.com/tm-assets/icons/primary/burger-menu-primary.svg"
                alt=""
                className="w-5 h-5 mr-4 lg:mr-8 lg:hidden"
                onClick={() => showSidebar(true)}
              />
            )}
            <div className="flex flex-row items-center">
              <img
                className={`w-10 h-10 object-cover rounded-full ${styles.schoolImg}`}
                src={
                  CurrentOrgId
                    ? organisationInfo?.org_logo || instituteDefaultImg
                    : instituteInfo?.ins_logo || instituteDefaultImg
                }
                alt=""
              />
              <div className="flex flex-wrap flex-col relative">
                <div
                  className="flex w-full justify-start"
                  ref={wrapperRef}
                  onClick={() => {
                    eventManager.send_event(
                      events.INSTITUTE_DROP_DOWN_CLICKED_TFI,
                      {
                        type: organisationInfo?._id
                          ? 'multi institute dashboard'
                          : 'institute dashboard',
                      }
                    )
                    setShowInstituteListPopup(!showInstituteListPopup)
                  }}
                >
                  <p
                    className={classNames('break-words', styles.instituteName)}
                  >
                    {CurrentOrgId
                      ? organisationInfo?.name
                      : instituteInfo?.name}
                  </p>
                  <div
                    className={classNames(
                      styles.chevron,
                      styles.chevronDownInstituteName
                    )}
                  >
                    <Icon
                      color="secondary"
                      name="chevronDown"
                      size={ICON_CONSTANTS.SIZES.X_SMALL}
                      type="outlined"
                    />
                  </div>

                  <div className="tm-dashboard-institute-list-dropdown">
                    <div className="arrow hidden"></div>
                    {showInstituteListPopup && (
                      <div
                        className={classNames(
                          'msg-box tm-box-shadow1',
                          styles.profileDropdown,
                          CurrentOrgId ? styles.orgProfileDropdown : ''
                        )}
                      >
                        <ProfileDropdown
                          setShowDetails={setShowInstituteProfile}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={styles.instituteId}>
                    <Trans i18nKey="idColon">ID: {instituteId}</Trans>
                  </div>
                  <img
                    className={` ml-2 cursor-pointer ${styles.copyIcon}`}
                    src="https://storage.googleapis.com/tm-assets/icons/blue/copy-blue.svg"
                    alt="Copy"
                    onClick={() => {
                      eventManager.send_event(
                        events.COPY_INSTITUTE_ID_CLICKED_TFI
                      )
                      handleCopy()
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {CurrentOrgId ? <OrgAcademicSession /> : <AcademicSession />}
        </div>

        <div className="flex items-center">
          <div
            className={styles.dropdown}
            onClick={() => handleNavbarHelpClick()}
            ref={helpWrapperRef}
          >
            <button>
              {isMobile() ? (
                <div className={styles.mobileHelpIcon}>
                  <Icon
                    name="help"
                    color="basic"
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    type="filled"
                  />
                </div>
              ) : !CurrentOrgId ? (
                <div className={styles.helpContainer}>
                  <Icon
                    name="help"
                    color="basic"
                    size={ICON_CONSTANTS.SIZES.XX_SMALL}
                    type="filled"
                  />
                  <span className={styles.helpText}>{t('help')}</span>
                </div>
              ) : null}
            </button>

            {isNavbarHelpClicked && (
              <div className={styles.dropdownContent}>
                {isPremium && (
                  <Link to={'/institute/dashboard/contact-us'}>
                    <div
                      className={styles.dropdownUnit}
                      onClick={() => setHadleNavbarChatClick(false)}
                    >
                      <Icon
                        name="comment"
                        color="basic"
                        size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                        type="fill"
                      />
                      <button>{t('chatWithUs')}</button>
                    </div>
                  </Link>
                )}
                <Link to={'/institute/dashboard/contact-us'}>
                  <div
                    className={styles.dropdownUnit}
                    onClick={() => setIsNavbarHelpClicked(false)}
                  >
                    <Icon
                      name="phone"
                      color="basic"
                      size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                      type="fill"
                    />
                    <button>{t('contactUs')}</button>
                  </div>
                </Link>
                <Link
                  to={{
                    pathname: '/institute/dashboard/feedback',
                    query: location.pathname,
                  }}
                >
                  <div
                    className={styles.dropdownUnit}
                    onClick={() => setIsNavbarHelpClicked(false)}
                  >
                    <Icon
                      name="feedback1"
                      color="basic"
                      size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                      type="fill"
                    />
                    <button>Send feedback</button>
                  </div>
                </Link>
                <div
                  className={styles.dropdownUnit}
                  onClick={() => handleRedirect()}
                >
                  <Icon
                    name="supportAgent"
                    color="basic"
                    size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                    type="fill"
                  />
                  <Link to="#">
                    <button>Support Tickets</button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div
            data-tip
            data-for="requestCallBack"
            className={styles.requestCallbackContainer}
            onClick={() => handleRedirect('&request_callback=true')}
          >
            <Icon
              color="secondary"
              name="phoneCallback"
              size={ICON_CONSTANTS.SIZES.XX_SMALL}
              type="outlined"
            />
            <Link to="#" className={styles.requestCallbackText}>
              <button>{t('requestCallBackText')}</button>
            </Link>
          </div>
          <Tooltip
            toolTipId="requestCallBack"
            toolTipBody={t('requestCallBackTooltipText')}
            className={styles.toolTipCustom}
            place={TOOLTIP_CONSTANTS.TOOLTIP_POSITIONS.BOTTOM}
            effect={TOOLTIP_CONSTANTS.TOOLTIP_EFFECTS.SOLID}
          />

          <div
            className="flex items-center cursor-pointer"
            onClick={async () => dispatch(switchAdminAction(true))}
          >
            <img
              className={styles.imgUrl}
              src={adminInfo?.img_url || profileImg}
              alt="user"
              onError={({currentTarget}) => {
                currentTarget.onerror = null // prevents looping
                currentTarget.src = profileImg
              }}
            />

            <div className="relative hidden lg:block">
              <div className={styles.chevronDown}>
                <Icon
                  color="secondary"
                  name="chevronDown"
                  size={ICON_CONSTANTS.SIZES.X_SMALL}
                  type="outlined"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showInstituteList && (
        <InstituteListPopup
          getTeacherExist={getTeacherExist}
          closeActive={closeActive}
        />
      )}
      {showInstituteProfile && (
        <UserProfileComponent
          userType="institute"
          setSliderScreen={setShowInstituteProfile}
        />
      )}
    </>
  )
}

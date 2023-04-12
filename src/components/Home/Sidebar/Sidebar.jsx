import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {
  Accordion,
  Badges,
  BADGES_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Tooltip,
} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './Sidebar.module.css'
import {
  showSidebarAction,
  showFeatureLockAction,
  showLoadingAction,
  showErrorOccuredAction,
} from '../../../redux/actions/commonAction'
import {checkSubscriptionType} from '../../../utils/Helpers'
import {Link, useLocation} from 'react-router-dom'
import {Trans, useTranslation} from 'react-i18next'
import {utilsGetHelpCenterUrl} from '../../../routes/dashboard'
import {sidebarData} from '../../../utils/SidebarItems'

export default function Sidebar() {
  const dispatch = useDispatch()
  const {instituteInfo, eventManager, sidebar, adminInfo} = useSelector(
    (state) => state
  )
  const {contentAccessCheckRequested} = useSelector(
    (state) => state.contentMvpInfo.content
  )

  const [activeItem, setActiveItem] = useState(null)
  const [activeGroup, setActiveGroup] = useState(null)

  const isPremium = checkSubscriptionType(instituteInfo)
  const location = useLocation()?.pathname
  const lang = adminInfo.lang || 'en'

  // We want to keep the admissions dashboard open when user is coming from ekaakshara admission management solution so we are using that information from local storage
  const isAdmissionOpen =
    isPremium || localStorage.getItem('admission_open') == 'true'

  useEffect(() => {
    if (sidebar?.groups?.length > 0) {
      // find active menu from location, route & subRoutes
      let activeMenu = null
      for (const key of Object.keys(sidebarData)) {
        if (
          sidebarData[key]?.route === location ||
          sidebarData[key]?.subRoutes?.includes(location) ||
          (key !== 'DASHBOARD' && location.includes(sidebarData[key]?.route))
        ) {
          activeMenu = key
          setActiveItem(key)
          break
        }
      }
      // find active group menu from sidebar.groups and activeItem
      if (activeMenu) {
        for (const module of sidebar?.groups) {
          if (
            module?._id === activeMenu ||
            module?.submodules?.find(
              (subModule) => subModule?._id === activeMenu
            )
          ) {
            setActiveGroup(module?._id)
            break
          }
        }
      }
    }
  }, [sidebar, location])

  const showSidebar = (flag) => dispatch(showSidebarAction(flag))
  const showFeatureLockPopup = (flag) => {
    dispatch(showFeatureLockAction(flag))
  }

  const trackEvent = (eventName, subscriptionType) => {
    eventManager.send_event(eventName, {
      screen_name: 'SIDEBAR',
      type: subscriptionType,
    })
  }

  const shrinkSidebar = () => {
    document.getElementsByClassName(
      styles.sidebarContainer
    )[0].style.pointerEvents = 'none'
    setTimeout(() => {
      document.getElementsByClassName(
        styles.sidebarContainer
      )[0].style.pointerEvents = 'unset'
    }, 500)
  }

  const handleClick = ({isLocked, moduleId, subModuleId}) => {
    shrinkSidebar()
    showSidebar(false)

    if (isLocked) {
      showFeatureLockPopup(true)
    } else {
      setActiveItem(subModuleId)
      setActiveGroup(moduleId)
    }

    const subscriptionType =
      isLocked ||
      (subModuleId === sidebarData.CONTENT_MVP.id &&
        !contentAccessCheckRequested)
        ? 'LOCKED'
        : 'UNLOCKED'

    trackEvent(sidebarData?.[subModuleId]?.eventName, subscriptionType)
  }

  const handleRedirect = () => {
    if (isPremium) {
      dispatch(showLoadingAction(true))
      utilsGetHelpCenterUrl()
        .then(({data}) => window.open(data))
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    } else {
      shrinkSidebar()
      showSidebar(false)
      dispatch(showFeatureLockAction(true))
    }
  }

  return sidebar?.groups ? (
    <div
      className={`tm-popup-bg-common h-full fixed w-screen lg:w-full lg:sticky ${styles.timPopupBg}`}
      onClick={() => showSidebar(false)}
    >
      <div
        className={classNames(styles.sidebarWrapper, 'tm-bgcr-wh-1')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.sidebar}>
          {sidebar?.groups?.map((module) =>
            !module?.submodules?.[0]?._id ? (
              // if no children (submodule)
              <div
                className={classNames(styles.sidebarItem, {
                  [styles.activeSidebarItem]: module?._id === activeGroup,
                })}
                key={module?._id}
              >
                <SidebarItem
                  id={module?._id}
                  title={module?.name?.[lang]}
                  icon={module?.icon}
                  showBadge={module?.submodules?.[0]?.new}
                  isActive={module?._id === activeGroup}
                  isLocked={
                    (module?.submodules?.[0]?.premium && !isPremium) ||
                    (module?._id === sidebarData.CONTENT_MVP.id &&
                      !contentAccessCheckRequested)
                  }
                  isModule={true}
                  onClick={() => {
                    handleClick({
                      isLocked: module?.submodules?.[0]?.premium && !isPremium,
                      moduleId: module?._id,
                      subModuleId: module?._id,
                    })
                  }}
                />
              </div>
            ) : (
              // else show list of submodules in  Accordion
              <div
                className={classNames(styles.sidebarItem, {
                  [styles.activeSidebarItem]: module?._id === activeGroup,
                })}
                key={module?._id}
              >
                <Accordion
                  headerContent={
                    <div className={classNames(styles.accordionTitle)}>
                      <Icon
                        name={module?.icon}
                        size={ICON_CONSTANTS.SIZES.XX_SMALL}
                        type={
                          module?._id === activeGroup
                            ? ICON_CONSTANTS.TYPES.PRIMARY
                            : ICON_CONSTANTS.TYPES.BASIC
                        }
                        className={styles.featureIcon}
                      />
                      {module?.name?.[lang]}
                    </div>
                  }
                  allowHeaderClick={true}
                  isOpen={module?._id === activeGroup}
                  classes={{
                    accordionWrapper: styles.accordionWrapper,
                    accordionBody: styles.accordionBody,
                    accordionHeader: classNames(styles.accordionHeader, {
                      [styles.activeGroup]: module?._id === activeGroup,
                    }),
                  }}
                  onClick={() => {
                    trackEvent(
                      sidebarData?.[module?._id]?.eventName,
                      'UNLOCKED'
                    )
                  }}
                >
                  <div>
                    {module?.submodules?.map((subModule) => (
                      <SidebarItem
                        key={subModule?._id}
                        id={subModule?._id}
                        title={subModule?.name?.[lang]}
                        icon={subModule?.icon}
                        showBadge={subModule?.new}
                        isActive={subModule?._id === activeItem}
                        isLocked={
                          (subModule?._id === sidebarData.ADMISSION.id
                            ? !isAdmissionOpen
                            : subModule?.premium && !isPremium) ||
                          (subModule?._id === sidebarData.CONTENT_MVP.id &&
                            !contentAccessCheckRequested)
                        }
                        onClick={() => {
                          handleClick({
                            isLocked:
                              subModule?._id === sidebarData.ADMISSION.id
                                ? !isAdmissionOpen
                                : subModule?.premium && !isPremium,
                            moduleId: module?._id,
                            subModuleId: subModule?._id,
                          })
                        }}
                      />
                    ))}
                  </div>
                </Accordion>
              </div>
            )
          )}
        </div>
        <div className={styles.sidebarFooter}>
          <SupportTicket onClick={handleRedirect} />
          <TeachmintLogo />
        </div>
      </div>
    </div>
  ) : null
}

function SidebarItem({
  id,
  title,
  icon,
  showBadge,
  isActive,
  isLocked,
  isModule = false,
  onClick,
}) {
  const {t} = useTranslation()
  return (
    <Link
      to={
        isLocked && id !== sidebarData.CONTENT_MVP.id
          ? (location) => `${location.pathname}`
          : sidebarData?.[id]?.route
      }
      onClick={onClick}
      className={classNames(styles.sidebarLink, {
        [styles.activeGroup]: isActive && isModule,
        [styles.activeItem]: isActive && !isModule,
      })}
    >
      {icon && (
        <Icon
          name={icon}
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={
            isActive ? ICON_CONSTANTS.TYPES.PRIMARY : ICON_CONSTANTS.TYPES.BASIC
          }
          className={styles.featureIcon}
        />
      )}
      {title}
      {showBadge && (
        <Badges
          label={t('new')}
          iconName={'star'}
          inverted={true}
          size={BADGES_CONSTANTS.SIZE.SMALL}
          type={BADGES_CONSTANTS.TYPE.WARNING}
          className={styles.badge}
        />
      )}
      {isLocked && (
        <Icon
          name={'lock'}
          type={ICON_CONSTANTS.TYPES.SECONDARY}
          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
          className={styles.lockIcon}
        />
      )}
    </Link>
  )
}

// Component in Sidebar Footer
function SupportTicket({onClick}) {
  const {t} = useTranslation()

  return (
    <div>
      <div
        data-tip
        data-for="support-ticket-tooltip"
        onClick={onClick}
        className={styles.supportTicket}
      >
        <Icon
          name="libraryBooks"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
        {t('helpCenter')}
        <Badges
          label={t('new')}
          iconName={'star'}
          inverted={true}
          size={BADGES_CONSTANTS.SIZE.SMALL}
          type={BADGES_CONSTANTS.TYPE.WARNING}
          className={styles.helpCenterNewBadge}
        />
      </div>

      <div>
        <Tooltip
          toolTipId="support-ticket-tooltip"
          toolTipBody={
            <div className="tm-cr-wh-1">
              <Trans i18nKey="helpCenterTooltipText">
                <div>
                  <span>FAQs | Help Center</span>
                  <span>Feature Troubleshoots</span>
                </div>
              </Trans>
            </div>
          }
          place="top"
          effect="solid"
        />
      </div>
    </div>
  )
}

function TeachmintLogo() {
  return (
    <div className={styles.teachmintLogo}>
      <img
        alt="Teachmint"
        src="https://storage.googleapis.com/tm-assets/images/dark/teachmint-logo-dark.svg"
      />
    </div>
  )
}

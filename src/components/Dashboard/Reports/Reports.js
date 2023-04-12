import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styles from './Reports.module.css'
import {Button, Card, Icon} from '@teachmint/common'
import classNames from 'classnames'
import FeeDownloadModal from './FeeDownloadModal/FeeDownloadModal'
import ClassAttendanceModal from './ClassAttendance/ClassAttendanceModal/ClassAttendanceModal'
import DownloadLogModal from './DownloadLogModal/DownloadLogModal'
import CashGreen from '../../../assets/images/icons/cashGreen.svg'
import {
  DOWNLOAD_LOG,
  DOWNLOAD_REPORT,
  // DOWNLOAD_REPORTS,
  // DOWNLOAD_REPORT_LOGS_ACCESSIBLE_ROLES,
  EVENT_TRACKER,
  FEE,
  PERFORMANCE,
  REPORTS,
} from './constant'
import HideScreen from '../../Common/HideScreen/HideScreen'
import {checkSubscriptionType} from '../../../utils/Helpers'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import {setPerformanceReportStatesAction} from '../../../redux/actions/reportLogActions'
import PerformanceReportModal from './PerformanceReportModal/PerformanceReportModal'
import {useTranslation} from 'react-i18next'
import {events} from '../../../utils/EventsConstants'
import {useHistory} from 'react-router-dom'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import AttendanceReportRoutes from '../../../pages/AttendanceReport/AttendanceReport.routes'
import {STUDENT_ATTENDANCE_REPORT_CLICK_FROM_DASHBOARD} from '../../../pages/AttendanceReport/AttendanceReport.events.constant'

export default function Reports() {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()

  const {instituteInfo, eventManager, sidebar} = useSelector((state) => state)
  const {performanceReportStates} = useSelector(
    (state) => state.downloadReportLog
  )
  const isPremiumUser = checkSubscriptionType(instituteInfo)

  const canAccessDownloadReportLogs = false
  const [showFeeDownloadReportModal, setShowFeeDownloadReportModal] =
    useState(false)
  const [showClassAttendanceReportModal, setShowClassAttendanceReportModal] =
    useState(false)
  const [showDownloadLogReportModal, setShowDownloadLogReportModal] =
    useState(false)

  const handleFeeReportClick = () => {
    trackEvent(events.FEE_REPORT_DOWNLOAD_CLICKED_TFI)
    if (isPremiumUser) {
      history.push('/institute/dashboard/fee-reports')
    }
  }

  const handleDownloadLogReportModalClick = () => {
    trackEvent(events.VIEW_DOWNLOAD_LOG_CLICKED_TFI)
    if (isPremiumUser) {
      setShowDownloadLogReportModal(true)
    }
  }

  const trackEvent = (eventName, data = {}) => {
    eventManager.send_event(eventName, {
      screen_name: 'admin_dashboard',
      type: isPremiumUser ? EVENT_TRACKER.UNLOCKED : EVENT_TRACKER.LOCKED,
      ...data,
    })
  }

  const handleFeaturelock = () => {
    trackEvent(events.DASHBOARD_REPORT_CLICKED_TFI)
    dispatch(showFeatureLockAction(true))
  }

  const handlePerformanceReportClick = () => {
    trackEvent(events.PERFORMANCE_REPORT_DOWNLOAD_CLICKED_TFI)
    if (isPremiumUser) {
      dispatch(
        setPerformanceReportStatesAction({
          isModalOpen: true,
        })
      )
    }
  }

  const handleStudentAttendanceRedirection = () => {
    history.push({
      pathname: AttendanceReportRoutes.overview.fullPath,
    })
    eventManager.send_event(STUDENT_ATTENDANCE_REPORT_CLICK_FROM_DASHBOARD)
  }

  const cardItems = [
    {
      num: 1,
      title: t(FEE),
      className: styles.displayNoneForMobile,
      icon: {
        icon: (
          <span className={styles.cashIconWrapper}>
            <img src={CashGreen} />
          </span>
        ),
        bgClass: classNames(styles.iconBg, styles.feeIconbg),
      },
      subTitle: (
        <div className={styles.subTextSection}>
          <div className={styles.subText}>{t(REPORTS)}</div>
          <Icon
            color="basic"
            name="downArrow"
            size="xs"
            type="filled"
            className={styles.subTextIconRotate}
          />
        </div>
      ),
      isVisible: sidebar?.allowedMenus?.has('FEE_REPORTS'),
      onClick: handleFeeReportClick,
    },
    {
      num: 2,
      title: t('studentAttendanceTitle'),
      className: '',
      subTitle: (
        <div className={styles.subTextSection}>
          <div className={styles.subText}>{t(REPORTS)}</div>
          <Icon
            color="basic"
            name="downArrow"
            size="xs"
            type="filled"
            className={styles.subTextIconRotate}
          />
        </div>
      ),
      icon: {
        icon: <Icon color="warning" name="handRaise" size="m" type="filled" />,
        bgClass: classNames(styles.iconBg, styles.classAttandanceIconBg),
      },
      isVisible: sidebar?.allowedMenus?.has('ATTENDANCE_REPORTS'),
      onClick: handleStudentAttendanceRedirection,
    },
    {
      num: 3,
      title: t(PERFORMANCE),
      className: '',
      subTitle: (
        <div className={styles.subTextSection}>
          <div className={styles.performanceCardContent}>
            <Icon color="basic" name="download" size="sm" type="filled" />
            <div className={styles.subText}>{t(DOWNLOAD_REPORT)}</div>
          </div>
        </div>
      ),
      icon: {
        icon: (
          <Icon
            name="graph"
            size="m"
            type="filled"
            className={classNames(
              styles.performanceIcon,
              styles.higherSpecificity
            )}
          />
        ),
        bgClass: classNames(styles.iconBg, styles.performanceIconBg),
      },
      isVisible: false,
      onClick: handlePerformanceReportClick,
    },
  ]

  return (
    <div className={styles.dashboardReportSection}>
      {showFeeDownloadReportModal && (
        <FeeDownloadModal
          showFeeDownloadReportModal={showFeeDownloadReportModal}
          setShowFeeDownloadReportModal={setShowFeeDownloadReportModal}
          trackEvent={trackEvent}
        />
      )}
      {showClassAttendanceReportModal && (
        <ErrorBoundary>
          <ClassAttendanceModal
            showClassAttendanceReportModal={showClassAttendanceReportModal}
            setShowClassAttendanceReportModal={
              setShowClassAttendanceReportModal
            }
            trackEvent={trackEvent}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary>
        {showDownloadLogReportModal && (
          <DownloadLogModal
            showDownloadLogReportModal={showDownloadLogReportModal}
            setShowDownloadLogReportModal={setShowDownloadLogReportModal}
            canAccessFeeReports={sidebar?.allowedMenus?.has('FEE_REPORTS')}
            canAccessAttendanceReports={sidebar?.allowedMenus?.has(
              'ATTENDANCE_REPORTS'
            )}
            canAccessPerformanceReports={sidebar?.allowedMenus?.has(
              'CLASSROOM_REPORTS'
            )}
          />
        )}
      </ErrorBoundary>

      {performanceReportStates.isModalOpen && (
        <PerformanceReportModal
          performanceReportStates={performanceReportStates}
        />
      )}

      <div className={styles.headingSection}>
        <div className="tm-h7">{t(REPORTS)} </div>
        <div>
          {isPremiumUser && canAccessDownloadReportLogs && (
            <Button
              size="big"
              type="secondary"
              className={classNames(
                styles.downloadLogBtn,
                styles.higherspecifisity
              )}
              onClick={handleDownloadLogReportModalClick}
            >
              {t(DOWNLOAD_LOG)}
            </Button>
          )}
        </div>
      </div>

      <div
        className={classNames(styles.cardSection, styles.positionRelative)}
        onClick={!isPremiumUser ? handleFeaturelock : null}
      >
        {!isPremiumUser && (
          <div className={styles.HideScreen}>
            <HideScreen />
          </div>
        )}
        {cardItems.map(
          ({title, icon, subTitle, isVisible, className, onClick}) => {
            return (
              isVisible && (
                <Card
                  className={classNames(styles.card, className)}
                  onClick={onClick}
                  key={title}
                >
                  <div className={styles.cardChildrenSection}>
                    <div className={icon.bgClass}>{icon.icon}</div>
                    <div className={styles.fullWidth}>
                      <div className={styles.titleText}>{title}</div>
                      {subTitle}
                    </div>
                  </div>
                </Card>
              )
            )
          }
        )}
      </div>
    </div>
  )
}

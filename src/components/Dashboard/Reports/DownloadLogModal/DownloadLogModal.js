import React, {useEffect, useState} from 'react'
import styles from './DownloadLogModal.module.css'
import classNames from 'classnames'
import reportStyles from '../Reports.module.css'
import {Icon, Modal} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import {fetchDownloadReportLogAction} from '../../../../redux/actions/reportLogActions'
import LinearTabOptions from '../../../Common/LinearTabOptions/LinearTabOptions'
import {
  API_RESPONCE_OBJ_KEYS,
  DOWNLOAD_REPORT_LOG_TABS,
  DOWNLOAD_REPORT_LOG_TABS_IDS,
  REPORT_DOWNLOAD_LOG,
} from '../constant'
import FeeReports from './components/FeeReports/FeeReports'
import AttendanceReports from './components/AttendanceReports/AttendanceReports'
import PerformanceReports from './components/PerformanceReports/PerformanceReports'
import {useTranslation} from 'react-i18next'

export default function DownloadLogModal({
  showDownloadLogReportModal,
  setShowDownloadLogReportModal,
  canAccessFeeReports,
  canAccessAttendanceReports,
  canAccessPerformanceReports,
}) {
  const {t} = useTranslation()

  const {downloadReportLogData, loader} = useSelector(
    (state) => state.downloadReportLog
  )

  const accessibaleTabs = DOWNLOAD_REPORT_LOG_TABS.map((tab) => {
    if (
      (tab.id === DOWNLOAD_REPORT_LOG_TABS_IDS.feeReports &&
        canAccessFeeReports) ||
      (tab.id === DOWNLOAD_REPORT_LOG_TABS_IDS.attendanceReports &&
        canAccessAttendanceReports) ||
      (tab.id === DOWNLOAD_REPORT_LOG_TABS_IDS.performance &&
        canAccessPerformanceReports)
    ) {
      return {...tab, label: t(tab.label)}
    }
  }).filter((el) => el !== undefined)

  const dispatch = useDispatch()
  const [reportList, setReportList] = useState([])
  const [currentTab, setCurrentTab] = useState(accessibaleTabs[0]?.id)

  useEffect(() => {
    dispatch(fetchDownloadReportLogAction())
  }, [])

  const reportListSetter = {
    [DOWNLOAD_REPORT_LOG_TABS_IDS.feeReports]:
      downloadReportLogData[API_RESPONCE_OBJ_KEYS.FEE],
    [DOWNLOAD_REPORT_LOG_TABS_IDS.attendanceReports]:
      downloadReportLogData[API_RESPONCE_OBJ_KEYS.ATTENDANCE],
    [DOWNLOAD_REPORT_LOG_TABS_IDS.performance]:
      downloadReportLogData[API_RESPONCE_OBJ_KEYS.PERFORMANCE],
  }

  const handleSetReportList = (tab) => {
    setReportList(
      Object.keys(reportListSetter).includes(tab) ? reportListSetter[tab] : []
    )
  }

  useEffect(() => {
    handleSetReportList(currentTab)
  }, [downloadReportLogData])

  const handleTabClick = (tab) => {
    handleSetReportList(tab)
    setCurrentTab(tab)
  }

  return (
    <Modal
      show={showDownloadLogReportModal}
      className={classNames(styles.downloadReportLogModal, styles.modalMain)}
    >
      <div className={reportStyles.modalSection}>
        <div className={reportStyles.modalHeadingSection}>
          <div className={reportStyles.modalIconAndHeadingSection}>
            {/* <div className={classNames(reportStyles.iconBg, styles.feeIconbg)}>
              <Icon color="success" name="rupeeCircle" size="m" type="filled" />
            </div> */}
            <div className={reportStyles.modalHeadingText}>
              {t(REPORT_DOWNLOAD_LOG)}
            </div>
          </div>
          <div>
            <button
              onClick={() =>
                setShowDownloadLogReportModal(!showDownloadLogReportModal)
              }
            >
              <Icon color="basic" name="close" size="xs" type="filled" />
            </button>
          </div>
        </div>

        <div>
          <LinearTabOptions
            options={accessibaleTabs}
            selected={currentTab}
            handleChange={(tab) => handleTabClick(tab)}
          />
        </div>

        {loader && (
          <div className={styles.loaderSection}>
            <div className="loading"></div>
          </div>
        )}
        <div className={styles.tableDataSection}>
          {!loader &&
            currentTab === DOWNLOAD_REPORT_LOG_TABS_IDS.feeReports && (
              <FeeReports reportList={reportList} />
            )}

          {!loader &&
            currentTab === DOWNLOAD_REPORT_LOG_TABS_IDS.attendanceReports && (
              <AttendanceReports reportList={reportList} />
            )}

          {!loader &&
            currentTab === DOWNLOAD_REPORT_LOG_TABS_IDS.performance && (
              <PerformanceReports reportList={reportList} />
            )}
        </div>
      </div>
    </Modal>
  )
}

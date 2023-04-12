import React, {useEffect} from 'react'
import styles from './PerformanceReportModal.module.css'
import classNames from 'classnames'
import reportStyles from '../Reports.module.css'
import {Icon, Modal} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import {
  fetchPerformanceReportAction,
  setPerformanceReportStatesAction,
} from '../../../../redux/actions/reportLogActions'
import {
  DOWNLOAD_IN_PROGRESS,
  FILE_IS_BEING_DOWNLOADED_PLEASE_WAIT,
} from '../constant'
import {useTranslation} from 'react-i18next'

export default function PerformanceReportModal({performanceReportStates}) {
  const {t} = useTranslation()

  const {isDownloading} = useSelector(
    (state) => state.downloadReportLog.performanceReportStates
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (!isDownloading) {
      dispatch(fetchPerformanceReportAction())
    }
  }, [])

  const setPerformanceReportClose = () => {
    dispatch(
      setPerformanceReportStatesAction({
        isModalOpen: false,
      })
    )
  }

  return (
    <Modal
      show={performanceReportStates.isModalOpen}
      className={classNames(styles.performanceReportModal, styles.modalMain)}
    >
      <div className={reportStyles.modalSection}>
        <div className={reportStyles.modalHeadingSection}>
          <div className={reportStyles.modalIconAndHeadingSection}>
            <div
              className={classNames(
                reportStyles.iconBg,
                reportStyles.performanceIconBg
              )}
            >
              <Icon
                name="graph"
                size="m"
                type="filled"
                className={classNames(
                  reportStyles.performanceIcon,
                  reportStyles.higherSpecificity
                )}
              />
            </div>
            <div className={reportStyles.modalHeadingText}>
              {t(DOWNLOAD_IN_PROGRESS)}
            </div>
          </div>
          <div>
            <button onClick={setPerformanceReportClose}>
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

        <div>
          <div className={styles.fileDownloadedText}>
            {t(FILE_IS_BEING_DOWNLOADED_PLEASE_WAIT)}
          </div>
        </div>
      </div>
    </Modal>
  )
}

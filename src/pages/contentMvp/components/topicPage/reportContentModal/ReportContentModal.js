import {Modal} from '@teachmint/common'
import classNames from 'classnames'
// import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
// import {REPORT_CONTENT_MODAL} from '../../../constants'
import {
  setContentForReportAction,
  setIsContentReportedAction,
} from '../../../redux/actions/contentActions'
import {CONTENT_ACTION_TYPES} from '../../../redux/actionTypes'
import ContentReported from './ContentReported'
import ReportContent from './ReportContent'
import styles from './ReportContentModal.module.css'

export default function ReportContentModal({
  isReportContentModalOpen,
  setIsReportContentModalOpen,
}) {
  const contentForReport = useSelector(
    (state) => state.contentMvpInfo.content.contentForReport
  )
  const isContentReported = useSelector(
    (state) => state.contentMvpInfo.content.isContentReported
  )

  const [contentForEvent, setContentForEvent] = useState(null)

  const eventManager = useSelector((state) => state.eventManager)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isContentReported) {
      setTimeoutForReportedModalClose()
    }

    return () => {
      clearTimeout(setTimeoutForReportedModalClose)
    }
  }, [isContentReported])

  const handleReportedBtnClick = () => {
    eventManager.send_event(events.PC_REPORT_OKAY_CLICKED, {
      pc_material_id: contentForEvent._id,
      pc_material_type: contentForEvent.content_type,
    })
    setContentForEvent(null)
    dispatch(setContentForReportAction(null))
    dispatch(setIsContentReportedAction(false))
    setIsReportContentModalOpen(false)
  }

  const handleReportConfirmBtnClick = () => {
    eventManager.send_event(events.PC_REPORT_BUTTON_CLICKED, {
      pc_material_id: contentForReport._id,
      pc_material_type: contentForReport.content_type,
    })

    setContentForEvent({...contentForReport})
    dispatch({
      type: CONTENT_ACTION_TYPES.REPORT_CONTENT_REQUEST,
      payload: contentForReport.uuid,
    })
  }

  const handleCancleBtnClick = () => {
    setIsReportContentModalOpen(false)
  }

  const setTimeoutForReportedModalClose = () => {
    setTimeout(() => {
      handleReportedBtnClick()
    }, 5000)
  }

  return (
    <Modal
      show={isReportContentModalOpen}
      className={classNames(styles.mainModal, styles.mainModalTag)}
    >
      <>
        {!isContentReported && (
          <ReportContent
            handleCancleBtnClick={handleCancleBtnClick}
            handleReportConfirmBtnClick={handleReportConfirmBtnClick}
          />
        )}

        {isContentReported && (
          <ContentReported handleReportedBtnClick={handleReportedBtnClick} />
        )}
      </>
    </Modal>
  )
}

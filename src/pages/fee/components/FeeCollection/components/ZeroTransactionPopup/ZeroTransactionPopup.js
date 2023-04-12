import React, {useRef, useState} from 'react'
import {Icon, Modal} from '@teachmint/common'
import styles from './ZeroTransactionPopup.module.css'
import classNames from 'classnames'
import {HELP_VIDEOS} from '../../../../fees.constants'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../utils/EventsConstants'
import YouTube from 'react-youtube'

export default function ZeroTransactionPopup({
  isOpen = false,
  setIsOpen = null,
}) {
  const eventManager = useSelector((state) => state.eventManager)
  const {t} = useTranslation()
  const video = {
    url: HELP_VIDEOS.COLLECT_FEE,
    title: t('zeroTransactionPopupTitle'),
  }
  const youtubeRef = useRef(null)
  const [isVideoPlayed, setIsVideoPlayed] = useState(false)

  const onModalClose = () => {
    youtubeRef.current.internalPlayer.getCurrentTime().then((res) => {
      eventManager.send_event(events.FEE_COLLECTION_HELP_VIDEO_TFI, {
        action: 'close',
        sec: res,
      })
    })
    setIsOpen(false)
  }

  const onVideoPlay = () => {
    if (!isVideoPlayed) {
      youtubeRef.current.internalPlayer.getCurrentTime().then(() => {
        eventManager.send_event(events.FEE_COLLECTION_HELP_VIDEO_TFI, {
          action: 'play',
          sec: 0,
        })
      })
      setIsVideoPlayed(true)
    }
  }

  return (
    <Modal
      show={isOpen}
      className={classNames(styles.feeDownloadReportModal, styles.modalMain)}
    >
      <div className={styles.modalSection}>
        <div className={styles.modalHeadingSection}>
          <span>{video.title}</span>
          <div>
            <button onClick={onModalClose}>
              <Icon color="basic" name="close" size="xs" type="filled" />
            </button>
          </div>
        </div>
        <div className={styles.mainContainer}>
          <div className={styles.container}>
            <div className={styles.videoWrapper}>
              <div className={styles.video}>
                <YouTube
                  ref={youtubeRef}
                  onPlay={onVideoPlay}
                  videoId="lYsW-IXYsZs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

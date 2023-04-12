import React, {useEffect, useRef} from 'react'
import {Icon, Modal} from '@teachmint/common'
import styles from '../TopicPage.module.css'
import {useSelector} from 'react-redux'
import {CLOSE} from '../../../constants'
import classNames from 'classnames'

export default function VideoModal({
  isVideoModalOpen,
  handleVideoModalClose,
  onClose = (f) => f,
}) {
  const currentContent = useSelector(
    (state) => state.contentMvpInfo.content.currentContent
  )

  let videoPlayerRef = useRef()

  useEffect(() => {
    const videoElement = videoPlayerRef.current
    return () => {
      onClose(videoElement)
    }
  }, [])

  return (
    <>
      <Modal
        show={isVideoModalOpen}
        className={classNames(styles.videoModalTag, styles.videoModalMain)}
      >
        <div className={styles.videoModalSection}>
          <div className={styles.videoModalHeader}>
            <button
              className={styles.videoModalCloseBtn}
              onClick={handleVideoModalClose}
              title={CLOSE}
            >
              <Icon color="basic" name="close" size="s" type="outlined" />
            </button>
          </div>
          <div className={styles.videoWrapper}>
            <video
              controls
              autoPlay
              controlsList="nodownload"
              disablePictureInPicture
              ref={videoPlayerRef}
              // onTimeUpdate={onPlaying}
              className={styles.videoTag}
            >
              <source src={currentContent.content_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className={styles.videoModalInfoSection}>
            <div className={styles.videoModalTitle}>
              {currentContent.content_file_name}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

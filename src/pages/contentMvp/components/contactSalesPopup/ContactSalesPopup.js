import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import styles from './ContactSalesPopup.module.css'
import topicPageStyles from '../topicPage/TopicPage.module.css'

import ncrtIcon from '../../../../assets/images/icons/ncert.svg'
import handRaiseicon from '../../../../assets/images/icons/hand_raise_outlined.svg'
import nounTransHiToEn from '../../../../assets/images/icons/noun-translate-hindi-to-english.svg'

import {events} from '../../../../utils/EventsConstants'
import {FEATURE_LOCK} from '../../constants'
import VideoCard from '../topicPage/topicCard/VideoCard'
import classNames from 'classnames'
import {
  ErrorBoundary,
  Icon,
  isAndroidWebview,
  isIOSWebview,
  VideoPlayerModal,
} from '@teachmint/common'
import {t} from 'i18next'
import {is_indian_institute} from '../../../../utils/Helpers'

export default function ContactSalesPopup() {
  const eventManager = useSelector((state) => state.eventManager)
  const user_auth_uuid = useSelector((state) => state.adminInfo.user_auth_uuid)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const {instituteInfo} = useSelector((state) => state)
  const is_indian_institute_val = is_indian_institute(instituteInfo)

  const handleOnAction = (event) => {
    let targetUrl = event.target.getAttribute('data-url')
    if (targetUrl === FEATURE_LOCK.contanctSalesUrl) {
      targetUrl += user_auth_uuid
      eventManager.send_event(events.CONTACT_SALES_CLICKED_TFI)
    } else {
      eventManager.send_event(events.BUY_NOW_CLICKED_TFI)
    }
    if (!is_indian_institute_val) {
      targetUrl = 'https://teachmint4.viewpage.co/Contact_Sales_on_Website'
    }
    const newWindow = window.open(targetUrl, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const handleVideoPlay = (selectedContent) => {
    if (selectedContent?.clickEvent) {
      eventManager.send_event(selectedContent.clickEvent)
    }
    setSelectedVideo(selectedContent)
    setIsVideoModalOpen(true)
  }

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false)
    setSelectedVideo(null)
  }

  const isWebview = () => !!(isAndroidWebview() || isIOSWebview())

  const contentLibraryVideos = [
    {
      _id: '6257d41abcb29f26552cae43',
      content_url:
        'https://storage.googleapis.com/teachmint/pratilipi/content/Video/5c2b2493-427c-453f-888e-6800e9367563.mp4',
      title: t('englishSampleVideo'),
      thumbnail_url:
        'https://storage.googleapis.com/teachmint/pratilipi/thumbnail/Video/5c2b2493-427c-453f-888e-6800e9367563.jpg',
      video_duration: '37',
      clickEvent: events.ENGLISH_SAMPLE_VIDEO_CLICKED_TFI,
    },
    {
      _id: '6257d41abcb29f26552cae43',
      title: t('hindiSampleVideo'),
      content_url:
        'https://storage.googleapis.com/teachmint/pratilipi/content/Video/dbd6a71d-3b85-4814-972b-d97ea1ffcb31.mp4',
      thumbnail_url:
        'https://storage.googleapis.com/teachmint/pratilipi/thumbnail/Video/dbd6a71d-3b85-4814-972b-d97ea1ffcb31.jpg',
      video_duration: '301',
      clickEvent: events.HINDI_SAMPLE_VIDEO_CLICKED,
    },
  ]

  const whyContentitem = [
    {
      id: 1,
      // icon: <Icon color="warning" name="clock" size="m" type="outlined" />,
      icon: <img src={ncrtIcon} alt={'icon'} />,
      title: t('comprehensiveNcertBasesDigitalContent'),
      description: t('includes520HoursOfContent'),
    },
    {
      id: 2,
      icon: <Icon color="warning" name="document" size="m" type="outlined" />,
      title: t('immersiveContentThatIncludes'),
      description: t('covers19kLearningModules'),
    },
    {
      id: 3,
      icon: <img src={nounTransHiToEn} alt={'icon'} />,
      title: t('24x7AccessibleLearningInEnglish'),
      description: t('allowsLearningAnytimeAnywhere'),
    },
    {
      id: 4,
      icon: <img src={handRaiseicon} alt={'icon'} />,
      title: t('helpsStudentsSelfPaced'),
      description: t('AnimatedVideosMakeLearningEasy'),
    },
  ]

  return (
    <>
      {isVideoModalOpen && (
        <ErrorBoundary>
          <VideoPlayerModal
            videoControlOptions={{
              controls: true,
              autoPlay: true,
              controlsList: 'nodownload',
              disablePictureInPicture: true,
              className: classNames(
                topicPageStyles.videoTag,
                topicPageStyles.videoModalMain
              ),
              onContextMenu: (e) => e.preventDefault(),
            }}
            videoUrl={selectedVideo?.content_url}
            videoTitle={selectedVideo?.title}
            isVideoModalOpen={isVideoModalOpen}
            handleVideoModalClose={handleVideoModalClose}
            onClose={() => {}}
          />
        </ErrorBoundary>
      )}

      <div className={styles.section}>
        <section className={styles.section1}>
          <div
            className={classNames(
              styles.headingTitle,
              styles.section1HeadingTitle
            )}
          >
            {t('contentLibrary')}
          </div>
          <div className={styles.contentLibrarySection}>
            {contentLibraryVideos.map((video, idx) => {
              return (
                <VideoCard
                  cardClass={styles.videoCard}
                  key={idx}
                  video={video}
                  handleVideoPlay={handleVideoPlay}
                />
              )
            })}
          </div>
        </section>

        <section className={styles.section2}>
          <div
            className={classNames(
              styles.headingTitle,
              styles.section2HeadingTitle
            )}
          >
            {t('whyContentLibrary')}
          </div>
          <div className={styles.whyContentSection}>
            <div className={styles.whyContentItemSection}>
              {whyContentitem.map((item) => {
                return (
                  <div key={item.id} className={styles.whyContentItem}>
                    <div className={styles.whyContentItemIcon}>{item.icon}</div>
                    <div className={styles.whyContentItemText}>
                      {item.title}
                    </div>
                    <div className={styles.whyContentItemSubtext}>
                      {item.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {isWebview() ? null : (
          <section className={styles.buttonSection}>
            <div className={styles.diplayFlexData}>
              <button
                className={classNames(styles.button, styles.contacSalestBtn)}
                data-url={FEATURE_LOCK.contactSalesUrl}
                onClick={handleOnAction}
              >
                {t('contactUs')}
              </button>
              {is_indian_institute_val && (
                <button
                  className={classNames(styles.button, styles.buyBtn)}
                  data-url={FEATURE_LOCK.buyNowUrl}
                  onClick={handleOnAction}
                >
                  {FEATURE_LOCK.buyNowText}
                </button>
              )}
            </div>

            <div className={styles.contactInfo}>
              {FEATURE_LOCK.contanctSalesCall}
              <span>
                <a className={styles.contactDetail} href="tel:08035242348">
                  080-3524-2348
                </a>
              </span>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

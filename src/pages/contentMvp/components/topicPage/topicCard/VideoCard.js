import React from 'react'
import styles from './TopicCard.module.css'
import contentStyles from '../../../Content.module.css'
import playDarkIcon from '../../../../../assets/images/icons/play-circle-dark.svg'
import classNames from 'classnames'
import {Card} from '@teachmint/common'
import DotsMenuButton from '../../dotsMenuButton/DotsMenuButton'
import {videoDurationConverter} from '../../../commonFunctions'

export default function VideoCard({
  handleVideoPlay,
  video,
  dropdownMenuItems = [],
  cardClass = '',
}) {
  return (
    <Card
      className={classNames(
        styles.videoCardSection,
        styles.topicCardSection,
        cardClass
      )}
    >
      <div className={styles.thumbnailDiv}>
        <div className={styles.cardHeaderSection}>
          {dropdownMenuItems.length > 0 && (
            <div className={styles.dotsBtnDiv}>
              <DotsMenuButton
                content={video}
                dropdownMenuItems={dropdownMenuItems}
              />
            </div>
          )}
        </div>
        <img
          className={styles.playIcon}
          src={playDarkIcon}
          alt="play icon"
          onClick={() => handleVideoPlay(video)}
        />
        <img
          className={styles.thubmnailImg}
          src={video.thumbnail_url}
          alt="thumbnail image"
        />
        <div className={styles.videoTime}>
          {video.video_duration
            ? videoDurationConverter(video.video_duration)
            : '00:00'}
        </div>
      </div>
      <div className={styles.titleText}>
        <span
          className={contentStyles.ellipsisAfterTwoLines}
          title={video?.title}
        >
          {video?.title}
        </span>
      </div>
    </Card>
  )
}

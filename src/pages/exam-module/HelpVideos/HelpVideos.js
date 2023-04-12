import React from 'react'
import styles from './HelpVideos.module.css'

import {HELP_VIDEOS} from './constants'

const HelpVideos = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {HELP_VIDEOS.map((video, i) => {
          return (
            <div key={i} className={styles.videoWrapper}>
              <div className="tm-hdg tm-hdg-16 pb-4">{video.title}</div>
              <div className={styles.video}>
                <iframe
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HelpVideos

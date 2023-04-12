import React, {useEffect} from 'react'
import styles from './IDayMsg.module.css'
import tWeb from './tWeb.png'
import tMWeb from './tMWeb.png'
import {useSelector} from 'react-redux'

const IDayMsg = () => {
  const {instituteInfo} = useSelector((state) => state)
  let isBannerHidden = false
  let hoursLeft
  let eventTime = new Date('2022-9-5').getTime()
  let bannerHideTime = new Date('2022-9-6').getTime()
  let currentTime = new Date().getTime()

  hoursLeft = Math.floor((eventTime - currentTime) / 3600000)
  if (currentTime > bannerHideTime) {
    isBannerHidden = true
    return isBannerHidden
  } else if (instituteInfo?.address?.country !== 'India') {
    isBannerHidden = true
  }
  const getCountDown = () => {
    if (hoursLeft > 0) {
      if (hoursLeft > 24) {
        return `0${Math.floor(hoursLeft / 24)}`
      } else {
        return `${Math.floor(hoursLeft)}`
      }
    }
  }

  useEffect(() => {
    getCountDown()
  }, [])

  return (
    <>
      {!isBannerHidden && (
        <div className={styles.message_banner_container}>
          <a
            className={styles.image_container}
            href="https://bit.ly/3CKr14o"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.tWeb} src={tWeb} />
            <img className={styles.tMWeb} src={tMWeb} />
          </a>
        </div>
      )}
    </>
  )
}

export default IDayMsg

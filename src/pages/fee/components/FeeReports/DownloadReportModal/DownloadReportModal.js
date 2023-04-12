import {Icon, Modal} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import styles from './DownloadReportModal.module.css'

export default function DownloadReportModal({isModalOpen, setIsModalOpen}) {
  //   const [myTimerText, setMyTimerText] = useState(null)
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    // let timerText = null
    let myCounter = 1
    const myTimer = () => {
      //   if (timerText === null) {
      //     timerText = 'request send'
      //   } else if (timerText === 'request send') {
      //     timerText = 'new request send'
      //   } else if (timerText === 'new request send') {
      //     timerText = 'request send'
      //   }

      //   setMyTimerText(timerText)
      setCounter(myCounter++)
    }
    const sendDownloadReportStausRequest = setInterval(myTimer, 2000)

    const myStopFunction = () => {
      clearInterval(sendDownloadReportStausRequest)
    }

    return () => {
      myStopFunction()
    }
  }, [])

  return (
    <Modal
      show={isModalOpen}
      className={classNames(styles.mainModal, styles.mainModalTag)}
    >
      <div className={styles.modalSection}>
        <div className={styles.modalHeadingSection}>
          <div className={styles.modalIconAndHeadingSection}>
            {/* <div className={styles.modalHeadingText}>
              {t(REPORT_DOWNLOAD_LOG)}
            </div> */}
          </div>
          <div>
            <button onClick={() => setIsModalOpen(!isModalOpen)}>
              <Icon color="basic" name="close" size="xs" type="filled" />
            </button>
          </div>
        </div>

        <div>
          {/* <h1>{myTimerText}</h1>  */}
          <h1>
            API Call{' '}
            <span style={{color: 'red', fontSize: '20px', marginLeft: '10px'}}>
              {counter}
            </span>
          </h1>
        </div>
      </div>
    </Modal>
  )
}

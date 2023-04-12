import React from 'react'
import Lottie from 'lottie-react'
import styles from './LoaderScreen.module.css'
import {
  Heading,
  HEADING_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'

function LoaderScreen({lottie, heading, para}) {
  return (
    <Modal isOpen size={MODAL_CONSTANTS.SIZE.SMALL}>
      <div className={styles.loaderWrapper}>
        <Lottie animationData={lottie} loop={true} />
        <div className={styles.contentWrapper}>
          <Heading
            className={'text-center'}
            textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
          >
            {heading}
          </Heading>
          <Para
            className={classNames(styles.para, 'text-center')}
            type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          >
            {para}
          </Para>
        </div>
      </div>
    </Modal>
  )
}

export default LoaderScreen

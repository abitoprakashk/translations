import {Icon, ICON_CONSTANTS, Modal} from '@teachmint/krayon'
import {MODAL_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import styles from './StudentWiseTable.module.css'

function StudentInfoModal({onClose, item}) {
  return (
    <Modal
      shouldCloseOnOverlayClick
      classes={{
        modal: classNames(styles.mmodal, styles.interFont),
      }}
      header={
        <div className={classNames(styles.mmodalHeader, styles.bottomBorder)}>
          {item.student}{' '}
          <Icon
            onClick={onClose}
            name="close"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            className={styles.clickable}
          />
        </div>
      }
      isOpen={true}
      showCloseIcon
      onClose={onClose}
      size={MODAL_CONSTANTS.SIZE.MEDIUM}
    >
      <div>{Object.keys(item).map((key) => item[key])}</div>
    </Modal>
  )
}

export default StudentInfoModal

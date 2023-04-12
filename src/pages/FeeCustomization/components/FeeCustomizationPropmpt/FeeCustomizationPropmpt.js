import {
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import React from 'react'
import styles from './FeeCustomizationPropmpt.module.css'

function FeeCustomizationPropmpt({
  onClose,
  title,
  desc,
  actionButtons = [],
  showCloseIcon,
}) {
  return (
    <Modal
      showCloseIcon={showCloseIcon}
      classes={{
        modal: classNames(styles.modal),
        footer: styles.modalFooter,
      }}
      isOpen={true}
      onClose={onClose}
      header={title}
      headerIcon={
        <Icon
          name="info"
          size={ICON_CONSTANTS.SIZES.XX_SMALL}
          type={ICON_CONSTANTS.TYPES.WARNING}
        />
      }
      size={MODAL_CONSTANTS.SIZE.SMALL}
      actionButtons={actionButtons}
    >
      <Para
        weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
        className={styles.desc}
        type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
      >
        {desc}
      </Para>
    </Modal>
  )
}

export default FeeCustomizationPropmpt

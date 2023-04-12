import React from 'react'
import styles from './AlertModal.module.css'
import {
  Button,
  Icon,
  ICON_CONSTANTS,
  Modal,
  MODAL_CONSTANTS,
  Para,
} from '@teachmint/krayon'
import classNames from 'classnames'

const AlertFooter = ({actionButtons = [], classes = {}}) => {
  return (
    <div className={classNames(styles.footerSection, classes?.footerSection)}>
      {actionButtons.map((buttonProps, index) => (
        <Button
          key={buttonProps.id || index}
          classes={{
            button: classNames(styles.button, buttonProps?.className),
          }}
          {...buttonProps}
        >
          {buttonProps.body}
        </Button>
      ))}
    </div>
  )
}

export default function AlertModal({
  isOpen = false,
  text = '',
  header = '',
  handleCloseModal = () => {},
  classes = {},
  headerIcon = {
    name: 'error',
    size: ICON_CONSTANTS.SIZES.XX_SMALL,
    type: ICON_CONSTANTS.TYPES.ERROR,
  },
  actionButtons = [],
}) {
  return (
    <Modal
      onClose={(event) => {
        event?.stopPropagation?.()
        event?.stopImmediatepropagation?.()
        handleCloseModal()
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
      footer={<AlertFooter actionButtons={actionButtons} />}
      header={header}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      isOpen={isOpen}
      classes={{
        modal: styles.modal,
        header: styles.modalHeader,
        ...classes?.modalClasses,
      }}
      headerIcon={<Icon {...headerIcon} />}
    >
      <div className={classNames(styles.textWrapper, classes?.textWrapper)}>
        <Para className={classNames(styles.textPara, classes?.textPara)}>
          {Array.isArray(text)
            ? text.map((item) => <div key={item}>{item}</div>)
            : text}
        </Para>
      </div>
    </Modal>
  )
}

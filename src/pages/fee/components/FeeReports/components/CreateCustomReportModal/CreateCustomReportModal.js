import {Input, Modal, MODAL_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import styles from './CreateCustomReportModal.module.css'

const CHAR_LIMIT = 60
function CreateCustomReportModal({onClose, onClick, title, btnText}) {
  const {t} = useTranslation()
  const [value, setvalue] = useState(title || '')

  const onSubmit = (e) => {
    e?.stopPropagation?.()
    onClick(value)
  }

  return (
    <Modal
      classes={{
        modal: classNames(styles.modal),
        footer: styles.modalFooter,
      }}
      isOpen={true}
      header={t('createCustomReports')}
      onClose={onClose}
      size={MODAL_CONSTANTS.SIZE.SMALL}
      actionButtons={[
        {
          body: btnText,
          onClick: () => {
            onClick(value)
          },
          isDisabled: !value?.length,
        },
      ]}
    >
      <form className={styles.wrapper} onSubmit={onSubmit}>
        <Input
          infoType={value.length > CHAR_LIMIT ? 'error' : ''}
          isRequired
          autoFocus
          maxLength={CHAR_LIMIT}
          onChange={({value}) => {
            setvalue(value)
          }}
          placeholder={t('createCustomReportPlaceholder')}
          showMsg
          title={t('reportName')}
          type="text"
          value={value}
        />
      </form>
    </Modal>
  )
}

export default CreateCustomReportModal

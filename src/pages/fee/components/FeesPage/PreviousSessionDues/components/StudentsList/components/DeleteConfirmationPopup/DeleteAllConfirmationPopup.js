import React from 'react'
import {useTranslation} from 'react-i18next'
import {Popup, Para} from '@teachmint/krayon'
import styles from './DeleteConfirmationPopup.module.css'

export default function DeleteAllConfirmationPopup({onClose, onDelete}) {
  const {t} = useTranslation()
  return (
    <Popup
      actionButtons={[
        {
          body: t('cancelButton'),
          id: 'cancel-btn',
          onClick: () => onClose(false),
          type: 'outline',
        },
        {
          body: t('delete'),
          category: 'destructive',
          id: 'delete-btn',
          onClick: () => onDelete(),
        },
      ]}
      header={t('deleteTitle')}
      headerIcon="delete1"
      isOpen
      onClose={() => onClose(false)}
    >
      <Para className={styles.message}>
        {t('deleteAllPopupConfirmationLine1')}
      </Para>
    </Popup>
  )
}

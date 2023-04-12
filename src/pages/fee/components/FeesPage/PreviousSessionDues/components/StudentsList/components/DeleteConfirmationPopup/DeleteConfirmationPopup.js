import React from 'react'
import {useTranslation} from 'react-i18next'
import {Popup, Para} from '@teachmint/krayon'
import styles from './DeleteConfirmationPopup.module.css'

export default function DeleteConfirmationPopup({
  setIsDeletePopupOpen,
  onDelete,
  studentToDelete,
}) {
  const {t} = useTranslation()
  return (
    <Popup
      actionButtons={[
        {
          body: t('cancelButton'),
          id: 'cancel-btn',
          onClick: () => setIsDeletePopupOpen(false),
          type: 'outline',
        },
        {
          body: t('delete'),
          category: 'destructive',
          id: 'delete-btn',
          onClick: () => onDelete(false),
        },
      ]}
      header={t('deleteTitle')}
      headerIcon="delete1"
      isOpen
      onClose={() => setIsDeletePopupOpen(false)}
    >
      <Para className={styles.message}>
        {t('deletePopupConfirmationLine1', {
          name: studentToDelete.student_name,
        })}
        <br />
        {t('deletePopupConfirmationLine2')}
      </Para>
    </Popup>
  )
}

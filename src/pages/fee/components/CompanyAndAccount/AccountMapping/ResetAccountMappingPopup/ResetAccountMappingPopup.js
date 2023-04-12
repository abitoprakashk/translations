import React from 'react'
import styles from './ResetAccountMappingPopup.module.css'
import {Para, Popup} from '@teachmint/krayon'
import {TRANSLATIONS_CA} from '../../companyAccConstants'

export default function ResetAccountMappingPopup({
  setIsResetAccountMappingPopupOpen = () => {},
  confirmResetAccountMapping = () => {},
  isOpen = false,
}) {
  return (
    <Popup
      actionButtons={[
        {
          body: TRANSLATIONS_CA.cancel,
          id: 'cancel-btn',
          category: 'destructive',
          onClick: () => setIsResetAccountMappingPopupOpen(false),
          type: 'outline',
        },
        {
          body: TRANSLATIONS_CA.reset,
          category: 'destructive',
          id: 'activate-btn',
          onClick: confirmResetAccountMapping,
        },
      ]}
      header={TRANSLATIONS_CA.resetAccountMappingHeader}
      isOpen={isOpen}
      onClose={() => setIsResetAccountMappingPopupOpen(false)}
    >
      <>
        <Para className={styles.contentSection}>
          <div>{TRANSLATIONS_CA.resetAccountMappingTitle}</div>
          <div>{TRANSLATIONS_CA.resetAccountMappingDesc}</div>
        </Para>
      </>
    </Popup>
  )
}

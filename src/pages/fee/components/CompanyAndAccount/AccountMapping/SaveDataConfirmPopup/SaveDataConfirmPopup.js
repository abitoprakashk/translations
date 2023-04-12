import {BUTTON_CONSTANTS, Para, Popup} from '@teachmint/krayon'
import styles from './SaveDataConfirmPopup.module.css'
import DeleteRecieptsModalStyles from '../../../../../../components/Common/DeleteRecieptsModal/DeleteRecieptsModal.module.css'
import React from 'react'
import {TRANSLATIONS_CA} from '../../companyAccConstants'
import classNames from 'classnames'

export default function SaveDataConfirmPopup({
  isOpen = false,
  buttonLoader = false,
  onClose = () => {},
  onConfirm = () => {},
}) {
  return (
    <Popup
      actionButtons={[
        {
          body: TRANSLATIONS_CA.cancel,
          id: 'cancel-btn',

          onClick: onClose,
          type: BUTTON_CONSTANTS.TYPE.OUTLINE,
        },
        {
          body: (
            <div className={styles.buttonLoadingSection}>
              {buttonLoader && (
                <div
                  className={classNames(
                    'loading',
                    DeleteRecieptsModalStyles.buttonLoading
                  )}
                ></div>
              )}
              {TRANSLATIONS_CA.save}
            </div>
          ),
          category: BUTTON_CONSTANTS.CATEGORY.CONSTRUCTIVE,
          id: 'activate-btn',
          onClick: onConfirm,
          isDisabled: buttonLoader,
        },
      ]}
      header={TRANSLATIONS_CA.saveAccountMappingHeader}
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <Para className={styles.contentSection}>
          <div>{TRANSLATIONS_CA.saveAccountMappingTitle}</div>
          {/* <div>{TRANSLATIONS_CA.resetAccountMappingDesc}</div> */}
        </Para>
      </>
    </Popup>
  )
}

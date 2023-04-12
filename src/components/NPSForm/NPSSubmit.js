import React from 'react'
import {Button, Icon} from '@teachmint/krayon'
import styles from './NPSStyles.module.css'
import {t} from 'i18next'

const NPSSubmit = ({handleCloseClick}) => {
  return (
    <div className={styles.NPSSubmit}>
      <div className={styles.submitCheckCircle}>
        <Icon
          name="checkCircle"
          size="xxxx_l"
          version="filled"
          type="success"
        />
        <div className={styles.submitHeader}>{t('feedbackReceivedDesc')}</div>
        <div className={styles.submitText}>{t('npsFeedbackReceivedDesc')}</div>
      </div>
      <div className={styles.submitPopupButtonContainer}>
        <Button
          classes={styles.submitButtonText}
          onClick={handleCloseClick}
          suffixIcon=""
          width={'full'}
        >
          {t('done')}
        </Button>
      </div>
    </div>
  )
}

export default NPSSubmit

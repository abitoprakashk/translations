import {Button, BUTTON_CONSTANTS} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from './Footer.module.css'

function Footer({onClick, isDisabled}) {
  const {t} = useTranslation()
  return (
    <div className={styles.wrapper}>
      <div className={styles.btnWrapper}>
        <Button
          isDisabled={isDisabled}
          onClick={onClick}
          width={BUTTON_CONSTANTS.WIDTH.FULL}
        >
          {t('updateTable')}
        </Button>
      </div>
    </div>
  )
}

export default Footer

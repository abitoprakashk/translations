import {
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import styles from '../FilterModal.module.css'

function Header({onClose}) {
  const {t} = useTranslation()
  return (
    <div className={styles.stickyTop}>
      <div className={styles.headerWrapper}>
        <div className={styles.headingflex}>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
            {t('addFilter')}
          </Heading>
          <div onClick={onClose}>
            <Icon
              className={styles.pointer}
              name="close"
              size={ICON_CONSTANTS.SIZES.SMALL}
            />
          </div>
        </div>
      </div>
      <Divider classes={{wrapper: styles.dividerWrapper}}></Divider>
    </div>
  )
}

export default Header

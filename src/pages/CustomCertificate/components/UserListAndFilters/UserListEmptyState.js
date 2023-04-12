import React from 'react'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import styles from './UserListEmptyState.module.css'

function UserListEmptyState({desc}) {
  const {t} = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper}>
        <Icon
          type={ICON_CONSTANTS.TYPES.BASIC}
          name="graph1"
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          version="outlined"
        />
      </div>
      <div className={styles.subTitle}>
        <div>{desc || t('noStudentsMatchingFilter')}</div>
      </div>
    </div>
  )
}

export default UserListEmptyState

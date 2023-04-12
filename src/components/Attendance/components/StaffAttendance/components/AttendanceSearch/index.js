import React from 'react'
import {Icon, Input, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './styles.module.css'
import {useTranslation} from 'react-i18next'

const AttendanceSearch = ({value, onChange}) => {
  const {t} = useTranslation()
  return (
    <div className={styles.searchWrapper}>
      <Input
        value={value}
        placeholder={t('searchByStaffName')}
        prefix={
          <Icon
            name="search"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
          />
        }
        onChange={onChange}
      />
    </div>
  )
}

export default AttendanceSearch

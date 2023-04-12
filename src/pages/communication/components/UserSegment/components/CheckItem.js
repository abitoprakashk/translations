import React from 'react'
import {Trans} from 'react-i18next'
import styles from '../UserSegment.module.css'

const CheckItem = ({value, text, checked, setIsCheck, obj, cssClass}) => {
  return (
    <div className={cssClass}>
      <input
        className={styles.checkbox}
        type="checkbox"
        checked={checked}
        // defaultChecked={checked}
        onChange={(e) =>
          setIsCheck({
            ...obj,
            id: e.target.value,
            text,
            isChecked: e.target.checked,
          })
        }
        value={value}
      />
      <span>
        <Trans i18nKey={'userSegmentCheckItem'}>{text}</Trans>
      </span>
    </div>
  )
}

export default CheckItem

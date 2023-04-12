import React from 'react'
import styles from './DaySelection.module.css'
// import {useTranslation} from 'react-i18next'
import {PLACEHOLDER} from '../../FineConstant'

export default function DaySelection({onChange = () => {}, index}) {
  //   const {t} = useTranslation()
  return (
    <div className={styles.wrapper}>
      <select
        name="master_id"
        type="text"
        value={''}
        onChange={(evnt) => onChange(evnt, index)}
        className={styles.select}
      >
        <option disabled value={''}>
          {PLACEHOLDER.daySelect}
        </option>
        {[...Array(31)].map((i, date) => {
          return (
            <option key={date} value={(date + 1 < 10 ? '0' : '') + (date + 1)}>
              {date + 1}
            </option>
          )
        })}
      </select>
    </div>
  )
}

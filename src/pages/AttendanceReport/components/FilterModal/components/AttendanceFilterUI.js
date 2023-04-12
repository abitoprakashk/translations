import {Checkbox} from '@teachmint/krayon'
import produce from 'immer'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {ATTENDANCE_FILTER} from '../../../AttendanceReport.constant'
import styles from '../FilterModal.module.css'

function AttendanceFilterUI({setAttendanceFilter, attendanceFilter}) {
  const {t} = useTranslation()
  const handleSelection = ({fieldName, value}) => {
    setAttendanceFilter(
      produce(attendanceFilter, (draft) => {
        if (fieldName === ATTENDANCE_FILTER.ALL.id) {
          // select all
          Object.keys(draft).map((key) => {
            if (value) {
              draft[key].isSelected = true
            } else {
              draft[key].isSelected = false
            }
          })
        } else {
          //select individual
          let matchCount = 0
          Object.keys(draft).map((key) => {
            if (key === ATTENDANCE_FILTER.ALL.id) return
            if (fieldName === key) {
              draft[key].isSelected = !draft[key].isSelected
            }
            if (draft[key].isSelected) {
              matchCount += 1
            }
          })
          if (matchCount === 3) {
            draft[ATTENDANCE_FILTER.ALL.id].isSelected = true
          } else {
            draft[ATTENDANCE_FILTER.ALL.id].isSelected = false
          }
        }
        return draft
      })
    )
  }

  return (
    <div className={styles.checkboxParent}>
      {Object.keys(attendanceFilter).map((key) => (
        <Checkbox
          isSelected={attendanceFilter[key].isSelected}
          classes={{wrapper: styles.checkboxWrapper, checkbox: styles.checkbox}}
          key={key}
          fieldName={key}
          handleChange={handleSelection}
          label={t(attendanceFilter[key].title)}
        />
      ))}
    </div>
  )
}

export default AttendanceFilterUI

import {Chips, Para} from '@teachmint/krayon'
import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {ATTENDANCE_FILTER} from '../../AttendanceReport.constant'
import styles from './FilterList.module.css'

function FilterList({reducerKey, hideDateChip}) {
  const {t} = useTranslation()
  const {
    filterData: {markFilter, attendanceFilter},
    dateFilter = {},
  } = useSelector((state) => state.attendanceReportReducer[reducerKey])
  const {value: calendarLabel = ''} = dateFilter || {}
  const chipsList = useMemo(() => {
    const chipContainer = []

    // attendanceFilter and markFilter are mutual exclusive
    if (attendanceFilter) {
      const chips = []
      //
      if (attendanceFilter[ATTENDANCE_FILTER.ALL.id].isSelected) {
        chips.push({
          id: ATTENDANCE_FILTER.ALL.id,
          label: t(ATTENDANCE_FILTER.ALL.title),
        })
      } else {
        Object.keys(attendanceFilter).map((key) => {
          if (attendanceFilter[key].isSelected) {
            chips.push({
              id: key,
              label: t(attendanceFilter[key].title),
            })
          }
        })
      }
      chipContainer.push({
        title: t('attendance'),
        chips,
      })
    }
    if (markFilter) {
      const chips = []
      Object.keys(markFilter).map((key) => {
        if (markFilter[key].isSelected) {
          chips.push({
            id: key,
            label: markFilter['MARKED'].isSelected
              ? `<= ${markFilter[key].sliderValue}%`
              : markFilter[key].title,
          })
        }
      })
      chipContainer.push({
        title: t('attendance'),
        chips,
      })
    }

    return chipContainer
  }, [attendanceFilter, markFilter, calendarLabel, hideDateChip, t])

  return (
    <div className={styles.container}>
      {chipsList?.map(({title, chips}, i) =>
        chips?.length ? (
          <div key={i} className={styles.chipWrapper}>
            <Para>{title}</Para>
            <Chips
              isClosable={false}
              className={styles.chip}
              onChange={() => {}}
              chipList={chips}
            />
          </div>
        ) : null
      )}
    </div>
  )
}

export default FilterList

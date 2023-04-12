import {Datepicker} from '@teachmint/krayon'
import styles from './ViewCalendar.module.css'
import {getCustomHTMLRender} from './ViewCalendar.utils'
import {CALENDAR_LEGEND} from '../../../StaffAttendanceConstants'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'

export default function ViewCalendar({
  attendanceData,
  handleRangeChange,
  selectedMonth,
}) {
  const {t} = useTranslation()

  const onShownDateChange = (day) => {
    const month = new Date(day).getMonth() + 1
    if (month > selectedMonth) handleRangeChange('next')
    else handleRangeChange('prev')
  }

  return (
    <div className={styles.viewCalendar}>
      <Datepicker
        classes={{
          wrapper: styles.dateWrapper,
          calendarWrapper: styles.calendarWrapper,
          input: styles.inputWrapper,
          calendar: styles.calendar,
        }}
        onChange={() => {}}
        onShownDateChange={onShownDateChange}
        showMonthAndYearPickers={false}
        dayContentRenderer={(day) => getCustomHTMLRender(day, attendanceData)}
        showSelectionPreview={false}
        shownDate={null}
        color="transparent"
        inputProps={{isFocused: true}}
        closeOnChange={false}
        closeOnOutsideClick={false}
        getCustomTriggerElement={() => <span></span>}
        openByDefault
      />
      <div className={styles.legends}>
        {CALENDAR_LEGEND.map((item) => {
          return (
            <div key={item.label} className={styles.legend}>
              <span
                style={{
                  background:
                    item.color.length > 1
                      ? `linear-gradient(to top, ${item.color[0]} 50%, ${item.color[1]} 50% 100%)`
                      : item.color[0],
                }}
                className={classNames(styles.legendItem, {
                  [styles.hasDot]: item?.hasDot,
                })}
              ></span>
              <span>{t(item.label)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

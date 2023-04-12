import React from 'react'
import {DateTime} from 'luxon'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {Input} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import styles from './DueDates.module.css'
import FormError from '../../tfi-common/FormError/FormError'
import {getAcademicSessionMonths} from '../../../../../utils/Helpers'

export default function DueDates({
  formValues,
  formErrors,
  handleChange,
  hidden,
}) {
  const {t} = useTranslation()
  const {instituteAcademicSessionInfo, instituteActiveAcademicSessionId} =
    useSelector((state) => state)
  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )
  const months = getAcademicSessionMonths(
    sessionRange.start_time,
    sessionRange.end_time
  )

  const handleScheduleTimestampsChange = (
    {fieldName, value, event},
    scheduleMonth
  ) =>
    handleChange({
      fieldName,
      value: {
        ...formValues.schedule_timestamps,
        [scheduleMonth]: parseInt(DateTime.fromJSDate(value).toSeconds()),
      },
      event,
    })

  const getFirstDayOfMonth = (monthAndYear) =>
    DateTime.fromFormat(monthAndYear, 'MM-yyyy').startOf('month')

  const getLastDayOfMonth = (monthAndYear) =>
    DateTime.fromFormat(monthAndYear, 'MM-yyyy').endOf('month')

  const getMinDate = (monthAndYear) => {
    return DateTime.fromMillis(parseInt(sessionRange.start_time)) <
      getFirstDayOfMonth(monthAndYear)
      ? getFirstDayOfMonth(monthAndYear)
      : DateTime.fromMillis(parseInt(sessionRange.start_time))
  }

  const getMaxDate = (monthAndYear) => {
    return DateTime.fromMillis(parseInt(sessionRange.end_time)) >
      getLastDayOfMonth(monthAndYear)
      ? getLastDayOfMonth(monthAndYear)
      : DateTime.fromMillis(parseInt(sessionRange.end_time))
  }

  return (
    <div className={classNames({hidden: hidden})}>
      {t('createInstallmentsBySelectingMonthAndAddingDueDate')}
      <div className={classNames(styles.dueDatesSection, styles.paddingBottom)}>
        <FormError errorMessage={formErrors.schedule_timestamps} />
        {months.map((month) => {
          return (
            <div key={month.value} className={styles.monthRow}>
              <div>
                <Input
                  type="checkbox"
                  value={month.value}
                  onChange={handleChange}
                  labelTxt={month.label}
                  fieldName="applicable_months"
                  className={styles.monthCheckbox}
                  isChecked={formValues.applicable_months.includes(month.value)}
                />
              </div>
              {formValues.applicable_months.includes(month.value) ? (
                <div>
                  <Input
                    type="date"
                    placeholder="Select Date"
                    fieldName="schedule_timestamps"
                    classes={{wrapper: styles.inputWrapper}}
                    value={
                      formValues.schedule_timestamps[month.value]
                        ? DateTime.fromSeconds(
                            formValues.schedule_timestamps[month.value]
                          ).toJSDate()
                        : null
                    }
                    onChange={(e) =>
                      handleScheduleTimestampsChange(e, month.value)
                    }
                    minDate={getMinDate(month.value).toJSDate()}
                    maxDate={getMaxDate(month.value).toJSDate()}
                  />
                </div>
              ) : (
                <div className={styles.selectMonthText}>
                  {t('selectMonthToAddDueDate')}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import {Chips, DateRangePicker, Dropdown, Para} from '@teachmint/krayon'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import React, {useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {DATE_FILTER} from '../../../../../../../../hooks/useFilterDateRange'
import CommonTitle from './components/CommonTitle'
import {DATE_FORMAT} from '../../../../../../constants/feeCustomization.constants'
import styles from './RenderEditorCategory.module.css'
import {useSelector} from 'react-redux'
import {events} from '../../../../../../../../utils/EventsConstants'

const defaultRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
}

function RenderDateRangeCategory({
  title,
  selectedDate,
  setSelectedDate,
  isDuePresent,
}) {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const [showDateRangePicker, setShowDateRangePicker] = useState(false)

  const options = useMemo(() => {
    // Handle DUE case
    const dateFilter = isDuePresent
      ? {[DATE_FILTER.THIS_SESSION.value]: DATE_FILTER.THIS_SESSION}
      : DATE_FILTER
    return Object.values(dateFilter).map((item) => ({
      ...item,
      label: t(item.label),
    }))
  }, [t, DATE_FILTER, isDuePresent])

  const handleDropdownSelection = ({value}) => {
    if (value !== DATE_FILTER.CUSTOM.value) {
      setSelectedDate(DATE_FILTER[value])
      eventManager.send_event(
        events.FEE_REPORTS_CUSTOM_DATE_RANGE_SELECTION_TFI,
        {
          date_range: DATE_FILTER[value],
        }
      )
    } else setShowDateRangePicker(true)
  }
  const onDone = (val) => {
    setShowDateRangePicker(false)
    const obj = {
      ...DATE_FILTER.CUSTOM,
      meta: val,
    }
    setSelectedDate(obj)
    eventManager.send_event(
      events.FEE_REPORTS_CUSTOM_DATE_RANGE_SELECTION_TFI,
      {
        date_range: obj,
      }
    )
  }

  const chipLabel = useMemo(
    () =>
      `${DateTime.fromJSDate(new Date(selectedDate?.meta?.startDate))?.toFormat(
        DATE_FORMAT
      )} - ${DateTime.fromJSDate(
        new Date(selectedDate?.meta?.endDate)
      )?.toFormat(DATE_FORMAT)}`,
    [selectedDate]
  )
  return (
    <div>
      <CommonTitle
        title={title}
        rightJSX={
          <Dropdown
            dropDownIcon={{
              up: 'chevronUp',
              down: 'chevronDown',
            }}
            onChange={handleDropdownSelection}
            classes={{
              // dropdownClass: styles.wrapper,
              optionsClass: classNames(styles.optionsClass, styles.sm),
              dropdownClass: classNames(
                styles.dropdownClass,
                styles.dropdownWidth,
                'cursor-pointer'
              ),
              dropdownOptions: classNames(
                'show-scrollbar show-scrollbar-small',
                styles.optionDropDown
              ),
            }}
            selectedOptions={selectedDate?.value}
            options={options}
          />
        }
      />
      {selectedDate.value === DATE_FILTER.CUSTOM.value ? (
        <div className={classNames(styles.mtopm, 'flex', 'items-center gap-2')}>
          <Para>{t('dateRange')}</Para>
          <Chips
            isClosable={false}
            chipList={[
              {
                id: 1,
                label: chipLabel,
              },
            ]}
          />
        </div>
      ) : null}
      {showDateRangePicker ? (
        <DateRangePicker
          direction={'horizontal'}
          ranges={selectedDate.meta || defaultRange}
          onDone={onDone}
          onClose={() => setShowDateRangePicker(false)}
        />
      ) : null}
    </div>
  )
}

export default RenderDateRangeCategory

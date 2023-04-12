import {
  Button,
  BUTTON_CONSTANTS,
  Datepicker,
  DateRangePicker,
  Dropdown,
  Icon,
  ICON_CONSTANTS,
  Input,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {DateTime} from 'luxon'
import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {BROWSER_STORAGE_KEYS} from '../../../../constants/institute.constants'
import globalActions from '../../../../redux/actions/global.actions'
import {getAdminSpecificFromLocalStorage} from '../../../../utils/Helpers'
import {DATE_FORMAT, DATE_FILTER} from '../../AttendanceReport.constant'
import {
  STUDENT_ATTENDANCE_COHORT_FILTER_INITITATED,
  STUDENT_ATTENDANCE_CUSTOM_TIME_FILTER_APPLIED,
  STUDENT_ATTENDANCE_REPORT_DOWNLOADED,
  STUDENT_ATTENDANCE_SEARCH_BAR_USED,
  STUDENT_ATTENDANCE_TIMEWISE_FILTER_INITIATED,
  STUDENT_ATTENDANCE_TIME_FILTER_APPLIED,
} from '../../AttendanceReport.events.constant'
import {useDebouncedValue} from '../../hooks/useDebouncedValue'
import useGetDateFilterRange from '../../hooks/useGetDateFilterRange'
import useGetSessionDates from '../../hooks/useGetSessionDates'
import useIsMobile from '../../hooks/useIsMobile'
import useSendEvent from '../../hooks/useSendEvent'
import useSetFilterToRedux from '../../hooks/useSetFilterToRedux'
import {saveToDisk} from '../../pages/Overview/utils/utils'
import useGetSelectedClassFromHeirarchy from '../../pages/StudentWiseAttendance/hooks/useGetSelectedClassFromHeirarchy'
import useInstituteAssignedStudents from '../../pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'
import {AttendanceReportReducerKey} from '../../redux/AttendanceReportReducer'
import FilterModal from '../FilterModal/FilterModal'
import styles from './SearchNFilter.module.css'

function SearchNFilter({
  actions = {},
  reducerKey,
  defaultMarkFilter, // default mark filter
  defaultDatefilter, // default date filter
  disableDateFilter, // disable date filter: disables dropdown
  hideDateFilter = false, // hides date filter
  hideFilter, // hides filter
  setAttendance, // used to set attendance (Present ,Absent, Not marked)
  hideSearch, // hides search input
  onlyCustomRange, // in the date dropdown onlt range is shown
  showDatePicker, // used to show single date picker
  hidemarkFilter, // used to hide mark filter (% attendance)
  maxDate, // date range and date picker max date
  download: {disableDownload, hideDownload} = {}, // download button props : disable and hide
  hideClassNSection, // used to hide classes in filter
  selectedClass, // used to pre-select single class in filter
}) {
  const dispatch = useDispatch()
  const [showModal, setshowModal] = useState(false)
  const [search, setsearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 200)
  const sessionDates = useGetSessionDates()
  const allSlectedSections = useGetSelectedClassFromHeirarchy(reducerKey)
  const instituteActiveStudentList = useInstituteAssignedStudents()
  const isMobile = useIsMobile()
  const sendEvent = useSendEvent()
  const {dateFilter} = useSelector(
    (state) => state.attendanceReportReducer[reducerKey]
  )
  const {
    downloadReport: {isLoading: downloadLoading, data: downloadData},
  } = useSelector((state) => state.globalData)
  const [showDateRangePicker, setshowDateRangePicker] = useState(false)
  const [ranges, setranges] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })
  const {t} = useTranslation()
  let source = window.location.pathname.split('/')
  source = source.pop() || source.pop() // get last part of url for event
  const downloadDateRange = useGetDateFilterRange({reducerKey})

  // used to set reducer : this is basically setting preselected data
  useSetFilterToRedux({
    action: actions.setFilterData,
    ...(hidemarkFilter ? {defaultMarkFilter: {}} : {defaultMarkFilter}),
    setAttendance,
    defaultDatefilter,
    selectedClass,
  })
  useLayoutEffect(() => {
    if (dateFilter?.meta) {
      setranges(dateFilter.meta)
    }
  }, [dateFilter])

  useEffect(() => {
    dispatch(actions.setTableSearch(debouncedSearch))
  }, [debouncedSearch])

  const OPTIONS = useMemo(() => {
    const _options = {}
    Object.entries(DATE_FILTER).forEach(([key, value]) => {
      //
      _options[key] = {
        ...value,
        label: t(value.label),
        ...(key === DATE_FILTER.CUSTOM.value &&
        dateFilter?.dropDownConstant?.value === DATE_FILTER.CUSTOM.value
          ? {children: dateFilter.value}
          : {}),
      }
    })
    return _options
  }, [dateFilter, DATE_FILTER])

  const handleDateFilterSelection = ({value}) => {
    sendEvent(STUDENT_ATTENDANCE_TIMEWISE_FILTER_INITIATED, {
      btn_src: source,
    })
    setshowDateRangePicker(false)
    if (value === DATE_FILTER.CUSTOM.value) {
      setshowDateRangePicker(true)
      return
    }
    dispatch(
      actions.setDateFilter({
        ...dateFilter,
        dropDownConstant: DATE_FILTER[value],
        value: DATE_FILTER[value].label,
      })
    )
    sendEvent(STUDENT_ATTENDANCE_TIME_FILTER_APPLIED, {
      btn_src: source,
      value,
    })
  }

  const onDone = (val) => {
    dispatch(
      actions.setDateFilter({
        ...dateFilter,
        dropDownConstant: DATE_FILTER.CUSTOM,
        value: `${DateTime.fromJSDate(val.startDate).toFormat('dd LLL')} -
                  ${DateTime.fromJSDate(val.endDate).toFormat('dd LLL')}
                `,
        meta: val,
      })
    )
    setranges(val)
    setshowDateRangePicker(false)
    sendEvent(STUDENT_ATTENDANCE_CUSTOM_TIME_FILTER_APPLIED, {
      btn_src: source,
      value: val,
    })
  }

  const handleDownload = () => {
    function getInstituteId() {
      return getAdminSpecificFromLocalStorage(
        BROWSER_STORAGE_KEYS.CURRENT_INSTITUTE_ID
      )
    }
    const json = {
      institute_id: getInstituteId(),
      attendance_date: downloadDateRange,
      ...(allSlectedSections ? {section_id: allSlectedSections} : {}),
      ...(reducerKey === AttendanceReportReducerKey.CLASS_WISE
        ? {report_type: 'Classwise'}
        : {}),
    }
    dispatch(globalActions.downloadReport.request(json))
    sendEvent(STUDENT_ATTENDANCE_REPORT_DOWNLOADED, {
      btn_src: source,
    })
  }

  useEffect(() => {
    if (downloadData) {
      const {name: fileName, url: fileURL} = downloadData
      saveToDisk({fileURL, fileName})
      setTimeout(() => {
        dispatch(globalActions.downloadReport.success(null))
      }, 300)
    }
  }, [downloadData])

  const handleOnlyRangePickerClick = (event) => {
    if (onlyCustomRange) {
      event.stopPropagation()
      handleDateFilterSelection({value: DATE_FILTER.CUSTOM.value})
    }
  }

  const getSearch = () => {
    if (hideSearch) return null

    return (
      <Input
        classes={{wrapper: styles.inputWrapper, input: styles.input}}
        fieldName="search"
        onBlur={() =>
          sendEvent(STUDENT_ATTENDANCE_SEARCH_BAR_USED, {
            btn_src: source,
          })
        }
        onChange={({value}) => {
          setsearch(value)
        }}
        value={search}
        placeholder={t('searchbyNameorEmail')}
        type="text"
        prefix={
          <Icon
            name={'search'}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            className={styles.searchIcon}
            type={ICON_CONSTANTS.TYPES.SECONDARY}
          />
        }
        suffix={
          search ? (
            <div
              className={styles.pointer}
              onClick={() => {
                setsearch('')
              }}
            >
              <Icon
                name={'close'}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                className={styles.searchIcon}
                type={ICON_CONSTANTS.TYPES.SECONDARY}
              />
            </div>
          ) : null
        }
      />
    )
  }

  const getFilter = () => {
    if (hideFilter) return null

    return (
      <Button
        classes={isMobile ? {button: styles.button} : {}}
        size={BUTTON_CONSTANTS.SIZE.LARGE}
        onClick={() => {
          setshowModal(true)
          sendEvent(STUDENT_ATTENDANCE_COHORT_FILTER_INITITATED, {
            btn_src: source,
          })
        }}
        prefixIcon="filter"
        type="outline"
      >
        {isMobile ? null : `Filter`}
      </Button>
    )
  }

  const getDateFilter = () => {
    if (hideDateFilter) return null

    if (showDatePicker) {
      //
      return (
        <Datepicker
          closeOnChange
          classes={{
            input: styles.dropdownClassCopy,
            wrapper: styles.datepickerWrapper,
          }}
          dateFormat={DATE_FORMAT}
          onChange={(val) => {
            dispatch(
              actions.setDateFilter({
                dropDownConstant: DATE_FILTER.CUSTOM,
                value: `${DateTime.fromJSDate(val).toFormat('dd LLL')}
                `,
                meta: {
                  startDate: val,
                  endDate: val,
                  key: 'selection',
                },
              })
            )
            sendEvent(STUDENT_ATTENDANCE_CUSTOM_TIME_FILTER_APPLIED, {
              btn_src: source,
              value: val,
            })
          }}
          maxDate={maxDate || new Date()}
          minDate={sessionDates?.from}
          value={dateFilter?.meta?.startDate}
        />
      )
    }

    return (
      <div onClickCapture={handleOnlyRangePickerClick}>
        <Dropdown
          title={isMobile ? t('selectDateRange') : null}
          isDisabled={disableDateFilter}
          onChange={handleDateFilterSelection}
          classes={{
            dropdownClass: styles.dropdownClass,
            optionsClass: styles.optionsClass,
            wrapperClass: styles.wrapperClass,
            dropdownOptions: 'show-scrollbar show-scrollbar-small',
          }}
          selectedOptions={dateFilter?.dropDownConstant?.value}
          options={Object.values(OPTIONS)}
        />
      </div>
    )
  }

  const btnText = useMemo(() => {
    if (isMobile) {
      if (downloadLoading) {
        return t('Preparing')
      } else {
        return t('report')
      }
    } else {
      if (downloadLoading) {
        return t('downloadingReports')
      } else {
        return t('downloadReport')
      }
    }
  }, [isMobile, downloadLoading])

  const getDownload = () => {
    if (hideDownload || !instituteActiveStudentList?.length) return null

    return (
      <Button
        onClick={handleDownload}
        classes={{}}
        size={
          isMobile ? BUTTON_CONSTANTS.SIZE.SMALL : BUTTON_CONSTANTS.SIZE.LARGE
        }
        isDisabled={
          downloadLoading || !allSlectedSections?.length || disableDownload
        }
      >
        <span
          className={classNames(styles.gap3xs, styles.flex, styles.alignCenter)}
        >
          <Icon
            name={'download'}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            type={ICON_CONSTANTS.TYPES.INVERTED}
          />

          {btnText}
        </span>
      </Button>
    )
  }

  const renderView = () => {
    if (isMobile) {
      return (
        <div className={classNames(styles.mwebFilterWrapper, styles.zi2)}>
          <div
            className={classNames(
              styles.flex,
              styles.gap3xs,
              styles.alignCenter
            )}
          >
            {getSearch()}
            {getFilter()}
          </div>
          <div
            className={classNames(
              styles.flex,
              styles.spaceBetween,
              styles.alignCenter,
              styles.gap3xs
            )}
          >
            {getDateFilter()}
            {getDownload()}
          </div>
        </div>
      )
    } else {
      return (
        <div className={classNames(styles.flex, styles.spaceBetween)}>
          <div className={classNames(styles.flex, styles.relative)}>
            {getSearch()}
          </div>
          <div className={classNames(styles.flex, styles.gap10)}>
            {getDateFilter()}
            {getFilter()}
            {getDownload()}
          </div>
        </div>
      )
    }
  }

  return (
    <>
      {renderView()}
      {showDateRangePicker ? (
        <DateRangePicker
          direction={isMobile ? 'vertical' : 'horizontal'}
          {...(sessionDates
            ? {
                minDate: sessionDates.from,
                maxDate: maxDate || sessionDates.to,
              }
            : {})}
          ranges={ranges}
          onDone={onDone}
          onClose={() => setshowDateRangePicker(false)}
        />
      ) : null}
      {showModal ? (
        <FilterModal
          selectedClass={selectedClass}
          hideClassNSection={hideClassNSection}
          hidemarkFilter={hidemarkFilter}
          source={source}
          setAttendance={setAttendance}
          reducerKey={reducerKey}
          isOpen={showModal}
          onClose={() => setshowModal(false)}
          setFilterData={actions.setFilterData}
        />
      ) : null}
    </>
  )
}

export default SearchNFilter

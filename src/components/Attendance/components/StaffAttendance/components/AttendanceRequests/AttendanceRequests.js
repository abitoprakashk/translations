import {
  Icon,
  ICON_CONSTANTS,
  BUTTON_CONSTANTS,
  Breadcrumb,
  BREADCRUMB_CONSTANTS,
  SearchBar,
  TabGroup,
  HeaderTemplate,
  ButtonDropdown,
  DateRangePicker,
  IconFrame,
  Para,
  BADGES_CONSTANTS,
} from '@teachmint/krayon'
import produce from 'immer'
import styles from './AttendanceRequests.module.css'
import {t} from 'i18next'
import {useHistory} from 'react-router-dom'
import {STAFF_ATTENDANCE_ROUTES} from '../../StaffAttendanceConstants'
import {useEffect, useState} from 'react'
import {IS_MOBILE} from '../../../../../../constants'
import AttendanceRequestCard from './AttendanceRequestCard'
import AttendanceRequestTable from './AttendanceRequestTable'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import Loader from '../../../../../Common/Loader/Loader'
import {DateTime} from 'luxon'
import {fetchStaffListRequestAction} from '../../redux/actions/StaffAttendanceActions'
import {searchBoxFilter} from '../../../../../../utils/Helpers'
import {events} from '../../../../../../utils/EventsConstants'
import {sortOnProperty} from '../../commonFunctions'

export const ATTENDANCE_REQUEST_STATUS = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
}

export const ATTENDANCE_REQUEST_BADGE_MAP = {
  [ATTENDANCE_REQUEST_STATUS.ACCEPTED]: {
    label: t('accepted'),
    type: BADGES_CONSTANTS.TYPE.SUCCESS,
  },
  [ATTENDANCE_REQUEST_STATUS.REJECTED]: {
    label: t('rejected'),
    type: BADGES_CONSTANTS.TYPE.ERROR,
  },
  [ATTENDANCE_REQUEST_STATUS.PENDING]: {
    label: t('pending'),
    type: BADGES_CONSTANTS.TYPE.WARNING,
  },
}

const REQUESTS_DURATION = {
  THIS_WEEK: 'THIS_WEEK',
  THIS_MONTH: 'THIS_MONTH',
  THREE_MONTHS: 'THREE_MONTHS',
  CUSTOM: 'CUSTOM',
}

const ATTENDANCE_REQUEST_TAB_FILTER_OPTIONS = {
  ALL: {
    id: 'ALL',
    label: t('all'),
    count: 0,
  },
  [ATTENDANCE_REQUEST_STATUS.PENDING]: {
    id: ATTENDANCE_REQUEST_STATUS.PENDING,
    label: t('pending'),
    count: 0,
  },
  [ATTENDANCE_REQUEST_STATUS.ACCEPTED]: {
    id: ATTENDANCE_REQUEST_STATUS.ACCEPTED,
    label: t('accepted'),
    count: 0,
  },
  [ATTENDANCE_REQUEST_STATUS.REJECTED]: {
    id: ATTENDANCE_REQUEST_STATUS.REJECTED,
    label: t('rejected'),
    count: 0,
  },
}

const DROPDOWN_OPTIONS = {
  [REQUESTS_DURATION.THIS_WEEK]: {
    label: t('thisWeek'),
    id: REQUESTS_DURATION.THIS_WEEK,
  },
  [REQUESTS_DURATION.THIS_MONTH]: {
    label: t('thisMonth'),
    id: REQUESTS_DURATION.THIS_MONTH,
  },
  [REQUESTS_DURATION.THREE_MONTHS]: {
    label: t('lastThreeMonths'),
    id: REQUESTS_DURATION.THREE_MONTHS,
  },
  ...(!IS_MOBILE
    ? {
        [REQUESTS_DURATION.CUSTOM]: {
          label: t('customDateRange'),
          id: REQUESTS_DURATION.CUSTOM,
        },
      }
    : {}),
}

const RESOLVE_REQUEST_EVENT_MAP = {
  [ATTENDANCE_REQUEST_STATUS.ACCEPTED]:
    events.HRMS_ATTENDANCE_REQUESTS_ACCEPTED_TFI,
  [ATTENDANCE_REQUEST_STATUS.REJECTED]:
    events.HRMS_ATTENDANCE_REQUESTS_REJECTED_TFI,
}

export default function AttendanceRequests() {
  const dispatch = useDispatch()
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const {staffListData} = useSelector((state) => state.staffAttendance)
  const {data: attendanceRequests, isLoading: isAttendanceRequestsLoading} =
    useSelector((state) => state.globalData.attendanceRequests)
  const [searchText, setSearchText] = useState('')
  const [selectedTabFilter, setSelectedTabFilter] = useState(
    ATTENDANCE_REQUEST_STATUS.PENDING
  )
  const [selectedDuration, setSelectedDuration] = useState(
    REQUESTS_DURATION.THIS_MONTH
  )
  const [duration, setDuration] = useState({
    fromDate: '',
    toDate: '',
  })
  const [filteredList, setFilteredList] = useState([])
  const [showDateRangePicker, setShowDateRangePicker] = useState(false)
  const [requestList, setRequestList] = useState([])
  const [tabOptions, setTabOptions] = useState([])

  useEffect(() => {
    if (!staffListData) {
      dispatch(fetchStaffListRequestAction())
    }
  }, [])

  const getAttendanceRequests = ({fromDate, toDate}) => {
    if (fromDate && toDate) {
      dispatch(
        globalActions.fetchAttendanceRequests.request({
          from_date: fromDate,
          to_date: toDate,
        })
      )
    }
  }

  useEffect(() => {
    getAttendanceRequests(duration)
  }, [duration])

  useEffect(() => {
    let fromDate, toDate
    switch (selectedDuration) {
      case REQUESTS_DURATION.THIS_WEEK: {
        fromDate = DateTime.utc().startOf('week').toUnixInteger()
        toDate = DateTime.utc().endOf('day').toUnixInteger()
        break
      }
      case REQUESTS_DURATION.THIS_MONTH: {
        fromDate = DateTime.utc().startOf('month').toUnixInteger()
        toDate = DateTime.utc().endOf('day').toUnixInteger()
        break
      }
      case REQUESTS_DURATION.THREE_MONTHS: {
        fromDate = DateTime.utc().startOf('quarter').toUnixInteger()
        toDate = DateTime.utc().endOf('day').toUnixInteger()
        break
      }
    }
    setDuration({
      fromDate: fromDate,
      toDate: toDate,
    })
  }, [selectedDuration])

  useEffect(() => {
    if (attendanceRequests && staffListData) {
      const list = []
      for (const timestamp in attendanceRequests) {
        const dayRecords = attendanceRequests[timestamp]
        for (const iid in dayRecords) {
          const requestItem = dayRecords[iid]
          const staff = staffListData.find((staff) => staff._id === iid)
          if (staff) {
            for (const type in requestItem) {
              const item = requestItem[type]
              list.push({
                name: staff.name,
                img_url: staff.img_url,
                phone_number: staff.phone_number,
                date: item.date,
                iid: item.iid,
                time: {
                  label:
                    type === 'checkout'
                      ? IS_MOBILE
                        ? t('outTime')
                        : t('outTimeAttendanceRequest')
                      : type === 'checkin'
                      ? IS_MOBILE
                        ? t('inTime')
                        : t('inTimeAttendanceRequest')
                      : null,
                  value: item?.checkin
                    ? DateTime.fromSeconds(item?.checkin).toFormat('hh:mm a')
                    : null,
                },
                distance: item.distance,
                request_msg: item.request_msg,
                request_status: item.request_status,
                _id: item._id,
              })
            }
          }
        }
      }
      const sortedRequestList = sortOnProperty(list, 'date', false)
      setRequestList([...sortedRequestList])
    }
  }, [attendanceRequests, staffListData])

  useEffect(() => {
    const options = produce(
      ATTENDANCE_REQUEST_TAB_FILTER_OPTIONS,
      (draftState) => {
        requestList.forEach((request) => {
          draftState['ALL'].count++
          draftState[request?.request_status].count++
        })
      }
    )
    setTabOptions(
      Object.values(options).map((option) => {
        return {
          id: option.id,
          label: `${option.label} ${!IS_MOBILE ? `(${option.count})` : ''}`,
        }
      })
    )
  }, [requestList])

  useEffect(() => {
    let updatedFilteredList = [...requestList]
    if (selectedTabFilter !== 'ALL') {
      updatedFilteredList = requestList.filter(
        (request) => request.request_status === selectedTabFilter
      )
    }
    if (searchText !== '') {
      updatedFilteredList = searchBoxFilter(searchText, updatedFilteredList, [
        ['name'],
        ['phone_number'],
      ])
    }
    setFilteredList([...updatedFilteredList])
  }, [requestList, searchText, selectedTabFilter])

  const onSelectDropdown = ({value}) => {
    if (value === REQUESTS_DURATION.CUSTOM) {
      setShowDateRangePicker(true)
    }
    setSelectedDuration(value)
  }

  const resolveAttendanceRequest = (staff, status) => {
    eventManager.send_event(RESOLVE_REQUEST_EVENT_MAP[status], {iid: staff.iid})
    dispatch(
      globalActions?.resolveAttendanceRequest?.request(
        {
          date: staff.date,
          iid: staff.iid,
          request_status: status,
        },
        () => getAttendanceRequests(duration)
      )
    )
  }

  const onSelectDateRange = ({startDate, endDate}) => {
    const startDateStr = DateTime.fromJSDate(startDate).toFormat('yyyy-MM-dd')
    const endDateStr = DateTime.fromJSDate(endDate).toFormat('yyyy-MM-dd')
    setDuration({
      fromDate: DateTime.fromFormat(startDateStr, 'yyyy-MM-dd', {
        zone: 'utc',
      })
        .startOf('day')
        .toUnixInteger(),
      toDate: DateTime.fromFormat(endDateStr, 'yyyy-MM-dd', {
        zone: 'utc',
      })
        .endOf('day')
        .toUnixInteger(),
    })
    setShowDateRangePicker(false)
  }

  return (
    <div>
      <Loader show={isAttendanceRequestsLoading} />
      <Breadcrumb
        paths={[
          {
            label: <div className={styles.pointer}>{t('staffAttendance')}</div>,
            onClick: () => {
              history.push(STAFF_ATTENDANCE_ROUTES.STAFF_ATTENDANCE)
            },
          },
          {
            label: t('attendanceRequests'),
            onClick: () => {},
          },
        ]}
        textSize={
          IS_MOBILE
            ? BREADCRUMB_CONSTANTS.TEXT_SIZES.MEDIUM
            : BREADCRUMB_CONSTANTS.TEXT_SIZES.LARGE
        }
        className={styles.breadcrumbWrapper}
      />
      <HeaderTemplate
        showBreadcrumb={false}
        classes={{
          mainHeading: styles.mainHeading,
        }}
        mainHeading={t('attendanceRequests')}
        subHeading={!IS_MOBILE ? t('attendanceRequestSubHeading') : ''}
      />
      <div className={styles.filterWrapper}>
        <ButtonDropdown
          buttonObj={{
            prefixIcon: (
              <Icon
                name="calendarToday"
                type={ICON_CONSTANTS.TYPES.PRIMARY}
                version={ICON_CONSTANTS.VERSION.OUTLINED}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
                className={styles.iconStyle}
              />
            ),
            suffixIcon: 'downArrow',
            children: DROPDOWN_OPTIONS[selectedDuration].label,
            type: BUTTON_CONSTANTS.TYPE.OUTLINE,
            classes: {
              button: styles.wrapper,
            },
          }}
          handleOptionClick={onSelectDropdown}
          options={Object.values(DROPDOWN_OPTIONS)}
          classes={{
            wrapper: styles.buttonDropdownWrapper,
            dropdownContainer: styles.dropdownContainer,
            optionStyle: styles.pointer,
          }}
        />
        <div className={styles.tabBarWrapper}>
          <TabGroup
            tabOptions={tabOptions}
            onTabClick={(tab) => setSelectedTabFilter(tab.id)}
            selectedTab={selectedTabFilter}
            showMoreTab={false}
          />
        </div>
      </div>
      {requestList?.length > 0 ? (
        <>
          <SearchBar
            value={searchText}
            placeholder={t('searchByStaffNameAndMobileNumber')}
            handleChange={({value}) => setSearchText(value)}
            classes={{wrapper: styles.searchBar}}
          />
          {IS_MOBILE ? (
            <div>
              {filteredList.map((staff) => {
                return (
                  <AttendanceRequestCard
                    key={staff?._id}
                    staff={staff}
                    onClickActionBtn={resolveAttendanceRequest}
                  />
                )
              })}
            </div>
          ) : (
            <AttendanceRequestTable
              requestList={filteredList}
              setRequestList={setFilteredList}
              onClickActionBtn={resolveAttendanceRequest}
            />
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <IconFrame className={styles.iconFrame}>
            <Icon
              name={'subject'}
              type={ICON_CONSTANTS.TYPES.SECONDARY}
              version={ICON_CONSTANTS.VERSION.OUTLINED}
              size={ICON_CONSTANTS.SIZES.SMALL}
            />
          </IconFrame>
          <Para>{t('noAttendanceRequestsReceived')}</Para>
        </div>
      )}
      {showDateRangePicker && (
        <DateRangePicker
          onDone={onSelectDateRange}
          onClose={() => setShowDateRangePicker(false)}
          maxDate={new Date()}
        />
      )}
    </div>
  )
}

import React, {useEffect, useState} from 'react'
import {
  BUTTON_CONSTANTS,
  Divider,
  EmptyState,
  Icon,
  ICON_CONSTANTS,
  Para,
  Widget,
} from '@teachmint/krayon'
import {t} from 'i18next'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../redux/actions/global.actions'
import styles from './AttendanceWidget.module.css'
import {PRICING} from '../../../utils/SidebarItems'
import {Link, useHistory} from 'react-router-dom'
import AttedanceGraph from './components/AttendanceGraph'
import {DateTime} from 'luxon'
import AttendanceSummary from './components/AttendanceSummary'
import AttendanceTable from './components/AttendanceTable'
import useAttendanceRegisterTableData from '../../../pages/AttendanceReport/pages/Overview/hooks/useAttendanceRegisterTableData'
import useGetDateRange from '../../../pages/AttendanceReport/hooks/useGetDateRange'
import {DATE_RANGE} from '../../../pages/AttendanceReport/AttendanceReport.constant'
import WidgetShimmer from '../WidgetShimmer/WidgetShimmer'
import BarGraphShimmer from '../WidgetShimmer/BarGraphShimmer'
import {events} from '../../../utils/EventsConstants'
import {checkSubscriptionType} from '../../../utils/Helpers'
import AttendanceReportRoutes from '../../../pages/AttendanceReport/AttendanceReport.routes'
import {EmptyData} from './constants'
const DATE_FORMAT = 'yyyy-MM-dd'
const AttendanceWidget = () => {
  const {
    dateWiseAttendance: {
      isLoading: isGraphLoading,
      loaded: graphLoaded,
      data: initGraphData,
    },
  } = useSelector((state) => state.globalData)
  const {instituteInfo} = useSelector((state) => state)
  const history = useHistory()
  const eventManager = useSelector((state) => state.eventManager)
  const isPremium = checkSubscriptionType(instituteInfo)
  const [showTable, setShowTable] = useState(false)
  const dispatch = useDispatch()
  const {rows, error} = useAttendanceRegisterTableData()
  const dateRange = useGetDateRange(DATE_RANGE.DAILY)
  const [tableData, setTableData] = useState({...EmptyData})
  const [todayData, setTodayData] = useState({...EmptyData})
  const [dateIndex, setDateIndex] = useState(6)
  let dateRangeArray = []

  const getTableRowsMarked = () => tableData?.marked_classes?.map((row) => row)
  const getTableRowsNotMarked = () =>
    tableData?.not_marked_classes?.map((row) => row)

  const getBody = () => {
    if (!isPremium) {
      return (
        <EmptyState
          iconName="lock"
          content={<Para>{t('upgradeToView')}</Para>}
          button={{
            size: BUTTON_CONSTANTS.SIZE.SMALL,
            type: BUTTON_CONSTANTS.TYPE.TEXT,
            version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
            children: t('viewPlans'),
            onClick: () => {
              history.push(PRICING)
            },
          }}
          classes={{
            wrapper: styles.unpaidWidgetLockContainer,
            iconFrame: styles.iconFrame,
          }}
        />
      )
    } else {
      if (error) {
        return (
          <div className={styles.errorWrapper}>
            <EmptyState
              iconName="error"
              content={t('unableToLoadData')}
              button={{
                size: BUTTON_CONSTANTS.SIZE.SMALL,
                version: BUTTON_CONSTANTS.ICON_VERSION.FILLED,
                children: t('tryAgain'),
                type: BUTTON_CONSTANTS.TYPE.TEXT,
                prefixIcon: 'refresh',
                onClick: () => getData(),
              }}
              classes={{iconFrame: styles.iconFrame}}
            />
          </div>
        )
      }
      if (!rows) {
        return (
          <div className={styles.widgetShimmerAttendanceBodyContainer}>
            <WidgetShimmer />
            <Divider spacing="0px" className={styles.widgetAttendanceDivider} />
            <BarGraphShimmer tableColumnsCount={7} />
          </div>
        )
      } else {
        return (
          <div className={styles.widgetAttendanceBodyContainer}>
            <AttendanceSummary
              rowsMarked={todayData?.marked}
              rowsNotMarked={todayData?.not_marked}
              tableRowsMarked={todayData?.marked_classes}
              tableRowsNotMarked={todayData?.not_marked_classes}
              setShowTable={setShowTable}
              setTableData={setTableData}
              filledData={filledData}
            />
            <Divider spacing="0px" className={styles.widgetAttendanceDivider} />
            <AttedanceGraph
              graphData={filledData}
              isGraphLoading={isGraphLoading}
              graphLoaded={graphLoaded}
              setShowTable={setShowTable}
              tableData={tableData}
              setTableData={setTableData}
              filledData={filledData}
              setDateIndex={setDateIndex}
            />
          </div>
        )
      }
    }
  }
  const getHeader = () => {
    return (
      <div className={styles.widgetAttendanceHeaderContainer}>
        <div className={styles.widgetAttendanceHeaderMainContainer}>
          <div className={styles.widgetAttendanceIconContainer}>
            <Icon
              name="people2"
              type="inverted"
              size={ICON_CONSTANTS.SIZES.XXX_SMALL}
              className={styles.widgetAttendanceIcon}
            />
          </div>
          <div className={styles.widgetAttendanceHeaderTitle}>
            {t('classAttendance')}
          </div>
        </div>
      </div>
    )
  }

  const getFilterDateRange = () => {
    let d = new Date()
    let f = DateTime.fromJSDate(d).toString(DATE_FORMAT)
    let e = new Date(new Date().setDate(new Date().getDate() - 6))
    for (let i = 0; i < 7; i++) {
      let temp = new Date(new Date().setDate(new Date().getDate() - i))
      dateRangeArray.push(
        DateTime.fromJSDate(temp).toString(DATE_FORMAT).slice(0, 10)
      )
    }
    let g = DateTime.fromJSDate(e).toString(DATE_FORMAT)
    return {
      from: g.slice(0, 10),
      to: f.slice(0, 10),
    }
  }
  if (dateRangeArray?.length !== 7) getFilterDateRange()

  const getData = () => {
    if (isPremium) {
      dateRange && dispatch(globalActions.attendanceRegister.request(dateRange))
      dispatch(globalActions.dateWiseAttendance.request(getFilterDateRange()))
    }
  }

  const filledData = dateRangeArray
    .map((item) => {
      const temp = item
      return (
        initGraphData?.filter((data) => data.day === temp)[0] || {
          ...EmptyData,
          day: temp,
        }
      )
    })
    .reverse()

  const getTableData = () => {
    setTableData(
      filledData?.filter((item) => item.day == dateRangeArray[6 - dateIndex])[0]
    )
  }

  const getTodayData = () => {
    setTodayData(filledData?.filter((item) => item.day == dateRangeArray[0])[0])
  }

  useEffect(() => {
    getData()
    initGraphData && getTodayData()
    getTableData()
    eventManager.send_event(events.DASHBOARD_WIDGETS_LOADED, {
      widget_type: 'attendance',
    })
  }, [dateRange, dateIndex])
  useEffect(() => {
    getTableRowsMarked(dateIndex)
    getTableRowsNotMarked(dateIndex)
  }, [tableData, dateIndex, showTable])

  return (
    <div>
      <AttendanceTable
        showTable={showTable}
        setShowTable={setShowTable}
        rowsMarked={tableData?.marked}
        rowsNotMarked={tableData?.not_marked}
        tableRowsMarked={tableData?.marked_classes}
        tableRowsNotMarked={tableData?.not_marked_classes}
        className={styles.attendanceTable}
        rows={rows}
        error={error}
        dateIndex={dateIndex}
        setTableData={setTableData}
        dateRangeArray={dateRangeArray}
        filledData={filledData}
        setDateIndex={setDateIndex}
      />
      <Widget
        header={getHeader()}
        actionButtons={[
          <Link
            key={1}
            className={styles.AttendanceWidgetHeaderCTA}
            to={isPremium && AttendanceReportRoutes.classAttendance.fullPath}
            onClick={() =>
              eventManager.send_event(
                events.STUDENT_ATTENDANCE_DETAILED_REPORTS,
                {
                  screen_name: 'dashboard',
                }
              )
            }
          >
            {isPremium && t('viewReports')}
          </Link>,
        ]}
        body={getBody()}
        classes={{
          widgetWrapper: styles.widgetAttendanceWrapper,
          header: styles.widgetAttendanceHeader,
          icon: styles.widgetAttendanceIcon,
          headerTitle: styles.widgetAttendanceHeaderTitle,
          actionBtn: styles.widgetAttendanceActionBtn,
          subHeading: styles.widgetAttendanceSubHeading,
          body: styles.widgetAttendanceBody,
          footer: styles.widgetAttendanceFooter,
        }}
      />
    </div>
  )
}

export default AttendanceWidget

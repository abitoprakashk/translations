import React, {useEffect, useState, memo, useMemo} from 'react'
import {Datepicker, Dropdown, EmptyState, Widget} from '@teachmint/krayon'
import {t} from 'i18next'
import {Chart as ChartJS, ArcElement, Tooltip} from 'chart.js'
import {Bar} from 'react-chartjs-2'
import styles from '../ChartWidgets.module.css'
import {DownloadReport} from '../../../components/DownloadReport'
import {
  STAFF_LABEL_MAPPING,
  STAFF_CHART_BG_COLORS,
  STAFF_CSV_HEADERS,
  STAFF_CSV_FILE_NAME,
} from '../../Constants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {DateTime} from 'luxon'

export const StaffAttendanceWidgetStructure = ({
  getCsvData,
  createChartData,
}) => {
  const dispatch = useDispatch()
  const LABELS = Object.values(STAFF_LABEL_MAPPING).map(({label}) => label)

  const [chartYAxis, setChartYAxis] = useState([])
  const [attendanceApiData, setAttendanceApiData] = useState([])
  const [totalAttendance, setTotalAttendance] = useState([])
  const [allAbsent, setAllAbsent] = useState([])
  const [allPresent, setAllPresent] = useState([])
  const [allNotMarked, setAllNotMarked] = useState([])
  const [csvData, setCsvData] = useState([])
  const [selectedFilter, setSelectedFilters] = useState(
    Object.values(STAFF_LABEL_MAPPING)
      .splice(1)
      .map((key) => key.value)
  )
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${DateTime.now().plus({days: -1}).toISODate()}`)
  )
  const maxDate = new Date(`${DateTime.now().plus({days: -1}).toISODate()}`)
  const chartStructure = useMemo(() => {
    return {
      total: {
        label: t(LABELS[0]),
        data: totalAttendance,
        backgroundColor: STAFF_CHART_BG_COLORS[0],
        borderWidth: 1,
        borderRadius: 8,
      },
      absent: {
        label: t(LABELS[1]),
        data: allAbsent,
        backgroundColor: STAFF_CHART_BG_COLORS[1],
        borderWidth: 1,
        borderRadius: 8,
      },
      present: {
        label: t(LABELS[2]),
        data: allPresent,
        backgroundColor: STAFF_CHART_BG_COLORS[2],
        borderWidth: 1,
        borderRadius: 8,
      },
      not_marked: {
        label: t(LABELS[3]),
        data: allNotMarked,
        backgroundColor: STAFF_CHART_BG_COLORS[3],
        borderWidth: 1,
        borderRadius: 8,
      },
    }
  }, [totalAttendance, allNotMarked, allPresent, allAbsent])

  ChartJS?.register(ArcElement, Tooltip)
  ChartJS.defaults.plugins.legend.display = false

  const orgOverviewDetails = useSelector(
    (state) => state.globalData.orgOverviewDetails?.data
  )
  const orgStaffAttendanceReport = useSelector(
    (state) => state.globalData.orgStaffAttendanceReport?.data
  )

  useEffect(() => {
    if (orgStaffAttendanceReport) {
      setAttendanceApiData(orgStaffAttendanceReport)
    }
  }, [orgStaffAttendanceReport])

  useEffect(() => {
    //call staff-attendance api for data
    dispatch(
      globalActions?.getOrgStaffAttendanceReport?.request({
        start_date: DateTime.fromJSDate(selectedDate).toISODate(),
        end_date: DateTime.fromJSDate(selectedDate).plus({days: 1}).toISODate(),
      })
    )
  }, [selectedDate])

  const updateAllAttendanceData = () => {
    if (attendanceApiData.length > 0) {
      let allInstitutes = [],
        totalAttendance = [],
        absent = [],
        present = [],
        not_marked = [],
        csvLines = [[...STAFF_CSV_HEADERS]]

      attendanceApiData.forEach((data) => {
        const institute_stats = orgOverviewDetails?.find(
          (stats) => stats.institute_id === data?.institute_id
        )
        const total = institute_stats
          ? institute_stats.no_of_non_teaching_staff +
            institute_stats.no_of_owners +
            institute_stats.no_of_teachers
          : 0
        const notMarked = Math.max(0, total - data?.present - data?.absent)

        allInstitutes.push(data?.institute_id)
        totalAttendance.push(total)
        absent.push(data?.absent)
        present.push(data?.present)
        not_marked.push(notMarked)
        csvLines.push([
          data?.institute_id,
          total,
          data?.absent,
          data?.present,
          notMarked,
        ])
      })

      setCsvData(csvLines)
      setChartYAxis(allInstitutes)
      setTotalAttendance(totalAttendance)
      setAllAbsent(absent)
      setAllPresent(present)
      setAllNotMarked(not_marked)
    } else {
      setCsvData([])
      setTotalAttendance([])
      setAllAbsent([])
      setAllPresent([])
      setAllNotMarked([])
    }
  }

  useEffect(() => {
    if (orgOverviewDetails) {
      updateAllAttendanceData(attendanceApiData)
    }
  }, [attendanceApiData, orgOverviewDetails])

  const AttendanceChart = () => {
    return (
      <div>
        <Bar
          data={createChartData(
            selectedFilter,
            chartYAxis,
            chartStructure,
            LABELS
          )}
          options={{
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: true,
                },
              },
            },
          }}
        />
        <div className={styles.legendWrapper}>
          {selectedFilter.map((filterValue) => {
            return (
              <span key={filterValue} className={styles.legendSpan}>
                <div
                  className={styles.legend}
                  style={{
                    backgroundColor:
                      chartStructure[filterValue]['backgroundColor'],
                  }}
                ></div>

                <span className={styles.legendLabel}>
                  {STAFF_LABEL_MAPPING[filterValue].label}
                </span>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Widget
      header={{title: 'Staff Attendance', icon: 'eventBusy'}}
      classes={{iconFrame: styles.staffIconBgColor}}
      actionButtons={[
        <DownloadReport
          fileName={STAFF_CSV_FILE_NAME}
          data={getCsvData(csvData)}
          key={STAFF_CSV_FILE_NAME}
        />,
      ]}
      body={
        totalAttendance.length === 0 ? (
          <div>
            <EmptyState
              content={t('noDataAvailable')}
              iconName="formatListBulleted"
              button={null}
              classes={{
                wrapper: styles.emptyState,
                iconFrame: styles.emptyStateIconFrame,
              }}
            ></EmptyState>
          </div>
        ) : (
          <div className={styles.chartWidget}>
            <div className={styles.subHeading}>
              <div className={styles.chartFilters}>
                <Dropdown
                  selectionPlaceholder={
                    selectedFilter.length > 0
                      ? `${selectedFilter.length} ${t('selected')}`
                      : t('filter')
                  }
                  fieldName="chartDataSet"
                  isMultiSelect={true}
                  title={'Show All'}
                  options={Object.values(STAFF_LABEL_MAPPING).map((key) => {
                    return {label: key.label, value: key.value}
                  })}
                  selectedOptions={selectedFilter.map((key) => {
                    return key
                  })}
                  onChange={(val) => {
                    setSelectedFilters(val.value)
                  }}
                  shouldOptionsOccupySpace={true}
                  classes={{
                    dropdownClass: styles.filterDropdown,
                    optionsClass: styles.filterOption,
                  }}
                />
                <Datepicker
                  value={selectedDate}
                  maxDate={maxDate}
                  onChange={(val) => {
                    setSelectedDate(val)
                  }}
                  closeOnChange
                  classes={{
                    input: styles.dateInput,
                    calendarWrapper: styles.calendarWrapper,
                  }}
                />
              </div>
            </div>
            <AttendanceChart />
          </div>
        )
      }
    />
  )
}
export const StaffAttendanceWidget = memo(StaffAttendanceWidgetStructure)

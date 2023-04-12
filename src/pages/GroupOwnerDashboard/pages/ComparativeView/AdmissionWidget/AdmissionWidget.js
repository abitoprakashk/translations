import React, {useEffect, useState, memo, useMemo} from 'react'
import {Dropdown, EmptyState, Widget} from '@teachmint/krayon'
import {t} from 'i18next'
import {Chart as ChartJS, ArcElement, Tooltip} from 'chart.js'
import {Bar} from 'react-chartjs-2'
import styles from '../ChartWidgets.module.css'
import {DownloadReport} from '../../../components/DownloadReport'
import {
  ADMISSION_CHART_BG_COLORS,
  ADMISSION_LABEL_MAPPING,
  ADMISSION_CSV_HEADER,
  ADMISSION_CSV_FILE_NAME,
} from '../../Constants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {DateTime} from 'luxon'

const AdmissionWidgetStructure = ({getCsvData, createChartData}) => {
  const dispatch = useDispatch()
  const LABELS = Object.values(ADMISSION_LABEL_MAPPING).map(({label}) => label)
  const [chartYAxis, setChartYAxis] = useState([])
  const [admissionApiData, setAdmissionApiData] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [allInquiries, setAllInquiries] = useState([])
  const [allFeeCollected, setAllFeeCollected] = useState([])
  const [allApplications, setAllApplications] = useState([])
  const [csvData, setCsvData] = useState([])
  const [selectedFilter, setSelectedFilters] = useState(
    Object.values(ADMISSION_LABEL_MAPPING).map((key) => key.value)
  )

  const dateDropDown = {
    yesterday: {
      label: 'Yesterday',
      value: 'yesterday',
      start_date: DateTime.now().plus({days: -1}).toISODate(),
      end_date: DateTime.now().toISODate(),
    },
    lastSevenDays: {
      label: 'Last 7 Days',
      value: 'lastSevenDays',
      start_date: DateTime.now().plus({days: -7}).toISODate(),
      end_date: DateTime.now().toISODate(),
    },
    lastThirtyDays: {
      label: 'Last 30 Days',
      value: 'lastThirtyDays',
      start_date: DateTime.now().plus({days: -30}).toISODate(),
      end_date: DateTime.now().toISODate(),
    },
    allSession: {
      label: 'All Session',
      value: 'allSession',
      start_date: '',
      end_date: '',
    },
  }

  const [selectedDateKey, setSelectedDateKey] = useState(
    dateDropDown.yesterday.value
  )

  ChartJS?.register(ArcElement, Tooltip)
  ChartJS.defaults.plugins.legend.display = false

  const chartStructure = useMemo(() => {
    return {
      admissions: {
        label: t(LABELS[0]),
        data: admissions,
        backgroundColor: ADMISSION_CHART_BG_COLORS[0],
        borderWidth: 1,
        borderRadius: 8,
      },
      allInquiries: {
        label: t(LABELS[1]),
        data: allInquiries,
        backgroundColor: ADMISSION_CHART_BG_COLORS[1],
        borderWidth: 1,
        borderRadius: 8,
      },
      allFeeCollected: {
        label: t(LABELS[2]),
        data: allFeeCollected,
        backgroundColor: ADMISSION_CHART_BG_COLORS[2],
        borderWidth: 1,
        borderRadius: 8,
      },
      allApplications: {
        label: t(LABELS[3]),
        data: allApplications,
        backgroundColor: ADMISSION_CHART_BG_COLORS[3],
        borderWidth: 1,
        borderRadius: 8,
      },
    }
  }, [admissions, allApplications, allFeeCollected, allInquiries])

  const orgAdmissionReport = useSelector(
    (state) => state.globalData.orgAdmissionReport?.data
  )

  useEffect(() => {
    if (orgAdmissionReport) {
      setAdmissionApiData(orgAdmissionReport)
    }
  }, [orgAdmissionReport])

  useEffect(() => {
    //call admission api for data on date change
    dispatch(
      globalActions?.getOrgAdmissionReport?.request({
        start_date: dateDropDown[selectedDateKey].start_date,
        end_date: dateDropDown[selectedDateKey].end_date,
      })
    )
  }, [selectedDateKey])

  const updateAllAdmissionData = (admissionData) => {
    if (admissionData.length > 0) {
      let allInstitutes = [],
        totalAdmission = [],
        totalApplications = [],
        collection = [],
        inquiries = [],
        csvLines = [[...ADMISSION_CSV_HEADER]]

      admissionData.forEach((data) => {
        allInstitutes.push(data?.institute_id)
        totalAdmission.push(data?.no_of_admissions)
        totalApplications.push(data?.no_of_applications)
        collection.push(data?.fees_collected)
        inquiries.push(data?.no_of_inquiries)
        csvLines.push([
          data?.institute_id,
          data?.no_of_inquiries,
          data?.fees_collected,
          data?.no_of_applications,
          data?.no_of_admissions,
        ])
      })

      setCsvData(csvLines)
      setChartYAxis(allInstitutes)
      setAdmissions(totalAdmission)
      setAllFeeCollected(collection)
      setAllApplications(totalApplications)
      setAllInquiries(inquiries)
    } else {
      setAdmissions([])
      setAllFeeCollected([])
      setAllApplications([])
      setAllInquiries([])
      setCsvData([])
    }
  }

  useEffect(() => {
    updateAllAdmissionData(admissionApiData)
  }, [admissionApiData])

  const AdmissionChart = () => {
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
                  {ADMISSION_LABEL_MAPPING[filterValue].label}
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
      header={{title: 'Admissions', icon: 'bookmark'}}
      classes={{iconFrame: styles.admissionIconBgColor}}
      actionButtons={[
        <DownloadReport
          fileName={ADMISSION_CSV_FILE_NAME}
          data={getCsvData(csvData)}
          key={ADMISSION_CSV_FILE_NAME}
        />,
      ]}
      body={
        admissions.length === 0 ? (
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
                  options={Object.values(ADMISSION_LABEL_MAPPING).map((key) => {
                    return {label: key.label, value: key.value}
                  })}
                  selectedOptions={selectedFilter.map((key) => {
                    return key
                  })}
                  onChange={(val) => {
                    setSelectedFilters(val.value)
                  }}
                  classes={{
                    dropdownClass: styles.filterDropdown,
                    optionsClass: styles.filterOption,
                  }}
                />
                <Dropdown
                  fieldName="chartDate"
                  isMultiSelect={false}
                  title={'Show All'}
                  options={Object.keys(dateDropDown).map((key) => {
                    return {
                      label: dateDropDown[key].label,
                      value: dateDropDown[key].value,
                    }
                  })}
                  selectedOptions={selectedDateKey}
                  onChange={(val) => {
                    setSelectedDateKey(val.value)
                  }}
                  classes={{
                    dropdownClass: styles.admissionDateDropDown,
                  }}
                />
              </div>
            </div>
            <AdmissionChart />
          </div>
        )
      }
    />
  )
}
export const AdmissionWidget = memo(AdmissionWidgetStructure)

import React, {useEffect, useState, memo, useMemo} from 'react'
import {Dropdown, EmptyState, Widget} from '@teachmint/krayon'
import {t} from 'i18next'
import {Chart as ChartJS, ArcElement, Tooltip} from 'chart.js'
import {Bar} from 'react-chartjs-2'
import styles from '../ChartWidgets.module.css'
import {DownloadReport} from '../../../components/DownloadReport'
import {
  FEE_CHART_BG_COLORS,
  FEE_LABEL_MAPPING,
  FEE_CSV_FILE_NAME,
  FEE_CSV_HEADERS,
} from '../../Constants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {DateTime} from 'luxon'

const FeeWidgetStructure = ({getCsvData, createChartData}) => {
  const dispatch = useDispatch()
  const LABELS = Object.values(FEE_LABEL_MAPPING)
  const [chartYAxis, setChartYAxis] = useState([])
  const [feeApiData, setFeeApiData] = useState([])
  const [allTotals, setAllTotals] = useState([])
  const [allDues, setAllDues] = useState([])
  const [allCollections, setAllCollections] = useState([])
  const [allDiscounts, setAllDiscounts] = useState([])
  const [csvData, setCsvData] = useState([])
  const [selectedFilter, setSelectedFilters] = useState([...LABELS])

  const dateDropDown = {
    tillDate: {
      label: 'Till Date',
      value: 'tillDate',
      start_date: '',
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
    dateDropDown.allSession.value
  )

  const chartStructure = useMemo(() => {
    return {
      Total: {
        label: t(LABELS[0]),
        data: allTotals,
        backgroundColor: FEE_CHART_BG_COLORS[0],
        borderWidth: 1,
        borderRadius: 8,
        pointStyle: 'circle',
        pointRadius: 5,
        pointBorderColor: 'rgb(0, 0, 0)',
      },
      Discount: {
        label: t(LABELS[1]),
        data: allDiscounts,
        backgroundColor: FEE_CHART_BG_COLORS[1],
        borderWidth: 1,
        borderRadius: 8,
        pointStyle: 'circle',
        pointRadius: 5,
        pointBorderColor: 'rgb(0, 0, 0)',
      },
      Collection: {
        label: t(LABELS[2]),
        data: allCollections,
        backgroundColor: FEE_CHART_BG_COLORS[2],
        borderWidth: 1,
        borderRadius: 8,
        pointStyle: 'circle',
        pointRadius: 5,
        pointBorderColor: 'rgb(0, 0, 0)',
      },
      Due: {
        label: t(LABELS[3]),
        data: allDues,
        backgroundColor: FEE_CHART_BG_COLORS[3],
        borderWidth: 1,
        borderRadius: 8,
        pointStyle: 'circle',
      },
    }
  }, [allTotals, allDiscounts, allCollections, allDues])

  ChartJS?.register(ArcElement, Tooltip)
  ChartJS.defaults.plugins.legend.display = false

  const orgFeeReport = useSelector(
    (state) => state.globalData.orgFeeReport?.data
  )

  useEffect(() => {
    if (orgFeeReport) {
      setFeeApiData(orgFeeReport)
    }
  }, [orgFeeReport])

  useEffect(() => {
    dispatch(
      globalActions?.getOrgFeeReport?.request({
        start_date: dateDropDown[selectedDateKey].start_date,
        end_date: dateDropDown[selectedDateKey].end_date,
      })
    )
  }, [selectedDateKey])

  const updateAllFeeData = (feeData) => {
    if (feeData.length > 0) {
      let totalFee = [],
        discount = [],
        collection = [],
        dues = [],
        allInstitutes = [],
        csvLines = [[...FEE_CSV_HEADERS]]

      feeData.forEach((data) => {
        allInstitutes.push(data?.institute_id)
        totalFee.push(data?.total_fee)
        discount.push(data?.discount)
        collection.push(data?.collected)
        dues.push(data?.overdue)
        csvLines.push([
          data?.institute_id,
          data?.collected,
          data?.discount,
          data?.overdue,
          data?.total_fee,
        ])
      })

      setCsvData(csvLines)
      setChartYAxis(allInstitutes)
      setAllTotals(totalFee)
      setAllCollections(collection)
      setAllDiscounts(discount)
      setAllDues(dues)
    } else {
      setAllTotals([])
      setAllCollections([])
      setAllDiscounts([])
      setAllDues([])
      setCsvData([])
    }
  }

  useEffect(() => {
    updateAllFeeData(feeApiData)
  }, [feeApiData])

  const FeeChart = () => {
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
          {selectedFilter?.map((filterValue) => {
            return (
              <span key={filterValue} className={styles.legendSpan}>
                <div
                  className={styles.legend}
                  style={{
                    backgroundColor:
                      chartStructure[filterValue]['backgroundColor'],
                  }}
                ></div>
                <span className={styles.legendLabel}>{filterValue}</span>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Widget
      header={{title: 'Fees', icon: 'cash'}}
      classes={{iconFrame: styles.feeIconBgColor}}
      actionButtons={[
        <DownloadReport
          fileName={FEE_CSV_FILE_NAME}
          data={getCsvData(csvData)}
          key={FEE_CSV_FILE_NAME}
        />,
      ]}
      body={
        allTotals.length === 0 ? (
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
                  options={LABELS.map((key) => {
                    return {label: key, value: key}
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
                    dropdownClass: styles.dateDropdown,
                  }}
                />
              </div>
            </div>
            <FeeChart />
          </div>
        )
      }
    />
  )
}

export const FeeWidget = memo(FeeWidgetStructure)

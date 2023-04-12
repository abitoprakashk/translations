import React, {useEffect, useState, useMemo, memo} from 'react'
import {Dropdown, EmptyState, Widget} from '@teachmint/krayon'
import {t} from 'i18next'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Doughnut} from 'react-chartjs-2'
import styles from './FeeWidget.module.css'
import {DownloadReport} from '../../../components/DownloadReport'
import {
  CUMULATIVE_FEE_CHART_BG_COLORS,
  CUMULATIVE_FEE_LABELS,
  FEE_CSV_FILE_NAME,
  FEE_CSV_HEADERS,
} from '../../Constants'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {DateTime} from 'luxon'
import {
  formatCurrencyToCountry,
  getSymbolFromCurrency,
} from '../../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'

const FeeWidgetComponent = ({getCsvData}) => {
  const dispatch = useDispatch()
  const [feeApiData, setFeeApiData] = useState([])
  const [csvData, setCsvData] = useState([])

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

  ChartJS?.register(ArcElement, Tooltip, Legend)

  const orgFeeReport = useSelector(
    (state) => state.globalData.orgFeeReport?.data
  )
  const {instituteListInfo} = useSelector((state) => state)
  const orgCurrency = instituteListInfo?.find(
    (institute) => institute?.currency !== null
  )?.currency

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

  const createPlugin = (parsedData) => {
    return [
      {
        beforeDraw: function (chart) {
          let height = chart.height,
            ctx = chart.ctx
          ctx.restore()
          let fontSize = (height / 200).toFixed(2)
          ctx.font = fontSize + 'em sans-serif'
          ctx.textBaseline = 'center'
          ctx.textAlign = 'center'
          let text = formatCurrencyToCountry(parsedData?.total_fee),
            textX = chart.getDatasetMeta(0).data[0].x,
            textY = chart.getDatasetMeta(0).data[0].y
          ctx.fillText(text, textX, textY)
          ctx.save()
        },
      },
    ]
  }

  const parseData = useMemo(() => {
    let csvLines = [[...FEE_CSV_HEADERS]]
    let tempParseData = feeApiData?.reduce((aggregated, data) => {
      csvLines.push([
        data?.institute_id,
        data?.collected,
        data?.discount,
        data?.overdue,
        data?.total_fee,
      ])
      return {
        total_fee: (aggregated?.total_fee || 0) + data?.total_fee,
        discount: (aggregated?.discount || 0) + data?.discount,
        collected: (aggregated?.collected || 0) + data?.collected,
        overdue: (aggregated?.overdue || 0) + data?.overdue,
      }
    }, {})
    csvLines.push([
      t('total'),
      tempParseData.collected,
      tempParseData.discount,
      tempParseData.overdue,
      tempParseData.total_fee,
    ])
    setCsvData(csvLines)
    return tempParseData
  }, [feeApiData])

  const feeValues = Object.values(parseData)

  const plugins = useMemo(() => {
    return createPlugin(parseData)
  }, [parseData])

  const chartData = useMemo(() => {
    return {
      datasets: [
        {
          label: '',
          data: [parseData.discount, parseData.collected, parseData.overdue],
          backgroundColor: CUMULATIVE_FEE_CHART_BG_COLORS.slice(1),
          borderColor: ['#FFFFFF'],
          borderWidth: 1,
        },
      ],
    }
  }, [parseData])

  const FeeChartComp = ({data, plugins}) => {
    return <Doughnut data={data} plugins={plugins} redraw={false} />
  }

  const FeeChart = memo(FeeChartComp)

  return (
    <Widget
      header={{title: 'Fees', icon: 'cash'}}
      classes={{iconFrame: styles.iconBgColor}}
      actionButtons={[
        <DownloadReport
          fileName={FEE_CSV_FILE_NAME}
          data={getCsvData(csvData)}
          key={FEE_CSV_FILE_NAME}
        />,
      ]}
      body={
        feeValues.length === 0 ? (
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
          <div>
            <div>
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
                classes={{dropdownClass: styles.dateDropDown}}
              />
            </div>
            {parseData.total_fee !== 0 ? (
              <div className={styles.feeWidget}>
                <FeeChart data={chartData} plugins={plugins} />
                <div>
                  {CUMULATIVE_FEE_LABELS.map((label, index) => {
                    return (
                      <div key={`${label}${index}`}>
                        <div
                          className={styles.legend}
                          style={{
                            backgroundColor:
                              CUMULATIVE_FEE_CHART_BG_COLORS[index],
                          }}
                        ></div>
                        <span className={styles.legendLabel}>{label}</span>
                        <span className={styles.legendValue}>
                          <span>
                            {getSymbolFromCurrency(
                              orgCurrency || DEFAULT_CURRENCY
                            )}
                          </span>{' '}
                          {formatCurrencyToCountry(feeValues[index])}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
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
            )}
          </div>
        )
      }
    />
  )
}

export const FeeWidget = React.memo(FeeWidgetComponent)

import {Breadcrumb, DateRangePicker} from '@teachmint/krayon'
import FilterModal from './components/filterModal/filterModal'
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {DateTime} from 'luxon'
import {events} from '../../../utils/EventsConstants'
import {prepareDataForDownloadRequest} from '../../../pages/fee/components/FeeReports/commonFunctions'
import GetChips, {GetDateChipList} from './components/filterChips/filterChips'
import FeeTable from './components/feeTable/feeTable'
import FeeSearchRow from './components/feeSearchRow/feeSearchRow'
import {
  FEE_REPORTS_TITLE,
  FEE_REPORTS_TEMPLATES,
  FEE_WISE_DATE_FILTER,
  isDateRangeVisible,
  hierarchyTypes,
  getColumnMap,
  getFilters,
  dispatchFeeReportType,
  FEE_URL_TO_REPORT_TYPE,
  screenWidth,
} from '../../../pages/fee/fees.constants'
import {
  getCustomTableColumns,
  handleFilterSelectionUtil,
  getColumnSortSymbols,
  handleClassSortUtils,
  onApplyFilter,
  getHierarchyIdMap,
  setDateRangeHelper,
} from './utils/feeReport.utils'
import {fetchFeeTypesRequestedAction} from '../../../pages/fee/redux/feeStructure/feeStructureActions'
import {
  fetchInstalmentDateTimestampAction,
  fetchInstituteFeeTypesAction,
  fetchReportData,
  resetFeeReportStatesAction,
  setFeeReports,
  setDateRangeAction,
  setReportTemplateIdAction,
} from '../../../pages/fee/redux/feeReports/feeReportsAction'
import styles from './FeeReports.module.css'
import {validateReportDownloadButton} from '../../../pages/fee/components/FeeReports/validation'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import useInstituteAssignedStudents from '../../../pages/AttendanceReport/pages/StudentWiseAttendance/hooks/useInstituteAssignedStudents'
const FeeReports = (props) => {
  const {t} = useTranslation()
  const feeReports = useSelector((state) => state.feeReports)
  const {
    feeTypeList,
    months,
    instalmentTimestampList,
    downloadReportData,
    dateRange,
    chequeStatus,
    paymentModes,
    hierarchyIds,
    masterCategoryIds,
    selectedInstalmentTimestamp,
    isPendingChequeDataIncluded,
    loader,
  } = feeReports

  const {
    instituteHierarchy,
    instituteActiveAcademicSessionId,
    instituteAcademicSessionInfo,
    instituteInfo,
  } = useSelector((state) => state)
  const instituteActiveStudentList = useInstituteAssignedStudents()

  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()
  let {type: reportType} = props.match.params
  reportType = FEE_URL_TO_REPORT_TYPE[reportType]
  const [filterTypes, setFilterType] = useState([])
  const [isFilterTypeSet, setIsFilterTypeSet] = useState(false)
  const [selectedFilterType, setSelectedFilterType] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterValues, setFilterValues] = useState({})
  const [tableData, setTableData] = useState([])
  const [isDownloadCategory, setIsDownloadCategroy] = useState(
    reportType !== 'FEE_MISC_ALL_TRANSACTIONS' &&
      reportType !== 'FEE_MISC_CHEQUE_STATUS'
  )
  const [searchKeyWord, setSearchKeyWord] = useState('')
  const [sortColData, setSortColData] = useState({})
  const [ranges, setranges] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })
  const [showDateRangePicker, setshowDateRangePicker] = useState(false)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(
    reportType === FEE_REPORTS_TEMPLATES.FEE_COLLECTION_DAILY.key
      ? 'THIS_MONTH'
      : 'THIS_SESSION'
  )
  const [viewMoreExpanded, setViewMoreExpanded] = useState({})
  const [chipClosed, setChipClosed] = useState('')

  const getEventsParams = () => {
    return {
      screen_name: 'fee_report',
      session: instituteActiveAcademicSessionId,
      fee_type_breakup: isDownloadCategory ? 'yes' : 'no',
      ...FEE_REPORTS_TEMPLATES[reportType].events,
    }
  }

  useEffect(() => {
    let data = []
    if (searchKeyWord !== '') {
      let sourceData = downloadReportData?.data
      if (sourceData && sourceData.length !== 0) {
        let columnMap = getColumnMap(
          FEE_REPORTS_TEMPLATES[reportType].value,
          getSortSymbols
        ).map((col) => {
          return `${col.key}`
        })
        for (let record of sourceData) {
          for (let rec of Object.keys(record)) {
            if (
              columnMap.includes(rec) &&
              record[rec] &&
              typeof record[rec] === 'string' &&
              record[rec].toLowerCase().includes(searchKeyWord.toLowerCase())
            ) {
              data.push(record)
              break
            }
          }
        }
      }
    } else {
      data = [...(downloadReportData?.data ? downloadReportData.data : [])]
    }
    setTableData(data)
  }, [searchKeyWord])

  useEffect(() => {
    dispatch(setReportTemplateIdAction(FEE_REPORTS_TEMPLATES[reportType].value))
  }, [])

  useEffect(() => {
    if (downloadReportData) {
      setTableData(downloadReportData.data ? downloadReportData.data : [])
    }
  }, [downloadReportData])

  const handleDataChange = (myData, dispatchType) => {
    dispatch({
      type: dispatchType,
      payload: myData,
    })
  }

  useEffect(() => {
    setIsFilterTypeSet(true)
    setSelectedFilterType(filterTypes && filterTypes[0])
  }, [filterTypes])

  useEffect(() => {
    let expandedFilter = {}
    filterTypes &&
      Object.keys(filterTypes).map((filt) => {
        expandedFilter[filterTypes[filt].value] = false
      })
    setViewMoreExpanded(expandedFilter)
  }, [filterTypes])

  useEffect(() => {
    const categoryIds = feeTypeList.map(({_id}) => _id)
    setFilterType(getFilters(reportType))
    dispatchFeeReportType(
      reportType,
      getHierarchyIdMap,
      instituteHierarchy,
      dispatch,
      setFeeReports,
      categoryIds,
      instalmentTimestampList,
      months
    )
  }, [instituteHierarchy, feeTypeList])

  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )

  const getSortSymbols = (label, key, sortType) => {
    return getColumnSortSymbols(
      label,
      key,
      sortType,
      sortColData,
      handleClassSortFn
    )
  }

  useEffect(() => {
    // TODO: Put query in state to avoid repetitive calls
    if (
      !loader &&
      instituteActiveStudentList &&
      !validateReportDownloadButton(FEE_REPORTS_TEMPLATES[reportType].value, {
        chequeStatus,
        paymentModes,
        hierarchyIds,
        masterCategoryIds,
        selectedInstalmentTimestamp,
        instituteStudentList: instituteActiveStudentList,
      })
    ) {
      fetchReport()
    }
  }, [
    reportType,
    paymentModes,
    chequeStatus,
    hierarchyIds,
    masterCategoryIds,
    selectedInstalmentTimestamp,
    instituteActiveStudentList,
  ])

  useEffect(() => {
    // TODO: Put query in state to avoid repetitive calls
    if (
      !loader &&
      instituteActiveStudentList &&
      !validateReportDownloadButton(FEE_REPORTS_TEMPLATES[reportType].value, {
        chequeStatus,
        paymentModes,
        hierarchyIds,
        masterCategoryIds,
        selectedInstalmentTimestamp,
        instituteStudentList: instituteActiveStudentList,
      })
    ) {
      fetchReport()
    }
  }, [dateRange])

  useEffect(() => {
    let activeAccademic = instituteAcademicSessionInfo.find(
      (session) => session._id === instituteActiveAcademicSessionId
    )
    let sessionStart = DateTime.now().toFormat('yyyy-MM-dd')
    if (activeAccademic) {
      sessionStart = DateTime.fromSeconds(
        parseInt(activeAccademic.start_time) / 1000
      ).toFormat('yyyy-MM-dd')
    }
    setDateRangeHelper({
      key: selectedTimePeriod,
      dispatch,
      setDateRangeAction,
      sessionStart,
      setshowDateRangePicker,
    })
  }, [])

  useEffect(() => {
    if (!feeTypeList.length) {
      dispatch(fetchInstituteFeeTypesAction())
    }
    dispatch(fetchFeeTypesRequestedAction())
    if (!instalmentTimestampList.length) {
      dispatch(fetchInstalmentDateTimestampAction())
    }

    return () => {
      dispatch(resetFeeReportStatesAction())
    }
  }, [instituteInfo._id])

  const fetchReport = (start_date, end_date, reportAction) => {
    let data = {
      report_type: FEE_REPORTS_TEMPLATES[reportType].value,
      meta: {
        category_breakdown: reportAction && isDownloadCategory,
        report_name: '',
        hierarchy_ids: hierarchyIds ? Object.keys(hierarchyIds) : [],
        category_master_ids: masterCategoryIds,
        timestamps: selectedInstalmentTimestamp,
        date_range: {
          start_date: start_date
            ? start_date
            : DateTime.fromFormat(
                dateRange.startDate,
                'yyyy-MM-dd'
              ).toSeconds(),
          end_date: end_date
            ? end_date
            : DateTime.fromFormat(dateRange.endDate, 'yyyy-MM-dd')
                .endOf('day')
                .toSeconds(),
        },
        is_pending_cheque: isPendingChequeDataIncluded,
        transaction_statuses: chequeStatus.map(function (x) {
          return x.toUpperCase()
        }),
        payment_modes: paymentModes,
      },
      is_saved: false,
    }
    data = prepareDataForDownloadRequest(data)
    data.metaData = {
      instituteInfo,
      reportName: FEE_REPORTS_TITLE[data.report_type],
      sessionStartDate: sessionRange.start_time,
      sessionEndDate: sessionRange.end_time,
      instituteStudentList: instituteActiveStudentList,
      instituteHierarchy,
      feeTypeList,
      reportAction,
      instalmentTimestampList,
    }
    dispatch(fetchReportData(data))
  }

  const BreadcrumbData = [
    {
      label: screenWidth() <= 1024 ? t('reports') : t('reportNAnalytics'),
      to: `/institute/dashboard/fee-reports`,
    },
    {label: t('fee'), to: `/institute/dashboard/fee-reports`},
    {label: FEE_REPORTS_TITLE[FEE_REPORTS_TEMPLATES[reportType]?.value]},
  ]

  const handleClassSortFn = (type, keyVal, sortType) => {
    handleClassSortUtils(
      type,
      keyVal,
      sortType,
      tableData,
      setTableData,
      setSortColData
    )
  }

  const handleFilterSelection = (val) => {
    handleFilterSelectionUtil(
      val,
      instituteAcademicSessionInfo,
      instituteActiveAcademicSessionId,
      eventManager,
      getEventsParams,
      dispatch,
      setDateRangeAction,
      setSelectedTimePeriod,
      setshowDateRangePicker
    )
  }

  const onDone = (val) => {
    onApplyFilter(
      val,
      setranges,
      dispatch,
      setDateRangeAction,
      setSelectedTimePeriod,
      setshowDateRangePicker
    )
  }

  const isDownloadSectionVisible = () => {
    if (
      reportType === 'FEE_MISC_CHEQUE_STATUS' ||
      reportType === 'FEE_MISC_ALL_TRANSACTIONS'
    )
      return false
    return true
  }

  const toggleViewMore = (ftype) => {
    let expandedData = {...viewMoreExpanded}
    expandedData[ftype] = !expandedData[ftype]
    setViewMoreExpanded(expandedData)
  }

  const handleDownloadReport = () => {
    if (!tableData || tableData.length === 0) return
    eventManager.send_event(events.FEE_REPORT_DOWNLOAD_CLICKED_TFI, {
      ...getEventsParams(),
    })
    fetchReport(null, null, 'download')
  }

  const openFilterModal = () => {
    eventManager.send_event(events.FEE_REPORT_FILTER_TFI, {
      ...getEventsParams(),
    })
    setIsModalOpen(true)
  }

  return (
    <>
      <div className={classNames(styles.container, styles.bgWhite)}>
        <FilterModal
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          hierarchyTypes={hierarchyTypes}
          isFilterTypeSet={isFilterTypeSet}
          setIsFilterTypeSet={setIsFilterTypeSet}
          filterTypes={filterTypes}
          selectedFilterType={selectedFilterType}
          setSelectedFilterType={setSelectedFilterType}
          handleDataChange={handleDataChange}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          chipClosed={chipClosed}
          getEventsParams={{...getEventsParams()}}
        />
        <div className={styles.marginBottom20}>
          <Breadcrumb paths={BreadcrumbData} />
        </div>
        <span className={styles.title}>
          {FEE_REPORTS_TITLE[FEE_REPORTS_TEMPLATES[reportType].value]}
        </span>
        <div
          className={classNames(styles.divider, styles.reportTitleDivider)}
        ></div>
        <FeeSearchRow
          reportType={reportType}
          searchKeyWord={searchKeyWord}
          setSearchKeyWord={setSearchKeyWord}
          isDateRangeVisible={isDateRangeVisible}
          FEE_WISE_DATE_FILTER={FEE_WISE_DATE_FILTER}
          handleFilterSelection={handleFilterSelection}
          handleDownloadReport={handleDownloadReport}
          selectedTimePeriod={selectedTimePeriod}
          openFilterModal={openFilterModal}
          loader={loader}
          tableData={tableData}
          isDownloadSectionVisible={isDownloadSectionVisible}
          isDownloadCategory={isDownloadCategory}
          setIsDownloadCategroy={setIsDownloadCategroy}
        />
        <div className={classNames(styles.chipCont)}>
          <div className={styles.dateRangeFilterLabel}>{t('dateRange')}</div>{' '}
          {GetDateChipList(selectedTimePeriod, ranges)?.map((filtVal) => (
            <div
              className={classNames(styles.chipsBox, styles.floatLeft)}
              key={filtVal.id}
            >
              {filtVal.label}
            </div>
          ))}
          {filterTypes &&
            filterTypes.map(
              (filt) =>
                filt.value !== 3 &&
                filt.value !== 0 && (
                  <div className="float-left" key={filt.value}>
                    <div className={styles.chipSeperation}></div>
                    <span
                      className={classNames(
                        styles.dateRangeFilterLabel,
                        styles.floatLeft
                      )}
                    >
                      {filt.label}
                    </span>
                    <GetChips
                      filt={filt}
                      filterValues={filterValues}
                      viewMoreExpanded={viewMoreExpanded}
                      toggleViewMore={toggleViewMore}
                      setFilterValues={setFilterValues}
                      setChipClosed={setChipClosed}
                      chipClosed={chipClosed}
                    />
                  </div>
                )
            )}
        </div>
        <div className={styles.clearBoth}></div>
        {loader && <div className={styles.feeReportLoader} />}
        <FeeTable
          tableData={tableData}
          loader={loader}
          getColumnMap={getColumnMap}
          reportType={reportType}
          getSortSymbols={getSortSymbols}
          instituteInfo={instituteInfo}
          getCustomTableColumns={getCustomTableColumns}
        />
        {showDateRangePicker ? (
          <DateRangePicker
            direction={screenWidth() <= 1024 ? 'vertical' : 'horizontal'}
            maxDate={new Date()}
            ranges={ranges}
            onDone={onDone}
            onClose={() => setshowDateRangePicker(false)}
          />
        ) : null}
      </div>
    </>
  )
}

export default FeeReports

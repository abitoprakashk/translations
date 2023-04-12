import {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import produce from 'immer'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import {
  Button,
  BUTTON_CONSTANTS,
  Chips,
  Para,
  SearchBar,
} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import {
  useLeadList,
  useAdmissionTransactionList,
  useCrmInstituteHierarchy,
} from '../../redux/admissionManagement.selectors'
import {
  dateDurationFilter,
  dateDurationKeys,
  feeTypeStatus,
  feeStatus,
  filterLables,
  filters,
  paymentMode,
  paymentStatus,
} from '../../utils/constants'
import {createAndDownloadCSV, JSObjectToCSV} from '../../../../utils/Helpers'

import {getSpecificLeadData, getClassName} from '../../utils/helpers'
import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'
import styles from './Transactions.module.css'
import DateDropdownFilter from '../Common/DateDropdownFilter/DateDropdownFilter'
import globalActions from '../../../../redux/actions/global.actions'
import {events} from '../../../../utils/EventsConstants'

export default function Transactions() {
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)

  const leadList = useLeadList()
  const transactionlist = useAdmissionTransactionList()
  const instituteHierarchy = useCrmInstituteHierarchy()

  const [searchTerm, setSearchTerm] = useState('')
  const [showOtherFilters, setShowOtherFilters] = useState(false)
  const [filterDate, setFilterDate] = useState({startDate: [], endDate: []})
  const [filterData, setFilterData] = useState({
    classes: [],
    feeTypes: [],
    paymentModes: [],
    paymentStatus: [],
  })

  const [downloadData, setDownloadData] = useState([])

  const isFilterApplied =
    filterData.classes.length > 0 ||
    filterData.feeTypes.length > 0 ||
    filterData.paymentModes.length > 0 ||
    filterData.paymentStatus.length > 0

  const instituteClasses = useMemo(() => {
    let classes = []
    instituteHierarchy?.children?.map((department) => {
      department?.children?.map((cls) => {
        classes.push({
          label: cls.name,
          value: cls.id,
        })
      })
    })
    return classes
  }, [])

  const setFilterStartEndDateData = (filterKey) => {
    if (filterKey !== dateDurationKeys.CUSTOMDATERANGE) {
      let startDate = DateTime.now()
      let endDate = DateTime.now().toSeconds()
      setFilterDate({
        startDate: startDate.minus({months: 1}).toSeconds(),
        endDate: endDate,
      })
    }
  }

  const convertDate = (timeStamp) =>
    DateTime.fromSeconds(timeStamp).toFormat('dd LLL, yyyy')

  useEffect(() => {
    setFilterStartEndDateData(dateDurationFilter[dateDurationKeys.LASTMONTH].id)
  }, [])

  useEffect(() => {
    dispatch(globalActions.transactionList.request())
  }, [])

  if (leadList.isLoading) return <div className="loader"></div>

  const getClassList = (classList) => {
    let classes = []
    classList.map((list) => {
      classes.push({
        id: list,
        label: instituteClasses.find((classIds) => classIds.value === list)
          .label,
      })
    })
    return classes
  }

  const getFeeTypesList = (typeList) => {
    let feeTypes = []
    typeList.map((list) => {
      feeTypes.push({
        id: list,
        label: feeTypeStatus[list].label,
      })
    })
    return feeTypes
  }

  const getPaymentModeList = (paymentModeList) => {
    let modes = []
    paymentModeList.map((list) => {
      modes.push({
        id: list,
        label: paymentMode[list],
      })
    })
    return modes
  }

  const getPaymentStatusList = (paymentStatusList) => {
    let status = []
    paymentStatusList.map((statusList) => {
      status.push({
        id: statusList,
        label: paymentStatus[statusList],
      })
    })
    return status
  }

  const handleChipChange = (key, value) => {
    setFilterData(
      produce(filterData, (draft) => {
        draft[key] = draft[key].filter((val) => val !== value)
      })
    )
  }

  const handdleButtonClick = () => {
    setFilterData({
      classes: [],
      feeTypes: [],
      paymentModes: [],
      paymentStatus: [],
    })
  }

  const getChipList = (list) => {
    switch (list) {
      case filters.classes:
        return getClassList(filterData.classes)
      case filters.feeTypes:
        return getFeeTypesList(filterData.feeTypes)
      case filters.paymentModes:
        return getPaymentModeList(filterData.paymentModes)
      case filters.paymentStatus:
        return getPaymentStatusList(filterData.paymentStatus)
    }
  }

  const renderFilterChip = (filterKey) => {
    return (
      <Chips
        className={styles.chipUnsetMargin}
        onChange={(e) => handleChipChange(filterKey, e)}
        chipList={getChipList(filterKey)}
      />
    )
  }

  const renderChips = () => {
    return (
      <div className={styles.filteredChips}>
        {Object.keys(filterData).map((filter) => {
          if (
            Array.isArray(filterData[filter])
              ? filterData[filter].length > 0
              : filterData[filter]
          )
            return (
              <div key={filter} className={styles.filterItem}>
                <Para className={styles.filterSpanStyle}>
                  {filterLables[filter]}
                </Para>
                <div>{renderFilterChip(filter, filterData[filter])}</div>
              </div>
            )
        })}
        <Button
          children={t('clearAll')}
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
          classes={{button: styles.btnClass}}
          onClick={handdleButtonClick}
        />
      </div>
    )
  }

  const getDownloadList = () => {
    const rows = {
      lead_id: 'Lead Id',
      reciept_no: 'Receipt No.',
      transaction_id: 'Transaction Id',
      name: 'Student Name',
      number: 'Mobile Number',
      class: 'Class',
      amount: 'Amount Paid',
      fee_type: 'Fee Type',
      date: 'Payment Date',
      status: 'Payment Status',
      mode: 'Payment Mode',
    }
    const requiredData =
      downloadData === undefined ? transactionlist?.data : downloadData
    const download_rows = requiredData?.map((rowData) => {
      const lead = getSpecificLeadData(leadList?.data, rowData?.lead_id)
      const leadName = lead
        ? `${lead?.profile_data?.name ?? ''} ${
            lead?.profile_data?.last_name ?? ''
          }`
        : null
      return {
        lead_id: rowData.lead_id,
        reciept_no: rowData.receipt_no,
        transaction_id: rowData._id,
        name: leadName ?? 'Deleted User',
        number: lead?.phone_number,
        class: lead
          ? getClassName(instituteHierarchy, lead?.class_id)
          : t('na'),
        amount: rowData.amount,
        fee_type: feeTypeStatus[rowData?.fee_type].label,
        date: convertDate(rowData.order_timestamp),
        status: feeStatus[rowData.status].label,
        mode: paymentMode[rowData.payment_mode],
      }
    })
    download_rows.splice(0, 0, rows)
    return download_rows
  }

  const handleDownload = () => {
    eventManager.send_event(events.ADMISSION_REPORT_DOWNLOAD_CLICKED_TFI, {
      screen_name: 'transaction',
    })
    const reportName = 'Transaction Report'
    createAndDownloadCSV(reportName, JSObjectToCSV([], getDownloadList()))
  }

  return (
    <ErrorBoundary>
      <div className={styles.searchData}>
        <div className={styles.searchbarwidth}>
          <SearchBar
            value={searchTerm}
            placeholder={t('searchVia')}
            handleChange={({value}) => setSearchTerm(value)}
            showSuggestion={false}
          />
        </div>
        <div className={styles.btnClick}>
          <div
            className={styles.dropdownWrapper}
            onClick={() => {
              eventManager.send_event(
                events.ADMISSION_SORT_FILTER_CLICKED_TFI,
                {screen_name: 'transaction_screen'}
              )
            }}
          >
            <DateDropdownFilter
              handleChange={(val) => {
                eventManager.send_event(
                  events.ADMISSION_SORT_FILTER_SELECTED_TFI,
                  {value: val, screen_name: 'transaction_screen'}
                )
                setFilterDate(val)
              }}
            />
          </div>
          <Button
            onClick={() => {
              eventManager.send_event(
                events.ADMISSION_TRANSACTION_FILTERS_CLICKED_TFI
              )
              setShowOtherFilters(!showOtherFilters)
            }}
            prefixIcon={'filter'}
            type={BUTTON_CONSTANTS.TYPE.OUTLINE}
          >
            {t('filters')}
          </Button>
          <Button
            type={BUTTON_CONSTANTS.TYPE.FILLED}
            prefixIcon="download"
            children={t('downloadReportLeadListTransactionFollowup')}
            onClick={handleDownload}
            isDisabled={downloadData?.length === 0}
          />
          {showOtherFilters && (
            <TransactionFilters
              showOtherFilters={showOtherFilters}
              setShowOtherFilters={setShowOtherFilters}
              filterData={filterData}
              setFilterData={setFilterData}
            />
          )}
        </div>
      </div>
      {isFilterApplied && <div className={styles.filters}>{renderChips()}</div>}
      <div className={styles.tableStyle}>
        <TransactionTable
          leadList={leadList}
          list={transactionlist}
          searchTerm={searchTerm}
          filterData={filterData}
          filterDate={filterDate}
          instituteClasses={instituteClasses}
          setDownloadData={setDownloadData}
        />
      </div>
    </ErrorBoundary>
  )
}

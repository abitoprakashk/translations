import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, Modal, Icon} from '@teachmint/krayon'
import {getAcademicSessionMonths} from '../../../../../utils/Helpers'
import {inputFields} from './InputFields'
import {events} from '../../../../../utils/EventsConstants'
import {
  FEE_REPORTS_TEMPLATES,
  FIELD_SORT,
  LABEL_BY_REPORT_WISE,
  SELECT_ALL_OPTION,
  ICON_SIZES,
} from '../../../../../pages/fee/fees.constants'
import Filters from './filters/filters'
import classNames from 'classnames'
import styles from '../../FeeReports.module.css'

export default function FilterModal({
  filterValues,
  setFilterValues,
  filterTypes,
  selectedFilterType,
  setSelectedFilterType,
  handleDataChange,
  isModalOpen,
  setIsModalOpen,
  chipClosed,
  getEventsParams,
  isFilterTypeSet,
  setIsFilterTypeSet,
}) {
  const {t} = useTranslation()
  const {instituteAcademicSessionInfo, instituteActiveAcademicSessionId} =
    useSelector((state) => state)

  const {eventManager} = useSelector((state) => state)

  const [initialFilterValues, setInitialFilterValues] = useState({})
  const [modalFilterValue, setModalFilterValues] = useState([])
  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )
  const sessionMonths = getAcademicSessionMonths(
    sessionRange.start_time,
    sessionRange.end_time
  )

  const {
    dateRange,
    months,
    paymentModes,
    isPendingChequeDataIncluded,
    reportTemplateId,
    hierarchyIds,
    masterCategoryIds,
    feeTypeList,
    instalmentTimestampList,
    selectedInstalmentTimestamp,
    chequeStatus,
  } = useSelector((state) => state.feeReports)

  const state = useSelector((state) => state)
  const {instituteHierarchy} = state

  let allStates = {
    dateRange,
    paymentModes,
    isPendingChequeDataIncluded,
    masterCategoryIds,
    hierarchyIds,
    months,
    selectedInstalmentTimestamp,
    chequeStatus,
    reportTemplateId,
    feeTypeList,
    instalmentTimestampList,
    instituteHierarchy,
    sessionMonths,
  }

  const getSelectedNodes = (nodes, type, dispatchType) => {
    const ids = {}
    Object.keys(nodes).map((node) => {
      if (nodes[node].type === type) {
        ids[node] = true
      }
    })
    handleFilterDataChange(ids, dispatchType)
  }

  const handleFilterDataChange = (obj1, obj2) => {
    let prevFilterType = {...modalFilterValue}
    let selectedftype = selectedFilterType.value
    if (
      selectedftype !== LABEL_BY_REPORT_WISE.CLASS_WISE &&
      selectedftype !== LABEL_BY_REPORT_WISE.DEPARTMENT_WISE
    ) {
      let isSelectedAll = prevFilterType[
        selectedFilterType.value
      ]?.param1.includes(SELECT_ALL_OPTION.value)
      let isChangeHasSelectAll = obj1.includes(SELECT_ALL_OPTION.value)
      if (isChangeHasSelectAll && !isSelectedAll) {
        prevFilterType[selectedftype] = {
          param1: selectAllFunction(),
          param2: obj2,
        }
      } else if (isSelectedAll && !isChangeHasSelectAll) {
        prevFilterType[selectedftype] = {param1: [], param2: obj2}
      } else if (isSelectedAll && isChangeHasSelectAll) {
        let selectedArr = [...obj1]
        let selectedAllIdx = selectedArr.findIndex(
          (str) => str === SELECT_ALL_OPTION.value
        )
        if (selectedAllIdx !== -1) selectedArr.splice(selectedAllIdx, 1)
        prevFilterType[selectedftype] = {param1: selectedArr, param2: obj2}
      } else {
        let excludes = [
          ...initialFilterValues[selectedftype].param1.filter(
            (x) => !obj1.includes(x)
          ),
        ]
        let selectedArr = [...obj1]
        if (excludes.length === 1 && excludes[0] === SELECT_ALL_OPTION.value) {
          selectedArr = selectedArr.filter(
            (val) => val !== SELECT_ALL_OPTION.value
          )
          selectedArr.unshift(SELECT_ALL_OPTION.value)
        }
        prevFilterType[selectedFilterType.value] = {
          param1: selectedArr,
          param2: obj2,
        }
      }
    } else {
      prevFilterType[selectedFilterType.value] = {param1: obj1, param2: obj2}
    }
    setModalFilterValues(prevFilterType)
  }

  const selectAllFunction = () => {
    let selectedArr = [...initialFilterValues[selectedFilterType.value]?.param1]
    selectedArr = selectedArr.filter((val) => val !== SELECT_ALL_OPTION.value)
    selectedArr.unshift(SELECT_ALL_OPTION.value)
    return selectedArr
  }

  const applyFilter = (initialFilterValues, closeModal = true) => {
    let filtValues = modalFilterValue
    if (initialFilterValues) {
      filtValues = initialFilterValues
    }
    let feeRepFilterValue = {...filterValues}
    let filtrArr = [...sortBy(numberItems)]

    filtValues &&
      Object.keys(filtValues).map((filtr) => {
        let optList = []
        if (filtrArr && filtr !== '3' && filtr !== '0') {
          filtrArr.map((filt) => {
            if (
              filt.isVisible &&
              filt.feeReportType !== LABEL_BY_REPORT_WISE.CLASS_WISE &&
              filt.feeReportType !== LABEL_BY_REPORT_WISE.DEPARTMENT_WISE &&
              feeRepFilterValue[filt.feeReportType]
            ) {
              for (let opt of filt.inputField.options) {
                if (filtValues[filtr].param1.includes(opt.value)) {
                  optList.push({
                    id: opt.value,
                    label: opt.label,
                  })
                }
              }
            }
          })
          feeRepFilterValue[filtr] = {
            param1: filtValues[filtr].param1,
            param2: filtValues[filtr].param2,
            options: optList,
          }
        }
        if (
          filtValues[filtr] &&
          filtValues[filtr].param2 &&
          filtValues[filtr].param1
        ) {
          let filterDataValues = filtValues[filtr].param1
          if (filtr !== '3' && filtr !== '0') {
            filterDataValues = filterDataValues.filter(
              (val) => val !== SELECT_ALL_OPTION.value
            )
          }
          handleDataChange(filterDataValues, filtValues[filtr].param2)
        }
      })
    let eventDataParam = {}
    Object.keys(feeRepFilterValue).map((filt) => {
      eventDataParam[feeRepFilterValue[filt].param2] =
        feeRepFilterValue[filt].param1
    })
    eventManager.send_event(events.FEE_REPORT_APPLY_FILTER_TFI, {
      ...getEventsParams,
      filter_data: {...eventDataParam},
    })
    setFilterValues(feeRepFilterValue)
    if (closeModal) handleModalClose()
  }

  const setInitialState = () => {
    let filtrArr = [...sortBy(numberItems)]
    let filtrObj = {}
    filtrArr &&
      filtrArr.map((filt) => {
        if (filt && filt.isVisible) {
          let valueArr = filt.inputField.value
          let obj = {}
          let optList = []
          if (
            filt.feeReportType !== LABEL_BY_REPORT_WISE.CLASS_WISE &&
            filt.feeReportType !== LABEL_BY_REPORT_WISE.DEPARTMENT_WISE
          ) {
            optList = filt.inputField.options.map((opt) => {
              return {
                id: opt.value,
                label: opt.label,
              }
            })
            valueArr = filt.inputField.options.map((opt) => opt.value)
            valueArr = [...valueArr]
            valueArr.unshift(SELECT_ALL_OPTION.value)
          }
          obj = {param1: valueArr, param2: filt.dispatchType, options: optList}
          filtrObj[filt.feeReportType] = obj
        }
      })
    setInitialFilterValues(filtrObj)
    setFilterValues(filtrObj)
    setModalFilterValues(filtrObj)
  }

  useEffect(() => {
    if (
      isFilterTypeSet !== 'Stop' &&
      isFilterTypeSet !== false &&
      instituteHierarchy &&
      hierarchyIds !== null &&
      instalmentTimestampList
    ) {
      setInitialState()
      setIsFilterTypeSet('Stop')
    }
  }, [
    isFilterTypeSet,
    instituteHierarchy,
    hierarchyIds,
    instalmentTimestampList,
  ])

  useEffect(() => {
    if (chipClosed !== '') {
      setModalFilterValues(filterValues)
      applyFilter(filterValues)
    }
  }, [chipClosed])

  const handleIsPendingChequeDataIncluded = () => {
    // dispatch(setIsPendingChequeDataIncludedAction(checked))
  }

  let allFunctions = {
    t,
    getSelectedNodes,
    handleIsPendingChequeDataIncluded,
  }

  const numberItems = inputFields(allStates, allFunctions, styles)

  function sortBy(array, keys = null, isSelectedFilterReq) {
    if (keys === null) {
      keys = FIELD_SORT.DEFAULT
      let sequence = Object.values(FEE_REPORTS_TEMPLATES).find(
        (report) => report.value === reportTemplateId
      )

      if (typeof sequence?.sort !== 'undefined') {
        keys = sequence.sort
      }
    }

    let sortedArr = []
    array.forEach((ele) => {
      if (isSelectedFilterReq) {
        if (
          selectedFilterType &&
          selectedFilterType.value !== ele.feeReportType
        ) {
          return null
        }
      } else {
        if (
          filterTypes &&
          !filterTypes.find((filt) => filt.value === ele.feeReportType)
        ) {
          return null
        }
      }
      let index = keys.indexOf(ele.id)
      if (index != -1) {
        // element found
        if (typeof sortedArr[index] !== 'undefined') {
          sortedArr.splice(index, 0, ele)
        } else {
          sortedArr[index] = ele
        }
      } else {
        // element not found
        sortedArr.push(ele)
      }
    })
    return sortedArr
  }

  const getNumberSuffix = (num) => {
    return ['st', 'nd', 'rd'][((((num + 90) % 100) - 10) % 10) - 1] || 'th'
  }

  const getInstallmentLabels = (filterObj, opt) => {
    if (filterObj.dispatchType === 'SET_INSTALMENT_TIMESTAMP') {
      let optArr = [...filterObj.inputField.options]
      let tempArr = [],
        instIndex = 0
      for (let inst of optArr) {
        instIndex++
        tempArr.push({
          label: `${instIndex}${getNumberSuffix(instIndex)} Installment - ${
            inst.label
          }`,
          value: inst.value,
        })
      }
      tempArr.unshift(SELECT_ALL_OPTION)
      return tempArr
    }
    opt.unshift(SELECT_ALL_OPTION)
    return opt
  }

  const checkIfApplyFilterDisabled = () => {
    let isEmpty = false
    modalFilterValue &&
      Object.keys(modalFilterValue).map((filtr) => {
        if (modalFilterValue[filtr]?.param1?.length === 0) {
          isEmpty = true
        }
      })
    return isEmpty
  }

  const handleModalClose = () => {
    if (checkIfApplyFilterDisabled()) {
      alert('Please select filters')
      return
    }
    setIsModalOpen(false)
  }

  const filterModal = () => {
    return (
      <div className={styles.filterModalCont}>
        <div className={classNames(styles.height64, styles.filterModalHeader)}>
          <div className={styles.addFilterTitle}>
            <span
              className={styles.mobileView}
              onClick={() => handleModalClose()}
            >
              <Icon
                name="arrowBackIos"
                size={ICON_SIZES.SIZES.XXX_SMALL}
                type="inverted"
              />
              &ensp;
            </span>{' '}
            {t('addFilter')}
          </div>
          <div
            className={classNames(styles.subHeading, styles.modalSubHeading)}
          >
            {t('selectedFilterWillBeApplied')}
          </div>
          <div
            className={styles.filterModalClose}
            onClick={() => handleModalClose()}
          >
            <Icon name="close" size="s" type="secondary" />{' '}
          </div>
        </div>
        <div className={classNames(styles.filterSelectPart, styles.flex)}>
          <div className={classNames(styles.filterCategory, styles.width208)}>
            {filterTypes.map((filter, index) => (
              <div
                key={index}
                className={classNames(
                  styles.filterCategoryOpts,
                  selectedFilterType?.label === filter.label
                    ? styles.selectedFilterCat
                    : ''
                )}
                onClick={() => setSelectedFilterType(filter)}
              >
                {filter.label}{' '}
                <Icon
                  name="backArrow"
                  size={ICON_SIZES.SIZES.X_SMALL}
                  type="basic"
                  className={styles.filterCategoryArrow}
                />
              </div>
            ))}
          </div>
          <Filters
            sortBy={sortBy}
            numberItems={numberItems}
            selectedFilterType={selectedFilterType}
            modalFilterValue={modalFilterValue}
            getInstallmentLabels={getInstallmentLabels}
            handleFilterDataChange={handleFilterDataChange}
          />
        </div>
        <div className={styles.filterApplyBtnCont}>
          <div className={styles.filterApplyBtn}>
            <div onClick={() => !checkIfApplyFilterDisabled() && applyFilter()}>
              <Button
                isDisabled={checkIfApplyFilterDisabled()}
                type="filled"
                size="m"
                category="primary"
                children={<div>{t('applyFilters')}</div>}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Modal
      size={ICON_SIZES.SIZES.MEDIUM}
      isOpen={isModalOpen}
      children={filterModal()}
      onClose={() => handleModalClose()}
      classes={{
        modal: styles.filterModalLayout,
        content: styles.filterModalContent,
      }}
    />
  )
}

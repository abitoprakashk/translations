import React, {useContext, useEffect} from 'react'
import styles from './FeeStructure.module.css'
import {Table, Input, Heading, HEADING_CONSTANTS} from '@teachmint/krayon'
import {collectFeeOptionsIds} from '../../../../../../fees.constants'
import getSymbolFromCurrency from 'currency-symbol-map'
import {useSelector, useDispatch} from 'react-redux'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../utils/Helpers'
import PreviousSessionDues from './PreviousSessionDues'
import produce from 'immer'
import {useFeeCollection} from '../../../../../../redux/feeCollectionSelectors'
import {
  roundWithPrecision,
  getPlainAmountFixDecimalWithCurrency,
} from '../../../../../../../../utils/Helpers'
import {Trans} from 'react-i18next'
import {DEFAULT_CURRENCY} from '../../../../../../../../constants/common.constants'
import {setDiscountStatesAction} from '../../../../../../redux/feeDiscountsActions'
import {CollectFeeModalContext} from '../../../../../context/CollectFeeModalContext/CollectFeeModalContext'
import {t} from 'i18next'
import InstallmentFeeTypes from './InstallmentFeeTypes'
import DiscountAmount from './DiscountAmount'

export default function FeeStructure({
  instituteCurrency,
  AdHocDiscountModal,
  resetAdHocValues,
  refreshParent,
}) {
  const {
    adHocDiscountReasons,
    isCreateReasonModalOpen,
    selectedRecordType,
    isAdHocModalOpen,
    setIsAdHocModalOpen,
    isPreviousSessionDueDiscount,
    setIsPreviousSessionDueDiscount,
    lumpsumAmount,
    selectedReasons,
    setSelectedReasons,
    recordSelectedForAdHoc,
    setRecordSelectedForAdHoc,
    adHocDiscountValues,
    setAdHocDiscountValues,
    isEditAdHocDiscount,
    setIsEditAdHocDiscount,
    rowsData,
    setRowsData,
    previousSessionRowsData,
    setPreviousSessionRowsData,
    setTotal,
    adHocDiscountValuesArr,
    setAdHocDiscountValuesArr,
  } = useContext(CollectFeeModalContext)

  const dispatch = useDispatch()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const {collectFees} = useFeeCollection()
  const collapseInstallment = (index) => {
    const rowData = Object.assign({}, rowsData[index])
    const tempRowsData = [...rowsData]
    rowData.icon = rowData.icon == 'downArrow' ? 'forwardArrow' : 'downArrow'
    tempRowsData[index] = rowData
    if (rowData.type == 'month') {
      tempRowsData
        .filter((row) => row.parentId == rowData.id)
        .map((filteredRow) => {
          const childIndex = tempRowsData.indexOf(filteredRow)
          const childRowData = Object.assign({}, filteredRow)
          childRowData.hidden = !childRowData.hidden
          tempRowsData[childIndex] = childRowData
        })
    }
    setRowsData(tempRowsData)
  }

  const handleAddAdHocDiscountValue = (previous_session = false, params) => {
    let monthDetail = previous_session
      ? previousSessionRowsData.find((row) => row.id === params.parentId)
      : rowsData.find((row) => row.id === params.parentId)
    let feeTypeDetail = previous_session
      ? previousSessionRowsData.find((row) => row.id === monthDetail.parentId)
      : rowsData.find((row) => row.id === monthDetail.parentId)

    let recordedAdHoc = {
      ...params,
      studentId: collectFees.Id,
      studentName: collectFees.name,
      monthDetail: monthDetail ? monthDetail.name : '',
      feeTypeName: feeTypeDetail ? feeTypeDetail.name : '',
    }

    setRecordSelectedForAdHoc(recordedAdHoc)

    let adHocDiscountData = adHocDiscountValuesArr.find(
      (adHoc) => adHoc.childLevelId === params.id
    )

    if (adHocDiscountData) {
      setAdHocDiscountValues({
        ...adHocDiscountValues,
        ...adHocDiscountData,
      })
      setIsEditAdHocDiscount(true)
    } else {
      setAdHocDiscountValues({
        ...adHocDiscountValues,
        childLevelId: params.id,
        isChecked: true,
        parentId: params.parentId,
        grandParentId: monthDetail.parentId,
      })
    }

    setIsAdHocModalOpen(true)
    setIsPreviousSessionDueDiscount(previous_session)
  }

  const handleChangeAdHocDiscountValue = (obj) => {
    let modalValue = false
    let adHocValues = {...adHocDiscountValues}
    if (obj.fieldName === 'discountAmount') {
      let value = obj.value !== '' && obj.value >= 0 ? +obj.value : ''
      let dueAmount =
        selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE
          ? recordSelectedForAdHoc?.due
          : +lumpsumAmount

      if (dueAmount < value) {
        value = ''
        setRecordSelectedForAdHoc({
          ...recordSelectedForAdHoc,
          discountAmountError:
            selectedRecordType === collectFeeOptionsIds.BY_FEE_STRUCTURE ? (
              t('amountValidation', {
                dueAmount: roundWithPrecision(dueAmount),
              })
            ) : (
              <Trans i18nKey={'lumpsumpAmountErrorMsg'}>
                Lump sum can&quot;t be more than due fee{' '}
                <div className="inline-flex">
                  <span>
                    {getSymbolFromCurrency(
                      instituteInfo.currency || DEFAULT_CURRENCY
                    )}
                  </span>
                  <span className="ml-1">{`${getPlainAmountFixDecimalWithCurrency(
                    dueAmount,
                    instituteInfo.currency
                  )}`}</span>
                </div>
              </Trans>
            ),
        })
      } else if (recordSelectedForAdHoc?.discountAmountError) {
        setRecordSelectedForAdHoc({
          ...recordSelectedForAdHoc,
          discountAmountError: '',
        })
      }
      setAdHocDiscountValues({...adHocValues, discountAmount: value})
    } else if (obj.fieldName === 'remarks') {
      setAdHocDiscountValues({...adHocValues, remarks: obj.value})
    } else if (obj.fieldName === 'reason') {
      if (obj?.value === 'noneOfAbove') {
        modalValue = true
      } else if (isCreateReasonModalOpen) {
        modalValue = false
      }

      setAdHocDiscountValues({...adHocValues, adHocReasonId: obj.value})

      dispatch(
        setDiscountStatesAction({
          isCreateReasonModalOpen: modalValue,
        })
      )
    }
  }

  const isAdHocDiscountApplied = (rowData) => {
    return (
      adHocDiscountValuesArr.length > 0 &&
      adHocDiscountValuesArr.find((value) => value.childLevelId === rowData.id)
    )
  }

  const updateRowsDataHelper = (data) => {
    return produce(data, (draft) => {
      const row = draft.find((r) => r.id === recordSelectedForAdHoc.id)
      row.paid = (row.due - +adHocDiscountValues.discountAmount).toFixed(2)
      row.amount = (row.due - +adHocDiscountValues.discountAmount).toFixed(2)
      row.adHocDiscountAmount = +adHocDiscountValues.discountAmount
      refreshParent(row, draft)
    })
  }

  const handleAddAdHocDiscountClick = (isPreviousSession) => {
    let newAdHocDiscountValues = adHocDiscountValuesArr.filter(
      (adHoc) => adHoc.childLevelId !== adHocDiscountValues.childLevelId
    )
    setAdHocDiscountValuesArr([
      ...newAdHocDiscountValues,
      {...adHocDiscountValues},
    ])
    if (isPreviousSession) {
      setPreviousSessionRowsData(updateRowsDataHelper(previousSessionRowsData))
    } else {
      setRowsData(updateRowsDataHelper(rowsData))
    }
    setIsAdHocModalOpen(false)
  }

  const updateAmountToBePaid = (
    previous_session = false,
    due,
    amount,
    index
  ) => {
    if (previous_session) {
      setPreviousSessionRowsData(
        produce(previousSessionRowsData, (draft) => {
          const row = draft[index]
          row.amount = amount > due ? due : amount
          row.paid = amount > due ? due : amount
          refreshParent(row, draft)
        })
      )
    } else {
      setRowsData(
        produce(rowsData, (draft) => {
          const row = draft[index]
          row.amount = amount > due ? due : amount
          row.paid = amount > due ? due : amount
          refreshParent(row, draft)
        })
      )
    }
  }

  const updateRowsData = (draft, index) => {
    const row = draft[index]
    const selected = row.selected
    row.selected = !selected
    row.amount = selected ? 0 : row.due
    if (row.type == 'month') {
      draft
        .filter((r) => r.parentId == row.id)
        .map((filteredRow) => {
          filteredRow.selected = !selected
          filteredRow.amount = selected ? 0 : filteredRow.due
          filteredRow.adHocDiscountAmount = selected
            ? 0
            : filteredRow.adHocDiscountAmount
        })
    } else {
      row.adHocDiscountAmount = selected ? 0 : row.adHocDiscountAmount
      refreshParent(row, draft)
    }
    if (adHocDiscountValuesArr.length > 0) {
      const newAdHocDiscountValuesArr = adHocDiscountValuesArr.filter(
        (adHoc) =>
          adHoc[row.type == 'month' ? 'parentId' : 'childLevelId'] !== row.id
      )
      setAdHocDiscountValuesArr([...newAdHocDiscountValuesArr])
    }
  }

  const toggleCheckBox = (previous_session = false, index) => {
    if (previous_session) {
      setPreviousSessionRowsData(
        produce(previousSessionRowsData, (draft) => {
          return updateRowsData(draft, index)
        })
      )
    } else {
      setRowsData(
        produce(rowsData, (draft) => {
          return updateRowsData(draft, index)
        })
      )
    }
  }

  useEffect(() => {
    let total = 0
    rowsData.forEach(function (item) {
      if (item.type === 'childLevel' && item.selected)
        total += item.amount != null ? parseFloat(item.amount || 0) : item.due
    })
    setTotal(total)
  }, [rowsData])

  const rows = rowsData.map((rowData, i) => ({
    installmentFeeTypes: (
      <InstallmentFeeTypes
        rowData={rowData}
        toggleCheckBox={toggleCheckBox}
        collapseInstallment={collapseInstallment}
        isPreviousSession={false}
        index={i}
      />
    ),
    totalFee: (
      <span className={styles.totalFees}>
        {getAmountFixDecimalWithCurrency(rowData.fee, instituteCurrency)}
      </span>
    ),
    disocuntAmount: (
      <DiscountAmount
        rowData={rowData}
        isPreviousSession={false}
        handleAddAdHocDiscountValue={handleAddAdHocDiscountValue}
        isAdHocDiscountApplied={isAdHocDiscountApplied}
      />
    ),
    dueAmount: (
      <span className={styles.dueAmount}>
        {getAmountFixDecimalWithCurrency(rowData.due, instituteCurrency)}
      </span>
    ),
    amountToBePaid:
      rowData.type == 'month' ? (
        rowData.selected ? (
          <span className={styles.amountToBePaid}>
            {getAmountFixDecimalWithCurrency(
              rowData.amount,
              instituteInfo.currency
            )}
          </span>
        ) : (
          <span className={styles.amountToBePaid}>
            {getAmountFixDecimalWithCurrency(0, instituteInfo.currency)}
          </span>
        )
      ) : (
        <Input
          fieldName="textField"
          isRequired
          value={rowData.selected ? roundWithPrecision(rowData.amount) : 0}
          onChange={(e) => {
            if (e.value < 0) return
            updateAmountToBePaid(false, rowData.due, e.value, i)
          }}
          type="number"
          min="0"
          prefix={
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
              {getSymbolFromCurrency(instituteCurrency)}
            </Heading>
          }
        />
      ),
    hidden: rowData.hidden,
  }))

  const cols = [
    {key: 'installmentFeeTypes', label: t('feeStructureTableInstallment')},
    {key: 'totalFee', label: t('feeStructureTableTotalFees')},
    {key: 'disocuntAmount', label: t('feeStructureTableDiscount')},
    {key: 'dueAmount', label: t('feeStructureTableDueAmount')},
    {key: 'amountToBePaid', label: t('feeStructureTableAmountToBePaid')},
  ]

  return (
    <>
      {previousSessionRowsData.length > 0 && (
        <PreviousSessionDues
          handleAddAdHocDiscountValue={handleAddAdHocDiscountValue}
          isAdHocDiscountApplied={isAdHocDiscountApplied}
          updateAmountToBePaid={updateAmountToBePaid}
          toggleCheckBox={toggleCheckBox}
        />
      )}
      <Table
        rows={rows.filter((r) => {
          return r.hidden == false
        })}
        cols={cols}
      />
      {isAdHocModalOpen && (
        <AdHocDiscountModal
          isShowOpen={isAdHocModalOpen}
          handleCancleAddAdHocDiscount={() => setIsAdHocModalOpen(false)}
          adHocDiscountReasons={adHocDiscountReasons}
          selectedReasons={selectedReasons}
          setSelectedReasons={setSelectedReasons}
          isCreateReasonModalOpen={isCreateReasonModalOpen}
          recordSelectedForAdHoc={recordSelectedForAdHoc}
          handleAddAdHocDiscountClick={handleAddAdHocDiscountClick}
          adHocDiscountValues={adHocDiscountValues}
          handleChangeAdHocDiscountValue={handleChangeAdHocDiscountValue}
          resetAdHocValues={resetAdHocValues}
          setAdHocDiscountValues={setAdHocDiscountValues}
          isEditAdHocDiscount={isEditAdHocDiscount}
          collectFeeType={selectedRecordType}
          isPreviousSession={isPreviousSessionDueDiscount}
        />
      )}
    </>
  )
}

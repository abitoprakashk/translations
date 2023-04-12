import React, {useContext} from 'react'
import styles from './FeeStructure.module.css'
import {Table, Input, Heading, HEADING_CONSTANTS} from '@teachmint/krayon'
import getSymbolFromCurrency from 'currency-symbol-map'
import {useEffect} from 'react'
import {getAmountFixDecimalWithCurrency} from '../../../../../../../../utils/Helpers'
import {t} from 'i18next'
import InstallmentFeeTypes from './InstallmentFeeTypes'
import DiscountAmount from './DiscountAmount'
import {CollectFeeModalContext} from '../../../../../context/CollectFeeModalContext/CollectFeeModalContext'
import {useSelector} from 'react-redux'

export default function PreviousSessionDues({
  handleAddAdHocDiscountValue,
  isAdHocDiscountApplied,
  updateAmountToBePaid,
  toggleCheckBox,
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const {
    previousSessionRowsData,
    setPreviousSessionRowsData,
    setTotalPreviousSessionDue,
  } = useContext(CollectFeeModalContext)
  const collapseInstallment = (index) => {
    const rowData = Object.assign({}, previousSessionRowsData[index])
    const tempRowsData = [...previousSessionRowsData]
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
    setPreviousSessionRowsData(tempRowsData)
  }

  useEffect(() => {
    let total = 0
    previousSessionRowsData.forEach(function (item) {
      if (item.type === 'childLevel' && item.selected === true)
        total += item.amount != null ? parseFloat(item.amount || 0) : item.due
    })
    setTotalPreviousSessionDue(total)
  }, [previousSessionRowsData])

  const rows = previousSessionRowsData.map((rowData, i) => ({
    installmentFeeTypes: (
      <InstallmentFeeTypes
        rowData={rowData}
        toggleCheckBox={toggleCheckBox}
        collapseInstallment={collapseInstallment}
        isPreviousSession={true}
        index={i}
      />
    ),
    totalFee: (
      <span className={styles.totalFees}>
        {getAmountFixDecimalWithCurrency(rowData.fee, instituteInfo.currency)}
      </span>
    ),
    disocuntAmount: (
      <DiscountAmount
        rowData={rowData}
        isPreviousSession={true}
        handleAddAdHocDiscountValue={handleAddAdHocDiscountValue}
        isAdHocDiscountApplied={isAdHocDiscountApplied}
      />
    ),
    dueAmount: (
      <span className={styles.dueAmount}>
        {getAmountFixDecimalWithCurrency(rowData.due, instituteInfo.currency)}
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
          value={rowData.selected ? rowData.amount : 0}
          onChange={(e) => updateAmountToBePaid(true, rowData.due, e.value, i)}
          type="number"
          prefix={
            <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.SMALL}>
              {getSymbolFromCurrency(instituteInfo.currency)}
            </Heading>
          }
        />
      ),
    hidden: rowData.hidden,
  }))

  const cols = [
    {
      key: 'installmentFeeTypes',
      label: t('feeStructureTablePreviousSessionDue'),
    },
    {key: 'totalFee', label: t('feeStructureTableTotalFees')},
    {key: 'disocuntAmount', label: t('feeStructureTableDiscount')},
    {key: 'dueAmount', label: t('feeStructureTableDueAmount')},
    {key: 'amountToBePaid', label: t('feeStructureTableAmountToBePaid')},
  ]

  return (
    <>
      <Table
        rows={rows.filter((r) => {
          return r.hidden == false
        })}
        cols={cols}
      />
    </>
  )
}

import React, {useEffect, useState} from 'react'
import styles from './EditInstallmentModal.module.css'
import {ErrorBoundary} from '@teachmint/common'
import {Input, Table, Tooltip} from '@teachmint/krayon'
import {ADD_ON_DISCOUNT_TABLE_COLS} from '../../FeeTabConstant'
import {useSelector} from 'react-redux'
import {getAmountWithCurrency} from '../../../../../../utils/Helpers'
import {useTranslation} from 'react-i18next'
import AddOnToolTipBody from './AddOnToolTipBody'

export default function AddOnDiscountTable({
  editInstallmentModalData = {},
  setAddonDiscounts = () => {},
  setTotalRow = () => {},
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const [rowsData, setRowsData] = useState([])

  useEffect(() => {
    setRowsData(
      [...editInstallmentModalData?.details].map((row) => ({
        ...row,
        addOnDiscountAmount: 0,
        newTotalDiscount: row.discount,
        infoType: '',
        errorMessage: '',
      }))
    )
  }, [])

  useEffect(() => {
    const addonDiscountApiData = {
      addon_discounts: rowsData.map((row) => ({
        transaction_id: row.transaction_id,
        amount: Number(row?.addOnDiscountAmount || 0),
      })),
    }
    setAddonDiscounts(addonDiscountApiData)
    setTotalRow(
      rowsData.reduce(
        (totals, data) => {
          totals[0] += Number(data?.discount || 0)
          totals[1] += Number(data?.addOnDiscountAmount || 0)
          totals[2] += Number(data?.newTotalDiscount || 0)
          return totals
        },
        [0, 0, 0]
      )
    )
  }, [rowsData])

  const handleAddOnDiscountChange = (addOnAmount, index) => {
    if (addOnAmount <= editInstallmentModalData?.details[index]?.due || 0) {
      setRowsData((prevRowsData) => {
        const updatedRowData = [...prevRowsData]
        updatedRowData[index].addOnDiscountAmount = addOnAmount
        updatedRowData[index].newTotalDiscount =
          Number(addOnAmount) + Number(updatedRowData[index].discount)
        updatedRowData[index].infoType = ''
        updatedRowData[index].errorMessage = ''
        return updatedRowData
      })
    } else {
      setRowsData((prevRowsData) => {
        const updatedRowData = [...prevRowsData]
        updatedRowData[index].infoType = 'error'
        updatedRowData[index].errorMessage =
          t('maximumDiscount') +
          ' ' +
          editInstallmentModalData?.details[index]?.due
        return updatedRowData
      })
    }
  }

  const rows = rowsData.map((currentRow, index) => {
    return {
      feeType: (
        <div className={styles.feeTypeBlock}>{currentRow.category_name}</div>
      ),
      existingDiscount: (
        <div className={styles.existingFeeAmount}>
          {getAmountWithCurrency(currentRow.discount, instituteInfo?.currency)}
          <AddOnToolTipBody
            uniqueIdentifier={currentRow.category_master_id}
            logs={currentRow.discount_logs}
            currency={instituteInfo?.currency}
          />
        </div>
      ),
      addOnDiscount: (
        <>
          <a data-for={`disableInfo${currentRow.category_master_id}`} data-tip>
            <Input
              isDisabled={currentRow.due <= 0}
              classes={{wrapper: styles.addOnAmountInput}}
              fieldName="addOnDiscount"
              onChange={(obj) => {
                handleAddOnDiscountChange(obj.value, index)
              }}
              prefix={getAmountWithCurrency(null, instituteInfo?.currency)}
              showMsg
              infoType={currentRow?.infoType}
              defaultText={currentRow?.errorMessage}
              type="number"
              value={currentRow?.addOnDiscountAmount}
              onKeyDown={(e) =>
                ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
              }
            />
          </a>
          {currentRow.due <= 0 && (
            <Tooltip
              effect="float"
              place="top"
              toolTipBody={t('addOnDiscountDisableToolTip')}
              toolTipId={`disableInfo${currentRow.category_master_id}`}
            />
          )}
        </>
      ),
      newDiscount: (
        <div className={styles.newFeeAmount}>
          {getAmountWithCurrency(
            currentRow.newTotalDiscount,
            instituteInfo?.currency
          )}
        </div>
      ),
    }
  })

  return (
    <ErrorBoundary>
      <div className={styles.addOnFeeTable}>
        <Table rows={rows} cols={ADD_ON_DISCOUNT_TABLE_COLS} />
      </div>
    </ErrorBoundary>
  )
}

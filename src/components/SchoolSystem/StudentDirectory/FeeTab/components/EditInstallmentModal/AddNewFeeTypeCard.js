import {Button, Icon, ICON_CONSTANTS, Input, PlainCard} from '@teachmint/krayon'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {getAmountWithCurrency} from '../../../../../../utils/Helpers'
import styles from './EditInstallmentModal.module.css'

export default function AddNewFeeTypeCard({
  unusedFeeTypes,
  receiptPrefixList,
  setAddFeeTypeOpen,
  newRowData,
  setNewRowData,
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const [data, setData] = useState({
    feeType: null,
    receiptPrefix: null,
    amount: null,
    addOnAmountWithTax: null,
    tax: null,
  })
  const [errorData, seterrorData] = useState({
    feeType: null,
    receiptPrefix: null,
    amount: null,
  })

  const onChangeData = (obj) => {
    setData((prevState) => {
      return {...prevState, [obj.fieldName]: obj.value}
    })
  }

  const handleAddOnClick = () => {
    let updatedErrorData = {
      feeType: null,
      receiptPrefix: null,
      amount: null,
    }
    let isValidData = true
    if (data.feeType == null) {
      updatedErrorData.feeType = t('enterFeeType')
      isValidData = false
    }
    if (data.receiptPrefix == null) {
      updatedErrorData.receiptPrefix = t('enterReceiptPrefix')
      isValidData = false
    }
    if (data.amount == null) {
      updatedErrorData.amount = t('enterAmount')
      isValidData = false
    }

    if (isValidData == false) {
      seterrorData(updatedErrorData)
      return
    }

    const newData = {
      feeType: data.feeType,
      existingFeeAmount: 0,
      addOnAmount: data.amount,
      addOnAmountWithTax: Number(
        (data.amount * (1 + data?.tax / 100)).toFixed(2)
      ),
      totalAmount: Number((data.amount * (1 + data?.tax / 100)).toFixed(2)),
      receiptPrefix: data.receiptPrefix,
      tax: data.tax ? data.tax : 0,
      isAddon: true,
      dueLogs: [],
    }
    setNewRowData([...newRowData, newData])
    setAddFeeTypeOpen(false)
  }

  return (
    <PlainCard>
      <div className={styles.addNewFeeTypeCard}>
        <div className={styles.mainSection}>
          <Input
            fieldName="feeType"
            isRequired
            onChange={(obj) => {
              onChangeData(obj)
            }}
            options={unusedFeeTypes}
            placeholder={t('select')}
            showMsg
            infoMsg={
              (
                <span className={styles.infoMessageColor}>
                  {errorData?.feeType}
                </span>
              ) || ''
            }
            title={t('feeTypeForInstallment')}
            type="dropdown"
            value={data.feeType}
          />
          <Input
            fieldName="receiptPrefix"
            isRequired
            onChange={(obj) => {
              onChangeData(obj)
            }}
            options={receiptPrefixList.map((receiptPrefix) => ({
              label: receiptPrefix,
              value: receiptPrefix,
            }))}
            placeholder={t('select')}
            showMsg
            infoMsg={
              (
                <span className={styles.infoMessageColor}>
                  {errorData?.receiptPrefix}
                </span>
              ) || ''
            }
            title={t('receiptPrefix')}
            type="dropdown"
            value={data?.receiptPrefix || null}
          />
          <Input
            fieldName="amount"
            isRequired
            onChange={(obj) => {
              onChangeData(obj)
            }}
            prefix={getAmountWithCurrency(null, instituteInfo.currency)}
            placeholder={t('valueAmountPlaceholder')}
            showMsg
            infoMsg={
              (
                <span className={styles.infoMessageColor}>
                  {errorData?.amount}
                </span>
              ) || ''
            }
            title={t('amount')}
            type="number"
            value={data.amount}
            onKeyDown={(e) =>
              ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
            }
          />
          <Input
            fieldName="tax"
            onChange={(obj) => {
              onChangeData(obj)
            }}
            placeholder={t('valuePercentagePlaceholder')}
            suffix={'%'}
            showMsg
            title="Tax % (if applicable)"
            type="number"
            value={data.tax}
            onKeyDown={(e) =>
              ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
            }
          />
        </div>
        <div className={styles.mainSection}>
          <Button type="outline" onClick={handleAddOnClick}>
            {t('add')}
          </Button>
          <Icon
            onClick={() => setAddFeeTypeOpen(false)}
            name="circledClose"
            type={ICON_CONSTANTS.TYPES.SECONDARY}
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
          />
        </div>
      </div>
    </PlainCard>
  )
}

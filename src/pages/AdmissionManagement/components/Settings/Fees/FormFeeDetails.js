import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import produce from 'immer'
import {t} from 'i18next'
import {Input, INPUT_TYPES, Table} from '@teachmint/krayon'
import styles from './FormFeeDetails.module.css'

import {
  useAdmissionCrmSettings,
  useCrmInstituteHierarchy,
} from '../../../redux/admissionManagement.selectors'
import {
  alphaRegex,
  floatingRegex,
  numericRegex,
} from '../../../../../utils/Validations'
import globalActions from '../../../../../redux/actions/global.actions'
import {calculateAmount} from '../../../utils/helpers'
import classNames from 'classnames'
import {DEFAULT_CURRENCY} from '../../../../../constants/common.constants'
import {getSymbolFromCurrency} from '../../../../../utils/Helpers'

export default function FormFeeDetails({stepKey, formData, setFormData}) {
  const dispatch = useDispatch()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const [isReceiptPrefixFound, setIsReceiptPrefixFound] = useState(
    formData[stepKey]?.receipt_starting_number ? true : false
  )
  const instituteHierarchy = useCrmInstituteHierarchy()

  const classes = {}
  instituteHierarchy?.children.forEach((department) => {
    department?.children.forEach((standard) => {
      classes[standard.id] = standard.name
    })
  })

  const cols = [
    {
      key: 'classname',
      label: t('feesFormTableFieldClass'),
    },
    {
      key: 'amount',
      label: t('feesFormTableFieldAmount'),
    },
    {
      key: 'tax',
      label: t('feesFormTableFieldTax'),
    },
    {
      key: 'totalAmount',
      label: t('feesFormTableFieldTotalAmount'),
    },
  ]

  const alphaFields = ['receipt_prefix']
  const floatingFields = ['tax']
  const numericFields = ['fee_amount', 'receipt_starting_number']

  const handleChange = ({fieldName, value}, node, isFirstRow) => {
    if (
      (alphaFields.includes(fieldName) && !alphaRegex(value)) ||
      (numericFields.includes(fieldName) && !numericRegex(value)) ||
      (floatingFields.includes(fieldName) && !floatingRegex(value)) ||
      (fieldName === 'tax' &&
        (parseFloat(value) < 0 || parseFloat(value) > 100))
    ) {
      return
    }
    let fieldValue = value
    if (node) {
      setFormData(
        produce(formData, (draft) => {
          fieldValue = value ? value : 0
          if (fieldName === 'fee_amount') {
            fieldValue = parseInt(fieldValue)
            if (!fieldValue) {
              draft[stepKey].class_fees[node].tax = 0
            }
            // Set rest of the amount fields on change of first field
            if (isFirstRow) {
              Object.keys(formData[stepKey].class_fees).forEach((classId) => {
                draft[stepKey].class_fees[classId][fieldName] = fieldValue
                if (!fieldValue) {
                  draft[stepKey].class_fees[classId].tax = fieldValue
                }
              })
            }
          } else {
            fieldValue =
              value.slice(-1) === '.' ? fieldValue : parseFloat(fieldValue)
          }
          draft[stepKey].class_fees[node][fieldName] = fieldValue
        })
      )
    } else {
      setFormData(
        produce(formData, (draft) => {
          draft[stepKey][fieldName] =
            fieldName === 'receipt_prefix'
              ? fieldValue.toUpperCase()
              : fieldValue
        })
      )
    }
  }

  const checkReceiptPrefix = (e) => {
    if (formData[stepKey].receipt_prefix) {
      const successAction = (response) => {
        if (response.duplicate_found) {
          setIsReceiptPrefixFound(true)
          setFormData(
            produce(formData, (draft) => {
              draft[stepKey].create_prefix = false
              draft[stepKey].receipt_starting_number =
                response.series_starting_number
            })
          )
        } else {
          setIsReceiptPrefixFound(false)
          setFormData(
            produce(formData, (draft) => {
              draft[stepKey].create_prefix = true
            })
          )
        }
      }
      dispatch(
        globalActions.checkCrmReceiptPrefix.request(
          e.target.value,
          successAction
        )
      )
    }
  }

  const getLeadStages = () => {
    const leadStages = Object.values(admissionCrmSettings?.data?.lead_stages)
    return leadStages
      .filter(
        (stage, index) =>
          // Don't show Rejected and Admission Confirmed Stage
          ![leadStages.length - 2, leadStages.length - 1].includes(index)
      )
      .map((stage) => ({
        label: stage.name,
        value: stage._id,
      }))
  }

  const getFormFeeClassesList = () => {
    return admissionCrmSettings?.data?.enable_session.enabled_node_ids.map(
      (node, index) => ({
        key: node,
        classname: classes[node],
        amount: (
          <Input
            type={INPUT_TYPES.TEXT}
            prefix={getSymbolFromCurrency(
              instituteInfo.currency || DEFAULT_CURRENCY
            )}
            fieldName="fee_amount"
            maxLength={5}
            value={formData[stepKey]?.class_fees?.[node]?.fee_amount}
            onChange={(e) => handleChange(e, node, index === 0)}
            classes={{
              wrapper: classNames(styles.amountWrapper, styles.inputText),
              infoMsg: classNames(styles.displayNone, styles.inputText),
            }}
          />
        ),
        tax: (
          <Input
            type={INPUT_TYPES.TEXT}
            suffix={'%'}
            fieldName="tax"
            isDisabled={!formData[stepKey]?.class_fees?.[node]?.fee_amount}
            maxLength={4}
            onChange={(e) => handleChange(e, node, index === 0)}
            value={formData[stepKey]?.class_fees?.[node]?.tax}
            classes={{
              wrapper: classNames(styles.taxWrapper, styles.inputText),
              infoMsg: classNames(styles.displayNone, styles.inputText),
            }}
          />
        ),
        totalAmount: calculateAmount(
          formData[stepKey].class_fees[node]?.fee_amount,
          formData[stepKey].class_fees[node]?.tax,
          true,
          instituteInfo.currency
        ),
      })
    )
  }

  return (
    <div className={styles.collectFeeSection}>
      <div className={styles.formGroup}>
        {stepKey === 'admission_fees' && (
          <Input
            type={INPUT_TYPES.DROPDOWN}
            isRequired={true}
            onChange={handleChange}
            title={t('feesFormSelectLeadStageLabel')}
            placeholder={t('feesFormSelectLeadStagePlaceholder')}
            fieldName="collect_fee_stage_id"
            value={formData[stepKey].collect_fee_stage_id}
            options={getLeadStages()}
          />
        )}
        <Input
          type={INPUT_TYPES.TEXT}
          isRequired={true}
          title={t('feesFormReceiptPrefixLabel')}
          placeholder={t('feesFormReceiptPrefixPlaceholder')}
          fieldName="receipt_prefix"
          onChange={handleChange}
          onBlur={checkReceiptPrefix}
          value={formData[stepKey].receipt_prefix}
        />
        <Input
          type={INPUT_TYPES.TEXT}
          isRequired={true}
          title={t('feesFormReceiptPrefixNoLabel')}
          placeholder={t('feesFormReceiptPrefixNoPlaceholder')}
          fieldName="receipt_starting_number"
          onChange={handleChange}
          isDisabled={isReceiptPrefixFound}
          value={formData[stepKey].receipt_starting_number}
        />
      </div>
      <div className={styles.tableContainer}>
        <Table
          classes={{table: styles.table, thead: styles.thead}}
          cols={cols}
          rows={getFormFeeClassesList()}
        />
      </div>
    </div>
  )
}

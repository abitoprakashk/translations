import React, {useEffect, useState} from 'react'
import styles from './AddInstallmentModal.module.css'
import {ErrorBoundary} from '@teachmint/common'
import {
  Alert,
  Button,
  Datepicker,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  Input,
  Modal,
  MODAL_CONSTANTS,
  Para,
  RequiredSymbol,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useFeeStructure} from '../../../../../../pages/fee/redux/feeStructure/feeStructureSelectors'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../../redux/actions/global.actions'
import {getStudentProfileFeeTabDetailsRequestAction} from '../../../redux/feeAndWallet/actions'
import {useAddStudentAddOnFeesSelector} from '../../../redux/selectros/feeTabSelectors'
import {getAmountWithCurrency} from '../../../../../../utils/Helpers'

export default function AddInstallmentModal({
  studentId = null,
  isOpen = true,
  setIsOpen = () => {},
  receiptPrefixList = [],
}) {
  const {feeTypes} = useFeeStructure()
  const addStudentAddOnFees = useAddStudentAddOnFeesSelector()
  const dispatch = useDispatch()
  const {
    instituteActiveAcademicSessionId,
    instituteAcademicSessionInfo,
    instituteInfo,
  } = useSelector((state) => state)
  const sessionRange = instituteAcademicSessionInfo.find(
    (session) => session._id == instituteActiveAcademicSessionId
  )
  const [errorData, setError] = useState('')

  const {t} = useTranslation()
  const [installmentData, setInstallmentData] = useState({
    installmentDate: null,
    feeTypeRow: [
      {
        feeType: null,
        amount: null,
        tax: null,
        receiptPrefix: null,
      },
    ],
  })

  const [feeTypeAddedList, setFeeTypeAddedList] = useState([])
  const validateFormAndSendData = () => {
    const {installmentDate, feeTypeRow} = installmentData
    if (!installmentDate) {
      setError(t('pleaseAddAllTheRequiredFields'))
      return
    }

    for (const row of feeTypeRow) {
      if (!row.feeType || !row.amount || !row.receiptPrefix) {
        setError(t('pleaseAddAllTheRequiredFields'))
        return
      }
    }

    const installmentDateInTimestamp = installmentDate.getTime() / 1000

    const payload = {
      existing: [],
      new: feeTypeRow.map(({feeType, amount, tax, receiptPrefix}) => ({
        fee_type: feeType,
        receipt_prefix: receiptPrefix,
        amount: parseFloat(amount),
        tax: parseFloat(tax) || 0,
        installment: installmentDateInTimestamp,
        student_id: studentId,
      })),
    }

    const successAction = (status) => {
      if (status == true) {
        setIsOpen(!isOpen)
        dispatch(getStudentProfileFeeTabDetailsRequestAction(studentId))
      }
    }
    dispatch(
      globalActions.addStudentAddOnFees.request(
        payload,
        successAction,
        (error) => {
          setError(error)
        }
      )
    )
  }

  const onChangeFeeTypeRow = (obj, index) => {
    setInstallmentData((prevState) => {
      const feeTypeRow = [...prevState.feeTypeRow]
      feeTypeRow[index] = {...feeTypeRow[index], [obj.fieldName]: obj.value}
      return {...prevState, feeTypeRow}
    })
  }

  useEffect(() => {
    const selectedFeeTypes = installmentData.feeTypeRow.map((row) => {
      return row.feeType
    })
    setFeeTypeAddedList(selectedFeeTypes)
  }, [installmentData])

  const handleAddMoreFeeTypeRow = () => {
    setInstallmentData({
      ...installmentData,
      feeTypeRow: [
        ...installmentData.feeTypeRow,
        {
          feeType: null,
          amount: null,
          tax: null,
          receiptPrefix: null,
        },
      ],
    })
  }

  const removeFeeTypeRow = (index) => {
    const newFeeTypeRows = [...installmentData.feeTypeRow]
    newFeeTypeRows.splice(index, 1)
    setInstallmentData({...installmentData, feeTypeRow: newFeeTypeRows})
  }

  return (
    <ErrorBoundary>
      <Modal
        classes={{modal: styles.modal}}
        size={MODAL_CONSTANTS.SIZE.LARGE}
        isOpen={isOpen}
        header={
          <>
            <div className={styles.modalHeadingSection}>
              <div className={styles.iconAndHeadingSection}>
                <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}>
                  {t('addInstallment')}
                </Heading>
              </div>
              <div>
                <button onClick={() => setIsOpen(!isOpen)}>
                  <Icon
                    name="close"
                    size={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
                    version="outlined"
                  />
                </button>
              </div>
            </div>
            <Divider length="100%" spacing="0px" thickness="1px" />
          </>
        }
        footerLeftElement={
          <div className={styles.footerMessage}>{errorData}</div>
        }
        actionButtons={[
          {
            body: t('cancel'),
            isDisabled: addStudentAddOnFees.isLoading,
            onClick: () => setIsOpen(!isOpen),
            type: 'outline',
          },
          {
            body: t('add'),
            isDisabled: addStudentAddOnFees.isLoading,
            onClick: () => {
              validateFormAndSendData()
            },
          },
        ]}
      >
        <>
          {addStudentAddOnFees.isLoading ? (
            <div className="loading" />
          ) : (
            <div className={styles.modalSection}>
              {/* INSTALLMENT DUE DATE */}
              <div>
                <Para textSize="m" className={styles.margin6px}>
                  {t('installmentDueDateLower')}
                  <RequiredSymbol />
                </Para>
                <Datepicker
                  inputProps={{
                    placeholder: t('selectDueDate'),
                  }}
                  closeOnChange
                  dateFormat={'dd/MM/yyyy'}
                  onChange={(val) => {
                    setInstallmentData({
                      ...installmentData,
                      installmentDate: val,
                    })
                  }}
                  maxDate={new Date(parseInt(sessionRange.end_time))}
                  minDate={new Date(parseInt(sessionRange.start_time))}
                  value={installmentData?.installmentDate}
                />
              </div>
              <div>
                {/* FEE TYPE ROW */}
                <div>
                  {installmentData.feeTypeRow.map((feeTypeRow, index) => {
                    return (
                      <div className={styles.feeTypeRow} key={index}>
                        {/* Fee type for installment */}
                        <Input
                          fieldName="feeType"
                          isRequired
                          onChange={(obj) => {
                            onChangeFeeTypeRow(obj, index)
                          }}
                          frozenOptions={feeTypeAddedList}
                          options={feeTypes.map((feetype) => ({
                            label: feetype.name,
                            value: feetype._id,
                          }))}
                          placeholder={t('select')}
                          showMsg
                          title={t('feeTypeForInstallment')}
                          type="dropdown"
                          value={feeTypeRow?.feeType || null}
                        />

                        {/* Amount */}
                        <Input
                          fieldName="amount"
                          isRequired
                          onChange={(obj) => {
                            onChangeFeeTypeRow(obj, index)
                          }}
                          placeholder={t('valueAmountPlaceholder')}
                          showMsg
                          title={t('amount')}
                          prefix={getAmountWithCurrency(
                            null,
                            instituteInfo?.currency
                          )}
                          type="number"
                          value={feeTypeRow?.amount || null}
                          onKeyDown={(e) =>
                            ['e', 'E', '+', '-'].includes(e.key) &&
                            e.preventDefault()
                          }
                        />

                        {/* Tax % (if applicable) */}
                        <Input
                          fieldName="tax"
                          onChange={(obj) => {
                            onChangeFeeTypeRow(obj, index)
                          }}
                          placeholder={t('valuePercentagePlaceholder')}
                          suffix="%"
                          showMsg
                          title={t('taxPercentageIfApplicable')}
                          type="number"
                          value={feeTypeRow?.tax || null}
                          onKeyDown={(e) =>
                            ['e', 'E', '+', '-'].includes(e.key) &&
                            e.preventDefault()
                          }
                        />

                        {/* Receipt prefix */}
                        <Input
                          fieldName="receiptPrefix"
                          isRequired
                          onChange={(obj) => {
                            onChangeFeeTypeRow(obj, index)
                          }}
                          options={receiptPrefixList.map((receiptPrefix) => ({
                            label: receiptPrefix,
                            value: receiptPrefix,
                          }))}
                          placeholder={t('select')}
                          showMsg
                          title={t('receiptPrefix')}
                          type="dropdown"
                          value={feeTypeRow?.receiptPrefix || null}
                        />

                        {/* Cross Icon - Delete row */}
                        {installmentData.feeTypeRow.length > 1 && (
                          <div className={styles.feeTypeRowDeleteIcon}>
                            <Icon
                              onClick={() => removeFeeTypeRow(index)}
                              name="circledClose"
                              type={ICON_CONSTANTS.TYPES.SECONDARY}
                              size={ICON_CONSTANTS.SIZES.XX_SMALL}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {/* ADD MORE FEE TYPE BUTTON */}
                  <Button onClick={handleAddMoreFeeTypeRow} type="text">
                    {t('addMoreFeeType')}
                  </Button>
                </div>
                <div className={styles.alertMarginTop}>
                  <Alert hideClose content={t('addInstallmentAlertText')} />
                </div>
              </div>
            </div>
          )}
        </>
      </Modal>
    </ErrorBoundary>
  )
}

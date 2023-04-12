import {useState} from 'react'
import {Trans} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {t} from 'i18next'
import {DateTime} from 'luxon'
import classNames from 'classnames'
import {
  Alert,
  ALERT_CONSTANTS,
  Button,
  Datepicker,
  Divider,
  Icon,
  ICON_CONSTANTS,
  Input,
  INPUT_TYPES,
  Modal,
  Para,
  PlainCard,
  RequiredSymbol,
} from '@teachmint/krayon'
import {
  admissionPaymentStatus,
  admissionPaymentStatusLabels,
  admissionTransactionMethods,
  feeType,
  kanbanBoardOtherFilterOptionValues,
} from '../../../utils/constants'
import globalActions from '../../../../../redux/actions/global.actions'
import {
  useAdmissionCrmSettings,
  useCreatePaymentStatus,
  useLeadList,
} from '../../../redux/admissionManagement.selectors'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import {
  calculateAmount,
  calculateTaxAmount,
  updateLeadList,
} from '../../../utils/helpers'
import styles from './ProfileFees.module.css'

const ProfileFees = ({feesData, setShowModal}) => {
  const dispatch = useDispatch()
  const leadList = useLeadList()
  const admissionCrmSettings = useAdmissionCrmSettings()
  const {lead_stages} = admissionCrmSettings?.data
  const createPayment = useCreatePaymentStatus()
  const instituteInfo = useSelector((state) => state.instituteInfo)

  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    payment_mode: '',
    additionalNote: '',
    ref_date: DateTime.now().startOf('day').toSeconds(),
    order_timestamp: DateTime.now().startOf('day').toSeconds(),
  })

  const handleChange = ({fieldName, value}) => {
    let newFormData = {...formData}
    newFormData[fieldName] = value
    setFormData(newFormData)
  }

  const handleDateChange = (fieldName, jsDate) => {
    handleChange({
      fieldName,
      value: DateTime.fromJSDate(jsDate).startOf('day').toSeconds(),
    })
  }

  const isChequeDD = [
    admissionPaymentStatus.CHEQUE,
    admissionPaymentStatus.DD,
  ].includes(formData.payment_mode)

  const getPaymentMeta = () => {
    const metaData = {}
    metaData.additional_note = formData.additionalNote
    metaData.tax = calculateTaxAmount(
      feesData.feesData?.fee_amount,
      feesData.feesData?.tax
    )
    metaData.tax_percentage = feesData.feesData?.tax
    metaData.amount_without_tax = feesData.feesData?.fee_amount
    if (isChequeDD) {
      metaData.ref_date = formData.ref_date
      metaData.ref_no = formData.referenceNo ?? ''
      metaData.status = admissionTransactionMethods.APPROVED
    }
    return metaData
  }

  const handlePayment = () => {
    setErrorMessage('')
    let paymentData = {}
    paymentData.lead_id = feesData.leadId
    paymentData.amount = calculateAmount(
      feesData.feesData?.fee_amount,
      feesData.feesData?.tax
    )
    paymentData.payment_mode = formData.payment_mode
    paymentData.fee_type = feeType[feesData.feeType]
    paymentData.order_timestamp = formData.order_timestamp
    paymentData.meta = getPaymentMeta()
    const successAction = () => {
      let leadData = {
        [paymentData.fee_type === feeType.admission
          ? 'status_adm_fee'
          : 'status_form_fee']: kanbanBoardOtherFilterOptionValues.PAID,
      }
      if (
        paymentData.fee_type === feeType.admission &&
        feesData.collectAdmissionFeeStage
      ) {
        leadData.lead_stage_id = feesData.collectAdmissionFeeStage
        dispatch(
          globalActions.updateLeadStage.request({
            lead_id: paymentData.lead_id,
            lead_stage_id: feesData.collectAdmissionFeeStage,
          })
        )
      }
      dispatch(
        globalActions.getLeadList.success(
          updateLeadList(leadList?.data, paymentData.lead_id, leadData)
        )
      )
      dispatch(globalActions.getLeadRecentActivity.request(paymentData.lead_id))
      setShowModal(false)
    }
    dispatch(
      globalActions.createAdmissionCrmOfflinePayment.request(
        paymentData,
        successAction,
        (error) => setErrorMessage(error)
      )
    )
  }

  const getModalFooter = () => {
    return (
      <div>
        <Divider spacing="0" />
        <div className={styles.modalFooter}>
          <div className={styles.modalErrorSection}>
            {errorMessage && (
              <>
                <Icon name="info" type={ICON_CONSTANTS.TYPES.ERROR} />
                <div>{errorMessage}</div>
              </>
            )}
          </div>
          <Button
            onClick={handlePayment}
            isDisabled={!formData?.payment_mode || createPayment?.isLoading}
          >
            {t('leadProfilePageCollectFee')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen
      header={feesData.title}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      onClose={() => setShowModal(false)}
      classes={{modal: styles.modalWdith}}
      footer={getModalFooter()}
    >
      {createPayment?.isLoading ? (
        <div className="loader" />
      ) : (
        <div>
          {feeType[feesData.feeType] === feeType.admission &&
            feesData?.collectAdmissionFeeStage !==
              feesData?.currentLeadStageId && (
              <Alert
                hideClose
                type={ALERT_CONSTANTS.TYPE.WARNING}
                content={
                  <Trans
                    i18nKey="leadProfileAdmissionFeeAlertMsg"
                    values={{
                      leadStageId:
                        lead_stages[feesData?.collectAdmissionFeeStage].name,
                    }}
                  />
                }
                className={styles.alertStyling}
              />
            )}
          <PlainCard className={styles.mainContainer}>
            <div className={classNames(styles.subContainer, styles.subHeader)}>
              <span>{t('totalFee')}</span>
              <span>
                {calculateAmount(
                  feesData.feesData?.fee_amount,
                  feesData.feesData?.tax,
                  true,
                  instituteInfo.currency
                )}
              </span>
            </div>
            <Divider classes={{divider: styles.dividerWidth}} />
            <div className={classNames(styles.subContent, styles.itemStyle)}>
              <span>{feesData.title}</span>
              <span>
                {getAmountFixDecimalWithCurrency(
                  feesData.feesData?.fee_amount,
                  instituteInfo.currency
                )}
              </span>
            </div>
            <div
              className={classNames(
                styles.subContent,
                styles.subContent2,
                styles.itemStyle
              )}
            >
              <span>{t('taxes')}</span>
              <span>
                {calculateTaxAmount(
                  feesData.feesData?.fee_amount,
                  feesData.feesData?.tax,
                  true,
                  instituteInfo.currency
                )}
              </span>
            </div>
          </PlainCard>
          <div
            className={classNames(styles.paymentMethods, {
              [styles.displayColumnFlex]: isChequeDD,
            })}
          >
            <div className={styles.formField}>
              <Input
                isRequired={true}
                type={INPUT_TYPES.DROPDOWN}
                fieldName="payment_mode"
                value={formData.payment_mode}
                placeholder={t('select')}
                options={admissionPaymentStatusLabels}
                title={t('admissionCrmSelectPaymentMethod')}
                onChange={handleChange}
                classes={{
                  wrapper: styles.paymentModeWrapper,
                  wrapperClass: styles.dropdownStyles,
                  optionsClass: `${styles.dropdownZindex1} ${styles.dropdownZindex2}`,
                }}
              />
            </div>
            <div className={styles.displayFlex}>
              {isChequeDD && (
                <div className={styles.datePicketStyling}>
                  <div>
                    <div className={styles.required}>
                      <Para className={styles.marginBotton}>
                        {t('admissionCrmSelectChequeDate')}
                        <RequiredSymbol />
                      </Para>
                    </div>
                    <div className={styles.datePickerZindex}>
                      <Datepicker
                        closeOnChange={true}
                        classes={{
                          calendarWrapper: styles.calendarSize,
                          wrapper: styles.dateWrapper,
                          input: styles.inputWrapper,
                        }}
                        onChange={(jsDate) =>
                          handleDateChange('ref_date', jsDate)
                        }
                        value={DateTime.fromSeconds(
                          formData.ref_date
                        ).toJSDate()}
                      />
                    </div>
                  </div>
                </div>
              )}
              {formData?.payment_mode && (
                <div className={styles.formField}>
                  <div className={styles.required}>
                    <Para className={styles.marginBotton}>
                      {t('admissionCrmSelectPaymentDate')}
                      <RequiredSymbol />
                    </Para>
                  </div>
                  <div className={styles.datePickerZindex}>
                    <Datepicker
                      closeOnChange={true}
                      classes={{
                        calendarWrapper: styles.calendarSize,
                        wrapper: styles.dateWrapper,
                        input: styles.inputWrapper,
                        calendar: styles.calendar,
                      }}
                      onChange={(jsDate) =>
                        handleDateChange('order_timestamp', jsDate)
                      }
                      value={DateTime.fromSeconds(
                        formData.order_timestamp
                      ).toJSDate()}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {isChequeDD && (
            <div className={styles.paymentDate}>
              <Input
                type={INPUT_TYPES.TEXT}
                fieldName="referenceNo"
                value={formData.referenceNo}
                onChange={handleChange}
                title={t('referenceNo')}
                placeholder={t('referenceNo')}
              />
            </div>
          )}
          <div className={styles.inputwrapper}>
            <Input
              type={INPUT_TYPES.TEXT}
              fieldName="additionalNote"
              onChange={handleChange}
              value={formData.additionalNote}
              title={t('admissionCrmAdditionalNote')}
              placeholder={t('admissionCrmAdditionalNote')}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ProfileFees

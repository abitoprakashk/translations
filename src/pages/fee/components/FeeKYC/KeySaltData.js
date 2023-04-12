import {
  multiplePaymentGatewayCreate,
  paymentGatewayFalseActions,
} from '../../redux/feeCollectionActions'
import styles from './PaymentGateways.module.css'
import {
  useFeeCollection,
  useInstituteId,
} from '../../redux/feeCollectionSelectors'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../utils/EventsConstants'
import {t} from 'i18next'
import {Button, BUTTON_CONSTANTS, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import {Input, Tooltip} from '@teachmint/common'
import classNames from 'classnames'
import FeeKYC from './FeeKYC'
import ConfirmationPopup from '../../../../components/Common/ConfirmationPopup/ConfirmationPopup'
import {updatePgData} from '../../redux/actions/pgActions'
import moment from 'moment'
import Loader from '../../../../components/Common/Loader/Loader'
import {validateInputs} from '../../../../utils/Validations'
const KeySaltData = ({
  selectedGateWay,
  fields = [],
  edit = {},
  countryData = {},
}) => {
  const {redirectToPaymentGateway, multiplePaymentgatewayLoading} =
    useFeeCollection()
  const [formValues, setFormValues] = useState({})
  // const [errObject, setErrorsObject] = useState({})
  // const [validateEmail, setValidateEmail] = useState('')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [countryIsdCode, setCountryISDCode] = useState(null)
  const eventManager = useSelector((state) => state.eventManager)
  const [showPaymentGatewayStatus, setShowPaymentGatewayStatus] =
    useState(false)
  const instituteId = useInstituteId()
  const dispatch = useDispatch()
  const [showConfirmPopup, setShowConfirmPopup] = useState(false)

  useEffect(() => {
    if (redirectToPaymentGateway) {
      setShowPaymentGatewayStatus(true)
      dispatch(paymentGatewayFalseActions(false))
    }
  }, [redirectToPaymentGateway])

  useEffect(() => {
    if (edit && Object.keys(edit).length && fields.length) {
      const withValue = {...formValues}
      fields.map((item) => {
        withValue[item.field] = edit[item.field]
        return withValue
      })
      setFormValues(withValue)
    }
  }, [edit, fields])

  useEffect(() => {
    if (typeof countryData == 'object' && Object.keys(countryData).length) {
      const data = {...formValues}
      setFormValues({
        ...data,
        country: countryData?.country,
        currency: countryData?.currency,
      })
    }
  }, [countryData])

  // useEffect(() => {
  //   if (
  //     Object.keys(formValues).length === fields.length &&
  //     fields.length != 0
  //   ) {
  //     let allValuesPresent = true
  //     Object.keys(formValues).map((key) => {
  //       if (!formValues[key]) allValuesPresent = false
  //     })
  //     if (errObject && Object.keys(errObject).length) {
  //       Object.keys(errObject).map((key) => {
  //         if (errObject[key]) allValuesPresent = false
  //       })
  //     }
  //     setIsSubmitDisabled(!allValuesPresent)
  //   }
  // }, [errObject])

  const handleChange = ({fieldName, value}) => {
    let isdisabled = false
    if (typeof value === 'string') value = value.trim()
    const formData = {...formValues}
    formData[fieldName] = value
    setFormValues(formData)
    fields.map((field) => {
      if (!formData[field.field]) {
        isdisabled = true
      }
    })
    setIsSubmitDisabled(isdisabled)
  }

  const verifyStatus = () => {
    eventManager.send_event(events.VERIFY_API_CREDS_CLICKED_TFI, {
      type: edit ? 'edited' : 'fresh',
    })
    const formData = {}
    formData.instituteId = instituteId
    Object.keys(formValues).map((key) => {
      if (formValues[key] instanceof Date)
        formData[key] = moment(formValues[key]).format('DD/MM/YYYY')
      else formData[key] = formValues[key]
    })
    formData.pg_id = selectedGateWay
    formData.country = countryData?.iso_country_code
    // formData.optional_fields = {merchantEmail: formValues.merchantEmail}
    setIsSubmitDisabled(true)
    if (edit && edit.pg_credentials_id) {
      dispatch(
        updatePgData({
          pg_credentials_id: edit.pg_credentials_id,
          updated_fields: formData,
        })
      )
    } else dispatch(multiplePaymentGatewayCreate(formData))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const mEmail = formValues.email
    const validateEmails = validateInputs('email', mEmail, true)
    let validateNo = false
    if (formValues.phone) {
      validateNo =
        formValues.phone.length >= countryData.min_length &&
        formValues.phone.length <= countryData.max_length
    }

    if (validateEmails || !validateNo) {
      e.preventDefault()
      verifyStatus()
    }
  }

  const getFieldValue = (field) => {
    if (edit && edit[field?.field] && !formValues[field.field])
      return edit[field?.field]
    return formValues[field.field]
  }

  return (
    <>
      <Loader show={multiplePaymentgatewayLoading} />
      {showConfirmPopup && (
        <ConfirmationPopup
          onClose={() => setShowConfirmPopup(false)}
          //   onAction={verifyStatus}
          icon={
            'https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg'
          }
          title="Are you sure you want to verify?"
          desc=""
          primaryBtnText="Cancel"
          secondaryBtnText="Verify"
          closeOnBackgroundClick={false}
        />
      )}

      <form onSubmit={handleSubmit}>
        {fields.map((field) => {
          return (
            <div className={styles.keyData} key={field.field}>
              <Input
                type={field.type}
                title={field.title}
                fieldName={field.field}
                onChange={(val) => handleChange(val)}
                autoComplete="off"
                countryCodeItem={countryIsdCode || countryData?.isd_code}
                onCountryCodeChange={(val) => {
                  setCountryISDCode(val?.value)
                }}
                minLength={
                  field.type === 'phoneNumber' && countryData?.min_length
                }
                maxLength={
                  field.type === 'phoneNumber' && countryData?.max_length
                }
                value={getFieldValue(field)}
                placeholder={field?.placeholder}
                // setShowError={(err) => {
                //   setErrorsObject({...errObject, [field.field]: err})
                // }}
                disabled={
                  field.field === 'country' || field.field === 'currency'
                }
                tooltipComponent={
                  <>
                    <a data-tip={field.field} data-for={field.field}>
                      {field.meta.information && (
                        <Icon
                          name={'info'}
                          type={ICON_CONSTANTS.TYPES.PRIMARY}
                          version={ICON_CONSTANTS.VERSION.OUTLINED}
                          size={ICON_CONSTANTS.SIZES.XXX_SMALL}
                        />
                      )}
                    </a>
                    <Tooltip toolTipId={field.field} place="top" type="info">
                      <span>{field.meta.information}</span>
                    </Tooltip>
                  </>
                }
                classes={{title: 'tm-para'}}
              />
            </div>
          )
        })}

        <div className={styles.verifyButtonStyle}>
          <Button
            isDisabled={isSubmitDisabled}
            size={BUTTON_CONSTANTS.SIZE.MEDIUM}
            width={BUTTON_CONSTANTS.WIDTH.FULL}
            classes={{
              button: classNames(
                styles.btsetting,
                isSubmitDisabled
                  ? 'tm-bg-dark-gray border-none tm-color-text-secondary'
                  : 'fill'
              ),
            }}
            children={t('verifyButton')}
          />
        </div>
      </form>

      {showPaymentGatewayStatus && <FeeKYC />}
    </>
  )
}

export default KeySaltData

import {
  Accordion,
  Checkbox,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Input,
  INPUT_TYPES,
  Para,
  PARA_CONSTANTS,
  PlainCard,
  RequiredSymbol,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useContext, useEffect, useState} from 'react'
import {Trans} from 'react-i18next'
import {useSelector} from 'react-redux'
import {alphaRegex, numericRegex} from '../../../../../utils/Validations'
import {idCardAccessoriesConfigSelector} from '../../../redux/CustomId.selector'
import {IdCardCheckoutContext} from '../IdCardCheckoutStates/IdCardCheckout.context'
import {IDCheckoutActions} from '../IdCardCheckoutStates/IdCardCheckout.reducer'
import styles from './CheckoutVerifyOrder.module.css'

export default function CheckoutVerifyOrder({summary}) {
  const {idCardCheckoutData, internalDispatch} = useContext(
    IdCardCheckoutContext
  )
  const {data: idConfig} = idCardAccessoriesConfigSelector()
  const {idCardConfig} = idCardCheckoutData
  const instituteInfo = useSelector((store) => store.instituteInfo)
  const adminInfo = useSelector((store) => store.adminInfo)

  const [deliveryBillingSame, setDeliveryBillingSame] = useState(true)

  useEffect(() => {
    if (instituteInfo && adminInfo) {
      const {
        pin: pincode,
        line1: line_1,
        line2: line_2,
        city,
        state,
      } = instituteInfo.address
      const {name, phone_number: mobile_no} = adminInfo
      internalDispatch({
        type: IDCheckoutActions.SET_ID_CARD_DELIVERY_ADDRESS,
        data: {
          name,
          mobile_no: mobile_no ? mobile_no.split('-')[1] : '',
          pincode,
          line_1,
          line_2,
          city,
          state,
          countryCode: mobile_no.split('-')[0],
        },
      })
      if (!name || !mobile_no || !pincode || !line_1 || !city || !state) {
        internalDispatch({
          type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
          data: true,
        })
      }
    }
  }, [instituteInfo, adminInfo])

  useEffect(() => {
    if (deliveryBillingSame) {
      internalDispatch({
        type: IDCheckoutActions.SET_ID_CARD_BILLING_ADDRESS,
        data: {...idCardCheckoutData?.deliveryAddress},
      })
    } else {
      internalDispatch({
        type: IDCheckoutActions.SET_ID_CARD_BILLING_ADDRESS,
        data: {
          name: '',
          mobile_no: '',
          countryCode: '91',
          pincode: '',
          line_1: '',
          line_2: '',
          city: '',
          state: '',
        },
      })
    }
  }, [deliveryBillingSame, idCardCheckoutData?.deliveryAddress])
  // const [errorObj, seterrorObj] = useState({})

  const handleInputChange = ({fieldName, value, type}) => {
    let newAddressData =
      type === 'delivery'
        ? {...idCardCheckoutData?.deliveryAddress}
        : {...idCardCheckoutData?.billingAddress}

    switch (fieldName) {
      case 'name':
        if (alphaRegex(value)) newAddressData[fieldName] = value
        break
      case 'mobile_no':
        newAddressData[fieldName] = value
        break
      case 'countryCode':
        newAddressData['mobile_no'] = ''
        newAddressData[fieldName] = value
        break
      case 'pincode':
        if (numericRegex(value) && value?.length <= 6)
          newAddressData[fieldName] = value
        break
      case 'line_1':
      case 'line_2':
      case 'city':
      case 'state':
        newAddressData[fieldName] = value
        break
      default:
        break
    }
    const {name, mobile_no, pincode, line_1, city, state} = newAddressData
    if (!name || !mobile_no || !pincode || !line_1 || !city || !state) {
      internalDispatch({
        type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
        data: true,
      })
    } else {
      internalDispatch({
        type: IDCheckoutActions.TOGGLE_NEXT_BUTTON_DISABILITY,
        data: false,
      })
    }

    if (type === 'delivery')
      internalDispatch({
        type: IDCheckoutActions.SET_ID_CARD_DELIVERY_ADDRESS,
        data: {...newAddressData},
      })
    else
      internalDispatch({
        type: IDCheckoutActions.SET_ID_CARD_BILLING_ADDRESS,
        data: {...newAddressData},
      })
  }

  const countryCodeObj = (type) => ({
    countryCode:
      type === 'delivery'
        ? idCardCheckoutData?.deliveryAddress?.countryCode
        : idCardCheckoutData?.billingAddress.countryCode,
    onCountryChange: (val) =>
      handleInputChange({fieldName: 'countryCode', value: val, type}),
    isDisabled: false,
  })

  const getInputFrom = (addressData, type) => (
    <div className={styles.formWrapper}>
      <Input
        type={INPUT_TYPES.TEXT}
        title={t('name')}
        fieldName="name"
        value={addressData?.name}
        onChange={({value, fieldName}) =>
          handleInputChange({value, fieldName, type})
        }
      />

      <Input
        type={INPUT_TYPES.PHONE_NUMBER}
        title={t('mobileNumber')}
        fieldName="mobile_no"
        value={addressData?.mobile_no}
        onChange={({value, fieldName}) =>
          handleInputChange({value, fieldName, type})
        }
        countryCodeObj={countryCodeObj(type)}
        isRequired={true}
        placeholder={t('enterPhoneNumber')}
      />

      <Input
        type={INPUT_TYPES.TEXT}
        title={t('pincode')}
        fieldName="pincode"
        maxLength={6}
        value={addressData?.pincode}
        onChange={({value, fieldName}) =>
          handleInputChange({value, fieldName, type})
        }
        isRequired
      />

      <Input
        type={INPUT_TYPES.TEXT_AREA}
        title={t('addressLine1')}
        fieldName="line_1"
        value={addressData?.line_1}
        onChange={({value, fieldName}) =>
          handleInputChange({value, fieldName, type})
        }
        rows={2}
        isRequired
      />

      <Input
        type={INPUT_TYPES.TEXT_AREA}
        title={t('addressLine2')}
        fieldName="line_2"
        value={addressData?.line_2}
        onChange={({value, fieldName}) =>
          handleInputChange({value, fieldName, type})
        }
        rows={2}
      />

      <div className={styles.cityStateWrapper}>
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('cityTown')}
          fieldName="city"
          value={addressData?.city}
          onChange={({value, fieldName}) =>
            handleInputChange({value, fieldName, type})
          }
          isRequired
        />
        <Input
          type={INPUT_TYPES.TEXT}
          title={t('state')}
          fieldName="state"
          value={addressData?.state}
          onChange={({value, fieldName}) =>
            handleInputChange({value, fieldName, type})
          }
          isRequired
        />
      </div>
    </div>
  )

  const getDisplayValue = (keyInConfig, valueKey) => {
    const config = idConfig[keyInConfig]
    const value = config.find(
      (item) => item._id === idCardConfig[valueKey]
    )?.name
    return value
  }

  return (
    <PlainCard className={styles.wrapper}>
      <div className={styles.header}>
        <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
          {t('verifyYourOrder')}
        </Heading>
      </div>

      <div className={styles.content}>
        <PlainCard className={styles.imgInfoWrapper}>
          <PlainCard className={styles.imgWrapper}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHu4xboueuX0A9WH1cK2XOS09AHQVczC5BQw&usqp=CAU"
              alt=""
            />
          </PlainCard>
          <div className={styles.infoContent}>
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              ID Card + Lanyard + Holder
            </Para>
            {summary?.student_price_per_set && (
              <div>
                <Para
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                >
                  {t('student')}:
                </Para>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  <Trans
                    i18nKey="qtySets"
                    values={{quantity: summary?.student_no_of_sets}}
                  />
                  , ₹{summary?.student_price_per_set}/Set
                </Para>
              </div>
            )}
            {summary?.staff_no_of_sets && (
              <div>
                <Para
                  textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                  type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                >
                  {t('staff')}:
                </Para>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  <Trans
                    i18nKey="qtySets"
                    values={{quantity: summary?.staff_no_of_sets}}
                  />
                  , ₹{summary?.staff_price_per_set}/Set
                </Para>
              </div>
            )}
          </div>
        </PlainCard>
        <div className="flex">
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            Need help? Call us at
          </Para>
          &nbsp;
          <Para
            type={PARA_CONSTANTS.TYPE.PRIMARY}
            textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          >
            +91 8447575553
          </Para>
        </div>
        <Accordion
          isOpen={true}
          classes={{accordionWrapper: styles.accordionWrapper}}
          headerContent={
            <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
              {t('IDCardDetails')}
            </Para>
          }
        >
          <div className={styles.detailWrapper}>
            <div className={styles.detailsItem}>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('IDCardType')}:
              </Para>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              >
                {getDisplayValue('card_type', 'card_type_id')}
              </Para>
            </div>
            <div className={styles.detailsItem}>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('lanyardType')}:
              </Para>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              >
                {getDisplayValue('lanyard', 'lanyard_id')}
              </Para>
            </div>
            {idCardConfig?.lanyard_logo && (
              <div className={styles.detailsItem}>
                <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                  {t('logoOnLanyard')}:
                </Para>
                <a
                  target="_blank"
                  href={idCardConfig?.lanyard_logo}
                  rel="noreferrer"
                >
                  Logo.png
                </a>
              </div>
            )}
            <div className={styles.detailsItem}>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('textOnLanyard')}:
              </Para>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              >
                {idCardConfig?.lanyard_text}
              </Para>
            </div>
            <div className={styles.detailsItem}>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('lanyardColour')}:
              </Para>
              <span
                className={styles.colourBrick}
                style={{background: idCardConfig?.lanyard_color}}
              ></span>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              >
                {idCardConfig?.lanyard_color}
              </Para>
            </div>
            <div className={styles.detailsItem}>
              <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
                {t('cardHolderType')}:
              </Para>
              <Para
                textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
              >
                {getDisplayValue('holder', 'holder_id')}
              </Para>
            </div>
          </div>
        </Accordion>
        <Divider spacing="20px" />
        <Checkbox
          classes={{wrapper: styles.checkboxWrapper}}
          label={
            <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
              {t('billingAddressSameAsDelivery')}
            </Para>
          }
          isSelected={deliveryBillingSame}
          handleChange={({value}) => setDeliveryBillingSame(value)}
        />
        <div className={styles.deliveryAddressWrapper}>
          <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
            {t('deliveryAddress')}
            <RequiredSymbol />
          </Para>

          {getInputFrom(idCardCheckoutData?.deliveryAddress, 'delivery')}
        </div>
        {!deliveryBillingSame && (
          <>
            <Divider />
            <div>
              <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
                {t('billingAddress')}
                <RequiredSymbol />
              </Para>

              {getInputFrom(idCardCheckoutData?.billingAddress, 'billing')}
            </div>
          </>
        )}
      </div>
    </PlainCard>
  )
}

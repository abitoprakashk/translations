import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {fetchPgListFields} from '../../redux/actions/pgActions'
import {useFeeCollection} from '../../redux/feeCollectionSelectors'
import TeachPay from './TeachPay'
import styles from './PaymentGateways.module.css'
import classNames from 'classnames'
import {Button} from '@teachmint/common'
import KeySaltData from './KeySaltData'
import FormDetail from './FormDetails'
import {
  ACCESS_TEACHPAY_DASHBOARD,
  CHANGE,
  COMPLETE_KYC,
  COMPLETE_KYC_SETUP,
  ENTER_API_DETAILS,
  ENTER_API_DETAILS_BELOW,
  formDetails,
  KYC_VERIFICATION,
  multiPaymentGateway,
  REGISTER,
  REGISTRATION_API,
  REGULATORY_COMPLIANCE,
} from '../../fees.constants'
import {useEffect} from 'react'
import {events} from '../../../../utils/EventsConstants'
const AddUpdatePGData = ({
  selectedGateWay,
  setNxtBtn,
  triggerEvent,
  selectedGateWayData,
  handleKYC,
  handleRegisterClick,
  edit = '',
  countryData,
}) => {
  const dispatch = useDispatch()
  const {pgFields} = useSelector((store) => store.paymentGatewayData)
  const [showTeachPay, setShowTeachPay] = useState(false)
  const {paymentGatewaySetup} = useFeeCollection()
  const teachPaySetup = paymentGatewaySetup?.tpay_pg_status
  const credentialsList = paymentGatewaySetup?.pg_credentials_list.length
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => {
    dispatch(fetchPgListFields({pg_id: selectedGateWay}))
  }, [])

  const handleBackPage = () => {
    triggerEvent()
    setNxtBtn(1)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.secStepfirst}>
          {selectedGateWay == multiPaymentGateway['RAZORPAY'] && (
            <div className={styles.headText}>
              <span>{KYC_VERIFICATION}</span>
            </div>
          )}
          {'registration_url' in selectedGateWayData && (
            <div className={styles.headText}>
              <span className={styles.textNewData}>{REGISTRATION_API}</span>
            </div>
          )}
          <div className={styles.backToPage}>
            <div className={styles.displayData}>
              <img
                className={classNames(styles.img1, styles.imgClass)}
                src={selectedGateWayData?.logo}
              />{' '}
              {!edit && (
                <button className={styles.textData} onClick={handleBackPage}>
                  {CHANGE}
                </button>
              )}
            </div>
          </div>
          {!edit && (
            <div>
              <FormDetail
                data={
                  'registration_url' in selectedGateWayData
                    ? formDetails.saltKey
                    : formDetails.kyc
                }
                selectedGateWay={selectedGateWay}
              />
            </div>
          )}
          <hr className={styles.hrStyling} />
        </div>
        <div className={styles.secStep}>
          {selectedGateWay == multiPaymentGateway['RAZORPAY'] && !edit && (
            <>
              <div className={styles.kycBtn}>
                <Button
                  size="big"
                  className={styles.btnsize}
                  type="primary"
                  onClick={handleKYC}
                >
                  {COMPLETE_KYC}
                </Button>
              </div>
              <div className={styles.mendatoryField}>
                {COMPLETE_KYC_SETUP}{' '}
                <span className={styles.capitalize}>
                  {selectedGateWay.toLowerCase()}
                </span>{' '}
                {REGULATORY_COMPLIANCE}
              </div>
            </>
          )}
          {('registration_url' in selectedGateWayData ||
            selectedGateWay == multiPaymentGateway.TEACHPAY) && (
            <div className={styles.kycBtn}>
              {((!edit && selectedGateWayData?.registration_url) ||
                selectedGateWay == multiPaymentGateway.TEACHPAY) && (
                <>
                  <button
                    className={classNames(
                      selectedGateWay == multiPaymentGateway.TEACHPAY
                        ? styles.teachPayButton
                        : styles.normalButtonText,
                      'border'
                    )}
                    onClick={() => {
                      selectedGateWay == multiPaymentGateway.TEACHPAY
                        ? (eventManager.send_event(
                            events.ACCESS_TEACHPAY_DASHBOARD_CLICKED_TFI,
                            {screen_name: 'add_payment_gateway'}
                          ),
                          setShowTeachPay(true))
                        : handleRegisterClick(
                            selectedGateWayData.registration_url
                          )
                    }}
                  >
                    {selectedGateWay == multiPaymentGateway.TEACHPAY
                      ? ACCESS_TEACHPAY_DASHBOARD
                      : REGISTER}
                  </button>
                  <div className={styles.test}>
                    <span className={styles.test2}>OR</span>
                  </div>
                </>
              )}

              <div className={styles.formData}>
                {
                  <span className={styles.noteText}>
                    {edit ? ENTER_API_DETAILS : ENTER_API_DETAILS_BELOW}
                  </span>
                }
                {/* {payuCashfreeGateway.has(tableData) && (
                    <span className={styles.noteText}>
                      Fill Below Form
                    </span>
                  )} */}
                <KeySaltData
                  selectedGateWay={selectedGateWay}
                  fields={pgFields}
                  edit={edit}
                  countryData={countryData}
                />
              </div>
            </div>
          )}
        </div>

        {showTeachPay && (
          <TeachPay
            teachPaySetup={teachPaySetup}
            setShowTeachPay={setShowTeachPay}
            credentialsList={credentialsList}
          />
        )}
      </div>
    </>
  )
}

export default AddUpdatePGData

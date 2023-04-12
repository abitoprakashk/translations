import {Button, ErrorOverlay, Icon} from '@teachmint/common'
import classNames from 'classnames'
import {useEffect, useState} from 'react'
import examMobileImage from '../../../../assets/images/dashboard/exam-mobile.svg'
import {useDispatch, useSelector} from 'react-redux'
import {
  KYC_INFO,
  MORE_DETAILS,
  multiPaymentGateway,
  paymentLogo,
} from '../../fees.constants'
import {paymentGateWaySetupActions} from '../../redux/feeCollectionActions'
import {
  useFeeCollection,
  useInstituteId,
} from '../../redux/feeCollectionSelectors'
import styles from './FeeKYC.module.css'
import {getCountryDataWithCountryCode} from '../../../../routes/dashboard'
import {fetchPgList} from '../../redux/actions/pgActions'
import {events} from '../../../../utils/EventsConstants'
import {useActiveAcademicSessionId} from '../../../../utils/CustomHooks/AcademicSessionHook'
import PaymentGateways from './PaymentGateWays'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {DASHBOARD} from '../../../../utils/SidebarItems'
import {useTranslation} from 'react-i18next'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import TeachPay from './TeachPay'
import EditAndAccessTeachpay from './EditAndAccessTeachpay'

const FeeKYC = () => {
  const {t} = useTranslation()
  const [countryData, setCountryData] = useState('')
  const {pgList} = useSelector((store) => store.paymentGatewayData)
  const [filteredPgList, setFilteredPgList] = useState({})
  const [paymentGatewayForEdit, setPaymentGatewayForEdit] = useState('')
  const [showTeachPay, setShowTeachPay] = useState(false)
  const dispatch = useDispatch()
  const instituteId = useInstituteId()
  const academicSessionId = useActiveAcademicSessionId()
  const {
    paymentGatewaySetup,
    paymentGatewayErrorMsg,
    multiplePaymentGatewayErrorMsg,
  } = useFeeCollection()
  const credentialsList = paymentGatewaySetup?.pg_credentials_list.length
  const teachPaySetup = paymentGatewaySetup?.tpay_pg_status
  const eventManager = useSelector((state) => state.eventManager)

  useEffect(() => {
    if (instituteId) {
      dispatch(paymentGateWaySetupActions(instituteId))
    }
  }, [instituteId, academicSessionId])

  const {
    address: {country},
  } = useSelector((store) => store.instituteInfo)

  const getCountryData = async () => {
    const res = await getCountryDataWithCountryCode({country: country})
    setCountryData(res)
  }

  useEffect(() => {
    getCountryData()
  }, [])

  useEffect(() => {
    if (countryData?.iso_country_code)
      dispatch(fetchPgList({country: countryData?.iso_country_code}))
  }, [countryData])

  useEffect(() => {
    if (
      paymentGatewaySetup?.pg_credentials_list &&
      Object.keys(pgList)?.length > 0
    ) {
      const verifiedPgs = paymentGatewaySetup?.pg_credentials_list.map(
        (item) => item.pg_id
      )
      const filteredPg = {...pgList}
      Object.keys(pgList).map((key) => {
        if (verifiedPgs.includes(key)) delete filteredPg[key]
      })
      setFilteredPgList(filteredPg)
    }
  }, [paymentGatewaySetup?.pg_credentials_list, pgList])

  const getShowPaymentGatewayBool = () => {
    if (!paymentGatewaySetup) return true
    if (paymentGatewaySetup?.kyc_status?.length) return false
    if (paymentGatewaySetup?.pg_credentials_list?.length) return false
    return true
  }
  const [showPaymentGateways, setShowPaymentGateways] = useState(
    getShowPaymentGatewayBool()
  )

  useEffect(() => {
    setShowPaymentGateways(getShowPaymentGatewayBool())
  }, [paymentGatewaySetup])

  const pglistArr = []
  paymentGatewaySetup?.pg_credentials_list.map((pg) => {
    return pglistArr.push(pg.pg_id)
  })

  if (!paymentGatewaySetup) {
    return <div className="loading"></div>
  }
  const existPgList = Object.keys(paymentLogo).filter((method) => {
    return !pglistArr.includes(method)
  })

  const handleEditPg = (paymentGateWayData) => {
    setPaymentGatewayForEdit({
      ...paymentGateWayData?.meta_info,
      pg_credentials_id: paymentGateWayData?.pg_credentials_id,
    })
    setShowPaymentGateways(true)
  }

  return (
    <>
      <div className="lg:hidden mt-20">
        <EmptyScreenV1
          image={examMobileImage}
          title={t('toUseTheFeaturePleaseOpenThePageInDesktop')}
          desc=""
          btnText={t('goToDashboardBtn')}
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>

      <div className="hidden lg:block">
        {!showPaymentGateways && (
          <div className={styles.mainClass}>
            {paymentGatewayErrorMsg && (
              <ErrorOverlay>{paymentGatewayErrorMsg}</ErrorOverlay>
            )}
            <div className={styles.subclass}>
              <div className="tm-para1 tm-color-text-primary">
                <p className={styles.headData}>
                  {' '}
                  {t('onlinePaymentCollection')}{' '}
                </p>
                <p className={styles.subData}>
                  {t('allPaymentsCollectedOnlineWillBeSentToTheBelowAccount')}
                </p>
              </div>
              {existPgList.length > 0 &&
                Object.keys(filteredPgList).length > 0 && (
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.feeModuleController_pgCreate_create
                    }
                  >
                    <Button
                      className={styles.addNewBtn}
                      onClick={() => {
                        setPaymentGatewayForEdit(null)
                        setShowPaymentGateways(true)
                      }}
                    >
                      {t('addPaymentGateway')}
                    </Button>
                  </Permission>
                )}
            </div>

            {paymentGatewaySetup &&
              paymentGatewaySetup?.pg_credentials_list.length > 0 &&
              paymentGatewaySetup?.pg_credentials_list &&
              paymentGatewaySetup?.pg_credentials_list.map(
                (paymentGateway, i) => (
                  <>
                    {multiplePaymentGatewayErrorMsg && (
                      <ErrorOverlay>
                        {multiplePaymentGatewayErrorMsg}
                      </ErrorOverlay>
                    )}
                    {paymentGateway.pg_id === multiPaymentGateway.RAZORPAY &&
                    paymentGateway.kyc_status ? (
                      <div className={styles.testClass}>
                        {(paymentGateway?.kyc_status === KYC_INFO.REQUESTED ||
                          paymentGateway?.kyc_status ===
                            KYC_INFO.UNDER_REVIEW) && (
                          <div className={styles.mt5}>
                            <div className={styles.inProcess}>
                              <div>
                                <Icon
                                  name="clock"
                                  type="outlined"
                                  color="success"
                                  size="4xl"
                                />
                                {/* <img src="https://storage.googleapis.com/tm-assets/icons/colorful/sand-timer-green.svg" /> */}
                              </div>
                              <div className={styles.displaytext}>
                                <p className={styles.progress}>
                                  {t('verificationInProcess')}
                                </p>
                                <p className={styles.subText}>
                                  {t('threeWorkingDays')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentGateway?.kyc_status ===
                          KYC_INFO.NEED_CLARIFICATION && (
                          <div className={styles.mt5}>
                            <div className={styles.inProcess}>
                              <div>
                                <Icon
                                  name="info"
                                  type="filled"
                                  color="warning"
                                  size="4xl"
                                />
                                {/* <img src="https://storage.googleapis.com/tm-assets/icons/colorful/warning-orange.svg" /> */}
                              </div>
                              <div className={styles.displaytext}>
                                <p className={styles.moreInfo}>
                                  {t('needMoreInformation')}
                                </p>
                                <p className={styles.subText}>
                                  {t('issueWithDocument')}
                                </p>
                              </div>
                            </div>
                            <div
                              className={classNames(
                                styles.addInfo,
                                'flex tm-box-shadow1 tm-border-radius1 p-4 mt-4'
                              )}
                            >
                              <div>
                                <p className={styles.uploadData}>
                                  {t('requiresFewClarifications')}{' '}
                                  <a
                                    href={'mailto:' + paymentGateway.email}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.emailLinkData}
                                  >
                                    {paymentGateway.email}
                                  </a>
                                </p>
                                <p
                                  className={classNames(
                                    styles.uploadData,
                                    'mt-8'
                                  )}
                                >
                                  {t('updateAlternatively')}{' '}
                                  <a
                                    href="https://dashboard.razorpay.com/signin?screen=sign_in"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.portalLinkData}
                                    onClick={eventManager.send_event(
                                      events.RAZORPAY_DASHBOARD_OPENED_TFI
                                    )}
                                  >
                                    {t('razorpayDashboard')}
                                  </a>
                                </p>
                                <p className={styles.uploadData}>
                                  {t('rememberPassword')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentGateway?.kyc_status === KYC_INFO.ACTIVATED && (
                          <div className={styles.mt5}>
                            <div className={styles.easeBuzzData}>
                              <div className={styles.logoSetting}>
                                <div className={styles.diplayData}>
                                  <Icon
                                    name="checkCircle"
                                    type="filled"
                                    color="success"
                                    size="4xl"
                                  />
                                  {/* <img src="https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg" /> */}
                                </div>
                                <div className={styles.diplayData}>
                                  <img
                                    src={
                                      paymentLogo[multiPaymentGateway.RAZORPAY]
                                    }
                                  />
                                  <div className={styles.gatewayName}>
                                    {t('paymentGateway')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentGateway?.kyc_status === KYC_INFO.SUSPENDED && (
                          <div className={styles.mt5}>
                            <div className={styles.inProcess}>
                              <div>
                                <Icon
                                  name="removeCircle"
                                  type="filled"
                                  color="error"
                                  size="4xl"
                                />
                                {/* <img src="https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg" /> */}
                              </div>
                              <div className={styles.displaytext}>
                                <p className={styles.failText}>
                                  {t('verificationFailed')}
                                </p>
                                <p className={styles.subText}>
                                  {t('notAbleToCollectOnlinePayments')}
                                </p>
                              </div>
                            </div>
                            <div
                              className={classNames(
                                styles.failStatus,
                                'tm-box-shadow1 tm-border-radius1 p-4 mt-4'
                              )}
                            >
                              <p className={styles.failData}>
                                {t('rejectApplication')}
                              </p>

                              <p
                                className={classNames(styles.failData, 'mt-8')}
                              >
                                {t('getInTouchWithRazorpay')}{' '}
                                <a
                                  href="https://dashboard.razorpay.com/signin?screen=sign_in"
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.portalLinkData}
                                >
                                  {t('razorpayDashboard')}
                                </a>{' '}
                                {MORE_DETAILS}
                              </p>
                              <p className={styles.failData}>
                                {t('moreDetails')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.mt5} key={i + 1}>
                        <div className={styles.easeBuzzData}>
                          <div className={styles.logoSetting}>
                            <div className={styles.diplayData}>
                              <Icon
                                name="checkCircle"
                                type="filled"
                                color="success"
                                size="4xl"
                              />
                              {/* <img src="https://storage.googleapis.com/tm-assets/icons/colorful/tick-bg-green.svg" /> */}
                            </div>
                            <div
                              className={classNames(
                                styles.diplayData,
                                styles.pgClass
                              )}
                            >
                              <img
                                src={paymentGateway?.logo}
                                className={styles.img}
                              />
                              <div
                                className={classNames(
                                  styles.gatewayName,
                                  styles.pgClass
                                )}
                              >
                                {t('paymentGateway')}
                              </div>
                            </div>

                            <div
                              className={classNames(
                                styles.vl,
                                styles.diplayData
                              )}
                            ></div>

                            <div className={styles.diplayData}>
                              <span className={styles.apiKey}>
                                #{paymentGateway.api_key}
                              </span>
                              <br />
                              <span className={styles.apiKeyText}>
                                {t('ApiKey')}
                              </span>
                            </div>
                          </div>

                          <EditAndAccessTeachpay
                            paymentGateway={paymentGateway}
                            setShowTeachPay={setShowTeachPay}
                            handleEditPg={handleEditPg}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )
              )}
          </div>
        )}

        {showPaymentGateways && (
          <PaymentGateways edit={paymentGatewayForEdit} />
        )}

        {showTeachPay && (
          <TeachPay
            setShowTeachPay={setShowTeachPay}
            teachPaySetup={teachPaySetup}
            credentialsList={credentialsList}
          />
        )}
      </div>
    </>
  )
}

export default FeeKYC

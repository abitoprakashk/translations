import {t} from 'i18next'
import {Button, ErrorOverlay, StickyFooter, Table} from '@teachmint/common'
import classNames from 'classnames'
import selected from '../../../../assets/images/companyLogos/Toggle.svg'
import examMobileImage from '../../../../assets/images/dashboard/exam-mobile.svg'
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  useFeeCollection,
  useInstituteId,
} from '../../redux/feeCollectionSelectors'
import styles from './PaymentGateways.module.css'
import {events} from '../../../../utils/EventsConstants'
import {
  showErrorOccuredAction,
  showLoadingAction,
} from '../../../../redux/actions/commonAction'
import {utilsGetKYCUrl} from '../../../../routes/dashboard'
import {useHistory} from 'react-router-dom'
import {multiPaymentGateway, colsData} from '../../fees.constants'
import AddUpdatePGData from './AddUpdatePGData'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {DASHBOARD} from '../../../../utils/SidebarItems'
import FeeKYC from './FeeKYC'
import {handleEasebuzzRegistration} from '../../apis/fees.utils'
import {fetchPgList} from '../../redux/actions/pgActions'
import {getCountryDataWithCountryCode} from '../../../../routes/dashboard'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {EmptyState} from '@teachmint/krayon'

const PaymentGateways = ({edit = {}}) => {
  const {
    paymentGatewaySetup: {pg_credentials_list},
  } = useFeeCollection()

  const dispatch = useDispatch()
  const instituteId = useInstituteId()
  const {paymentGatewaySetup, paymentGatewayErrorMsg} = useFeeCollection()
  const [tableData, setTableData] = useState([])
  const [cols, setTableCol] = useState([])
  const [selectedGateWay, setSelectedGateWay] = useState('')
  const [nxtBtn, setNxtBtn] = useState(1)
  const [selectedGateWayData, setSelectedPGData] = useState({})
  const [filteredPgList, setFilteredPgList] = useState({})
  const {pgList} = useSelector((store) => store.paymentGatewayData)
  const eventManager = useSelector((state) => state.eventManager)
  const [countryData, setCountryData] = useState('')
  const [showPaymentGatewayStatus, setShowPaymentGatewayStatus] =
    useState(false)
  const showFooter = true
  const history = useHistory()

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
    if (pg_credentials_list && Object.keys(pgList)?.length > 0) {
      const verifiedPgs = pg_credentials_list.map((item) => item.pg_id)
      const filteredPg = {...pgList}
      Object.keys(pgList).map((key) => {
        if (verifiedPgs.includes(key)) delete filteredPg[key]
      })
      setFilteredPgList(filteredPg)
      if (Object.keys(filteredPg).length == Object.keys(pgList).length)
        handlePG(
          Object.keys(filteredPg).length > 0
            ? Object.keys(filteredPg)[0]
            : multiPaymentGateway.EASEBUZZ
        )
      else handlePG(Object.keys(filteredPg)[0])
    }
  }, [pg_credentials_list, pgList])

  useEffect(() => {
    // setSelectedGateWay()
    if (pgList && Object.keys(pgList).length) {
      if (edit && Object.keys(edit).length) {
        handlePG(edit.pg_id)
        setNxtBtn(2)
      }
      // else handlePG(multiPaymentGateway.EASEBUZZ)
    }
  }, [pgList])

  const handleRegisterClick = (link) => {
    handleEasebuzzRegistration(eventManager, link)
  }

  const handleKYC = () => {
    eventManager.send_event(events.COMPLETE_KYC_CLICKED_TFI)
    dispatch(showLoadingAction(true))
    if (instituteId) {
      utilsGetKYCUrl(instituteId)
        .then(({data}) => window.open(data))
        .catch(() => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const handlePG = (type) => {
    const pricingInfo = pgList[type]?.pricing_information
    const rowData =
      pricingInfo &&
      Object.keys(pricingInfo).map((key) => {
        return {key: key, pricing: pricingInfo[key]}
      })

    setTableCol(cols)
    setTableData(rowData)
    setSelectedGateWay(type)
    setSelectedPGData(pgList[type])
  }

  const handleNxtEvnt = (selectedGateWay) => {
    eventManager.send_event(events.PAYMENT_GATEWAY_SELECTED_TFI, {
      gateway: selectedGateWay,
      pricing: tableData,
    })
    setNxtBtn(2)
  }

  if (!paymentGatewaySetup) {
    return <div className="loading"></div>
  }

  let pgDataList = Object.keys(filteredPgList)?.length ? filteredPgList : pgList

  return (
    <>
      <div className="lg:hidden mt-20">
        <EmptyScreenV1
          image={examMobileImage}
          title="To use the feature please open the page in Desktop"
          desc=""
          btnText="Go to Dashboard"
          handleChange={() => history.push(DASHBOARD)}
          btnType="primary"
        />
      </div>

      <div className="hidden lg:block">
        {Object.keys(pgDataList).length > 0 && !showPaymentGatewayStatus ? (
          <div className={styles.mainClass}>
            {paymentGatewayErrorMsg && (
              <ErrorOverlay>{paymentGatewayErrorMsg}</ErrorOverlay>
            )}

            <div className={styles.subclass}>
              <div className="tm-para1 tm-color-text-primary">
                <p className={styles.maintext}>Payment Gateway</p>
                <p className={styles.secondaryTxt}>
                  Start collecting online payments by setting up your payment
                  gateway
                </p>
              </div>
              {pg_credentials_list.length > 0 && (
                <Button onClick={() => setShowPaymentGatewayStatus(true)}>
                  {' '}
                  Back
                </Button>
              )}
            </div>

            <hr />

            {nxtBtn == 1 && (
              <div className={styles.displayCard}>
                <div className={styles.paymentGatewaySettings}>
                  <div className={styles.testData}>
                    <label className={styles.gatewaySelection}>
                      Select payment gateway
                    </label>
                    <div className={styles.disData}>
                      {Object.keys(pgDataList).map((key) => (
                        <button
                          key={key}
                          className={classNames(
                            styles.spanDesign,
                            styles.paymentGateway,
                            {
                              [styles.activeClass]: selectedGateWay === key,
                            }
                          )}
                          onClick={() => handlePG(key)}
                        >
                          <div>
                            {selectedGateWay === key && (
                              <img
                                src={selected}
                                className={styles.selectedPg}
                              />
                            )}
                            <img
                              className={styles.img}
                              src={pgList[key].logo}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.settingData}>
                  <div className={styles.vertical}></div>
                  <div className={styles.tablepaymentGatewaySettings}>
                    <div className={classNames(styles.logoStyling, 'flex')}>
                      <img
                        className={styles.img1}
                        src={pgList[selectedGateWay]?.logo}
                      />{' '}
                      <span className={styles.pricing}>Pricing</span>
                    </div>
                    <div className={styles.tableData}>
                      <Table
                        className={styles.tableWidth}
                        rows={tableData}
                        cols={colsData}
                      />
                    </div>
                  </div>
                </div>

                {showFooter && selectedGateWay !== '' && (
                  <StickyFooter>
                    <div>
                      <Permission
                        permissionId={
                          PERMISSION_CONSTANTS.feeModuleController_pgCreate_create
                        }
                      >
                        <Button
                          className={classNames(styles.testBtn, 'fill')}
                          type="secondary"
                          onClick={() => handleNxtEvnt(selectedGateWay)}
                        >
                          Next
                        </Button>
                      </Permission>
                    </div>
                  </StickyFooter>
                )}
              </div>
            )}

            {nxtBtn == 2 && (
              <AddUpdatePGData
                selectedGateWay={selectedGateWay}
                selectedGateWayData={selectedGateWayData}
                setNxtBtn={setNxtBtn}
                triggerEvent={() =>
                  eventManager.send_event(events.CHANGE_GATEWAY_CLICKED_TFI, {
                    gateway: selectedGateWay,
                  })
                }
                handleKYC={handleKYC}
                handleRegisterClick={handleRegisterClick}
                edit={edit}
                countryData={countryData}
              />
            )}
          </div>
        ) : (
          <div className={styles.emptystateStyle}>
            <EmptyState
              iconName={'doNotDisturbFlipped'}
              content={t('paymentServiceNotAvailable')}
              button={false}
            />
          </div>
        )}
      </div>

      {showPaymentGatewayStatus && <FeeKYC />}
    </>
  )
}

export default PaymentGateways

import React, {useEffect, useState} from 'react'
import {events} from '../../../../utils/EventsConstants'
import {
  FEE_REPORTS_TEMPLATES,
  getDoughnutGraphData,
  getPayDuesCardDetails,
  getPayCollectionCardDetails,
  getMiscCardDetails,
  SELECTED_FEE_TAB_INDEX,
} from '../../fees.constants'
import TabSelection from './components/tabSelection/tabSelection'
import {useDispatch, useSelector} from 'react-redux'
import styles from './FeeReports.module.css'
//imgs
import FeeWiseImg from '../../../../assets/images/dashboard/fee-type-wise.svg'
import ChequeStatusImg from '../../../../assets/images/dashboard/cheque-status-fee.svg'
import AllTransactionImg from '../../../../assets/images/dashboard/all-transaction-fee.svg'
import StudentWiseImg from '../../../../assets/images/dashboard/stud-wise-fee.svg'
import InstallmentWiseImg from '../../../../assets/images/dashboard/installment-wise-fee.svg'
import ClassWiseFeeImg from '../../../../assets/images/dashboard/class-wise-fee.svg'
import PaymentModeImg from '../../../../assets/images/dashboard/payment-mode-wise.svg'
import {fetchFeeTypesRequestedAction} from '../../redux/feeStructure/feeStructureActions'
import DoughnutCard from './components/doughnutCard/doughnutCard'
import ChequeListBar from './components/chequeListBar/chequeListBar'
import FeeCards from './components/feeCards/feeCards'
import {
  fetchInstalmentDateTimestampAction,
  fetchInstituteFeeTypesAction,
  fetchFeeDataAction,
  fetchFeeDataStartAction,
  fetchFeeDataDefaultersAction,
  fetchFeeChequeCountAction,
  setReportTemplateIdAction,
  fetchTimeStampFeeDataAction,
} from '../../redux/feeReports/feeReportsAction'
import classNames from 'classnames'
import history from '../../../../history'
import {useTranslation} from 'react-i18next'
import {DEFAULT_CURRENCY} from '../../../../constants/common.constants'
import {Heading, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import FeeCard from './components/FeeCard/FeeCard'
import {
  deleteFromSessionStorage,
  getFromSessionStorage,
  setToSessionStorage,
} from '../../../../utils/Helpers'
import {REPORT_TYPE} from './feeReport.constants'
import globalActions from '../../../../redux/actions/global.actions'
import {useLocation} from 'react-router-dom'
const doughnutDatatemp = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderWidth: 2,
    },
  ],
}

export default function FeeReports() {
  const {t} = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()
  const {
    instituteStudentList,
    instituteAcademicSessionInfo,
    instituteHierarchy,
  } = useSelector((state) => state)
  const {instituteInfo} = useSelector((state) => state)
  const {eventManager} = useSelector((state) => state)
  const {
    feeReportData,
    feeReportDataStart,
    instalmentTimestampList,
    chequeCount,
  } = useSelector((state) => state.feeReports)
  const [selectedDropDownOpt, setSelectedDropDownOpt] = useState({
    0: 0,
    1: 'All Classes',
    2: instituteAcademicSessionInfo?.[0]?.start_time / 1000,
    3: instituteAcademicSessionInfo?.[0]?.start_time / 1000,
  }) //0 -> Paid vs due, 1 -> Overdue Students, 2 -> PaymentMode wise collections
  const [doughnutData, setDoughnutData] = useState({})
  const [selectedTab, setSelectedTab] = useState(null)

  const departments = instituteHierarchy && instituteHierarchy.children

  const getCurrencySymbol = () => {
    if (instituteInfo && instituteInfo.currency) {
      return instituteInfo.currency
    }
  }

  useEffect(() => {
    if (selectedTab) {
      {
        eventManager.send_event(events.FEE_REPORTS_TAB_CLICKED_TFI, {
          tab: selectedTab,
        })
      }
    }
  }, [selectedTab])

  const chartOptions = {
    locale:
      instituteInfo.currency === DEFAULT_CURRENCY ||
      instituteInfo.currency === null ||
      instituteInfo.currency === ''
        ? 'en-IN'
        : 'en-US', // Added to remove commas in chart hover values
  }

  const getClassNames = () => {
    const className = []
    departments?.map((dept) => {
      if (dept.children.length > 0) {
        dept.children.map((cls) => {
          cls.children.map((section) => {
            if (section.name !== '+ Add new section')
              className.push(cls.name + '-' + section.name)
          })
        })
      }
    })
    let finalArr = []
    finalArr = className.map((cls) => {
      return {label: cls, value: cls}
    })
    finalArr.unshift({label: 'All Classes', value: 'All Classes'})
    return finalArr
  }

  useEffect(() => {
    getFeeData(0)
    dispatch(fetchFeeDataStartAction())
    dispatch(fetchFeeChequeCountAction({actionType: 'count'}))
    // check if selected tab is stored in session storage.
    const selectedIndex = getFromSessionStorage(SELECTED_FEE_TAB_INDEX)
    if (selectedIndex && Object.values(REPORT_TYPE).includes(selectedIndex)) {
      setSelectedTab(selectedIndex)
      deleteFromSessionStorage(SELECTED_FEE_TAB_INDEX)
    }
  }, [])

  useEffect(() => {
    dispatch(fetchFeeTypesRequestedAction())
    dispatch(fetchInstituteFeeTypesAction())
    dispatch(fetchInstalmentDateTimestampAction())
  }, [instituteInfo._id])

  useEffect(() => {
    // CUSTOM REPORTS
    getCustomReportsData()
  }, [location])

  const getCustomReportsData = () => {
    dispatch(globalActions.feeCustomReports.request())
  }

  //to set dough nut data of over due students
  useEffect(() => {
    if (feeReportDataStart) {
      let totalStud = 0,
        paidStud = 0,
        dueStud = 0
      for (let rep of feeReportDataStart) {
        if (rep.payable_amount !== 0) {
          if (parseFloat(rep.due_amount) > 0.0) {
            dueStud += 1
          } else if (rep.paid_amount >= 0.0) {
            paidStud += 1
          }
          totalStud++
        }
      }
      setDoughnutData({
        ...doughnutData,
        1: {
          labels: [],
          labelData: [totalStud, paidStud, dueStud],
          datasets: [
            {
              data: [paidStud, dueStud],
              backgroundColor: ['#A8D793', '#FF6666'],
              hoverBackgroundColor: ['#A8D793', '#FF6666'],
              borderWidth: 2,
            },
          ],
        },
      })
    }
  }, [feeReportDataStart])

  //called if changes in class dropdown
  const getFeeClassData = (clsName) => {
    if (feeReportDataStart && instituteStudentList) {
      let totalStud = 0,
        paidStud = 0,
        dueStud = 0
      for (let stud of instituteStudentList) {
        if (clsName === 'All Classes' || stud.classroom === clsName) {
          let obj = feeReportDataStart.find(
            (rep) => rep.student_id === stud._id
          )
          if (obj && obj.payable_amount !== 0) {
            if (parseFloat(obj.due_amount) > 0.0) {
              dueStud += 1
            } else if (obj.paid_amount >= 0.0) {
              paidStud += 1
            }
            totalStud++
          }
        }
      }
      setSelectedDropDownOpt({...selectedDropDownOpt, 1: clsName})
      setDoughnutData({
        ...doughnutData,
        1: {
          labels: [],
          labelData: [totalStud, paidStud, dueStud],
          datasets: [
            {
              data: [paidStud, dueStud],
              backgroundColor: ['#A8D793', '#FF6666'],
              hoverBackgroundColor: ['#A8D793', '#FF6666'],
              borderWidth: 2,
            },
          ],
        },
      })
    }
  }

  //to set dough nut data of paid vs due fee
  useEffect(() => {
    if (feeReportData) {
      let due = 0,
        paid = 0,
        total = 0,
        discount_amount = 0
      for (let rep of feeReportData) {
        due += rep.due_amount ? rep.due_amount : 0
        paid += rep.paid_amount ? rep.paid_amount : 0
        discount_amount += rep.discount_amount ? rep.discount_amount : 0
      }
      total = (due + paid + discount_amount).toFixed(2)
      due = due.toFixed(2)
      paid = paid.toFixed(2)
      discount_amount = discount_amount.toFixed(2)

      setDoughnutData({
        ...doughnutData,
        0: {
          labels: [],
          labelData: [total, paid, due, discount_amount],
          datasets: [
            {
              data: [paid, due, discount_amount],
              backgroundColor: ['#A8D793', '#FF6666', '#6EC2D4'],
              hoverBackgroundColor: ['#A8D793', '#FF6666', '#6EC2D4'],
              borderWidth: 2,
            },
          ],
        },
      })
    }
  }, [feeReportData])

  const getFeeDataDefaulters = (startDate) => {
    dispatch(fetchFeeDataDefaultersAction(startDate))
    setSelectedDropDownOpt({...selectedDropDownOpt, 3: startDate})
  }

  const getFeeData = (startDate) => {
    dispatch(fetchFeeDataAction(startDate))
    setSelectedDropDownOpt({...selectedDropDownOpt, 0: startDate})
  }

  //
  const getPaymentModeDetails = (startDate) => {
    dispatch(
      fetchTimeStampFeeDataAction({
        report_type: 'FEE_COLLECTION_PAYMENTMODE',
        meta: {
          report_name: '',
          date_range: {
            start_date: startDate,
            end_date: Date.now() / 1000,
          },
        },
      })
    )
    setSelectedDropDownOpt({...selectedDropDownOpt, 2: startDate})
  }

  const handleReporttypeSelection = (feeReportTemplateType, isCard) => {
    dispatch(
      setReportTemplateIdAction(
        FEE_REPORTS_TEMPLATES[feeReportTemplateType].value
      )
    )
    eventManager.send_event(events.FEE_REPORT_NODE_CLICKED_TFI, {
      ...FEE_REPORTS_TEMPLATES[feeReportTemplateType].events,
      card: isCard ? 'yes' : 'no',
    })
    history.push(
      `/institute/dashboard/fee-reports/${FEE_REPORTS_TEMPLATES[feeReportTemplateType].route}`
    )
  }

  const payAndDuesCards = getPayDuesCardDetails(
    handleReporttypeSelection,
    StudentWiseImg,
    InstallmentWiseImg,
    ClassWiseFeeImg
  )
  const payCollectionCards = getPayCollectionCardDetails(
    handleReporttypeSelection,
    InstallmentWiseImg,
    PaymentModeImg,
    FeeWiseImg,
    ClassWiseFeeImg
  )
  const MiscellaneousReportCard = getMiscCardDetails(
    handleReporttypeSelection,
    ChequeStatusImg,
    AllTransactionImg
  )

  const getNumberSuffix = (num) => {
    return ['st', 'nd', 'rd'][((((num + 90) % 100) - 10) % 10) - 1] || 'th'
  }

  const getInstallmentLabels = (instArr) => {
    let optArr = [...instArr]
    let tempArr = [],
      instIndex = 0
    for (let inst of optArr) {
      tempArr.push({
        label:
          inst.label === 'All Installments'
            ? inst.label
            : `${instIndex}${getNumberSuffix(instIndex)} Installment - ${
                inst.label
              }`,
        value: inst.value,
      })
      instIndex++
    }
    return tempArr
  }

  let installmentsOptions = []
  installmentsOptions.push(
    ...instalmentTimestampList.map((installment) => {
      return {
        label: new Date(installment * 1000).toLocaleDateString('en-In', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        value: installment,
      }
    })
  )
  installmentsOptions.unshift({label: 'All Installments', value: 0})
  const payDetailsGraphData = getDoughnutGraphData(
    installmentsOptions,
    getClassNames,
    handleReporttypeSelection
  )

  const payDetailsCard = (cardDetail) => {
    return (
      // className={classNames(styles.detailedReportBox)}
      <FeeCard
        onClick={() => {
          //  set selected tab in session storage
          setToSessionStorage(SELECTED_FEE_TAB_INDEX, selectedTab)
          cardDetail.click()
        }}
      >
        <FeeCard.Header>
          <div className={classNames(styles.feeCardTitleImg)}>
            <img src={cardDetail.icon} alt="fee cards icons"></img>
          </div>
          <Icon name="arrowForwardIos" size={ICON_CONSTANTS.SIZES.XX_SMALL} />
        </FeeCard.Header>
        <div className={styles.payDetailsCardTitle}>{cardDetail.title}</div>
        <div className={classNames(styles.payDetailDesc)}>
          {cardDetail.description}
        </div>
      </FeeCard>
    )
  }

  const handleChequeListDownload = () => {
    dispatch(
      fetchFeeChequeCountAction({
        actionType: 'Download Report',
        reportName: 'cheque-list',
        instituteStudentList,
        instituteInfo,
      })
    )
    eventManager.send_event(events.FEE_REPORT_DOWNLOAD_OVERVIEW_TFI)
  }

  return (
    <>
      <div
        className={classNames(
          styles.feeReportSection,
          'show-scrollbar show-scrollbar-big '
        )}
      >
        <div className={classNames(styles.feeTitle)}>{t('feeReports')}</div>
        {/* <div className={classNames(styles.feeSubTitle)} >Track fee payments and download detailed reports</div> */}
        <div
          className={classNames(styles.divider, styles.feeTitleDivider)}
        ></div>
        {chequeCount ? (
          <ChequeListBar
            chequeCount={chequeCount}
            handleChequeListDownload={handleChequeListDownload}
          />
        ) : (
          ''
        )}
        <div className={styles.wFull}>
          {payDetailsGraphData.map((payDetail, index) => (
            <div key={index}>
              {' '}
              <DoughnutCard
                payDetails={payDetail}
                getInstallmentLabels={getInstallmentLabels}
                getFeeData={getFeeData}
                getFeeClassData={getFeeClassData}
                getPaymentModeDetails={getPaymentModeDetails}
                getFeeDataDefaulters={getFeeDataDefaulters}
                selectedDropDownOpt={selectedDropDownOpt}
                doughnutData={doughnutData}
                doughnutDatatemp={doughnutDatatemp}
                getCurrencySymbol={getCurrencySymbol}
                chartOptions={chartOptions}
                eventManager={eventManager}
                feeReportTemplateType={payDetail.reportTypeCard}
              />
            </div>
          ))}
        </div>
        <div className={styles.clearBoth}></div>
        <Heading className={styles.heading} textSize="s">
          {t('detailedReports')}
        </Heading>
        <TabSelection
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        <FeeCards
          selectedTab={selectedTab}
          payAndDuesCards={payAndDuesCards}
          payDetailsCard={payDetailsCard}
          payCollectionCards={payCollectionCards}
          MiscellaneousReportCard={MiscellaneousReportCard}
          getCustomReportsData={getCustomReportsData}
        />
      </div>
    </>
  )
}

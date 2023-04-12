import {ErrorBoundary, ErrorOverlay, Table, Tag} from '@teachmint/common'
import {useDispatch, useSelector} from 'react-redux'
import {SliderScreens} from '../../fees.constants'
import userDefaultImg from '../../../../assets/images/icons/user-profile.svg'
import feeCollectionActionTypes from '../../redux/feeCollectionActionTypes'
import {useFeeCollection} from '../../redux/feeCollectionSelectors'

import styles from './StudentSearchResults.module.css'
import {getAmountFixDecimalWithCurrency} from '../../../../utils/Helpers'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {events} from '../../../../utils/EventsConstants'

const StudentSearchResults = () => {
  const {t} = useTranslation()
  const {instituteInfo, eventManager, instituteActiveAcademicSessionId} =
    useSelector((state) => state)
  const {searchResults, searchResultsLoading, searchResultErrMsg} =
    useFeeCollection()

  const dispatch = useDispatch()

  if (searchResultsLoading) {
    return (
      <div className={styles.searchResults}>
        <div className={styles.searchresultData}>
          <div style={{width: '100px'}}>
            <div className="loading" />
          </div>
        </div>
      </div>
    )
  }

  if (searchResults.length === 0) {
    return ''
  }

  const sendClickEvent = (eventName, dataObj = {}) => {
    eventManager.send_event(eventName, {
      ...dataObj,
    })
  }

  const handleNameClick = (studentData) => {
    sendClickEvent(events.FEE_STUDENT_NAME_CLICKED_TFI, {
      student_id: studentData.Id,
      screen_name: 'search_bar',
      session_id: instituteActiveAcademicSessionId,
    })

    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: {
        name: SliderScreens.STUDENT_DETAILS_SLIDER,
        data: studentData,
      },
    })
  }

  const handleCollectFeeBtnClick = (studentData) => {
    eventManager.send_event(events.RECORD_PAYMENT_INITIALIZED_TFI, {
      student_id: studentData.Id,
      screen_name: 'search_bar',
      session_id: instituteActiveAcademicSessionId,
    })

    dispatch({
      type: feeCollectionActionTypes.SET_SLIDER_SCREEN,
      payload: {
        name: SliderScreens.COLLECT_FEES_SLIDER,
        data: studentData,
      },
    })
  }

  const rows = searchResults.map(
    (rowData) => (
      (rowData = {
        ...rowData,
        selectedSliderTab: 'FEE_HISTORY',
      }),
      {
        id: rowData.enrollmentNumber,
        studentDetails: (
          <div className={styles.flex}>
            <img
              className={styles.img}
              src={rowData.picUrl || userDefaultImg}
              alt=""
            />
            <div>
              <div
                className={styles.link}
                onClick={() => {
                  handleNameClick(rowData)
                }}
              >
                {rowData?.full_name || rowData?.name || '-'}
              </div>
              <div className={styles.displayData}>
                {!!rowData.phoneNumber && (
                  <div className="teachmint zipy-block">
                    +{rowData.phoneNumber}
                  </div>
                )}
                <div className={styles.studentStatus}>
                  &nbsp; &nbsp;
                  <span className={styles.spanSettings}>&bull; </span> &nbsp;
                  {rowData.verificationStatus === 1 ? (
                    <Tag accent="success" content={t('joined')} />
                  ) : (
                    <Tag accent="danger" content={t('notJoined')} />
                  )}
                </div>
              </div>
              <span className={styles.mobileView}>
                {rowData.class} - {rowData.section}
              </span>
            </div>
          </div>
        ),
        classAndSection: (
          <span className={styles.desktopView}>
            {rowData.class} - {rowData.section}
          </span>
        ),
        paid: (
          <div>
            <div className={styles.paid}>
              {getAmountFixDecimalWithCurrency(
                rowData.paid ?? 0,
                instituteInfo.currency
              )}
            </div>
            {/* <div className={styles.inputGrp}>
          {upcomingReminderDate(rowData.lastPaidDate)} &nbsp;
          <span className={styles.spanSettings}>&bull; </span>
          {paymentMethods[rowData.paymentMethod]}
          {rowData.lastPaidDate} - {rowData.paymentMethod}
        </div> */}
          </div>
        ),
        due: (
          <div>
            <div className={styles.due}>
              {getAmountFixDecimalWithCurrency(
                rowData.due ?? 0,
                instituteInfo.currency
              )}
            </div>
            {/* <div className={styles.inputGrp}>
          {upcomingReminderDate(rowData.dueDate)}
        </div>
        <div>{rowData.dueDate}</div> */}
          </div>
        ),
        paymentHistories: (
          <a className="link" onClick={() => handleNameClick(rowData)}>
            {t('paymentHistory')}
          </a>
        ),
        action: (
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.feeModuleController_feeStudentPayment_create
            }
          >
            <button
              className={styles.btnfill}
              onClick={() => handleCollectFeeBtnClick(rowData)}
            >
              {t('collectFee')}
            </button>
          </Permission>
        ),
      }
    )
  )

  const cols = [
    {key: 'id'},
    {key: 'studentDetails', label: 'student details'},
    {key: 'classAndSection', label: 'class & section'},
    {key: 'paid', label: 'paid'},
    {key: 'due', label: 'due'},
    {key: 'paymentHistories', label: 'Payment History'},
    {key: 'action', label: 'action'},
  ]

  return (
    <>
      {searchResultErrMsg && <ErrorOverlay>{searchResultErrMsg}</ErrorOverlay>}
      <ErrorBoundary>
        <div
          className={classNames(
            styles.searchResults,
            'show-scrollbar show-scrollbar-small'
          )}
        >
          <div className={styles.searchresultData}>
            <Table rows={rows} cols={cols} />
          </div>
        </div>
      </ErrorBoundary>
    </>
  )
}

export default StudentSearchResults

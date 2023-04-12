import React, {useEffect} from 'react'
import styles from './AdhocDiscount.module.css'
import {useDispatch, useSelector} from 'react-redux'
import {
  AD_HOC_DISCOUNT_DOT_BUTTON_OPTIONS,
  AD_HOC_DISCOUNT_DOT_BUTTON_OPTION_IDS,
  AD_HOC_DISCOUNT_TABLE_HEADERS,
  SliderScreens,
} from '../../../fees.constants'
import {getStudentDetails} from '../../../helpers/helpers'
import {
  deleteAdHocDiscountAction,
  fetchAdHocDiscountRequestAction,
} from '../../../redux/feeDiscountsActions'
import {getAmountFixDecimalWithCurrency} from '../../../../../utils/Helpers'
import UserProfile from '../../../../../components/Common/UserProfile/UserProfile'
import {DateTime} from 'luxon'
import {useTranslation} from 'react-i18next'
import {Table, Tooltip} from '@teachmint/common'
import {setSliderScreenAction} from '../../../redux/feeTransactionActions'
import SubjectTooltipOptions from '../../../../../components/SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'

export default function AdhocDiscount({
  adHocDiscountStudentList = [],
  adHocDiscountStudentListLoader = false,
  studentsList = [],
  searchTerms = '',
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAdHocDiscountRequestAction())

    return () => {}
  }, [])

  const cols = AD_HOC_DISCOUNT_TABLE_HEADERS.map((col) => {
    return {key: col.key, label: col.originalLable}
  })

  let rows = []

  const handleNameClick = (studentInfo) => {
    dispatch(
      setSliderScreenAction(SliderScreens.STUDENT_DETAILS_SLIDER, {
        Id: studentInfo?._id,
        name: studentInfo?.name,
        phoneNumber: studentInfo?.phone_number,
        selectedSliderTab: 'FEE_HISTORY',
      })
    )
  }

  const handleDeleteReceipt = (action, payload) => {
    switch (action) {
      case AD_HOC_DISCOUNT_DOT_BUTTON_OPTION_IDS.DELETE_DISCOUNT: {
        dispatch(
          deleteAdHocDiscountAction({
            _id: payload,
          })
        )
        break
      }
      default:
        break
    }
  }

  if (adHocDiscountStudentList.length === 0) {
    rows = [
      {
        studentDetails: '',
        amount: '',
        class: '',
        feeTypeDetails: t('noDataFound'),
        receiptNo: '',
        reason: '',
        moreOptions: '',
      },
    ]
  } else {
    rows = adHocDiscountStudentList
      .filter((row) => {
        if (searchTerms) {
          const student = getStudentDetails(studentsList, row.student_id)
          return !student
            ? false
            : student.name
                .toLowerCase()
                .replace('  ', ' ')
                .includes(searchTerms.toLowerCase()) ||
                student.phone_number.includes(searchTerms)
        }
        return true
      })
      .reverse()
      .map((row, idx) => {
        let studentInfo = getStudentDetails(studentsList, row.student_id)
        let receiptNoArr = row?.receipt_no.split(',')
        return {
          studentDetails: (
            <div className={styles.studentDetailsSection}>
              {studentInfo ? (
                <>
                  <UserProfile
                    handleChange={() => handleNameClick(studentInfo)}
                    name={studentInfo.name ?? '-'}
                    phoneNumber={studentInfo.phone_number ?? '-'}
                    image={studentInfo.img_url}
                  />
                </>
              ) : (
                '-'
              )}
            </div>
          ),
          amount: (
            <span className={styles.amountDetailsText}>
              {getAmountFixDecimalWithCurrency(
                row.amount,
                instituteInfo.currency
              )}
            </span>
          ),
          class: studentInfo ? studentInfo.classroom : '-',
          feeTypeDetails: (
            <div>
              <div>{row.fee_type}</div>
              <div className={styles.feeTypeMonthYearText}>
                {' '}
                of {DateTime.fromSeconds(row.timestamp).toFormat(`MMM yy`)}
                {"'"}
              </div>
            </div>
          ),
          receiptNo: (
            <div>
              <a data-tip data-for={`feeTypeDetails${idx}`}>
                <div>
                  {receiptNoArr.length > 3 ? (
                    <span>
                      {receiptNoArr.splice(0, 3).join(',')} +
                      {receiptNoArr.length - 3} {t('more')}
                    </span>
                  ) : (
                    <span>{receiptNoArr.join(',')}</span>
                  )}
                </div>
              </a>
              <Tooltip
                toolTipId={`feeTypeDetails${idx}`}
                type="basic"
                className={styles.receiptTooltip}
              >
                <span>{row.receipt_no}</span>
              </Tooltip>
            </div>
          ),
          reason: <span className={styles.reasonText}>{row.reason}</span>,
          moreOptions: (
            <SubjectTooltipOptions
              subjectItem={row._id}
              options={AD_HOC_DISCOUNT_DOT_BUTTON_OPTIONS}
              trigger={
                <div>
                  <Icon
                    name="ellipsisVertical"
                    type={ICON_CONSTANTS.TYPES.SECONDARY}
                    size={ICON_CONSTANTS.SIZES.MEDIUM}
                  />
                </div>
              }
              handleChange={handleDeleteReceipt}
            />
          ),
        }
      })
  }

  if (adHocDiscountStudentListLoader) {
    return <div className="loader"></div>
  }

  return (
    <div>
      <div>
        <Table cols={cols} rows={rows} />
      </div>
    </div>
  )
}

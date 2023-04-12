import styles from './PaymentSchedule.module.css'
import {useTranslation} from 'react-i18next'
import {
  Badges,
  BADGES_CONSTANTS,
  Button,
  BUTTON_CONSTANTS,
  Chips,
  Dropdown,
  Table,
  TOAST_CONSTANTS,
} from '@teachmint/krayon'
import {
  installmentsListTableCols,
  paymentStatusDropdownOptions,
  paymentStatusOptions,
} from '../../constants'
import {useState} from 'react'
import {
  convertListToSeparatedString,
  handleNull,
  statusBadge,
} from '../../utils'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {getPaymentLink} from '../../apiServices'
import {showToast} from '../../../../redux/actions/commonAction'
import {
  formatCurrencyToCountry,
  getSymbolFromCurrency,
} from '../../../../utils/Helpers'
import {DEFAULT_CURRENCY} from '../../../../constants/common.constants'

export default function PaymentSchedule({collectionInstallments}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {instituteBillingInfo, instituteInfo, currentAdminInfo} = useSelector(
    (state) => state
  )

  const [paymentStatusFilterValue, setPaymentStatusFilterValue] = useState([])

  const getRows = (collectionInstallments) => {
    return collectionInstallments?.map((collectionInstallment, idx) => {
      return {
        id: idx,
        installment_number: collectionInstallment?.name,
        due_date: moment
          .unix(collectionInstallment?.start_time)
          .format('Do MMM YYYY'),
        duration: `${moment
          .unix(collectionInstallment?.start_time)
          .format('Do MMM YYYY')} - ${moment
          .unix(collectionInstallment?.end_time)
          .format('Do MMM YYYY')}`,
        module: handleNull(collectionInstallment?.modules),
        total_amount: `${getSymbolFromCurrency(
          instituteInfo?.currency || DEFAULT_CURRENCY
        )}${formatCurrencyToCountry(
          collectionInstallment?.paid_amount
            ? parseInt(collectionInstallment?.paid_amount) +
                parseInt(collectionInstallment?.pending_amount)
            : parseInt(collectionInstallment?.pending_amount)
        )}`,
        paid_amount: `${getSymbolFromCurrency(
          instituteInfo?.currency || DEFAULT_CURRENCY
        )}${formatCurrencyToCountry(
          parseInt(collectionInstallment?.paid_amount)
        )}`,
        pending_amount: `${getSymbolFromCurrency(
          instituteInfo?.currency || DEFAULT_CURRENCY
        )}${formatCurrencyToCountry(
          parseInt(collectionInstallment?.pending_amount)
        )}`,
        status: (
          <>
            <Badges
              inverted
              showIcon={false}
              type={statusBadge[collectionInstallment?.status].type}
              label={statusBadge[collectionInstallment?.status].label}
            />
            {moment
              .unix(collectionInstallment?.due_date, 'DD-MMM-YYYY')
              .isBefore(moment(), 'days') &&
              parseInt(collectionInstallment?.pending_amount) !== 0 && (
                <Badges
                  inverted
                  showIcon={false}
                  type={BADGES_CONSTANTS.TYPE.ERROR}
                  label={paymentStatusOptions.OVERDUE}
                />
              )}
          </>
        ),
      }
    })
  }

  const getChipList = (list) => {
    let chipList = []
    for (let i = 0; i < list.length; i++)
      chipList.push({id: list[i], label: list[i]})
    return chipList
  }

  const handleChipClicked = (event) => {
    let newPaymentStatusFilterValue = [...paymentStatusFilterValue]
    newPaymentStatusFilterValue = newPaymentStatusFilterValue.filter(
      (item) => item !== event
    )
    setPaymentStatusFilterValue(newPaymentStatusFilterValue)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.headerAndFilters}>
          <div className={styles.header}>{t('paymentSchedule')}</div>
          <div className={styles.filters}>
            <Button
              category={BUTTON_CONSTANTS.CATEGORY.PRIMARY}
              type={BUTTON_CONSTANTS.TYPE.OUTLINE}
              onClick={() => {
                getPaymentLink(
                  instituteInfo,
                  instituteBillingInfo,
                  currentAdminInfo
                )
                  .then((res) => {
                    if (!res?.data?.obj) throw new Error()
                    window.location.href = res?.data?.obj?.payment_link
                  })
                  .catch(() => {
                    dispatch(
                      showToast({
                        type: TOAST_CONSTANTS.TYPES.ERROR,
                        message: t('somethingWentWrong'),
                      })
                    )
                  })
              }}
            >
              {t('payNextInstallment')}
            </Button>
            <Dropdown
              isMultiSelect
              fieldName="status"
              options={paymentStatusDropdownOptions}
              value={paymentStatusFilterValue}
              onChange={({value}) => {
                setPaymentStatusFilterValue([...value])
              }}
              selectionPlaceholder={
                paymentStatusFilterValue.length !== 0
                  ? convertListToSeparatedString(paymentStatusFilterValue)
                  : t('status')
              }
              selectedOptions={paymentStatusFilterValue || []}
              classes={{wrapperClass: styles.dropdownWrapper}}
            />
          </div>
        </div>
        <div className={styles.selectedFilters}>
          <Chips
            chipList={getChipList(paymentStatusFilterValue)}
            onChange={(event) => handleChipClicked(event)}
          />
          {paymentStatusFilterValue.length !== 0 && (
            <Button
              category={BUTTON_CONSTANTS.CATEGORY.DESTRUCTIVE}
              type={BUTTON_CONSTANTS.TYPE.TEXT}
              onClick={() => {
                setPaymentStatusFilterValue([])
              }}
              classes={{button: styles.button}}
            >
              {t('clearFilters')}
            </Button>
          )}
        </div>
        <div className={styles.table}>
          <Table
            uniqueKey={'id'}
            cols={installmentsListTableCols}
            rows={getRows(
              collectionInstallments?.filter((installment) =>
                paymentStatusFilterValue?.length !== 0
                  ? paymentStatusFilterValue?.includes(installment.status) ||
                    (paymentStatusFilterValue?.includes(
                      paymentStatusOptions.OVERDUE
                    ) &&
                      moment(installment?.due_date, 'DD-MMM-YYYY').isBefore(
                        moment(),
                        'days'
                      ))
                  : true
              )
            )}
            classes={{table: styles.tableWrapper, thead: styles.thead}}
          />
        </div>
      </div>
    </>
  )
}

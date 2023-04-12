import classNames from 'classnames'
import {useSelector} from 'react-redux'
import {isInstituteInternational} from '../../helpers/helpers'
import {
  payStatusLabel,
  payModeLabel,
  FEE_TRANSACTION_LABEL,
  revokePaymentStatusLabel,
} from '../FeeTransaction/FeeTransactionConstants'
import styles from './FeeTransactionFilters.module.css'
import FilterItems from './FilterItems'

const FeeTransactionFilters = ({filters, onApplyFilters}) => {
  const {instituteInfo} = useSelector((state) => state)
  const isInternational = isInstituteInternational(
    instituteInfo?.address?.country
  )
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      paymentStatus: formData.getAll('paymentStatus'),
      paymentModes: formData.getAll('paymentModes'),
    }
    onApplyFilters && onApplyFilters(data)
  }

  const paymentMethods = [
    {
      key: 'PENDING',
      value: payStatusLabel.PENDING,
    },
    {
      key: 'SUCCESS',
      value: payStatusLabel.SUCCESS,
    },
    {
      key: 'SETTLED',
      value: payStatusLabel.SETTLED,
    },
    {
      key: 'CANCELLED',
      value: payStatusLabel.CANCELLED,
    },
  ]

  const revokePaymentMethods = [
    {
      key: 'REVOKED',
      value: revokePaymentStatusLabel.REVOKED,
    },
    {
      key: 'FAILED',
      value: revokePaymentStatusLabel.FAILED,
    },
  ]

  const paymentStatus = [
    {
      key: 'CASH',
      value: payModeLabel.CASH,
      visibleToInernational: true,
    },
    {
      key: 'CHEQUE',
      value: payModeLabel.CHEQUE,
      visibleToInernational: true,
    },
    {
      key: 'DD',
      value: payModeLabel.DD,
      visibleToInernational: false,
    },
    {
      key: 'ONLINE',
      value: payModeLabel.ONLINE,
      visibleToInernational: false,
    },
    {
      key: 'POS',
      value: payModeLabel.POS,
      visibleToInernational: true,
    },
    {
      key: 'BANK_TRANSFER',
      value: isInternational
        ? payModeLabel.BANK_TRANSFER
        : payModeLabel.BANK_TRANSFER_NEFT,
      visibleToInernational: true,
    },
    {
      key: 'UPI',
      value: payModeLabel.UPI,
      visibleToInernational: false,
    },
    {
      key: 'CHALLAN',
      value: payModeLabel.CHALLAN,
      visibleToInernational: false,
    },
    {
      key: 'OTHERS',
      value: payModeLabel.OTHERS,
      visibleToInernational: true,
    },
  ]

  return (
    <div className={classNames(styles.dropdown)}>
      <form onSubmit={handleSubmit}>
        <div className={styles.filters}>
          <div>
            <FilterItems
              name="paymentStatus"
              header={FEE_TRANSACTION_LABEL.STATUS}
              filters={filters}
              filterItems={paymentMethods}
            />
            <div className={styles.revokedStatus}>
              <FilterItems
                name="paymentStatus"
                filters={filters}
                filterItems={revokePaymentMethods}
              />
            </div>
          </div>

          <div>
            <FilterItems
              name="paymentModes"
              header={FEE_TRANSACTION_LABEL.MODES}
              filters={filters}
              filterItems={paymentStatus.filter((item) =>
                isInternational ? item.visibleToInernational : true
              )}
            />
          </div>
        </div>

        <div style={{textAlign: 'right', padding: '5px'}}>
          <button className="fill" type="submit">
            {FEE_TRANSACTION_LABEL.ADD_FILTERS}
          </button>
        </div>
      </form>
    </div>
  )
}
export default FeeTransactionFilters

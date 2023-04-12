import classNames from 'classnames'
import {bankTransactionFilterModes} from '../../fees.constants'
import {
  payModeLabel,
  FEE_TRANSACTION_LABEL,
} from '../FeeTransaction/FeeTransactionConstants'
// import styles from './FeeTransactionFilters.module.css'
import styles from '../FeeTransaction/FeeTransactionFilters.module.css'
import FilterItems from '../FeeTransaction/FilterItems'

const ChequeTransactionFilters = ({filters, onApplyFilters}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      paymentStatus: formData.getAll('paymentStatus'),
      paymentModes: formData.getAll('paymentModes'),
    }
    onApplyFilters && onApplyFilters(data)
  }

  const paymentStatus = [
    {
      key: 'RECEIVED',
      value: bankTransactionFilterModes.RECEIVED,
    },
    {
      key: 'DEPOSITED',
      value: bankTransactionFilterModes.DEPOSITED,
    },
    {
      key: 'CLEARED',
      value: bankTransactionFilterModes.CLEARED,
    },
    {
      key: 'BOUNCED',
      value: bankTransactionFilterModes.BOUNCED,
    },
    {
      key: 'RETURNED',
      value: bankTransactionFilterModes.RETURNED,
    },
    {
      key: 'CANCELLED',
      value: bankTransactionFilterModes.CANCELLED,
    },
  ]

  const paymentMethods = [
    {
      key: 'CHEQUE',
      value: payModeLabel.CHEQUE,
    },
    {
      key: 'DD',
      value: payModeLabel.DD,
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
              filterItems={paymentStatus}
            />
          </div>

          <div>
            <FilterItems
              name="paymentModes"
              header={FEE_TRANSACTION_LABEL.MODES}
              filters={filters}
              filterItems={paymentMethods}
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
export default ChequeTransactionFilters

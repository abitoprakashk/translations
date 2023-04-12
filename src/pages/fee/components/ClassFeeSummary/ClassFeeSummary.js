import styles from './ClassFeeSummary.module.css'
import {Tooltip} from '@teachmint/krayon'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {
  getAmountFixDecimalWithCurrency,
  numDifferentiation,
} from '../../../../utils/Helpers'
import {useHistory} from 'react-router-dom'
import {useFeeCollection} from '../../redux/feeCollectionSelectors'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {feeHistoryTabFalseActions} from '../../redux/feeCollectionActions'
import {useTranslation} from 'react-i18next'

const ClassFeeSummary = ({
  className,
  classId,
  totalPaid,
  totalDue,
  paidAmount,
  dueAmount,
  selectedFeeFilterOption,
}) => {
  const {t} = useTranslation()

  const {feeHistortyTab} = useFeeCollection()
  const {instituteInfo} = useSelector((state) => state)
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(() => {
    if (feeHistortyTab) {
      history.push('/institute/dashboard/fee-transactions/bank')
      dispatch(feeHistoryTabFalseActions(false))
    }
  }, [feeHistortyTab])
  return (
    <Link
      to={`/institute/dashboard/fees/collection/dues?class=${className}&classId=${classId}`}
    >
      <div className={styles.feeSummaryData}>
        <div className={styles.bg}>
          <div className={styles.heading}>
            <div className="flex items-center">
              <span className={styles.classData}>{t('class')}</span> &nbsp;
              <div className={styles.classDataName} title={className}>
                {className}
              </div>
            </div>
            <img
              src="https://storage.googleapis.com/tm-assets/icons/blue/right-arrow-blue.svg"
              className={styles.iconSize}
            />
            {/* </Link> */}
          </div>

          <div className={styles.amountWrapper}>
            <div>
              <div
                className={classNames(styles.amount, styles.paid)}
                data-tip
                data-for={`${classId}-paid`}
              >
                {selectedFeeFilterOption == 'applicable_till_date'
                  ? numDifferentiation(paidAmount ?? 0, instituteInfo.currency)
                  : numDifferentiation(totalPaid ?? 0, instituteInfo.currency)}
              </div>
              <div className={styles.fontSettings}>{t('totalPaid')}</div>
              <Tooltip
                toolTipId={`${classId}-paid`}
                toolTipBody={
                  selectedFeeFilterOption == 'applicable_till_date'
                    ? getAmountFixDecimalWithCurrency(
                        paidAmount,
                        instituteInfo.currency
                      )
                    : getAmountFixDecimalWithCurrency(
                        totalPaid ?? 0,
                        instituteInfo.currency
                      )
                }
                place="bottom"
                effect="solid"
              />
            </div>

            <div>
              <div
                className={classNames(styles.amount, styles.due)}
                data-tip
                data-for={`${classId}-due`}
              >
                {selectedFeeFilterOption == 'applicable_till_date'
                  ? numDifferentiation(dueAmount ?? 0, instituteInfo.currency)
                  : numDifferentiation(totalDue ?? 0, instituteInfo.currency)}
              </div>
              <div className={styles.fontSettings}>{t('totalDue')}</div>
              <Tooltip
                toolTipId={`${classId}-due`}
                toolTipBody={
                  selectedFeeFilterOption == 'applicable_till_date'
                    ? getAmountFixDecimalWithCurrency(
                        totalDue,
                        instituteInfo.currency
                      )
                    : getAmountFixDecimalWithCurrency(
                        totalDue ?? 0,
                        instituteInfo.currency
                      )
                }
                place="bottom"
                effect="solid"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ClassFeeSummary

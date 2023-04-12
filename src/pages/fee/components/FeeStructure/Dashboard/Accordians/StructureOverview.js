import {DateTime} from 'luxon'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './StructureView.module.css'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'
import {
  FEE_STRUCTURE_TYPES_IDS,
  getStructureFeeType,
  PROFILE_CATEGORY_OPTIONS,
  PROFILE_GENDER_OPTIONS,
  STUDENT_OPTIONS,
  STUDENT_PROFILE_OPTIONS,
} from '../../../../fees.constants'

export default function StructureOverview({
  structure,
  isClassView,
  getClassNames,
}) {
  const {t} = useTranslation()
  const {instituteInfo} = useSelector((state) => state)
  const getApplicableMonths = (months) => {
    let newMonths = [...months]
    return newMonths
      .sort((a, b) => {
        const dateA = new Date(a.split('-').reverse().join('-'))
        const dateB = new Date(b.split('-').reverse().join('-'))
        return dateA - dateB
      })
      .slice(0, 3)
      .map((month) => {
        const d = month.split('-')
        return DateTime.local(parseInt(d[1]), parseInt(d[0])).monthShort
      })
      .join(', ')
  }

  return (
    <div className={styles.basicDetails}>
      <div className={styles.feeType}>
        <div>{t('type')}</div>
        <div>{getStructureFeeType(structure).replace('_', ' ')}</div>
      </div>
      {!isClassView && (
        <div className={styles.feeType}>
          <div>{t('classes')}</div>
          <div>{getClassNames(structure.assigned_to)}</div>
        </div>
      )}
      {structure.applicable_students !== STUDENT_OPTIONS.NONE && (
        <div className={styles.feeType}>
          <div>{t('createdFor')}</div>
          <div>
            {
              STUDENT_PROFILE_OPTIONS.find(
                (option) => option.id === structure.applicable_students
              )?.label
            }
          </div>
        </div>
      )}
      <div className={styles.feeType}>
        <div>{t('receiptSeries')}</div>
        <div>
          {structure.receipt_prefix + ' - ' + structure.series_starting_number}
        </div>
      </div>
      {structure?.profile_filters &&
        Object.keys(structure.profile_filters.length > 0) && (
          <>
            {structure.profile_filters?.gender && (
              <div className={styles.feeType}>
                <div>{t('gender')}</div>
                <div>
                  {structure?.profile_filters?.gender
                    ? t(
                        PROFILE_GENDER_OPTIONS.find(
                          (gen) => gen.id === structure.profile_filters.gender
                        ).label
                      )
                    : PROFILE_GENDER_OPTIONS.filter((gen) => gen.id !== 'all')
                        .map((gen) => t(gen.label))
                        .join(', ')}
                </div>
              </div>
            )}
            {structure?.profile_filters?.category && (
              <div className={styles.feeType}>
                <div>{t('category')}</div>
                <div>
                  {structure?.profile_filters?.category
                    ? PROFILE_CATEGORY_OPTIONS.filter((cate) =>
                        structure.profile_filters.category.includes(cate.value)
                      )
                        .map((cate) => cate.label)
                        .join(', ')
                    : PROFILE_CATEGORY_OPTIONS.map((cate) => cate.label).join(
                        ','
                      )}
                </div>
              </div>
            )}
          </>
        )}
      {structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE && (
        <div className={styles.feeType}>
          <div>{t('monthFeeApplicableOn')}</div>
          <div>
            {getApplicableMonths(structure.applicable_months)}
            {structure.applicable_months.length > 3 && (
              <span>
                {' '}
                +{structure.applicable_months.length - 3} {t('more')}
              </span>
            )}
          </div>
        </div>
      )}
      {structure.fee_type === FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE && (
        <div className={styles.feeType}>
          <div>
            {structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE
              ? t('installmentDueDate')
              : t('dueDate')}
          </div>
          <div>
            {structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.ONE_TIME_FEE
              ? structure.due_date
              : DateTime.fromSeconds(structure.schedule_timestamps[0]).toFormat(
                  'dd LLL yyyy'
                )}
          </div>
        </div>
      )}
      {structure.fee_type !== FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE && (
        <div className={classNames(styles.feeType, 'tm-color-green')}>
          <div>{t('totalAnnualFee')}</div>
          <div>
            {getAmountFixDecimalWithCurrency(
              structure.payable_amount,
              instituteInfo.currency
            )}
          </div>
        </div>
      )}
      {structure.fee_type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE && (
        <div className={styles.feeType}>
          <div>{t('tax')}</div>
          <div>{structure.tax ?? 0} %</div>
        </div>
      )}
    </div>
  )
}

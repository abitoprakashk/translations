import {useMemo} from 'react'
import styles from './SectionWiseStudents.module.css'
import {useFeeCollectionContext} from '../../../context/FeeCollectionContext/FeeCollectionContext'
import {
  getAmountFixDecimalWithCurrency,
  numDifferentiationWithoutStyling,
  truncateTextWithTooltip,
} from '../../../../../../utils/Helpers'
import {
  CLASSNAME_HEADER_TRUNCATE_LIMIT,
  SECTION_WISE_FILTER,
} from '../../../../fees.constants'
import {t} from 'i18next'
import classNames from 'classnames'
import {useSelector} from 'react-redux'
import CalloutCard from '../../../../../../components/SchoolSystem/StudentDirectory/FeeTab/components/CalloutCard/CalloutCard'
import {Tooltip, Dropdown} from '@teachmint/krayon'

export default function SectionOverview() {
  const {
    sections,
    sectionStats,
    selectedSection,
    selectedFilter,
    setSelectedFilters,
  } = useFeeCollectionContext()
  const instituteInfo = useSelector((state) => state.instituteInfo)

  const sectionIdToNameMap = useMemo(() => {
    return sections.reduce((acc, item) => {
      acc[item.id] = item.name
      return acc
    }, {})
  }, [sections])

  const callouts = [
    {
      id: 1,
      amount: sectionStats.total_payable,
      subText: t('totalApplied'),
      additionalInfo: t('beforeDiscountAdditionalInfo'),
      borderClassName: classNames(styles.borderBlue, styles.higerSpeficity),
    },
    {
      id: 2,
      amount: sectionStats.total_discount,
      subText: t('totalDiscount'),
      borderClassName: classNames(styles.borderYellow, styles.higerSpeficity),
    },
    {
      id: 3,
      amount: sectionStats.total_paid,
      subText: t('totalPaid'),
      borderClassName: classNames(styles.borderGreen, styles.higerSpeficity),
    },
    {
      id: 4,
      amount: sectionStats.total_due,
      subText: t('totalDue'),
      borderClassName: classNames(styles.borderRed, styles.higerSpeficity),
    },
  ]

  return (
    <div className={styles.classHeader}>
      <span className={styles.classHeaderSectionName}>
        {sectionIdToNameMap[selectedSection]
          ? truncateTextWithTooltip(
              sectionIdToNameMap[selectedSection],
              CLASSNAME_HEADER_TRUNCATE_LIMIT
            )
          : '-'}
      </span>
      <div className={styles.sectionInfo}>
        <div className={styles.classHeaderCalloutSection}>
          {callouts.map((callout, i) => {
            return (
              <div key={i} className={styles.classHeaderCalloutCard}>
                <a
                  key={i}
                  data-for={`extraInfo${i}`}
                  data-tip
                  className={styles.amount}
                >
                  <CalloutCard
                    key={callout.id}
                    text={numDifferentiationWithoutStyling(
                      callout.amount,
                      instituteInfo.currency
                    )}
                    subText={callout.subText}
                    additionalInfo={callout?.additionalInfo}
                    additionalInfoClass={styles.additionalInfo}
                    borderClassName={callout.borderClassName}
                    smallerText={true}
                    subTextClass="capitalize"
                    contentWrapperClassName={styles.calloutContentWrapper}
                  />
                </a>
                <Tooltip
                  place="top"
                  effect="solid"
                  toolTipBody={getAmountFixDecimalWithCurrency(
                    callout.amount,
                    instituteInfo.currency
                  )}
                  toolTipId={`extraInfo${i}`}
                />
              </div>
            )
          })}
        </div>
        <div>
          <Dropdown
            fieldName="filter"
            isMultiSelect={false}
            title={''}
            options={Object.values(SECTION_WISE_FILTER).map((key) => {
              return {label: key.label, value: key.value}
            })}
            classes={{
              dropdownClass: styles.dropdownClass,
            }}
            selectedOptions={selectedFilter}
            onChange={(val) => {
              setSelectedFilters(val.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

import styles from './SectionWiseStudentsMobile.module.css'
import {useFeeCollectionContext} from '../../../context/FeeCollectionContext/FeeCollectionContext'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {getAmountFixDecimalWithCurrency} from '../../../../../../utils/Helpers'
import {t} from 'i18next'
import CalloutCard from '../../../../../../components/SchoolSystem/StudentDirectory/FeeTab/components/CalloutCard/CalloutCard'
import {useFeeCollection} from '../../../../redux/feeCollectionSelectors'
import {useMemo} from 'react'
import {useSelector} from 'react-redux'

export default function SectionCardMobile({section}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const {setSelectedSection, setClassId, selectedSection} =
    useFeeCollectionContext()

  const callouts = [
    {
      id: 1,
      key_name: 'totalPaid',
      subText: t('totalPaid'),
      borderClassName: classNames(styles.borderGreen, styles.higerSpeficity),
    },
    {
      id: 2,
      key_name: 'totalDue',
      subText: t('totalDue'),
      borderClassName: classNames(styles.borderRed, styles.higerSpeficity),
    },
  ]

  const {stats} = useFeeCollection()

  const sectionDataDictionary = useMemo(() => {
    const sectionDataDictionary = {}
    stats.forEach((item) => {
      const {sectionId, ...statsData} = item
      sectionDataDictionary[sectionId] = statsData
    })
    return sectionDataDictionary
  }, [stats])

  return (
    <div
      onClick={() => {
        setSelectedSection(section.id)
        setClassId(section.class_id)
      }}
      className={classNames(
        styles.sectionTile,
        selectedSection == section.id ? styles.selectedSectionTile : ''
      )}
    >
      <div className={styles.sectionContent}>
        <span className={styles.sectionName}>{section.name}</span>
        <Icon
          name="forwardArrow"
          size={ICON_CONSTANTS.SIZES.X_SMALL}
          type={ICON_CONSTANTS.TYPES.BASIC}
        />
      </div>
      <div className={styles.sectionCalloutCards}>
        {callouts.map((callout, i) => {
          return (
            <div key={i} className={styles.calloutCard}>
              <CalloutCard
                key={callout.id}
                text={getAmountFixDecimalWithCurrency(
                  sectionDataDictionary[section.id]
                    ? sectionDataDictionary[section.id][callout.key_name] || 0
                    : 0,
                  instituteInfo.currency
                )}
                subText={callout.subText}
                borderClassName={callout.borderClassName}
                smallerText={true}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

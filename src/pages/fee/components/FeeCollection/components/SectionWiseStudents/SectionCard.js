import styles from './SectionWiseStudents.module.css'
import {useFeeCollectionContext} from '../../../context/FeeCollectionContext/FeeCollectionContext'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import classNames from 'classnames'
import {truncateTextWithTooltip} from '../../../../../../utils/Helpers'
import {CLASSNAME_TRUNCATE_LIMIT} from '../../../../fees.constants'

export default function SectionCard({section}) {
  const {setSelectedSection, setClassId, selectedSection} =
    useFeeCollectionContext()
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
      <span className={styles.sectionName}>
        {truncateTextWithTooltip(section.name, CLASSNAME_TRUNCATE_LIMIT)}
      </span>
      <Icon
        name="forwardArrow"
        size={ICON_CONSTANTS.SIZES.X_SMALL}
        type={ICON_CONSTANTS.TYPES.BASIC}
      />
    </div>
  )
}

import React, {useState} from 'react'
import CheckItem from './CheckItem'
import styles from '../UserSegment.module.css'
import classNames from 'classnames'

const HierarchyNode = ({item, isChecked, parent, setIsCheck, children}) => {
  const [isOpen, setIsOpen] = useState(false)
  const closeUrl =
    'https://storage.googleapis.com/tm-assets/icons/secondary/right-arrow-secondary.svg'
  const openUrl =
    'https://storage.googleapis.com/tm-assets/icons/secondary/down-arrow-secondary.svg'
  return (
    <>
      <div
        className={classNames(
          ` mb-2`,
          {[styles.openNode]: isOpen},
          {[styles.closeNode]: !isOpen},
          styles.hierarchyNodeSection
        )}
      >
        <img
          className={styles.accordionButton}
          src={isOpen ? openUrl : closeUrl}
          onClick={() => setIsOpen(!isOpen)}
        />
        <CheckItem
          key={item.id}
          value={item.id}
          checked={isChecked}
          text={item.name}
          obj={item}
          setIsCheck={(obj) => setIsCheck(obj, parent)}
          cssClass={styles.hierarchyNodeCheckbox}
        />
      </div>
      {item.children && isOpen ? children : null}
    </>
  )
}

export default HierarchyNode

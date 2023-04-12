import {useState} from 'react'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import styles from './ClassView.module.css'
import {Icon} from '@teachmint/common'
import StructureView from './StructureView'

export default function ClassView({classStructure, allStructures}) {
  const {t} = useTranslation()
  const [toggleAccordian, setToggleAccordian] = useState(false)
  const structureExists = classStructure.fee_structures.length > 0

  return (
    <div
      className={classNames(styles.accordian, {
        [styles.active]: toggleAccordian,
      })}
    >
      <div className={styles.label}>
        <div
          className={classNames(
            styles.name,
            structureExists ? styles.cursorPointer : styles.maxWidth
          )}
          onClick={() => setToggleAccordian(!toggleAccordian)}
        >
          {t('class')} {classStructure.class_name}
        </div>
        {!structureExists ? (
          <div className={styles.noStructure}>
            <div>{t('noFeeStructureExistsForThisClass')}</div>
          </div>
        ) : (
          <div className={styles.categoryOptions}>
            <div
              className={classNames(styles.cursorPointer, {
                [styles.headingSectionIconRight]: !toggleAccordian,
              })}
              onClick={() => setToggleAccordian(!toggleAccordian)}
            >
              <Icon name="downArrow" size="xxs" />
            </div>
          </div>
        )}
      </div>
      {structureExists && (
        <div className={styles.content}>
          {classStructure?.fee_structures?.map((structure) => {
            return (
              <StructureView
                key={structure._id}
                structure={allStructures[structure]}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

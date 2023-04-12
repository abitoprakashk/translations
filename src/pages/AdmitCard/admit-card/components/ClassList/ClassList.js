import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {FlatAccordion} from '@teachmint/common'
import styles from './ClassList.module.css'
import ClassDetails from './components/ClassDetails/ClassDetails'
import {STANDARD} from '../../constants'
import {getNodesListOfSimilarTypeWithChildren} from '../../../../../utils/HierarchyHelpers'
import {events} from '../../../../../utils/EventsConstants'

export default function ClassList({openClass, selectedStandard}) {
  const {eventManager} = useSelector((state) => state)
  const {instituteHierarchy} = useSelector((state) => state)
  const [listOfClasses, setListOfClasses] = useState([])

  useEffect(() => {
    setListOfClasses([
      ...getNodesListOfSimilarTypeWithChildren(instituteHierarchy, STANDARD),
    ])
  }, [instituteHierarchy])

  const renderAccordions = () => {
    return listOfClasses.map((standard) => (
      <FlatAccordion
        key={standard.id}
        title={`Class ${standard.name}`}
        isOpen={selectedStandard ? selectedStandard.id === standard.id : false}
        accordionClass={styles.accordionStyle}
        titleClass={classNames(styles.accordionTitle, 'tm-hdg tm-hdg-16')}
        onClick={() =>
          eventManager.send_event(events.ADMIT_CARD_STANDARD_TAB_CLICKED_TFI, {
            standard_id: standard.id,
          })
        }
      >
        <div className={styles.classDetailWrapper}>
          <div className={styles.classDetails}>
            <ClassDetails standard={{...standard}} openClass={openClass} />
          </div>
        </div>
      </FlatAccordion>
    ))
  }

  return <div className={styles.wrapper}>{renderAccordions()}</div>
}

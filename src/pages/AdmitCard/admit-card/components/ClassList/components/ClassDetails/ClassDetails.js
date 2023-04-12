import React from 'react'
import {t} from 'i18next'
import {useSelector} from 'react-redux'
import styles from './ClassDetails.module.css'
import SectionCard from './components/SectionCard/SectionCard'
import {events} from '../../../../../../../utils/EventsConstants'

export default function ClassDetails({standard, openClass}) {
  const {eventManager} = useSelector((state) => state)

  const renderSections = () => {
    let sections = standard.children.filter(
      (section) => section.type !== 'ADD_SEC'
    )
    return (
      <div className={styles.sectionCardWrapper}>
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            title={`${standard.name} - ${section.name}`}
            onViewClick={() => {
              eventManager.send_event(events.ADMIT_CARD_SECTION_SELECTED_TFI, {
                standard_id: standard.id,
                section_id: section.id,
              })
              openClass(3, {
                node_ids: [`${standard?.id}`],
                ...section,
                name: `${standard?.name} - ${section?.name}`,
                selectedTemplate: '',
              })
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sections}>
          <div className={styles.sectionsTitle}>{t('admitCardSections')}</div>
          <div>{renderSections()}</div>
        </div>
      </div>
    </>
  )
}

import React from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {generatePath, useHistory} from 'react-router'
import styles from './ClassDetails.module.css'
import SectionCard from './components/SectionCard/SectionCard'
import TemplateThumbnail from './components/TemplateThumbnail/TemplateThumbnail'
import {events} from '../../../../../../../utils/EventsConstants'
import classNames from 'classnames'
import Permission from '../../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../../utils/permission.constants'
import {Badges, BADGES_CONSTANTS} from '@teachmint/krayon'
import REPORT_CARD_ROUTES from '../../../../ReportCard.routes'

export default function ClassDetails({standard, setTemplatePreview}) {
  const {t} = useTranslation()
  const history = useHistory()
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
            standardId={standard._id}
            title={`${standard.name} - ${section.name}`}
            id={section.id}
            onViewClick={() => {
              eventManager.send_event(
                events.REPORT_CARD_SECTION_REPORT_CARD_VIEW_CLICKED_TFI,
                {
                  class_id: standard.id,
                  section_id: section.id,
                }
              )
              // openClass(3, {
              //   node_ids: [`${standard?.id}`],
              //   ...section,
              //   name: `${standard?.name} - ${section?.name}`,
              //   selectedTemplate: standard.report_card_templates[0],
              // })
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.chooseTemplateSection}>
          <div className={classNames('tm-para tm-para-16', styles.subHeading)}>
            {t('createChooseTemplate')}
          </div>
          <div className={styles.templateSection}>
            <TemplateThumbnail />
            <div className={styles.buttonSection}>
              <div
                className={classNames(styles.heading, 'tm-hdg tm-hdg-16')}
              >{`Class ${standard.name} ${t('template')}`}</div>
              <div className={styles.links}>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.reportCardWebController_upsertTemplate_update
                  }
                >
                  <span
                    className={styles.linkButton}
                    onClick={() => {
                      eventManager.send_event(
                        events.REPORT_CARD_EDIT_TEMPLATE_CLICKED_TFI,
                        {
                          class_id: standard.id,
                        }
                      )
                      history.push({
                        pathname: generatePath(
                          REPORT_CARD_ROUTES.EDIT_TEMPLATE,
                          {
                            standardId: standard.id,
                          }
                        ),
                      })
                    }}
                  >
                    {t('editTemplate')}
                  </span>{' '}
                </Permission>
                <span className={styles.divider}>| </span>
                <span
                  className={styles.linkButton}
                  onClick={() => {
                    eventManager.send_event(
                      events.REPORT_CARD_CHANGE_CLICKED_TFI,
                      {
                        class_id: standard.id,
                      }
                    )
                    setTemplatePreview({
                      ...standard.report_card_templates[0],
                      name: `Class ${standard.report_card_templates[0].name}`,
                    })
                  }}
                >
                  {t('previewTemplate')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.sections}>
          <div className={styles.sectionsTitle}>
            Evaluate and Generate Report Card{' '}
            <Badges
              label={t('new')}
              iconName="star"
              inverted={true}
              size={BADGES_CONSTANTS.SIZE.SMALL}
              type={BADGES_CONSTANTS.TYPE.WARNING}
              className={styles.newBadge}
            />
          </div>
          <div>{renderSections()}</div>
        </div>
      </div>
    </>
  )
}

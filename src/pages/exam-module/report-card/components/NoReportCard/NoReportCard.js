import React from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {Button} from '@teachmint/common'
import styles from './NoReportCard.module.css'
import NoReportCardImage from './../../../../../assets/images/dashboard/no_report_card.svg'
import {events} from '../../../../../utils/EventsConstants'
import history from '../../../../../history'
import {sidebarData} from '../../../../../utils/SidebarItems'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

export default function NoReportCard({standardId}) {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)

  const goToExamStructure = () => {
    let jsonData = {}
    if (standardId) {
      jsonData.class_id = standardId
    }
    eventManager.send_event(
      events.REPORT_CARD_GO_TO_EXAM_STRUCTURE_CLICKED_TFI,
      jsonData
    )
    if (standardId) {
      history.push(
        sidebarData.REPORT_CARD.route + '/structure/edit?classId=' + standardId
      )
    } else {
      history.push(sidebarData.REPORT_CARD.route + '/structure')
    }
  }

  return (
    <div className={styles.wrapper}>
      {!standardId && <img src={NoReportCardImage} className={styles.image} />}
      <div className={styles.title}>{t('noReportCardFound')}</div>
      <div className={styles.text}>{t('noReportCardFoundText')}</div>
      <Permission
        permissionId={
          PERMISSION_CONSTANTS.examStructureController_upsertClassStructure_update
        }
      >
        <Button className={styles.button} onClick={goToExamStructure}>
          {t('createExamStructure')}
        </Button>
      </Permission>
    </div>
  )
}

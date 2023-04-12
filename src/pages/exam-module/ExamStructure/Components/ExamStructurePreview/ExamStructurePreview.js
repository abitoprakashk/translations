import styles from './ExamStructurePreview.module.css'
import {useTranslation} from 'react-i18next'
import {Icon, Button} from '@teachmint/common'
import {useHistory} from 'react-router'
import classNames from 'classnames'
import {EXAM_STRUCTURE_PATHS} from '../../Constants/Constants'
import {useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import {pdfPrint} from '../../../../../utils/Helpers'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

const ExamStructurePreview = ({pdfLink, classId}) => {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const history = useHistory()

  const handlePrint = () => {
    pdfPrint(pdfLink)
  }

  return (
    <div className={styles.container}>
      <div className={styles.ctaContainer}>
        <div className={styles.marksAndPassingCriteria}>
          {/* <div className={styles.marksToGrade}>
            {t('marksToGradeConversion')}
          </div> */}
          {/* <div className={styles.verticalLine} /> */}
          <div>
            {t('scholasticArea')} {t('preview')}
          </div>
        </div>
        <div className={styles.ctaOptions}>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.examStructureController_upsertClassStructure_update
            }
          >
            <Button
              className={styles.editPattern}
              size="medium"
              type="outline"
              onClick={() => {
                eventManager.send_event(
                  events.EXAM_STRUCTURE_EDIT_PATTERN_CLICKED_TFI,
                  {
                    class_id: classId,
                  }
                )
                history.push({
                  pathname: EXAM_STRUCTURE_PATHS.editExamPattern,
                  search: '?classId=' + classId,
                })
              }}
            >
              {t('editStructure')}
            </Button>
          </Permission>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.examStructureController_copy_update
            }
          >
            <span
              className={classNames(styles.ctaIcon, styles.ctaIconImport)}
              onClick={() => {
                eventManager.send_event(
                  events.EXAM_STRUCTURE_IMPORT_EXISTING_CLICKED_TFI,
                  {
                    class_id: classId,
                  }
                )
                history.push({
                  pathname: EXAM_STRUCTURE_PATHS.importExamPattern,
                  search: '?classId=' + classId,
                  state: {
                    pdfLink,
                  },
                })
              }}
            >
              <Icon name="import" size="xxs" color="primary" />
            </span>
          </Permission>
          <span
            className={styles.ctaIcon}
            onClick={() => {
              eventManager.send_event(
                events.EXAM_STRUCTURE_PATTERN_PRINT_CLICKED_TFI,
                {
                  class_id: classId,
                  screen_name: 'exam-structure',
                }
              )
              handlePrint()
            }}
          >
            <Icon name="print" size="xxs" color="primary" />
          </span>
        </div>
      </div>
      <object
        className={styles.pdfPreview}
        data={`${pdfLink}#toolbar=0&navpanes=0&scrollbar=0`}
        type="application/pdf"
      />
    </div>
  )
}

export default ExamStructurePreview

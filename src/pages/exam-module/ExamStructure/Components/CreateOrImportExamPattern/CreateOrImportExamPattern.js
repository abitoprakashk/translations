import {Button, Icon, isMobile} from '@teachmint/common'
import styles from './CreateOrImportExamPattern.module.css'
import {useTranslation} from 'react-i18next'
import {useHistory} from 'react-router'
import {EXAM_STRUCTURE_PATHS} from '../../Constants/Constants'
import {useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'

const CreateOrImportExamPattern = ({classId, standardName}) => {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)
  const history = useHistory()

  const createExamPattern = () => {
    eventManager.send_event(events.EXAM_STRUCTURE_CREATE_CLICKED_TFI, {
      class_id: classId,
    })
    history.push({
      pathname: EXAM_STRUCTURE_PATHS.editExamPattern,
      search: '?classId=' + classId,
    })
  }

  const importExamPattern = () => {
    eventManager.send_event(events.EXAM_STRUCTURE_IMPORT_CLICKED_TFI, {
      class_id: classId,
    })
    history.push({
      pathname: EXAM_STRUCTURE_PATHS.importExamPattern,
      search: '?classId=' + classId,
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.ctaContainer}>
        <div className={styles.whiteBg}>
          <div className={styles.createStructure}>
            {`${t('createExamStructureForClass')} ${standardName}`}
          </div>
          <Permission
            permissionId={
              PERMISSION_CONSTANTS.examStructureController_upsertClassStructure_update
            }
          >
            <div className={styles.createOrImport}>
              <Button
                size="big"
                type="fill"
                onClick={createExamPattern}
                className={styles.btn}
              >
                + {t('create')}
              </Button>
              <Button
                size="big"
                type="border"
                onClick={importExamPattern}
                className={styles.btn}
              >
                {!isMobile() && (
                  <Icon name="import" size="xxs" color="primary" />
                )}
                {t('importFromAnotherClass')}
              </Button>
            </div>
          </Permission>
        </div>
      </div>
    </div>
  )
}
export default CreateOrImportExamPattern

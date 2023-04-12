import {FlatAccordion, Table} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import styles from './AdditionalExams.module.css'
import {getDateFromTimeStamp, toCamelCasedKeys} from '../../../../utils/Helpers'
import {useExamStructureForClass} from '../../Redux/ExamStructureSelectors'
import {useState} from 'react'
import {useHistory} from 'react-router'
import {EXAM_STRUCTURE_PATHS} from '../../Constants/Constants'
import {useDispatch, useSelector} from 'react-redux'
import {setAddToTermExamAction} from '../../Redux/ExamStructureActions'
import {events} from '../../../../../utils/EventsConstants'

const AdditionalExams = ({classId}) => {
  const [isOpen, setIsOpen] = useState(true)
  const {t} = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)

  const additionalExams = toCamelCasedKeys(
    useExamStructureForClass()
  )?.additionalExams

  const cols = [
    {key: 'exam', label: t('exam')},
    {key: 'subject', label: t('subjects')},
    {key: 'statusAndDate', label: t('statusAndDate')},
    {key: 'action', label: t('action')},
  ]

  const getSubjectName = (subjects) => {
    if (subjects) {
      switch (subjects.length) {
        case 0:
          return 'NA'
        case 1:
          return subjects[0]
        case 2:
          return subjects[0] + ' ' + subjects[1]
        case 3:
          return (
            subjects[0] + ' ' + subjects[1] + ` + ${subjects.length - 2} other`
          )
      }
    }
  }

  const STATUS = {
    COMPLETED: 'Completed',
    PENDING: 'Pending',
    ONGOING: 'Ongoing',
  }

  const getDateAndStatus = (startsOn, endsOn) => {
    let status = STATUS.COMPLETED
    const todayDate = Date.now()
    if (startsOn > todayDate) status = STATUS.PENDING
    else if (endsOn < todayDate) status = STATUS.COMPLETED
    else status = STATUS.ONGOING
    return {status, date: getDateFromTimeStamp(endsOn)}
  }

  const createRows = () => {
    return additionalExams?.map((item) => {
      const {_id: id, name, subjects, endsOn, startsOn} = toCamelCasedKeys(item)
      const {status, date} = getDateAndStatus(startsOn, endsOn)

      return {
        id,
        exam: <div className={styles.examName}>{name}</div>,
        subject: (
          <div className={styles.subjectsName}>{getSubjectName(subjects)}</div>
        ),
        statusAndDate: (
          <div className={styles.statusAndDate}>
            <div className={styles.statusOngoing}>{status}</div>
            <div className={styles.date}>{date}</div>
          </div>
        ),
        action: (
          <div className={styles.actions}>
            {/* <div
              className={styles.viewResult}
              onClick={() => {
              eventManager.send_event(
                  events.EXAM_STRUCTURE_ADDITIONAL_EXAMS_VIEW_RESULTS_CLICKED_TFI,
                  {
                    class_id: classId,
                    subjects,
                    exam: name,
                  }
                )
                history.push({
                  pathname: EXAM_STRUCTURE_PATHS.viewResult,
                })
              }}
            >
              {t('viewResult')}
            </div> */}
            {/* <div className={styles.verticalLine}></div> */}
            <div
              className={styles.addToTerm}
              onClick={() => {
                eventManager.send_event(
                  events.EXAM_STRUCTURE_ADD_TO_TERM_CLICKED_TFI,
                  {
                    class_id: classId,
                    subjects,
                    exam: name,
                    status,
                  }
                )
                dispatch(
                  setAddToTermExamAction({id, name, subjects, status, date})
                )
                history.push({
                  pathname: EXAM_STRUCTURE_PATHS.addToTerm,
                  search: '?classId=' + classId,
                })
              }}
            >
              {t('addToTerm')}
            </div>
          </div>
        ),
      }
    })
  }

  return (
    <FlatAccordion
      title={
        <div>
          <div className={styles.title}>{t('additionalExams')}</div>
          <div className={styles.desc}>{t('unplannedExams')}</div>
        </div>
      }
      isLeafNode={false}
      isOpen={isOpen}
      handleActions={() => {
        setIsOpen(!isOpen)
      }}
      titleClass={styles.titleClass}
      accordionClass={styles.accordionClass}
    >
      <Table rows={createRows()} cols={cols} className={styles.tableClass} />
    </FlatAccordion>
  )
}

export default AdditionalExams

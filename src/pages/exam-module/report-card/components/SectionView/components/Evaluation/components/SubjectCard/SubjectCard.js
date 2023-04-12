import React, {useCallback, useRef, useState} from 'react'
import {
  Divider,
  Para,
  PlainCard,
  PARA_CONSTANTS,
  Icon,
  ICON_CONSTANTS,
  AVATAR_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import {v4} from 'uuid'
import {
  EVALUATION_DURATION_TYPE,
  EVALUATION_TYPE,
} from '../../../../../../constants'
import {openEvaluationDrawer} from '../../../../../../redux/actions'
import styles from './SubjectCard.module.css'
import SubjectTeacher from './SubjectTeacher'
import {events} from '../../../../../../../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'

const completeMessage = (type, t) =>
  type == EVALUATION_TYPE.SCHOLASTIC ? t('evaluationCompleted') : t('completed')

const inCompleteMessage = (
  type,
  total_students,
  total_students_result_count,
  t
) =>
  `${total_students - total_students_result_count}/${total_students} ${
    type == EVALUATION_TYPE.REMARKS || type == EVALUATION_TYPE.RESULTS
      ? 'left'
      : t('evaluationLeft')
  }`

const cardName = (type = null, data = {}) => {
  switch (type) {
    case EVALUATION_TYPE.SCHOLASTIC:
      return data?.subject_name || data?.term_name

    case EVALUATION_TYPE.CO_SCHOLASTIC:
      return `${data.term_name} - ${data.subject_name}`

    case EVALUATION_TYPE.ATTENDANCE:
      return data?.[EVALUATION_DURATION_TYPE.OVERALL]
        ? 'Attendance'
        : data?.[`${data?.duration_type}_name`]

    case EVALUATION_TYPE.REMARKS:
      return data?.[EVALUATION_DURATION_TYPE.OVERALL]
        ? 'Remarks'
        : `${data?.[`${data?.duration_type}_name`]} - Remark`

    case EVALUATION_TYPE.RESULTS:
      return data?.[EVALUATION_DURATION_TYPE.OVERALL]
        ? 'Result'
        : `${data?.[`${data?.duration_type}_name`]} - Result`

    default:
      return ''
  }
}

const SubjectCard = ({data, type}) => {
  const [uuid] = useState(() => v4())
  const inputRef = useRef()

  const eventManager = useSelector((state) => state.eventManager)
  const {t} = useTranslation()

  const {
    total_students_result_count,
    total_students,
    teacher,
    co_teachers,
    subject_id,
    subject_name,
    term_name,
    term_id,
    assessment_id,
    class_id,
    section_id,
    test_name,
    test_id,
    class_name,
    section_name,
    duration_type,
    duration_type_id,
    month_id,
    month_name,
  } = data

  const dispatch = useDispatch()
  const openEvaluation = useCallback(() => {
    inputRef.current.checked = true
    dispatch(
      openEvaluationDrawer({
        term_id,
        term_name,
        assessment_id,
        class_id,
        section_id,
        subject_id,
        subject_name,
        test_name,
        teacher,
        co_teachers,
        class_name,
        section_name,
        type,
        duration_type,
        duration_type_id,
        month_id,
        month_name,
      })
    )

    eventManager.send_event(
      events.REPORT_CARD_EVALUATION_SUBJECT_TAB_CLICKED_TFI,
      {
        type,
        class_id,
        section_id,
        term_id,
        exam_id: test_id,
        subject_id,
        subject_evaluation_status:
          total_students == total_students_result_count
            ? 'completed'
            : 'pending',
      }
    )
  }, [])

  return (
    <>
      <input
        type="radio"
        name="subjectcard"
        hidden
        ref={inputRef}
        value={uuid}
      />
      <PlainCard
        className={styles.card}
        onClick={openEvaluation}
        data-name="subject-card"
      >
        <div className={classNames(styles.flex, styles.spaceBetween)}>
          <div>
            <Para
              className={classNames(styles.subject, styles.semiBold)}
              type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
            >
              {cardName(type, data)}
            </Para>
            <Para
              type={
                total_students == 0
                  ? PARA_CONSTANTS.TYPE.TEXT_SECONDARY
                  : total_students == total_students_result_count
                  ? PARA_CONSTANTS.TYPE.SUCCESS
                  : PARA_CONSTANTS.TYPE.WARNING
              }
              className={styles.semiBold}
            >
              {total_students == 0
                ? t('noStudentAssigned')
                : total_students == total_students_result_count
                ? completeMessage(type, t)
                : inCompleteMessage(
                    type,
                    total_students,
                    total_students_result_count,
                    t
                  )}
            </Para>
          </div>
          <Icon
            name="chevronRight"
            size={ICON_CONSTANTS.SIZES.XX_SMALL}
            className={styles.arrowIcon}
          />
        </div>
        <Divider spacing="12px" className={styles.divider} />
        <div className={styles.flex}>
          <SubjectTeacher
            teacher={teacher}
            coTeachers={co_teachers}
            size={AVATAR_CONSTANTS.SIZE.SMALL}
          />
        </div>
      </PlainCard>
    </>
  )
}

export default React.memo(SubjectCard)

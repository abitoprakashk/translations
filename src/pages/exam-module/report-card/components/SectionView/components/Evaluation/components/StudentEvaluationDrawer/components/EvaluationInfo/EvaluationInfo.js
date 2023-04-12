import React from 'react'
import {
  AVATAR_CONSTANTS,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import classNames from 'classnames'
import styles from './EvaluationInfo.module.css'
import {useSelector} from 'react-redux'
import SubjectTeacher from '../../../SubjectCard/SubjectTeacher'
import {IS_MOBILE} from '../../../../../../../../../../../constants'
import {useTranslation} from 'react-i18next'
import {
  EVALUATION_DURATION_TYPE,
  EVALUATION_TYPE,
} from '../../../../../../../../constants'

const EvaluationInfo = () => {
  const {
    test_name,
    teacher,
    co_teachers,
    class_name,
    section_name,
    term_name,
    type,
    duration_type,
    month_name,
  } = useSelector((state) => state.reportCard.evaluationDrawer?.data || {})

  const {t} = useTranslation()

  return (
    <div
      className={classNames(
        styles.flex,
        styles.spaceBetween,
        styles.alignCenter,
        styles.wrapper,
        {[styles.mobile]: IS_MOBILE}
      )}
    >
      <div
        className={classNames(styles.flex, styles.flexColumn, styles.standard)}
      >
        <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{t('class')}</Para>
        <Heading
          textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
          className={styles.standardName}
        >
          {t('class')} {class_name} - {section_name}
        </Heading>
      </div>

      {type == EVALUATION_TYPE.SCHOLASTIC && (
        <div className={classNames(styles.flex, styles.flexColumn)}>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>Exam</Para>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {term_name} - {test_name}
          </Heading>
        </div>
      )}

      {(type == EVALUATION_TYPE.CO_SCHOLASTIC ||
        type == EVALUATION_TYPE.ATTENDANCE ||
        type == EVALUATION_TYPE.REMARKS ||
        type == EVALUATION_TYPE.RESULTS) && (
        <div className={classNames(styles.flex, styles.flexColumn)}>
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>
            {duration_type == EVALUATION_DURATION_TYPE.MONTH ? 'Month' : 'Term'}
          </Para>
          <Heading textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}>
            {duration_type == EVALUATION_DURATION_TYPE.MONTH
              ? month_name
              : term_name}
          </Heading>
        </div>
      )}

      <div className={classNames(styles.flex, styles.flexColumn)}>
        {IS_MOBILE && (
          <Para textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}>{t('teacher')}</Para>
        )}
        <div className={classNames(styles.flex, styles.alignCenter)}>
          <SubjectTeacher
            teacher={teacher}
            coTeachers={co_teachers}
            showDesignation={!IS_MOBILE}
            size={
              IS_MOBILE
                ? AVATAR_CONSTANTS.SIZE.SMALL
                : AVATAR_CONSTANTS.SIZE.MEDIUM
            }
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(EvaluationInfo)

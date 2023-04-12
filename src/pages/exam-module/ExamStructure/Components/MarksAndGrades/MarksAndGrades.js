import {useState} from 'react'
import {useSelector} from 'react-redux'
import {Button, Icon} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'

import GradesPopup from './components/GradesPopup/GradesPopup'
import {useGradesCriteria} from '../../Redux/ExamStructureSelectors'
import styles from './MarksAndGrades.module.css'
import {events} from '../../../../../utils/EventsConstants'

const MarksAndGrades = ({classId}) => {
  const [showPopup, setShowPopup] = useState(false)
  const {eventManager} = useSelector((state) => state)
  const {t} = useTranslation()
  const gradesCriteria = useGradesCriteria()

  const hasGrades = gradesCriteria?.gradeEnabled

  return (
    <div className={styles.wrapper}>
      <div className={styles.textWrapper}>
        <span className={styles.label}>{t('marksToGradesConversion')} -</span>
        <span
          className={classNames(styles.label, {
            [styles.error]: !hasGrades,
            [styles.success]: hasGrades,
          })}
        >
          {hasGrades ? 'Yes' : 'No'}
        </span>
        <span className={styles.divider}>| </span>
        <span className={styles.label}>{t('passingCriteria')} -</span>
        <span className={classNames(styles.label, styles.success)}>
          {hasGrades
            ? gradesCriteria?.passingGrade.name
            : gradesCriteria?.passingPercentage}
        </span>
      </div>
      <Button
        className={styles.button}
        onClick={() => {
          eventManager.send_event(events.EXAM_STRUCTURE_CONFIGURE_CLICKED_TFI, {
            class_id: classId,
          })
          setShowPopup(true)
        }}
      >
        <Icon name="settingsGear" size="xs" type="outlined" color="inverted" />
        {t('configurations')}
      </Button>
      {showPopup && <GradesPopup onClose={() => setShowPopup(false)} />}
    </div>
  )
}

export default MarksAndGrades

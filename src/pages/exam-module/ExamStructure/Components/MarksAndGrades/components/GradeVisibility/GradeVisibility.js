import {Input} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import styles from './GradeVisibility.module.css'
import {MARKS_GRADES_OPTIONS} from './../../../../Constants/Constants'
import {events} from '../../../../../../../utils/EventsConstants'

const GradeVisibility = ({isGrade, visibility, setVisibility, classId}) => {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)

  const marksGradesOptions = [
    {value: MARKS_GRADES_OPTIONS.MARKS, label: t('marks')},
    {value: MARKS_GRADES_OPTIONS.GRADES, label: t('grades')},
    {value: MARKS_GRADES_OPTIONS.BOTH, label: t('both')},
  ]

  const levels = [
    {
      label: t('academicSessionLevel'),
      value: 'session_level',
      event: events.EXAM_STRUCTURE_ACADEMIC_SESSION_LEVEL_SELECTED_TFI,
    },
    {
      label: t('termLevel'),
      value: 'term_level',
      event: events.EXAM_STRUCTURE_TERM_LEVEL_SELECTED_TFI,
    },
    {
      label: t('examLevel'),
      value: 'exam_level',
      event: events.EXAM_STRUCTURE_EXAM_LEVEL_SELECTED_TFI,
    },
  ]

  const handleChange = (obj, item) => {
    let tmp = {...visibility}
    tmp[obj.fieldName] = obj.value
    setVisibility(tmp)
    visibility = Object.keys(MARKS_GRADES_OPTIONS).find(
      (key) => MARKS_GRADES_OPTIONS[key] === obj.value
    )
    eventManager.send_event(item.event, {
      class_id: classId,
      visibility: visibility,
    })
  }

  const renderOptions = () => {
    return levels.map((item) => (
      <div key={item.value} className={styles.card}>
        <Input
          type="radio"
          title={item.label}
          fieldName={item.value}
          options={marksGradesOptions}
          value={visibility[item.value]}
          onChange={(obj) => handleChange(obj, item)}
          disabled={!isGrade}
          classes={{title: styles.title}}
        />
      </div>
    ))
  }
  return (
    <>
      <div className={styles.heading}>{t('gradeVisibility')}</div>
      {renderOptions()}
    </>
  )
}

export default GradeVisibility

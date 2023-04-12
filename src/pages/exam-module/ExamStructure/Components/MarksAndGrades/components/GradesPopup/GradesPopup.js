import {useState, useEffect} from 'react'
import {Modal, Icon, Button} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styles from './GradesPopup.module.css'

import PassingCriteria from '../PassingCriteria/PassingCriteria'
import GradeRange from '../GradeRange/GradeRange'
import GradeVisibility from '../GradeVisibility/GradeVisibility'
import {useGradesCriteria} from '../../../../Redux/ExamStructureSelectors'
import {updateGradesCriteriaAction} from '../../../../Redux/ExamStructureActions'
import {toSnakeCasedKeys} from '../../../../../../../utils/Helpers'
import {validationForGradeRange} from '../../../../utils/Utils'
import useQuery from '../../../../../../../hooks/UseQuery'
import {events} from '../../../../../../../utils/EventsConstants'

const GradesPopup = ({onClose}) => {
  const gradesCriteria = useGradesCriteria()
  const [isMarksToGrade, setIsMarksToGrade] = useState(false)
  const [passingValue, setPassingValue] = useState({})
  const [grades, setGrades] = useState([])
  const [visibility, setVisibility] = useState({})
  const [error, setError] = useState(null)
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const query = useQuery()
  const classId = query.get('classId')
  const {eventManager} = useSelector((state) => state)

  useEffect(() => {
    if (!gradesCriteria) return
    setIsMarksToGrade(gradesCriteria.gradeEnabled)
    setGrades(gradesCriteria.grades)
    setVisibility(gradesCriteria.gradingVisibility)
    if (gradesCriteria.gradeEnabled) {
      setPassingValue(gradesCriteria.passingGrade)
    } else {
      setPassingValue(gradesCriteria.passingPercentage)
    }
  }, [gradesCriteria])

  useEffect(() => {
    if (!gradesCriteria) return
    if (isMarksToGrade) {
      if (
        grades.some((item) => item.name === gradesCriteria.passingGrade.name)
      ) {
        setPassingValue(gradesCriteria.passingGrade)
      } else {
        setPassingValue(grades[grades.length - 1])
      }
    } else {
      setPassingValue(passingValue?.min || gradesCriteria.passingPercentage)
    }
  }, [isMarksToGrade])

  const handleSave = () => {
    eventManager.send_event(events.EXAM_STRUCTURE_GRADE_SAVE_CLIKCED_TFI, {
      class_id: classId,
      grades,
      passing_grade: passingValue,
    })
    let tmp = {...gradesCriteria}
    tmp.gradeEnabled = isMarksToGrade
    tmp.grades = grades
    tmp.gradingVisibility = visibility
    if (isMarksToGrade) {
      tmp.passingGrade = passingValue
    } else {
      tmp.passingPercentage = parseInt(passingValue)
    }
    let res = validationForGradeRange(tmp)
    if (!res.status) {
      setError(res.error)
      return
    }
    tmp = toSnakeCasedKeys(tmp)
    dispatch(updateGradesCriteriaAction({grade_map: tmp, class_id: classId}))
    onClose()
  }

  const handleGradeRangeChange = (obj) => {
    setError(null)
    setGrades(obj)
  }

  const handlePassingValueChange = (value) => {
    setError(null)
    setPassingValue(value)
  }

  return (
    <Modal show={true} className={styles.modalWrapper}>
      <div className={styles.heading}>
        {t('marksToGrades')}
        <span onClick={onClose}>
          <Icon name="close" size="xs" className={styles.closeIcon} />
        </span>
      </div>
      <PassingCriteria
        isGrade={isMarksToGrade}
        setIsMarksToGrade={setIsMarksToGrade}
        grades={grades}
        passingValue={passingValue}
        setPassingValue={handlePassingValueChange}
      />
      <div className={styles.container}>
        <div className={styles.gradeInputs}>
          <GradeRange
            isGrade={isMarksToGrade}
            grades={grades}
            passingValue={passingValue}
            setPassingValue={handlePassingValueChange}
            handleChange={handleGradeRangeChange}
            classId={classId}
          />
        </div>
        <div className={styles.options}>
          <GradeVisibility
            isGrade={isMarksToGrade}
            visibility={visibility}
            setVisibility={setVisibility}
            classId={classId}
          />
        </div>
      </div>
      <div className={styles.footer}>
        {error ? <span className={styles.errorMsg}>{error}</span> : null}
        <Button className={styles.saveButton} onClick={handleSave}>
          {t('save')}
        </Button>
      </div>
    </Modal>
  )
}

export default GradesPopup

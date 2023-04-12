import {useEffect, useState} from 'react'
import classNames from 'classnames'
import {useTranslation} from 'react-i18next'
import {
  Icon,
  Input,
  Button,
  Para,
  BUTTON_CONSTANTS,
  ICON_CONSTANTS,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import styles from './GradesConverter.module.css'
// import styles from './../../../ScholasticBlock/ScholasticBlock.module.css'
import commonStyles from './../../../ScholasticBlock/ScholasticBlock.module.css'
import ToggleButtonWrapper from '../../../ToggleButtonWrapper'

const GradesConverter = ({
  gradesList,
  setGradeList,
  passingGrade,
  setPassingGrade,
  failEnabled,
  setDisableApply,
  setFailEnabled,
}) => {
  const {t} = useTranslation()
  const [passingIndex, setPassingIndex] = useState(0)
  const [hasError, setHasError] = useState([])

  useEffect(() => {
    let index = gradesList.findIndex((grade) => {
      if (grade._id) {
        return passingGrade._id === grade._id
      }
      return JSON.stringify(grade) === JSON.stringify(passingGrade)
    })
    setPassingIndex(index)
  }, [passingGrade])

  useEffect(() => {
    setDisableApply(hasError.length ? true : false)
  }, [hasError])

  const addGradeAtLast = () => {
    let tmp = [...gradesList]
    tmp.push({min: 0, max: gradesList[gradesList.length - 1].max - 2})
    setGradeList(tmp)
    //   eventManager.send_event(
    //     events.EXAM_STRUCTURE_ADD_MORE_GRADE_SCALE_CLICKED_TFI,
    //     {class_id: classId}
    //   )
  }

  const addGradeInBetween = () => {
    let tmp = [...gradesList]
    let item = {
      max: gradesList[passingIndex].min - 1,
      name: '',
    }
    if (!failEnabled) {
      item = {...item, min: 0, max: gradesList[passingIndex].max - 2}
      tmp[passingIndex] = {
        ...gradesList[passingIndex],
        min: gradesList[passingIndex].max - 1,
      }
    }
    tmp.splice(passingIndex + 1, 0, item)
    setPassingIndex(passingIndex + 1)
    setGradeList(tmp)
    //   eventManager.send_event(
    //     events.EXAM_STRUCTURE_ADD_MORE_GRADE_SCALE_CLICKED_TFI,
    //     {class_id: classId}
    //   )
  }

  const deleteGrade = (index) => {
    let tmp = [...gradesList]
    let deleted = tmp.splice(index, 1)
    if (index < gradesList.length - 1) {
      tmp[index] = {...tmp[index], max: deleted[0].max}
    } else {
      tmp[index - 1] = {...tmp[index - 1], min: 0}
    }
    if (index < passingIndex) {
      setPassingIndex(passingIndex - 1)
    }
    if (index === passingIndex) {
      setPassingGrade(tmp[index - 1], tmp)
      setPassingIndex(passingIndex - 1)
      return
    }
    setGradeList(tmp)
    //   eventManager.send_event(
    //     events.EXAM_STRUCTURE_ADD_MORE_GRADE_SCALE_DELETE_CLICKED_TFI,
    //     {class_id: classId}
    //   )
  }

  const handleChange = ({fieldName, value}, index) => {
    let arr = [...gradesList]
    if (fieldName === 'max' || fieldName === 'min') {
      if (value > 100 || value < 0) {
        setHasError([...hasError, index])
      } else {
        let i = hasError.indexOf(index)
        if (i !== -1) {
          let tmp = [...hasError]
          tmp.splice(i, 1)
          setHasError(tmp)
        }
      }
    }

    let obj = {...arr[index], [fieldName]: value}
    if (obj.min < 0 || obj.max < 0) {
      return
    }
    arr[index] = obj
    if (index + 1 < arr.length) {
      arr[index + 1] = {
        ...arr[index + 1],
        max: isNaN(parseInt(obj.min)) ? '' : parseInt(obj.min) - 1,
      }
    }
    if (index - 1 >= 0 && obj.max) {
      arr[index - 1] = {
        ...arr[index - 1],
        min: isNaN(parseInt(obj.max)) ? '' : parseInt(obj.max) + 1,
      }
    }
    let tmp = [...arr]
    if (index === passingIndex) {
      setPassingGrade(tmp[index], tmp)
      return
    }
    setGradeList(tmp)
  }

  const isValid = (val) => {
    return val > 100 || val < 0
  }

  const renderFailToggle = () => {
    return (
      <>
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          classes={{button: commonStyles.marginBottom}}
          onClick={addGradeInBetween}
        >
          {t('addNew')}
        </Button>
        <ToggleButtonWrapper
          label={t('setupPassingGrades')}
          isSelected={failEnabled}
          handleChange={(obj) =>
            setFailEnabled(
              obj.value,
              obj.value
                ? gradesList[gradesList.length - 2]
                : gradesList[gradesList.length - 1]
            )
          }
        />
        <Para className={styles.cautionPara} type={PARA_CONSTANTS.TYPE.ERROR}>
          <Icon
            name="caution"
            type={ICON_CONSTANTS.TYPES.ERROR}
            version={ICON_CONSTANTS.VERSION.OUTLINED}
          />
          <div className="flex flex-col">
            <span>{t('failCaution1')}</span>
            <span>{t('failCaution2')}</span>
          </div>
        </Para>
        {failEnabled && (
          <div className={styles.redDiv}>{t('failingGrade')}</div>
        )}
      </>
    )
  }

  const renderGrades = () => {
    return gradesList?.map((grade, i) => {
      return (
        <>
          {i === passingIndex + 1 && failEnabled ? renderFailToggle() : null}
          {(i <= passingIndex || failEnabled) && (
            <div key={grade._id} className={styles.gradeRow}>
              <div className={styles.gradeMarksColumn}>
                <Input
                  type="number"
                  value={grade.max}
                  fieldName="max"
                  onChange={(obj) =>
                    handleChange({...obj, value: parseInt(obj.value)}, i)
                  }
                  suffix="%"
                  infoType={isValid(grade.max) ? 'error' : undefined}
                  classes={{wrapper: styles.gradesInput}}
                  isDisabled={i === 0}
                />
                <span>-</span>
                <Input
                  type="number"
                  value={grade.min}
                  fieldName="min"
                  onChange={(obj) =>
                    handleChange({...obj, value: parseInt(obj.value)}, i)
                  }
                  suffix="%"
                  infoType={isValid(grade.min) ? 'error' : undefined}
                  classes={{wrapper: styles.gradesInput}}
                  isDisabled={i === gradesList.length - 1}
                />
                <span>=</span>
                <Input
                  value={grade.name}
                  fieldName="name"
                  onChange={(obj) => handleChange(obj, i)}
                  maxLength={3}
                  classes={{wrapper: styles.gradesInput}}
                />
              </div>

              <Icon
                name="delete1"
                type={ICON_CONSTANTS.TYPES.SECONDARY}
                size={ICON_CONSTANTS.SIZES.X_SMALL}
                onClick={() => deleteGrade(i)}
              />
            </div>
          )}
          {i === gradesList.length - 1 && !failEnabled
            ? renderFailToggle()
            : null}
        </>
      )
    })
  }

  return (
    <div className={styles.gradeConverter}>
      <div className={classNames(styles.gradeRow, styles.gradesSubtext)}>
        <div className={styles.gradeMarksColumn}>
          <span>{t('higher')}%</span>
          <span>-</span>
          <span>{t('lower')}%</span>
          <span>=</span>
          <span>{t('grade')}</span>
        </div>
      </div>
      <div className={styles.greenDiv}>{t('passingGrade')}</div>
      <div className={styles.gradesBlock}>{renderGrades()}</div>
      {failEnabled && (
        <Button
          type={BUTTON_CONSTANTS.TYPE.TEXT}
          onClick={addGradeAtLast}
          classes={{button: commonStyles.marginBottom}}
        >
          {t('addNew')}
        </Button>
      )}
    </div>
  )
}

export default GradesConverter

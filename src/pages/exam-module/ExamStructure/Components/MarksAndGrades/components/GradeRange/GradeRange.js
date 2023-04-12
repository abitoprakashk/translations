import {Button, Input, Icon} from '@teachmint/common'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import classNames from 'classnames'
import styles from './GradeRange.module.css'
import {events} from '../../../../../../../utils/EventsConstants'

const GradeRange = ({
  isGrade,
  grades,
  handleChange,
  passingValue,
  setPassingValue,
  classId,
}) => {
  const {t} = useTranslation()
  const {eventManager} = useSelector((state) => state)

  const addGrade = () => {
    let tmp = [...grades]
    tmp.push({min: 0})
    handleChange(tmp)
    eventManager.send_event(
      events.EXAM_STRUCTURE_ADD_MORE_GRADE_SCALE_CLICKED_TFI,
      {class_id: classId}
    )
  }

  const deleteGrade = (index) => {
    let tmp = [...grades]
    let deleted = tmp.splice(index, 1)
    if (index < grades.length - 1) {
      tmp[index] = {...tmp[index], max: deleted[0].max}
    } else {
      tmp[index - 1] = {...tmp[index - 1], min: 0}
    }
    if (passingValue?.name === deleted[0].name) {
      setPassingValue(tmp[index]?.name ? tmp[index] : tmp[index - 1])
    }
    handleChange(tmp)
    eventManager.send_event(
      events.EXAM_STRUCTURE_ADD_MORE_GRADE_SCALE_DELETE_CLICKED_TFI,
      {class_id: classId}
    )
  }

  const handleRangeChange = (obj, index) => {
    let tmp = [...grades]
    if (index === grades.length) {
      tmp.push(obj)
    } else {
      if (obj.min < 0 || obj.max < 0) {
        return
      }
      tmp[index] = obj
      if (index + 1 < grades.length) {
        tmp[index + 1] = {...tmp[index + 1], max: parseInt(obj.min) - 1}
      }
      if (index - 1 >= 0 && obj.max) {
        tmp[index - 1] = {...tmp[index - 1], min: parseInt(obj.max) + 1}
      }
    }
    handleChange(tmp)
  }

  const renderRange = () => {
    return grades.map((item, index) => (
      <React.Fragment key={item._id || index}>
        <Input
          classes={{wrapper: styles.input}}
          className={classNames({
            [styles.disabledBackground]: !isGrade,
          })}
          type="text"
          placeholder="Grade"
          value={item.name}
          onChange={(obj) =>
            handleRangeChange({...item, name: obj.value}, index)
          }
          maxLength="3"
          disabled={!isGrade}
          isRequired={true}
        />
        <span className={styles.dividers}>:</span>
        <Input
          classes={{wrapper: styles.input}}
          className={classNames({
            [styles.disabledBackground]:
              !isGrade || index === grades.length - 1,
          })}
          type="number"
          placeholder="Lower Marks"
          value={`${item.min}`}
          onChange={(obj) =>
            handleRangeChange(
              {...item, min: obj.value ? parseInt(obj.value) : obj.value},
              index
            )
          }
          maxLength="3"
          disabled={!isGrade || index === grades.length - 1}
          isRequired={true}
        />
        <span className={styles.dividers}>-</span>
        <Input
          classes={{wrapper: styles.input}}
          className={classNames({
            [styles.disabledBackground]: !isGrade || index === 0,
          })}
          type="number"
          placeholder="Higher Marks"
          value={`${item.max}`}
          onChange={(obj) =>
            handleRangeChange(
              {...item, max: obj.value ? parseInt(obj.value) : obj.value},
              index
            )
          }
          maxLength="3"
          disabled={!isGrade || index === 0}
          isRequired={true}
        />
        {isGrade && index > 0 ? (
          <div className={styles.dividers} onClick={() => deleteGrade(index)}>
            <Icon
              className={styles.pointer}
              name="delete"
              color="error"
              type="outlined"
            />
          </div>
        ) : (
          <div></div>
        )}
      </React.Fragment>
    ))
  }
  return (
    <>
      <div className={styles.heading}>{t('gradeRange')}</div>
      <div className={styles.rangeContainer}>
        <div className={styles.rangeHeading}>
          <span>{t('grade')}</span>
          <span></span>
          <span>{t('lowerMarks')}</span>
          <span></span>
          <span>{t('higherMarks')}</span>
        </div>
        <div className={styles.rangeBody}>
          {renderRange()}
          {isGrade && (
            <Button type="secondary" onClick={addGrade}>
              {t('addMore')}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default GradeRange

import {Checkbox, Input} from '@teachmint/krayon'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import commonStyles from './../../../ScholasticBlock/ScholasticBlock.module.css'
import styles from './SubjectMarks.module.css'
import ToggleButtonWrapper from '../../../ToggleButtonWrapper'
import {events} from '../../../../../../../../../../../utils/EventsConstants'

const SubjectMarks = ({
  exam,
  setExam,
  isSameMarks,
  subjectIds,
  examTypes,
  setDisableApply,
  userEventHandler,
}) => {
  const {t} = useTranslation()
  const [subjectList, setSubjectList] = useState([])
  const [hasError, setHasError] = useState([])

  useEffect(() => {
    setDisableApply(hasError.length ? true : false)
  }, [hasError])

  useEffect(() => {
    if (!exam) return
    let list = []
    exam.children.forEach((subject) => {
      let index = subjectIds.indexOf(subject.subject_master_id)
      if (index !== -1) {
        let obj = {...subject}
        obj.marks = {}
        obj.children.forEach((sub) => {
          obj.marks[sub.exam_type_id] = sub.checked ? sub.weightage : null
        })
        list.push(obj)
      }
    })
    list = list.sort((a, b) => a.order - b.order)
    setSubjectList(list)
  }, [exam, subjectIds])

  const validator = (value, index) => {
    if (value > 1000 || value < 0) {
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

  const handleAllSubjectChange = ({fieldName, value}, testType = 0) => {
    let subjects = []
    exam.children.forEach((item) => {
      let tmp = [...item.children]
      let childIndex = tmp.findIndex((sub) => sub.exam_type_id === testType)
      let flag = true
      if (fieldName === 'checkbox') {
        if (childIndex > -1) {
          tmp[childIndex] = {...tmp[childIndex], checked: value}
          if (!value) {
            flag = tmp.reduce((bool, sub) => bool || sub.checked, value)
          }
        } else {
          let json = {...tmp[0]}
          delete json._id
          delete json.c
          delete json.u
          json = {
            ...json,
            weightage: 20,
            checked: value,
            exam_type_id: testType,
          }
          tmp.push(json)
        }
      } else {
        validator(value, 0)
        tmp[childIndex] = {...tmp[childIndex], checked: true, weightage: value}
      }
      subjects.push({
        ...item,
        children: tmp,
        checked: subjectIds.includes(item.subject_master_id) ? flag : false,
      })
    })
    setExam({...exam, children: subjects})
  }

  const handleCheckboxChange = (children, subIndex, value, testType) => {
    if (subIndex > -1) {
      children[subIndex] = {...children[subIndex], checked: value}
    } else {
      let json = {...children[0]}
      delete json._id
      delete json.c
      delete json.u
      json = {
        ...json,
        weightage: 20,
        checked: value,
        exam_type_id: testType,
      }
      children.push(json)
    }
    return children
  }

  const handleMarksChange = (children, subIndex, value) => {
    validator(value, subIndex)
    children[subIndex] = {...children[subIndex], weightage: value}
    return children
  }

  const handleChange = ({fieldName, value}, subjectMasterId, testType) => {
    let subjects = [...exam.children]
    let index = subjects.findIndex(
      (sub) => sub.subject_master_id === subjectMasterId
    )
    let selectedSubject = {...subjects[index]}
    if (testType) {
      let children = [...selectedSubject.children]
      let subIndex = children.findIndex((item) => item.exam_type_id == testType)
      if (fieldName === 'checkbox') {
        children = [
          ...handleCheckboxChange(children, subIndex, value, testType),
        ]
      } else {
        children = [...handleMarksChange(children, subIndex, value)]
      }
      selectedSubject = {
        ...selectedSubject,
        children: [...children],
        checked: children.reduce((bool, sub) => bool || sub.checked, false),
      }
    } else {
      selectedSubject = {...selectedSubject, checked: value}
      selectedSubject.children = selectedSubject.children.map((item) => ({
        ...item,
        checked: value,
      }))
    }
    subjects[index] = {...selectedSubject}
    setExam({...exam, children: subjects})
  }

  const setIsSameMarks = (bool) => {
    userEventHandler(
      events.REPORT_CARD_SCHOLASTIC_SUBJECT_MARKS_SET_SAME_CLICKED_TFI,
      {
        flag: bool ? 'Y' : 'N',
      }
    )
    setExam({...exam, same_subtest_total: bool})
  }

  const renderCell = (value, isChecked = false, handleChange) => {
    return (
      <div className={styles.cell}>
        <Checkbox
          fieldName="checkbox"
          isSelected={isChecked}
          handleChange={handleChange}
        />
        <Input
          type="number"
          fieldName="marks"
          value={value}
          onChange={handleChange}
          suffix="marks"
          placeholder="Enter"
          isDisabled={!isChecked}
          infoType={value < 0 || value > 1000 ? 'error' : undefined}
        />
      </div>
    )
  }

  const renderRowInputs = (subject) => {
    return examTypes.map((type) => (
      <td key={type._id}>
        {renderCell(
          subject.marks[type._id],
          subject.children.find((item) => item.exam_type_id === type._id)
            ?.checked && subject.checked,
          (obj) => handleChange(obj, subject.subject_master_id, type._id)
        )}
      </td>
    ))
  }

  const populateTableForSubjects = () => {
    return subjectList.map((subject) => (
      <tr key={subject.subject_master_id}>
        <td>
          <div className={styles.cell}>
            <Checkbox
              fieldName="checkbox"
              isSelected={subject.checked}
              handleChange={(obj) =>
                handleChange(obj, subject.subject_master_id)
              }
            />
            {subject.name}
          </div>
        </td>
        {renderRowInputs(subject)}
      </tr>
    ))
  }

  const renderRowValues = (subject) => {
    return examTypes.map((type) => (
      <td key={type._id}>
        {subject.marks[type._id] ? (
          <>
            {subject.marks[type._id]}{' '}
            <span className={commonStyles.gradesSubtext}>{t('marks')}</span>
          </>
        ) : null}
      </td>
    ))
  }

  const renderAllSubjectHeading = (overAllWeightage) => {
    return examTypes.map((type) => (
      <td key={type._id}>
        {renderCell(
          overAllWeightage[type._id],
          overAllWeightage[type._id] !== undefined ? true : false,
          (obj) => handleAllSubjectChange(obj, type._id)
        )}
      </td>
    ))
  }

  const populateTableForSameForAllSubjects = (overAllWeightage) => {
    let allSubjects = {
      _id: 'all_subjects',
      name: 'All subjects',
    }

    return (
      <>
        <tr key={allSubjects._id}>
          <td>{allSubjects.name}</td>
          {renderAllSubjectHeading(overAllWeightage)}
        </tr>
        {subjectList.map((subject) => (
          <tr key={subject.subject_master_id}>
            <td>{subject.name}</td>
            {renderRowValues(subject)}
          </tr>
        ))}
      </>
    )
  }

  const renderSubjects = () => {
    let overAllWeightage = {}
    let testTypes = examTypes
    let subjects = exam.children
    for (let i = 0; i < subjects.length; i++) {
      let arr = []
      for (let j = 0; j < subjects[i].children.length; j++) {
        arr.push(subjects[i].children[j].exam_type_id)
      }
      testTypes = testTypes.filter((item) => arr.includes(item._id))
      if (!testTypes.length) break
    }
    if (subjects.length) {
      let subs = {}
      exam.children[0].children.forEach(
        (item) => (subs[item.exam_type_id] = item)
      )
      testTypes.forEach((item) => {
        overAllWeightage[item._id] = subs[item._id].checked
          ? subs[item._id].weightage
          : undefined
      })
    }
    if (!isSameMarks) return populateTableForSubjects()
    return populateTableForSameForAllSubjects(overAllWeightage)
  }

  const renderTableHeading = () => {
    let arr = [<th key="subject">{t('subjects')}</th>]
    arr = [
      ...arr,
      ...examTypes.map((item) => (
        <th key={item._id}>{item.label || 'Marks'}</th>
      )),
    ]
    return arr
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toggleWrapper}>
        <ToggleButtonWrapper
          label={t('setSameMarksForAllSubjects')}
          isSelected={isSameMarks}
          handleChange={(obj) => setIsSameMarks(obj.value)}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.tableStyles}>
          <thead>
            <tr>{renderTableHeading()}</tr>
          </thead>
          <tbody>{renderSubjects()}</tbody>
        </table>
      </div>
    </div>
  )
}

export default SubjectMarks

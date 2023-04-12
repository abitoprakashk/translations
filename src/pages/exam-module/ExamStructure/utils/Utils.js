import produce from 'immer'
import {t} from 'i18next'

let subjectSelectedFlagArr = []

export const modifyObjectAsNewEntry = (obj, index) => {
  obj = produce(obj, (draft) => {
    delete draft._id
    delete draft.c
    delete draft.u
    delete draft.uuid
    delete draft.parent
    delete draft.ancestors
    delete draft.exam_planner_id
    if (index) {
      draft.order = index
    }
    if (draft.node_type === 'TestSubType') draft.order = draft.test_type
  })
  if (!obj.children) return obj
  else {
    for (let i = 0; i < obj.children.length; i++) {
      const modifiedChild = modifyObjectAsNewEntry(obj.children[i])
      obj = produce(obj, (draft) => {
        draft.children.splice(i, 1)
        draft.children.splice(i, 0, modifiedChild)
      })
    }
  }
  return obj
}

export const addErrorKey = (obj) => {
  obj = produce(obj, (draft) => {
    draft['nameError'] = null
    draft['weightageError'] = null
  })
  if (!obj.children) return obj
  else {
    obj = produce(obj, (draft) => {
      draft.children.sort((a, b) => a.order < b.order)
    })
    for (let i = 0; i < obj.children.length; i++) {
      const modifiedChild = addErrorKey(obj.children[i])
      obj = produce(obj, (draft) => {
        draft.children.splice(i, 1)
        draft.children.splice(i, 0, modifiedChild)
      })
    }
  }
  return obj
}

const checkingErrorRecursively = (obj, index) => {
  if (obj.nameError || obj.weightageError)
    return {
      errorMsg: obj.nameError || obj.weightageError,
      error: true,
    }

  if (obj.node_type === 'Test') {
    subjectSelectedFlagArr.push({name: obj.name, value: false})
  }

  if (obj.node_type === 'TestSubject' && obj.checked) {
    subjectSelectedFlagArr[index].value = true
  }

  if (!obj.children || !obj.children.length) return true
  else {
    for (let i = 0; i < obj.children.length; i++) {
      let res = checkingErrorRecursively(
        obj.children[i],
        obj.node_type === 'Test' ? subjectSelectedFlagArr.length - 1 : index
      )
      if (res.error) {
        return res
      }
    }
  }
  return true
}

export const checkExamName = (terms) => {
  let tmpExams = []
  for (let term of terms) {
    for (let exam of term.children) {
      if (tmpExams.includes(exam.name)) {
        return true
      } else {
        tmpExams.push(exam.name)
      }
    }
  }
  return false
}

export const validateExamStructure = (obj) => {
  // let weightage = 0
  let hasSameName = false
  subjectSelectedFlagArr = []
  let tmpTerm = []
  let passingPercent = parseInt(obj.passing_percentage)
  if (isNaN(passingPercent) || passingPercent < 1 || passingPercent > 100) {
    return {
      errorMsg: t('percentInvalid'),
      error: true,
    }
  }
  obj.children.forEach((item) => {
    // weightage += parseInt(item.weightage)
    if (!hasSameName) {
      if (tmpTerm.includes(item.name)) {
        hasSameName = true
      } else {
        tmpTerm.push(item.name)
      }
    }
  })
  // if (weightage !== 100)
  //   return {
  //     errorMsg: t('termWeightageInvalid'),
  //     error: true,
  //   }
  if (hasSameName)
    return {
      errorMsg: t('termNameInvalid'),
      error: true,
    }
  let hasSameExamName = checkExamName(obj.children)
  if (hasSameExamName)
    return {
      errorMsg: t('examNameInvalid'),
      error: true,
    }
  let res = checkingErrorRecursively(obj)
  for (let i = 0; i < subjectSelectedFlagArr.length; i++) {
    if (!subjectSelectedFlagArr[i].value) {
      return {
        errorMsg: t('examNoSubject', {
          subjectName: subjectSelectedFlagArr[i].name,
        }),
        error: true,
      }
    }
  }
  return res
}

export const removeErrorFields = (obj, index) => {
  obj = produce(obj, (draft) => {
    delete draft.nameError
    delete draft.weightageError
    draft.order = index
    if (draft.node_type === 'TestSubType') draft.order = draft.test_type
  })
  if (!obj.children) return obj
  else {
    for (let i = 0; i < obj.children.length; i++) {
      const modifiedChild = removeErrorFields(obj.children[i], i)
      obj = produce(obj, (draft) => {
        draft.children.splice(i, 1)
        draft.children.splice(i, 0, modifiedChild)
      })
    }
  }
  return obj
}

export const deleteExtraFieldsFromAPIResponse = (obj) => {
  let arr = [
    'c',
    'u',
    'uuid',
    'parent',
    'ancestors',
    'deleted',
    'institute_id',
    'session_id',
    'entity_id',
  ]
  arr.forEach((item) => delete obj[item])
  return obj
}

export const validationForGradeRange = (data) => {
  if (!data.gradeEnabled) {
    if (
      !data.passingPercentage ||
      data.passingPercentage < 0 ||
      data.passingPercentage > 100
    ) {
      return {
        status: false,
        error: t('percentRange'),
      }
    }
  } else {
    if (!data.passingGrade) {
      return {
        status: false,
        error: t('passingGradeEmpty'),
      }
    }
    let names = []
    for (let grade of data.grades) {
      if (!grade.name) {
        return {
          status: false,
          error: t('gradeNameEmpty'),
        }
      }
      if (grade.min === '') {
        return {
          status: false,
          error: t('lowerMarksEmpty'),
        }
      }
      if (grade.max === '') {
        return {
          status: false,
          error: t('higherMarksEmpty'),
        }
      }
      if (names.includes(grade.name.toLowerCase())) {
        return {
          status: false,
          error: t('gradeNameUnique'),
        }
      }
      names.push(grade.name.toLowerCase())
      if (grade.max <= grade.min)
        return {
          status: false,
          error: t('gradeRangeInvalid', {gradeName: grade.name}),
        }
    }
  }
  return {status: true}
}

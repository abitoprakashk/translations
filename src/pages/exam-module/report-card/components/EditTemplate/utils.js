import {
  EXAM_TYPES,
  GRADE_VISIBLITY_OPTIONS,
  TEMPLATE_SECTIONS_ID,
} from '../../constants'
import {t} from 'i18next'
import {toCamelCasedKeys} from '../../../../../utils/Helpers'
import studentDp from './../../../../../assets/images/icons/reportcard_student_dp.svg'

const SUBTEST_RESULT_WIDTH = 2

const SUBTEST_TOTAL_RESULT_WIDTH = 3

const TERM_RESULT_WIDTH = 4

export const SESSION_RESULT_WIDTH = 5

const getSubjectMapOfWhole = (data) => {
  let obj = {}
  data.children?.forEach((term) => {
    term.children?.forEach((exam) => {
      exam.children?.forEach((sub) => {
        if (!obj[sub.subject_id]) {
          let tmp = {...sub}
          delete tmp.children
          obj[sub.subject_master_id] = {...tmp, checked: true}
        }
      })
    })
  })
  return obj
}

const getExamTypeList = (subjects, examTypes) => {
  let arr = []
  subjects?.forEach((subject) => {
    subject.children.forEach((sub) => {
      if (!arr.find((item) => item._id === sub.exam_type_id)) {
        let tmp = examTypes.find((item) => item._id === sub.exam_type_id)
        if (tmp?.checked) {
          arr.push({
            _id: sub.exam_type_id,
            label: EXAM_TYPES[sub.exam_type_id] || tmp.label,
            order: tmp.order,
          })
        }
      }
    })
  })
  return arr
}

const getSubjectChecked = (subjects, examType) => {
  let flag = false
  subjects.forEach((sub) => {
    let obj = sub.children.find((s) => s.exam_type_id === examType)
    if (obj) {
      flag = flag || obj.checked
    }
  })
  return flag
}

const getSubjectMap = (subjects, examType, subjectIds) => {
  let obj = {}
  subjects.forEach((sub) => {
    if (sub.children.find((s) => s.exam_type_id === examType)) {
      let index = subjectIds.findIndex(
        (item) => item.id === sub.subject_master_id && item.checked
      )
      if (index !== -1) obj[sub.subject_id] = {...sub, Result: '', order: index}
    }
  })
  return obj
}

const getWeightageObj = (subjects, examType) => {
  let weight = null
  let flag = true
  for (let sub of subjects) {
    const item = sub.children.find((s) => s.exam_type_id === examType)
    if (item) {
      if (weight === null) {
        weight = item.weightage
      } else if (weight != item.weightage) {
        flag = false
        break
      }
    }
  }
  return {weightage: weight, same_subtest_total: flag}
}

const getSubjectsDetailsOfResult = (
  subjectMap,
  showGrades,
  gradesVisiblity,
  bodyWidth
) => {
  if (showGrades && gradesVisiblity === GRADE_VISIBLITY_OPTIONS.NONE) return {}
  let data = {
    subject_map: subjectMap,
    body_width_weight: bodyWidth,
  }
  if (!showGrades || gradesVisiblity === GRADE_VISIBLITY_OPTIONS.MARKS)
    return {Total: data}
  if (showGrades && gradesVisiblity === GRADE_VISIBLITY_OPTIONS.GRADES)
    return {'Gr.': data}
  if (showGrades && gradesVisiblity === GRADE_VISIBLITY_OPTIONS.BOTH)
    return {
      Total: {...data, body_width_weight: bodyWidth / 2},
      'Gr.': {...data, body_width_weight: bodyWidth / 2},
    }
}

const getSubjectsDetailsOfExam = (subjects, examTypes, subjectIds) => {
  let tmp = examTypes.map((type) => {
    const isChecked = getSubjectChecked(subjects, type._id)
    return {
      _id: type._id,
      checked: isChecked,
      name: type.label,
      order: type.order,
      subject_map: {
        Total: {
          subject_map: getSubjectMap(subjects, type._id, subjectIds),
        },
      },
      body_width_weight: isChecked ? SUBTEST_RESULT_WIDTH : 0,
      ...getWeightageObj(subjects, type._id),
    }
  })
  return sortByOrderAndChecked(tmp)
}

const getChildrenObj = (
  terms,
  subjectMap,
  showGrades,
  gradesVisiblity,
  subjectIds,
  examTypes
) => {
  return terms.map((term) => {
    term.Result = getSubjectsDetailsOfResult(
      subjectMap,
      showGrades,
      gradesVisiblity.term_level,
      TERM_RESULT_WIDTH
    )
    term.show_term_total =
      gradesVisiblity.term_level !== GRADE_VISIBLITY_OPTIONS.NONE
    term.out_of = term.weightage
    term.body_width_weight = 0
    term.total_width_weight =
      term.checked && term.show_term_total ? TERM_RESULT_WIDTH : 0
    let sameWeightageFlag = true
    let totalOfExams = 0
    term.children = term.children.map((exam) => {
      exam.Result = getSubjectsDetailsOfResult(
        subjectMap,
        showGrades,
        gradesVisiblity.exam_level,
        SUBTEST_TOTAL_RESULT_WIDTH
      )
      exam.examTypes = getExamTypeList(exam.children, examTypes)
      exam.children = getSubjectsDetailsOfExam(
        exam.children,
        exam.examTypes,
        subjectIds
      )
      exam.weightage = 0
      let sameWeightageExamFlag = true
      for (let key in exam.children) {
        exam.weightage += +exam.children[key].weightage || 0
        sameWeightageExamFlag =
          sameWeightageExamFlag && exam.children[key].same_subtest_total
      }
      exam.same_test_total = sameWeightageExamFlag
      sameWeightageFlag = sameWeightageFlag && exam.same_test_total
      exam.children_count = exam.children.filter((item) => item.checked).length
      exam.body_width_weight =
        exam.checked && exam.children_count > 1
          ? exam.children_count * SUBTEST_RESULT_WIDTH
          : 0
      exam.total_width_weight = exam.checked ? SUBTEST_TOTAL_RESULT_WIDTH : 0
      if (term.checked) {
        term.body_width_weight +=
          exam.body_width_weight + exam.total_width_weight
      }
      totalOfExams += +exam.weightage
      return exam
    })
    term.same_term_total = sameWeightageFlag
    term.out_of = totalOfExams
    return term
  })
}

export const sortByOrderAndChecked = (arr) => {
  return arr.sort((a, b) => {
    return b.checked - a.checked || a.order - b.order
  })
}

export const getCombinedTermName = (terms) => {
  let arr = terms.filter((item) => item.checked).map((term) => term.name)
  return arr.join('+ ')
}

export const getCombinedTermPercent = (terms) => {
  let arr = terms
    .filter((item) => item.checked)
    .map((term) => `${term.weightage}%`)
  return arr.join('+ ')
}

export const getBodyWidthWeight = (terms) => {
  return terms.reduce(
    (sum, term) => sum + term.body_width_weight + term.total_width_weight,
    0
  )
}

export const convertExamStructure = (obj, showGrades, gradesVisiblity) => {
  let tmp = {}
  tmp.subject_map_whole = getSubjectMapOfWhole({...obj})
  tmp.subject_map = sortByOrderAndChecked([...obj.common_subjects])
  tmp.exam_types = [...obj.exam_types]
  tmp.show_session_total = obj.show_session_total
  tmp.children = getChildrenObj(
    [...obj.children],
    tmp.subject_map_whole,
    showGrades,
    gradesVisiblity,
    tmp.subject_map,
    [...obj.exam_types]
  )
  tmp.Result = getSubjectsDetailsOfResult(
    tmp.subject_map_whole,
    showGrades,
    gradesVisiblity.session_level,
    SESSION_RESULT_WIDTH
  )
  tmp = {
    ...tmp,
    total_width_weight: obj.show_session_total ? SESSION_RESULT_WIDTH : 0,
    body_width_weight: getBodyWidthWeight(tmp.children),
    terms_combined_names: getCombinedTermName(tmp.children),
    terms_combined_percentages: getCombinedTermPercent(tmp.children),
    session_same_total: tmp.children.reduce(
      (sum, item) => sum + item.out_of,
      0
    ),
    same_session_total: tmp.children.reduce(
      (sum, item) => sum && item.same_term_total,
      true
    ),
    page_break: false,
  }
  return tmp
}

export const convertCoScholastic = (
  {co_scholastic: obj, scholastic},
  sectionName
) => {
  let terms = scholastic.exam_str.children

  let tmp = {
    cosch_subjects: [...obj.cosch_subjects],
  }
  let subjects = [...obj.cosch_subjects]
  subjects = subjects.filter((sub) => sub.checked && !sub.deleted)
  if (!subjects.length) {
    // tmp.show_co_scholastic = false
    tmp.left_cosch_data = []
    return tmp
  }
  subjects = sortByOrderAndChecked(subjects)
  tmp.left_cosch_data = []
  let elems = [sectionName || 'Activity']
  terms.forEach((term) => {
    if (term.show_cosch) elems.push(term.name)
  })
  // if (elems.length === 1) tmp.show_co_scholastic = false
  tmp.left_cosch_data.push(elems)
  let item = []
  terms.forEach((term) => {
    if (term.show_cosch) item.push('')
  })
  tmp.right_cosch_data = [elems]
  let divider = subjects.length > 5 ? Math.ceil(subjects.length / 2) : 5
  subjects.forEach((sub, i) => {
    if (i < divider) {
      tmp.left_cosch_data.push([sub.label, ...item])
    } else {
      tmp.right_cosch_data.push([sub.label, ...item])
    }
  })
  return tmp
}

export const getStudentDetails = ({fetch_params}) => {
  let arr = fetch_params.filter(
    (item) => item.method_name === 'get_student_details'
  )
  let detailsArr = []
  let objArr = []
  let imgUrl = null
  if (arr.length) {
    arr[0].params.forEach((item) => {
      if (!item.checked) return
      if (item.id === 'img_url') {
        imgUrl = item.label
      } else {
        detailsArr.push({...item, value: ''})
      }
      objArr.push({...item, value: ''})
    })
  }
  objArr.sort((a, b) => a.order - b.order)
  return {
    params_student_details: objArr,
    student_details_arr: detailsArr,
    show_student_pic: imgUrl ? true : false,
    student_pic_url: studentDp,
  }
}

export const getReportCardTitle = ({fetch_params}) => {
  let arr = fetch_params.filter(
    (item) => item.meta.template_section_id === 'header'
  )
  let obj = {}
  if (arr.length) {
    obj = arr[0].params.find((item) => item.id === 'report_card_title')
  }
  return obj.value
}

export const getScholasticTitle = ({fetch_params}) => {
  let arr = fetch_params.filter(
    (item) => item.meta.template_section_id === TEMPLATE_SECTIONS_ID.SCHOLASTIC
  )
  let obj = {}
  if (arr.length) {
    obj = arr[0].params.find((item) => item.id === 'scholastic_area_title')
  }
  return {
    scholastic_area_title: obj.value,
    show_session_total: arr[0].meta.show_session_total,
  }
}

export const getCoscholasticTitle = ({fetch_params}) => {
  let arr = fetch_params.filter(
    (item) =>
      item.meta.template_section_id === TEMPLATE_SECTIONS_ID.CO_SCHOLASTIC
  )
  let obj = {}
  if (arr.length) {
    obj.co_scholastic_area_title = arr[0].params.find(
      (item) => item.id === 'co_scholastic_area_title'
    )?.value
    obj.co_scholastic_section_name =
      arr[0].params.find((item) => item.id === 'co_scholastic_section_name')
        ?.value || 'Activities'
  }
  return {
    show_co_scholastic: arr[0]?.meta.show,
    co_sch_details: {...obj},
  }
}

export const getScoreSummary = ({fetch_params}) => {
  let arr = fetch_params.filter(
    (item) => item.method_name === 'calculate_student_marks'
  )
  let obj = {}
  if (arr.length) {
    arr[0].params.forEach((item) => {
      obj[item.id] = item
    })
  }
  return [...arr[0].params].sort((a, b) => a.order - b.order)
}

export const getGradingScale = ({grades}) => {
  return grades.reduce(
    (str, grade) => str + `${grade.name}(${grade.max}-${grade.min}),`,
    'Grading Scale: '
  )
}

const getAttendance = ({fetch_params}, terms) => {
  let arr = fetch_params.filter((item) => item.method_name === 'get_attendance')
  let obj = {}
  if (arr.length) {
    arr[0].params.forEach((item) => {
      if (!obj[item.type]) {
        obj[item.type] = []
      }
      if (item.type === 3) {
        item = {...item, name: item.label}
      }
      obj[item.type].push(item)
    })
  }
  return {
    show_attendance: arr[0]?.meta.show,
    attendance_type: arr[0]?.meta.mode,
    attendance:
      arr[0]?.meta.mode === 2 ? terms : arr[0]?.meta.mode === 3 ? obj[3] : [],
  }
}

export const getRemarks = ({fetch_params}) => {
  let arr = fetch_params.filter((item) => item.method_name === 'get_remarks')
  return {
    show_remarks: arr[0]?.meta.show,
    remarks_type: arr[0]?.meta.mode,
  }
}

export const getResult = ({fetch_params}) => {
  let arr = fetch_params.filter((item) => item.method_name === 'get_results')
  return {
    show_result: arr[0]?.meta.show,
    result_type: arr[0]?.meta.mode,
  }
}

export const getSignatureObj = ({fetch_params}) => {
  let arr = fetch_params.filter((item) => item.method_name === 'get_signatures')
  let obj = {}
  if (arr.length) {
    arr[0].params.forEach((item) => {
      obj[item.id] = item
    })
  }
  return {
    show_signature: arr[0]?.meta.show,
    params_signatures: obj,
    signature_arr: sortByOrderAndChecked([...arr[0]?.params]),
  }
}

export const convertTemplateFieldsIntoDataObj = ({
  scholastic,
  template,
  co_scholastic,
}) => {
  let coscholasticTitleDetails = getCoscholasticTitle(template)
  let scholasticDetails = getScholasticTitle(template)
  let exmStrTree = {
    ...convertExamStructure(
      JSON.parse(
        JSON.stringify({
          ...scholastic.exam_str,
          common_subjects: scholastic.common_subjects.params,
          exam_types: [...scholastic.exam_types],
          show_session_total: scholasticDetails.show_session_total,
        })
      ),
      scholastic.grading_criteria.grade_enabled,
      scholastic.grading_criteria.grading_visibility
    ),
    grand_total_footer: getScoreSummary(template),
    grading_desc: getGradingScale(scholastic.grading_criteria),
    // exam_types: [...scholastic.exam_types],
  }
  return {
    exm_str_tree: exmStrTree,
    grading_visibility: scholastic.grading_criteria.grading_visibility,
    title: getReportCardTitle(template),
    ...getScholasticTitle(template),
    ...coscholasticTitleDetails,
    ...getStudentDetails(template),
    ...scholastic.grading_criteria,
    ...getSignatureObj(template),
    ...getAttendance(template, exmStrTree.children),
    ...getRemarks(template),
    ...getResult(template),
    ...convertCoScholastic(
      JSON.parse(JSON.stringify({co_scholastic, scholastic})),
      coscholasticTitleDetails.co_sch_details.co_scholastic_section_name
    ),
    remarks: exmStrTree.children,
    results: exmStrTree.children,
  }
}

export const createExamSubjectTable = (exam) => {
  let subjectList = []
  let tmp = {}
  Object.keys(exam.children).forEach((item) => {
    return Object.keys(
      exam.children[item].subject_map['Total'].subject_map
    ).forEach((key) => {
      if (!tmp[key]) {
        tmp[key] = exam.children[item].subject_map['Total'].subject_map[key]
      }
    })
  })
  subjectList = Object.keys(tmp).map((key) => {
    let obj = {...tmp[key], _id: key}
    obj.marks = {}
    obj.children.forEach((sub) => {
      obj.marks[sub.exam_type_id] = sub.checked ? sub.weightage : null
    })
    return obj
  })
  return sortByOrderAndChecked(subjectList)
}

export const structureChangesForSubjects = (
  subjectIds,
  scholastic,
  examTypes,
  oldCommonSubject
) => {
  let terms = scholastic.children.map((term) => {
    let exams = term.children.map((exam) => {
      let subjects = exam.children.map((sub) => {
        let tmp = subjectIds.find((item) => item.id === sub.subject_master_id)
        if (tmp) {
          let newSub = {
            ...sub,
            order: tmp.order,
            checked: tmp.checked,
          }
          if (!tmp.checked) {
            let subChild = sub.children.map((item) => ({
              ...item,
              checked: false,
            }))
            newSub = {...newSub, children: subChild}
          } else {
            let oldTmp = oldCommonSubject.find(
              (item) => item.id === sub.subject_master_id
            )
            if (!oldTmp.checked) {
              let subChild = sub.children.map((item) => ({
                ...item,
                checked: examTypes.find(
                  (type) => type._id === item.exam_type_id
                ).checked,
              }))
              newSub = {...newSub, children: subChild}
            }
          }
          return newSub
        }
      })
      return {...exam, children: subjects}
    })
    return {...term, children: exams}
  })
  return {...scholastic, children: terms}
}

export const examTypeChangesForSubjects = (scholastic, examTypes) => {
  let terms = scholastic.children.map((term) => {
    let exams = term.children.map((exam) => {
      let subjects = exam.children.map((sub) => {
        let subTests = [...sub.children]
        examTypes.forEach((type) => {
          let index = subTests.findIndex(
            (subTest) => subTest.exam_type_id === type._id
          )
          if (index !== -1) {
            subTests[index] = {
              ...subTests[index],
              checked: type.checked,
              order: type.order,
            }
          } else {
            let tmp = {...subTests[0]}
            delete tmp?._id
            delete tmp?.c
            delete tmp?.u
            subTests.push({
              ...tmp,
              children: null,
              name: null,
              node_type: 'TestSubType',
              exam_type_id: type._id,
              checked: type.checked,
              order: type.order,
            })
          }
        })
        return {...sub, children: subTests}
      })
      return {...exam, children: subjects}
    })
    return {...term, children: exams}
  })
  return {...scholastic, children: terms}
}

export const validationForExam = (arr) => {
  for (let sub of arr) {
    for (let item of sub.children) {
      if (sub.checked && item.checked) {
        if (!item.weightage || item.weightage === '') {
          return {
            errorMsg: `${sub.name} ${t('marksCannotBeEmpty')}`,
            error: true,
          }
        }
      }
    }
  }
}

const validateExamStructure = (obj) => {
  // let weightage = 0
  let hasSameName = false
  let hasEnabled = false
  let tmpTerm = []

  let passingPercent = parseInt(obj.passing_percentage)
  if (isNaN(passingPercent) || passingPercent < 0 || passingPercent > 100) {
    return {
      errorMsg: t('passingPercentInvalid'),
      error: true,
    }
  }
  for (let i = 0; i < obj.children.length; i++) {
    let item = obj.children[i]
    // weightage += parseInt(item.weightage)
    if (item.checked) {
      hasEnabled = true
    }
    if (!item.name.length) {
      return {
        errorMsg: t('termNameEmpty'),
        error: true,
      }
    }
    if (item.weightage === '' || item.weightage === '-') {
      return {
        errorMsg: t('termWeightageEmpty'),
        error: true,
      }
    }
    if (!hasSameName) {
      if (tmpTerm.includes(item.name)) {
        hasSameName = true
      } else {
        tmpTerm.push(item.name)
      }
    }
  }
  if (!hasEnabled) {
    return {
      errorMsg: t('atleastOneTerm'),
      error: true,
    }
  }
  // if (weightage !== 100)
  //   return {
  //     errorMsg: t('termWeightageInvalid'),
  //     error: true,
  //   }
  if (hasSameName)
    return {
      errorMsg: t('termNameDuplicate'),
      error: true,
    }
  let hasSameExamName = false
  let tmpExams = []
  for (let term of obj.children) {
    hasEnabled = false
    for (let exam of term.children) {
      if (exam.checked) {
        hasEnabled = true
      }
      if (!exam.name.length) {
        return {
          errorMsg: t('examNameEmpty'),
          error: true,
        }
      }
      if (tmpExams.includes(exam.name)) {
        hasSameExamName = true
        break
      } else {
        tmpExams.push(exam.name)
      }
    }
    if (term.checked && !hasEnabled) {
      return {
        errorMsg: t('atleastOneExam'),
        error: true,
      }
    }
  }
  if (hasSameExamName)
    return {
      errorMsg: t('examNameDuplicate'),
      error: true,
    }
  return false
}

const validTitles = (fetchParams, coSchSubjects, examStruct) => {
  for (let i = 0; i < fetchParams.length; i++) {
    switch (fetchParams[i].meta.template_section_id) {
      case TEMPLATE_SECTIONS_ID.HEADER: {
        let param = fetchParams[i].params.find(
          (item) => item.id === 'report_card_title'
        )
        if (!param?.value?.length) {
          return {
            errorMsg: t('reportCardTitleEmpty'),
            error: true,
          }
        }
        break
      }
      case TEMPLATE_SECTIONS_ID.CO_SCHOLASTIC: {
        if (!fetchParams[i].meta.show) break
        let param = fetchParams[i].params.find(
          (item) => item.id === 'co_scholastic_area_title'
        )
        if (!param?.value?.length) {
          return {
            errorMsg: t('coScholasticTitleEmpty'),
            error: true,
          }
        }
        param = fetchParams[i].params.find(
          (item) => item.id === 'co_scholastic_section_name'
        )
        if (!param?.value?.length) {
          return {
            errorMsg: t('coScholasticSectionEmpty'),
            error: true,
          }
        }
        let filteredCoScholasticSubjects = coSchSubjects.filter(
          (item) => !item.deleted && item.checked
        )
        if (!filteredCoScholasticSubjects.length) {
          return {
            errorMsg: t('noSubjects'),
            error: true,
          }
        }
        let hasShowCosch = examStruct.children.find((item) => item.show_cosch)
        if (!hasShowCosch) {
          return {
            errorMsg: t('noTermsSelectedForCoscholastic'),
            error: true,
          }
        }
        break
      }
      case TEMPLATE_SECTIONS_ID.SCHOLASTIC: {
        let param = fetchParams[i].params.find(
          (item) => item.id === 'scholastic_area_title'
        )
        if (!param?.value?.length) {
          return {
            errorMsg: t('scholasticTitleEmpty'),
            error: true,
          }
        }
        break
      }
    }
  }
  return false
}

export const validationForExamTypes = (arr) => {
  let tmpArr = []
  let flag = false
  for (let examType of arr) {
    if (examType.label === '') {
      return {
        errorMsg: t('examTypeEmpty'),
        error: true,
      }
    }
    if (examType.checked) {
      flag = true
    }
    let name = examType.label.toLowerCase().trim()
    if (tmpArr.includes(name)) {
      return {
        errorMsg: t('examTypeDuplicate'),
        error: true,
      }
    }
    tmpArr.push(name)
  }
  if (!flag) {
    return {
      errorMsg: t('atleastOneExamType'),
      error: true,
    }
  }
}

export const validationForGradeRange = (obj) => {
  let data = toCamelCasedKeys({...obj})
  if (!data.passingGrade) {
    return {
      error: true,
      errorMsg: t('passingGradeEmpty'),
    }
  }
  let names = []
  for (let grade of data.grades) {
    if (!grade.name) {
      return {
        error: true,
        errorMsg: t('gradeNameEmpty'),
      }
    }
    if (grade.max === undefined || grade.max === '') {
      return {
        error: true,
        errorMsg: t('higherMarksEmpty'),
      }
    }
    if (grade.min === undefined || grade.min === '') {
      return {
        error: true,
        errorMsg: t('lowerMarksEmpty'),
      }
    }
    let gradeName = grade.name.toLowerCase().trim()
    if (names.includes(gradeName)) {
      return {
        error: true,
        errorMsg: t('gradeNameUnique'),
      }
    }
    names.push(gradeName)
    if (grade.max <= grade.min)
      return {
        error: true,
        errorMsg: t('gradeRangeInvalid', {gradeName: grade.name}),
      }
  }
  return
}

export const validateCoscholasticMandatory = (obj) => {
  let subsArr = []
  let nonDeletedSubs = obj.cosch_subjects.filter((item) => !item.deleted)
  for (let sub of nonDeletedSubs) {
    if (sub.checked && sub.label === '') {
      return {
        errorMsg: t('coScholasticSubjectEmpty'),
        error: true,
      }
    }
    let name = sub.label.toLowerCase().trim()
    if (subsArr.includes(name)) {
      return {
        errorMsg: t('coScholasticSubjectDuplicate'),
        error: true,
      }
    }
    subsArr.push(name)
  }
  return
}

export const validateCoscholastic = (obj) => {
  if (!obj.co_sch_details?.co_scholastic_section_name?.length) {
    return {
      errorMsg: t('coScholasticSectionEmpty'),
      error: true,
    }
  }
  if (!obj.cosch_subjects.length) {
    return {
      errorMsg: t('noSubjects'),
      error: true,
    }
  }
  return
}

export const validateSignature = (arr) => {
  let signArr = []
  let flag = false
  for (let sign of arr) {
    if (sign.checked && sign.label === '') {
      return {
        errorMsg: t('signEmpty'),
        error: true,
      }
    }
    if (sign.checked) {
      flag = true
    }
    let name = sign.label.toLowerCase().trim()
    if (signArr.includes(name)) {
      return {
        errorMsg: t('signDuplicate'),
        error: true,
      }
    }
    signArr.push(name)
  }
  if (!flag) {
    return {
      errorMsg: t('atleastOneSign'),
      error: true,
    }
  }
  return
}

export const validateTemplateFieldsObj = (obj) => {
  let examStruct = {
    ...obj.scholastic.exam_str,
    ...obj.scholastic.grading_criteria,
  }
  let error = validTitles(
    obj.template.fetch_params,
    obj.co_scholastic.cosch_subjects,
    obj.scholastic.exam_str
  )
  if (error) return error
  error = validateExamStructure(examStruct)
  if (error) return error
}

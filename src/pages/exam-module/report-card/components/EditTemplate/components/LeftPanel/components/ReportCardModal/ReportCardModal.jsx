import {
  Modal,
  Para,
  Icon,
  ICON_CONSTANTS,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import StudentFields from './components/StudentFields'
import ScholasticSubject from './components/ScholasticSubject'
import ExamTypes from './components/ExamTypes'
import GradesConverter from './components/GradesConverter/GradesConverter'
import {
  EDIT_TEMPLATE_SECTIONS,
  SCHOLASTIC_BLOCKS,
  TEMPLATE_SECTIONS_ID,
} from '../../../../../../constants'
import SubjectMarks from './components/SubjectMarks/SubjectMarks'
import CoScholasticArea from './components/CoScholasticArea/CoScholasticArea'
import SignatureManage from './components/SignatureManage/SignatureManage'
import {
  convertExamStructure,
  getGradingScale,
  convertCoScholastic,
  structureChangesForSubjects,
  examTypeChangesForSubjects,
  sortByOrderAndChecked,
  validationForGradeRange,
  validateCoscholastic,
  validateCoscholasticMandatory,
  validateSignature,
  validationForExamTypes,
  validationForExam,
} from '../../../../utils'
import {showErrorToast} from '../../../../../../../../../redux/actions/commonAction'
import {events} from '../../../../../../../../../utils/EventsConstants'

import styles from './ReportCardModal.module.css'

const ReportCardModal = ({
  isOpen,
  onClose,
  section,
  data,
  setData,
  objToSave,
  setObjToSave,
  userEventHandler,
  ...modalProps
}) => {
  const [templateData, setTemplateData] = useState(data)
  const [examDetails, setExamDetails] = useState(objToSave.scholastic.exam_str)
  const [disableApply, setDisableApply] = useState(false)
  const {t} = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    setExamDetails(objToSave.scholastic.exam_str)
  }, [objToSave])

  const eventHandler = (headerType, subHeaderType, details) => {
    userEventHandler(events.REPORT_CARD_APPLY_CLICKED_TFI, {
      header_type: headerType,
      sub_header_type: subHeaderType,
      details,
    })
  }

  const renderHeader = () => {
    switch (section) {
      case EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS:
        return t('manageStudentDetails')
      case SCHOLASTIC_BLOCKS.SUBJECTS:
        return t('selectSubjects')
      case SCHOLASTIC_BLOCKS.EXAM_TYPES:
        return t('manageExamTypes')
      case SCHOLASTIC_BLOCKS.GRADES:
        return t('convertMarksToGrade')
      case SCHOLASTIC_BLOCKS.MANAGE_EXAM:
        return t('subjectMarks')
      case EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC:
        return t('coscholasticArea')
      case EDIT_TEMPLATE_SECTIONS.SIGN_MANAGE:
        return t('signature')
    }
  }

  const renderBody = () => {
    switch (section) {
      case EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS:
        return (
          <StudentFields
            setDisableApply={setDisableApply}
            selectedFields={templateData.params_student_details}
            setSelectedFields={(fields) => {
              setTemplateData({
                ...templateData,
                params_student_details: fields,
              })
            }}
          />
        )
      case SCHOLASTIC_BLOCKS.SUBJECTS:
        return (
          <ScholasticSubject
            subjectIds={templateData.exm_str_tree.subject_map}
            setDisableApply={setDisableApply}
            setSubjectIds={(subjects) => {
              setTemplateData({
                ...templateData,
                exm_str_tree: {
                  ...templateData.exm_str_tree,
                  subject_map: subjects,
                },
              })
            }}
          />
        )
      case SCHOLASTIC_BLOCKS.EXAM_TYPES:
        return (
          <ExamTypes
            selectedExamTypes={sortByOrderAndChecked(
              templateData.exm_str_tree.exam_types
            )}
            setSelectedExamTypes={(types) =>
              setTemplateData({
                ...templateData,
                exm_str_tree: {
                  ...templateData.exm_str_tree,
                  exam_types: [...types],
                },
              })
            }
          />
        )
      case SCHOLASTIC_BLOCKS.GRADES:
        return (
          <GradesConverter
            gradesList={templateData.grades}
            failEnabled={templateData.fail_enabled}
            setDisableApply={setDisableApply}
            setFailEnabled={(bool, passingGrade) => {
              userEventHandler(
                events.REPORT_CARD_SCHOLASTIC_SETUP_PASSING_GRADE_CLICKED_TFI,
                {flag: bool ? 'Y' : 'N'}
              )
              setTemplateData({
                ...templateData,
                fail_enabled: bool,
                passing_grade: passingGrade,
              })
            }}
            setGradeList={(arr) =>
              setTemplateData({
                ...templateData,
                grades: [...arr],
              })
            }
            passingGrade={templateData.passing_grade}
            setPassingGrade={(obj, arr) =>
              setTemplateData({
                ...templateData,
                grades: [...arr],
                passing_grade: obj,
              })
            }
          />
        )
      case SCHOLASTIC_BLOCKS.MANAGE_EXAM: {
        const term = examDetails.children[modalProps.termIndex]
        const exam = term?.children[modalProps.examIndex]
        let subjectIds = templateData.exm_str_tree.subject_map
          .filter((item) => item.checked)
          .map((item) => item.id)
        return (
          <SubjectMarks
            subjectIds={subjectIds}
            exam={exam}
            setDisableApply={setDisableApply}
            userEventHandler={userEventHandler}
            isSameMarks={
              exam.same_subtest_total === undefined
                ? true
                : exam.same_subtest_total
            }
            examTypes={sortByOrderAndChecked(
              templateData.exm_str_tree.exam_types.filter(
                (item) => item.checked
              )
            )}
            setExam={(obj) => {
              let terms = [...examDetails.children]
              const termIndex = modalProps.termIndex
              let exams = [...terms[termIndex].children]
              exams[modalProps.examIndex] = {...obj}
              terms[termIndex] = {...terms[termIndex], children: [...exams]}
              setExamDetails({...examDetails, children: terms})
            }}
          />
        )
      }
      case EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC:
        return (
          <CoScholasticArea data={templateData} setData={setTemplateData} />
        )
      case EDIT_TEMPLATE_SECTIONS.SIGN_MANAGE:
        return <SignatureManage data={templateData} setData={setTemplateData} />
    }
  }

  const handleApplyButton = () => {
    switch (section) {
      case EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS: {
        eventHandler(
          EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS,
          EDIT_TEMPLATE_SECTIONS.STUDENT_DETAILS,
          templateData.params_student_details
        )
        let fetchParams1 = [...objToSave.template.fetch_params]
        let index = fetchParams1.findIndex(
          (item) => item.method_name === 'get_student_details'
        )
        let params = [...templateData.params_student_details]
        fetchParams1[index] = {...fetchParams1[index], params}
        setObjToSave({
          ...objToSave,
          template: {...objToSave.template, fetch_params: fetchParams1},
        })
        setData({...templateData})
        return
      }
      case SCHOLASTIC_BLOCKS.SUBJECTS: {
        eventHandler(
          EDIT_TEMPLATE_SECTIONS.SCHOLASTIC,
          SCHOLASTIC_BLOCKS.SUBJECTS,
          templateData.exm_str_tree.subject_map
        )
        let convertedData = convertExamStructure(
          JSON.parse(
            JSON.stringify({
              ...examDetails,
              common_subjects: templateData.exm_str_tree.subject_map,
              exam_types: templateData.exm_str_tree.exam_types,
            })
          ),
          templateData.grade_enabled,
          templateData.grading_visibility
        )
        setData({
          ...templateData,
          exm_str_tree: {...templateData.exm_str_tree, ...convertedData},
        })
        let exam_str = structureChangesForSubjects(
          templateData.exm_str_tree.subject_map,
          objToSave.scholastic.exam_str,
          objToSave.scholastic.exam_types,
          objToSave.scholastic.common_subjects.params
        )
        setObjToSave({
          ...objToSave,
          scholastic: {
            ...objToSave.scholastic,
            exam_str,
            common_subjects: {
              ...objToSave.scholastic.common_subjects,
              params: [...templateData.exm_str_tree.subject_map],
            },
          },
        })
        return
      }
      case SCHOLASTIC_BLOCKS.EXAM_TYPES: {
        eventHandler(
          EDIT_TEMPLATE_SECTIONS.SCHOLASTIC,
          SCHOLASTIC_BLOCKS.EXAM_TYPES,
          templateData.exm_str_tree.exam_types
        )
        let res = validationForExamTypes(templateData.exm_str_tree.exam_types)
        if (res?.error) {
          return res
        }
        setData({...templateData})
        let exam_str = examTypeChangesForSubjects(
          objToSave.scholastic.exam_str,
          templateData.exm_str_tree.exam_types
        )
        setObjToSave({
          ...objToSave,
          scholastic: {
            ...objToSave.scholastic,
            exam_str,
            exam_types: templateData.exm_str_tree.exam_types,
          },
        })
        return
      }
      case SCHOLASTIC_BLOCKS.GRADES: {
        let gradingCriteria = {...objToSave.scholastic.grading_criteria}
        gradingCriteria = {
          ...gradingCriteria,
          grades: templateData.grades,
          fail_enabled: templateData.fail_enabled,
          passing_grade: templateData.passing_grade,
        }
        let res = validationForGradeRange({...gradingCriteria})
        if (res?.error) {
          return res
        }
        eventHandler(
          EDIT_TEMPLATE_SECTIONS.SCHOLASTIC,
          SCHOLASTIC_BLOCKS.GRADES,
          gradingCriteria
        )
        setObjToSave({
          ...objToSave,
          scholastic: {
            ...objToSave.scholastic,
            grading_criteria: gradingCriteria,
          },
        })
        setData({
          ...templateData,
          exm_str_tree: {
            ...templateData.exm_str_tree,
            grading_desc: getGradingScale(gradingCriteria),
          },
        })
        return
      }
      case SCHOLASTIC_BLOCKS.MANAGE_EXAM: {
        const term = examDetails.children[modalProps.termIndex]
        const exam = term?.children[modalProps.examIndex]
        let res = validationForExam(exam.children)
        if (res?.error) {
          return res
        }
        eventHandler(
          EDIT_TEMPLATE_SECTIONS.SCHOLASTIC,
          SCHOLASTIC_BLOCKS.MANAGE_EXAM,
          examDetails
        )
        let convertedData = convertExamStructure(
          JSON.parse(
            JSON.stringify({
              ...examDetails,
              common_subjects: templateData.exm_str_tree.subject_map,
              exam_types: templateData.exm_str_tree.exam_types,
            })
          ),
          templateData.grade_enabled,
          templateData.grading_visibility
        )
        setData({
          ...templateData,
          exm_str_tree: {...templateData.exm_str_tree, ...convertedData},
        })
        setObjToSave({
          ...objToSave,
          scholastic: {
            ...objToSave.scholastic,
            exam_str: examDetails,
          },
        })
        return
      }
      case EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC: {
        if (templateData.show_co_scholastic) {
          let res = validateCoscholastic(templateData)
          if (res?.error) {
            return res
          }
        }
        let res = validateCoscholasticMandatory(templateData)
        if (res?.error) {
          return res
        }
        eventHandler(
          EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC,
          EDIT_TEMPLATE_SECTIONS.CO_SCHOLASTIC,
          templateData.cosch_subjects
        )
        let coScholasticObj = {
          cosch_subjects: templateData.cosch_subjects.filter(
            (item) => item.label.length
          ),
        }
        let obj = convertCoScholastic(
          {co_scholastic: coScholasticObj, scholastic: objToSave.scholastic},
          templateData.co_sch_details.co_scholastic_section_name
        )
        setData({...templateData, ...obj})
        let fetchParams = [...objToSave.template.fetch_params]
        let index = fetchParams.findIndex(
          (item) =>
            item.meta.template_section_id === TEMPLATE_SECTIONS_ID.CO_SCHOLASTIC
        )
        let params = [...fetchParams[index].params]
        let paramIndex = params.findIndex(
          (item) => item.id === 'co_scholastic_section_name'
        )
        params[paramIndex] = {
          ...params[paramIndex],
          value: templateData.co_sch_details.co_scholastic_section_name,
        }
        fetchParams[index] = {...fetchParams[index], params}
        setObjToSave({
          ...objToSave,
          co_scholastic: coScholasticObj,
          template: {...objToSave.template, fetch_params: fetchParams},
        })
        return
      }
      case EDIT_TEMPLATE_SECTIONS.SIGN_MANAGE: {
        let fetchParams = [...objToSave.template.fetch_params]
        let index = fetchParams.findIndex(
          (item) => item.method_name === 'get_signatures'
        )
        let arr = [...templateData.signature_arr]
        arr = arr.map((item) => {
          let tmp = templateData.params_signatures[item.id]
          return {
            ...item,
            checked: tmp.checked,
            label: tmp.label,
          }
        })
        if (templateData.show_signature) {
          let res = validateSignature(arr)
          if (res?.error) {
            return res
          }
        }
        eventHandler(
          EDIT_TEMPLATE_SECTIONS.SIGN_MANAGE,
          EDIT_TEMPLATE_SECTIONS.SIGN_MANAGE,
          arr
        )
        let params = arr
        fetchParams[index] = {...fetchParams[index], params}
        setObjToSave({
          ...objToSave,
          template: {
            ...objToSave.template,
            fetch_params: fetchParams,
          },
        })
        setData({...templateData, signature_arr: arr})
        return
      }
      default: {
        setData({...templateData})
      }
    }
  }

  return (
    <Modal
      classes={{content: styles.content}}
      isOpen={isOpen}
      actionButtons={[
        {
          body: 'Apply',
          isDisabled: disableApply,
          onClick: () => {
            let res = handleApplyButton()
            if (res?.error) {
              dispatch(showErrorToast(res.errorMsg))
            } else {
              onClose()
            }
          },
        },
      ]}
      shouldCloseOnOverlayClick={false}
      header={renderHeader()}
      onClose={onClose}
      size="m"
      {...(section === SCHOLASTIC_BLOCKS.GRADES
        ? {
            footerLeftElement: (
              <Para
                className={styles.infoPara}
                type={PARA_CONSTANTS.TYPE.TEXT_SECONDARY}
              >
                <Icon
                  name="info"
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                  version={ICON_CONSTANTS.VERSION.OUTLINED}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
                {t('marksInBetweenRanges')}
              </Para>
            ),
          }
        : null)}
    >
      {renderBody()}
    </Modal>
  )
}

export default ReportCardModal

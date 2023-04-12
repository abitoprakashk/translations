import {
  call,
  put,
  takeEvery,
  delay,
  race,
  take,
  select,
} from 'redux-saga/effects'
import {
  showErrorToast,
  // showSuccessToast,
} from '../../../../redux/actions/commonAction'
import {commonActionTypes} from '../../../../redux/actionTypes'
import {
  POLLING_TIMELIMIT,
  DELAY_BETWEEN_POLLS,
  EVALUATION_TYPE,
  EVALUATION_DURATION_TYPE,
} from '../constants'
import * as Api from '../apiService'
import ACTIONS from './actionTypes'
import {t} from 'i18next'

function* getTemplates() {
  try {
    const res = yield call(Api.getTemplateList)
    if (res.status) {
      yield put({
        type: ACTIONS.REPORT_CARD_TEMPLATE_SUCCESS,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      if (res.error_code === 7012) {
        error = 'Invalid Data'
      }
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchGetReportCardTemplates() {
  yield takeEvery(ACTIONS.REPORT_CARD_TEMPLATE_REQUEST, getTemplates)
}

function* getTemplateFields(action) {
  yield put({
    type: commonActionTypes.SHOW_LOADING,
    payload: true,
  })
  try {
    const res = yield call(Api.getTemplateFieldList, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.TEMPLATE_FILEDS_REQUEST_SUCCESSFUL,
        payload: res.obj,
      })
    } else {
      let error = 'Unable to fetch the template details'
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
  yield put({
    type: commonActionTypes.SHOW_LOADING,
    payload: false,
  })
}

export function* watchGetReportCardTemplateFields() {
  yield takeEvery(ACTIONS.TEMPLATE_FILEDS_REQUEST, getTemplateFields)
}

function* generateTemplate(action) {
  yield put({
    type: commonActionTypes.SHOW_LOADING,
    payload: true,
  })
  try {
    const res = yield call(Api.generateTemplate, action.payload)
    if (res.status) {
      if (!action.payload.preview) {
        yield put({
          type: ACTIONS.TEMPLATE_FILEDS_UPDATE_SUCCESSFUL,
          payload: true,
        })
      } else {
        yield put({
          type: ACTIONS.TEMPLATE_FILEDS_REQUEST_SUCCESSFUL,
          payload: res.obj,
        })
      }
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
  yield put({
    type: commonActionTypes.SHOW_LOADING,
    payload: false,
  })
}

export function* watchGenerateReportCardTemplate() {
  yield takeEvery(ACTIONS.GENERATE_TEMPLATE_REQUEST, generateTemplate)
}

function* generateReportCards(action) {
  try {
    const res = yield call(Api.generateReportCards, action.payload)
    if (res.status) {
      yield* startPollingSaga({
        payload: {
          request_id: res.obj,
          section_id: action.payload.section_id,
        },
      })
    } else {
      let error = t('somethingWentWrong')
      if (res.msg) error = res.msg
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchGenerateReportCardsForAClass() {
  yield takeEvery(ACTIONS.GENERATE_REPORT_CARDS_REQUEST, generateReportCards)
}

function* startPollingSaga(action) {
  const {timeout} = yield race({
    response: call(pollingForReportCard, action),
    cancel: take(ACTIONS.STOP_POLLING),
    timeout: delay(POLLING_TIMELIMIT),
  })
  if (timeout) {
    yield put({type: ACTIONS.POLLING_TIMEOUT})
  }
}

function* pollingForReportCard(action) {
  try {
    const params = {request_id: action.payload.request_id}
    let reportGenerated = false
    while (!reportGenerated) {
      yield delay(DELAY_BETWEEN_POLLS)
      const res = yield call(Api.pollingAPI, params)
      if (res.status) {
        if (res?.obj?.length && res.obj[0].status) {
          reportGenerated = true
          yield put({
            type: ACTIONS.GET_STUDENT_LIST_REQUEST,
            payload: {section_id: action.payload.section_id},
          })
        }
      } else {
        reportGenerated = true
        let error = t('somethingWentWrong')
        yield put(showErrorToast(error))
      }
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getStudents(action) {
  try {
    const res = yield call(Api.getStudents, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.STUDENT_LIST_SUCCESSFUL,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getSectionEvaluationStructure(action) {
  try {
    const res = yield call(Api.sectionEvaluationStructure, action.payload)

    if (res.status) {
      yield put({
        type: ACTIONS.GET_SECTION_EVALUATION_STRUCTURE_SUCCESS,
        payload: res.obj,
      })
    } else {
      let error = 'Something went wrong'
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getTermEvaluationDetails(action) {
  const payload = action.payload
  const {term_id, ...rest} = payload

  try {
    const scholastic = payload.evaluation_type == EVALUATION_TYPE.SCHOLASTIC
    const res = yield call(Api.sectionEvaluationCount, {
      ...rest,
      ...(scholastic ? {term_id} : {}),
    })

    if (res.status) {
      let formatData = {}

      if (scholastic) {
        formatData = res.obj.data.reduce((acc, curr) => {
          if (!acc[curr.test_id]) {
            acc[curr.test_id] = {
              testName: `Exam - ${curr.test_name}`,
              testId: curr.test_id,
              subjects: [],
            }
          }
          acc[curr.test_id].subjects.push({
            ...curr,
            class_id: rest.class_id,
            section_id: rest.section_id,
            section_name: res.obj.section_name,
            class_name: res.obj.standard_name,
          })
          return acc
        }, {})
      } else {
        const {activeStandard, activeSection} = yield select(
          (state) => state.reportCard
        )
        formatData = Object.entries(res.obj.others || {}).reduce(
          (acc, [testName, curr]) => {
            if (!acc[testName]) {
              const overall = [curr[EVALUATION_DURATION_TYPE.OVERALL]]
              const term = curr[EVALUATION_DURATION_TYPE.TERM]
              const month = curr[EVALUATION_DURATION_TYPE.MONTH]
              const evaluationDurationType = Object.keys(curr)[0]

              const DURATION_TYPE_ID = {
                [EVALUATION_DURATION_TYPE.OVERALL]: () => 'overall_id',
                [EVALUATION_DURATION_TYPE.TERM]: (item) => item.term_id,
                [EVALUATION_DURATION_TYPE.MONTH]: (item) => item.month_id,
              }

              acc[testName] = {
                testName: testName.replace('_', '-'),
                testId: testName,
                subjects:
                  (month || term || overall)?.map((item) => ({
                    ...item,
                    [evaluationDurationType]: true,
                    duration_type: evaluationDurationType,
                    duration_type_id:
                      DURATION_TYPE_ID[evaluationDurationType](item),
                    term_name: item.term_name || 'Overall',
                    month_name: item.month_name || 'Overall',
                    class_id: rest.class_id,
                    section_id: rest.section_id,
                    section_name: activeSection.name,
                    class_name: activeStandard.name,
                    teacher: res.obj.class_teacher,
                  })) || [],
              }
            }
            return acc
          },
          {}
        )
      }

      const coScholasticOrder = {
        'co-scholastic': 0,
        attendance: 1,
        remarks: 2,
        results: 3,
      }

      yield put({
        type: ACTIONS.GET_TERM_EVALUATION_DETAILS_SUCCESS,
        payload: {
          term_id,
          section_id: rest.section_id,
          testData: scholastic
            ? Object.values(formatData)
            : Object.values(formatData).sort(
                (a, b) =>
                  coScholasticOrder[a.testName] - coScholasticOrder[b.testName]
              ),
          section_name: res.obj.section_name,
          class_name: res.obj.standard_name,
        },
      })
    } else {
      yield put({
        type: ACTIONS.GET_TERM_EVALUATION_DETAILS_ERROR,
        payload: {term_id, section_id: rest.section_id},
      })
      let error = 'Something went wrong'
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put({
      type: ACTIONS.GET_TERM_EVALUATION_DETAILS_ERROR,
      payload: {term_id, section_id: rest.section_id},
    })
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

export function* watchGetStudentsOfSection() {
  yield takeEvery(ACTIONS.GET_STUDENT_LIST_REQUEST, getStudents)
  yield takeEvery(
    ACTIONS.GET_SECTION_EVALUATION_STRUCTURE,
    getSectionEvaluationStructure
  )
  yield takeEvery(ACTIONS.GET_TERM_EVALUATION_DETAILS, getTermEvaluationDetails)
}

function* validateCSV(action) {
  try {
    const res = yield call(Api.validateCSV, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.GET_VALIDATE_RESPONSE,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
      yield put({
        type: ACTIONS.VALIDATE_RESPONSE_FAILED,
      })
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchValidateCSVdata() {
  yield takeEvery(ACTIONS.VALIDATE_CSV_DATA, validateCSV)
}

function* downloadCurrentMarksheet(action) {
  try {
    const res = yield call(Api.getCSVCurrentMarksheet, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.CURRENT_MARKSHEET_CSV_SUCCESSFUL,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchDownloadCurrentMarksheet() {
  yield takeEvery(
    ACTIONS.DOWNLOAD_CSV_CURRENT_MARKSHEET,
    downloadCurrentMarksheet
  )
}

function* downloadErrorMarksheet(action) {
  try {
    const res = yield call(Api.sendErroValidationResultBack, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.ERROR_MARKSHEET_CSV_SUCCESSFUL,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchDownloadErrorMarksheet() {
  yield takeEvery(
    ACTIONS.DOWNLOAD_CSV_WITH_ERROR_MARKSHEET,
    downloadErrorMarksheet
  )
}

function* updateMarksFromCSV(action) {
  try {
    const res = yield call(Api.updateMarksFromCSV, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.UPDATE_MARKS_FROM_CSV_SUCCESSFUL,
        payload: true,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchUpdateMarksFromCSV() {
  yield takeEvery(ACTIONS.UPDATE_MARKS_FROM_CSV, updateMarksFromCSV)
}

function* getStudentExamStructure(action) {
  try {
    const res = yield call(Api.getSectionExamStructure, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.STUDENT_EXAM_STRUCTURE_SUCCESS,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchStudentExamStructure() {
  yield takeEvery(ACTIONS.GET_STUDENT_EXAM_STRUCTURE, getStudentExamStructure)
}

function* getExamMarksDetails(action) {
  try {
    const res = yield call(Api.getStudentExamMarks, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.UPDATE_EXAM_MARKS_DETAILS,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchGetExamMarksDetails() {
  yield takeEvery(ACTIONS.GET_EXAM_MARKS_DETAILS, getExamMarksDetails)
}

function* saveAsDraft(action) {
  try {
    const res = yield call(Api.saveAsDraftOrPublish, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.SAVE_AS_DRAFT_SUCCESSFUL,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
      yield put({
        type: ACTIONS.SAVE_AS_DRAFT_FAILED,
      })
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
    yield put({
      type: ACTIONS.SAVE_AS_DRAFT_FAILED,
    })
  }
}

export function* watchSaveAsDraftReportCardTemplate() {
  yield takeEvery(ACTIONS.SAVE_AS_DRAFT_REQUEST, saveAsDraft)
}

function* publishTemplate(action) {
  try {
    const res = yield call(Api.saveAsDraftOrPublish, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.PUBLISH_TEMPLATE_SUCCESSFUL,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchPublishReportCardTemplate() {
  yield takeEvery(ACTIONS.PUBLISH_TEMPLATE_REQUEST, publishTemplate)
}

function* getStudentFields(action) {
  try {
    const res = yield call(Api.getStudentDetailFields, action.payload)
    if (res.status) {
      yield put({
        type: ACTIONS.GET_STUDENT_FIELDS_SUCCESSFUL,
        payload: res.obj,
      })
    } else {
      let error = t('somethingWentWrong')
      yield put(showErrorToast(error))
    }
  } catch (e) {
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchGetStudentFields() {
  yield takeEvery(ACTIONS.GET_STUDENT_FIELDS_REQUEST, getStudentFields)
}

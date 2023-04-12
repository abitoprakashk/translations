import {call, put, select, takeEvery} from 'redux-saga/effects'

import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../CustomCertificate.api'
import globalActions from '../../../redux/actions/global.actions'
import {t} from 'i18next'
import {templatePageSettingsActions} from '../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {toCamelCasedKeysRecursive} from '../../../utils/Helpers'
import {replaceInstituteFields} from '../../../components/TemplateGenerator/TemplateGenerator.utils'

const instituteData = (store) => store.globalData?.templateFields?.data

function* getTemplatePreview(payload) {
  try {
    const res = yield call(Api.getTemplatePreview, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(
        globalActions.customTemplatePreview.success(
          `${res?.data?.obj}?timestamp=${+new Date()}`
        )
      )
    } else {
      yield put(
        globalActions.customTemplatePreview.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put()
      showErrorToast(t('fetchPostsListErrorToast'))
    }
  } catch (e) {
    globalActions.customTemplatePreview.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* saveTemplate(payload) {
  try {
    const res = yield call(Api.saveTemplate, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.saveDocumentTemplate.success(res?.data?.obj))
      payload?.successAction()
    } else {
      yield put(
        globalActions.saveDocumentTemplate.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.saveDocumentTemplate.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getAllTemplates() {
  try {
    const res = yield call(Api.getAllTemplates)
    const {status} = res?.data
    if (status == true) {
      const data = {student: [], staff: []}
      if (res.data?.obj?.length) {
        res.data.obj.forEach((item) => {
          if (item.user_type === 'STUDENT') data.student.push(item)
          else data.staff.push(item)
        })
      }
      yield put(globalActions.templateList.success(data))
    } else {
      yield put(
        globalActions.templateList.failure(t('fetchPostsListErrorToast'))
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.templateList.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getTemplateDetails(payload) {
  try {
    const res = yield call(Api.getTemplateDetails, payload?.data)
    const {status} = res.data
    if (status == true) {
      const {obj} = res.data
      const {fields} = obj.template
      yield put(globalActions.templateDetails.success(res?.data?.obj))
      let data = toCamelCasedKeysRecursive(res?.data?.obj)
      let body = ''
      if (data.default) {
        const instituteValues = yield select(instituteData)
        body = replaceInstituteFields(
          data.template.body,
          data.template.fields.INSTITUTE,
          instituteValues?.staff?.data?.INSTITUTE
        )
      }
      data.template.body = body ? body : data.template?.body
      data.template.fields = fields
      yield put({
        type: templatePageSettingsActions.SET_TEMPLATE,
        payload: {_id: obj._id, default: obj.default, ...data.template},
      })
      payload?.successAction && payload.successAction()
    } else {
      yield put(
        globalActions.templateDetails.failure(t('fetchPostsListErrorToast'))
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.templateDetails.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* updateTemplate(payload) {
  try {
    const res = yield call(Api.updateTempate, payload?.data)
    const {status} = res.data
    if (status == true) {
      if (payload?.data?.isUpdate) {
        yield put(
          showSuccessToast(
            t(
              payload?.data?.status === 'ACTIVE'
                ? 'customCertificate.unArchiveSuccess'
                : 'customCertificate.archiveSuccess'
            )
          )
        )
      }
      yield put(globalActions.updateDocumentTemplate.success(res?.data?.status))
      payload?.successAction()
    } else {
      yield put(
        globalActions.updateDocumentTemplate.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.updateDocumentTemplate.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getStaffList() {
  try {
    const res = yield call(Api.getStaffList)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.staffList.success(res?.data?.obj))
    } else {
      yield put(globalActions.staffList.failure(t('fetchPostsListErrorToast')))
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.staffList.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getFieldValuesForTemplate(payload) {
  const res = yield call(Api.getFieldValuesForTemplate, payload?.data)
  const {status} = res.data
  if (status == true) {
    yield put(globalActions.customTemplateFieldValues.success(res?.data?.obj))
  } else {
    yield put(
      globalActions.customTemplateFieldValues.failure(
        t('fetchPostsListErrorToast')
      )
    )
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* generateCertificate(payload) {
  const res = yield call(Api.generateSingleCertificate, payload?.data)
  const {status} = res.data
  if (status == true) {
    yield put(globalActions.generateSingleCertificate.success(res?.data?.obj))
  } else {
    const {msg, error_code} = res?.data
    yield put(globalActions.generateSingleCertificate.failure(msg))
    if (error_code && error_code === 7301) {
      yield put(showErrorToast(t('customCertificate.inactiveFields')))
    }
  }
}

function* getGeneratedDocumentStatus(payload) {
  const res = yield call(Api.getGeneratedDocumentStatus, payload?.data)
  const {status} = res.data
  if (status == true) {
    yield put(globalActions.generatedDocumentStatus.success(res?.data?.obj))
  } else {
    yield put(
      globalActions.generatedDocumentStatus.failure(
        t('fetchPostsListErrorToast')
      )
    )
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getGeneratedDocuments(payload) {
  try {
    const res = yield call(Api.getAllGeneratedDocs, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.generatedDocuments.success(res?.data?.obj))
    } else {
      yield put(
        globalActions.generatedDocuments.failure(t('fetchPostsListErrorToast'))
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.generatedDocuments.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* bulkGenerate(payload) {
  try {
    const res = yield call(Api.bulkGenerate, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.bulkCertificateGenerate.success(res?.data?.obj))
    } else {
      const {msg, error_code} = res?.data
      yield put(globalActions.generateSingleCertificate.failure(msg))
      if (error_code && error_code === 7301) {
        yield put(showErrorToast(t('customCertificate.inactiveFields')))
      }
    }
  } catch (e) {
    globalActions.bulkCertificateGenerate.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getDefaultTemplatePreview(payload) {
  try {
    const res = yield call(Api.getDefaultTemplatePreview, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.defaultTemplatePreview.success(res?.data?.obj))
    } else {
      yield put(
        globalActions.defaultTemplatePreview.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.defaultTemplatePreview.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchCustomTemplatePreview() {
  yield takeEvery(
    globalActions.customTemplatePreview.REQUEST,
    getTemplatePreview
  )
  yield takeEvery(globalActions.templateList.REQUEST, getAllTemplates)
  yield takeEvery(globalActions.saveDocumentTemplate.REQUEST, saveTemplate)
  yield takeEvery(globalActions.templateDetails.REQUEST, getTemplateDetails)
  yield takeEvery(globalActions.updateDocumentTemplate.REQUEST, updateTemplate)
  yield takeEvery(globalActions.staffList.REQUEST, getStaffList)
  yield takeEvery(
    globalActions.customTemplateFieldValues.REQUEST,
    getFieldValuesForTemplate
  )
  yield takeEvery(
    globalActions.generateSingleCertificate.REQUEST,
    generateCertificate
  )
  yield takeEvery(
    globalActions.generatedDocumentStatus.REQUEST,
    getGeneratedDocumentStatus
  )
  yield takeEvery(
    globalActions.generatedDocuments.REQUEST,
    getGeneratedDocuments
  )
  yield takeEvery(globalActions.bulkCertificateGenerate.REQUEST, bulkGenerate)
  yield takeEvery(
    globalActions.defaultTemplatePreview.REQUEST,
    getDefaultTemplatePreview
  )
}

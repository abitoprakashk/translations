import {
  call,
  delay,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../redux/actions/commonAction'
import * as Api from '../CustomId.apis'
import globalActions from '../../../redux/actions/global.actions'
import {t} from 'i18next'
import {templatePageSettingsActions} from '../../../components/TemplateGenerator/redux/TemplateGenerator.actionTypes'
import {toCamelCasedKeysRecursive} from '../../../utils/Helpers'
import {replaceInstituteFields} from '../../../components/TemplateGenerator/TemplateGenerator.utils'
import {COMPLETED} from '../CustomId.constants'

export const CANCEL_BULK_ID_STATUS_POLLING = 'CancelBuStatusPolling'

const instituteData = (store) => store.globalData?.templateFields?.data
const idCardCheckoutPreviewUrls = (store) =>
  store.globalData?.idCardCheckoutPreviewUrls?.data || {
    staff: [],
    student: [],
  }
function* getTemplatePreview(payload) {
  try {
    const res = yield call(Api.getTemplatePreview, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(
        globalActions.customIdPreview.success(
          `${res?.data?.obj}?timestamp=${+new Date()}`
        )
      )
    } else {
      yield put(
        globalActions.customIdPreview.failure(t('fetchPostsListErrorToast'))
      )
      yield put()
      showErrorToast(t('fetchPostsListErrorToast'))
    }
  } catch (e) {
    globalActions.customIdPreview.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* saveTemplate(payload) {
  try {
    const res = yield call(Api.saveTemplate, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.saveCustomIdTemplate.success(res?.data?.obj))
      payload?.successAction()
    } else {
      yield put(
        globalActions.saveCustomIdTemplate.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.saveCustomIdTemplate.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getAllIdTemplates() {
  try {
    const res = yield call(Api.getAllIdTemplates)
    const {status} = res?.data
    if (status == true) {
      const data = {student: [], staff: []}
      let studentSelectedTemplate, staffSelectedTemplate
      if (res.data?.obj?.length) {
        res.data.obj.forEach((item) => {
          if (item.user_type === 'STUDENT') {
            if (item.selected) studentSelectedTemplate = item
            else data.student.push(item)
          } else {
            if (item.selected) staffSelectedTemplate = item
            else data.staff.push(item)
          }
        })
        studentSelectedTemplate && data.student.unshift(studentSelectedTemplate)
        staffSelectedTemplate && data.staff.unshift(staffSelectedTemplate)
      }

      yield put(globalActions.customIdTemplateList.success(data))
    } else {
      yield put(
        globalActions.customIdTemplateList.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.customIdTemplateList.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getTemplateDetails(payload) {
  try {
    const res = yield call(Api.getTemplateDetails, payload?.data)
    const {status} = res.data
    if (status == true) {
      const {obj} = res.data
      let data = toCamelCasedKeysRecursive(res?.data?.obj, 'fields')
      yield put(globalActions.customIdTemplateDetails.success(data))

      data.frontTemplate.pageSettings.design = data.design
      if (data?.backTemplate)
        data.backTemplate.pageSettings.design = data.design

      if (data.default) {
        const instituteValues = yield select(instituteData)
        const frontTemplateBody = replaceInstituteFields(
          data.frontTemplate.body,
          data.frontTemplate.fields.INSTITUTE,
          instituteValues?.staff?.data?.INSTITUTE
        )
        data.frontTemplate.body = frontTemplateBody
        if (data?.backTemplate) {
          const backTemplateBody = replaceInstituteFields(
            data.backTemplate.body,
            data.backTemplate.fields.INSTITUTE,
            instituteValues?.staff?.data?.INSTITUTE
          )
          data.backTemplate.body = backTemplateBody
        }
      }
      yield put({
        type: templatePageSettingsActions.SET_TEMPLATE,
        payload: {
          _id: obj._id,
          default: obj?.default,
          ...data.frontTemplate,
        },
      })
      payload?.successAction && payload.successAction()
    } else {
      yield put(
        globalActions.customIdTemplateDetails.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.customIdTemplateDetails.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* updateCustomIdTemplate(payload) {
  try {
    const res = yield call(Api.updateCustomIdTemplate, payload?.data)
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
      yield put(globalActions.updateCustomIdTemplate.success(res?.data?.status))
      payload?.successAction?.()
    } else {
      yield put(
        globalActions.updateCustomIdTemplate.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.updateCustomIdTemplate.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* generateSingleIdCard(payload) {
  try {
    const res = yield call(Api.generateSingleIdCard, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(
        globalActions.generateSingleIdCard.success(res?.data?.obj?.file?.url)
      )
    } else {
      const {msg, error_code} = res?.data
      yield put(globalActions.generateSingleIdCard.failure(msg))
      if (error_code && error_code === 7301) {
        yield put(showErrorToast(t('customCertificate.inactiveFields')))
      }
    }
  } catch (e) {
    globalActions.generateSingleIdCard.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* bulkGeneratedIDCardStatus(payload) {
  const res = yield call(Api.getbulkGeneratedIDCardStatus, payload?.data)
  const {status} = res.data
  if (status == true) {
    yield put(globalActions.bulkGeneratedIDCardStatus.success(res?.data?.obj))
  } else {
    yield put(
      globalActions.bulkGeneratedIDCardStatus.failure(
        t('fetchPostsListErrorToast')
      )
    )
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* generateBulkIdCardSaga(payload) {
  try {
    const res = yield call(Api.generateBulkIdCard, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.generateBulkIdCard.success(res?.data?.obj))
    } else {
      const {msg, error_code} = res?.data
      yield put(globalActions.generateBulkIdCard.failure(msg))
      if (error_code && error_code === 7301) {
        yield put(showErrorToast(t('customCertificate.inactiveFields')))
      }
    }
  } catch (e) {
    globalActions.generateBulkIdCard.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* generatedIdCardListSaga(payload) {
  try {
    const res = yield call(Api.getGeneratedIdCardList, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.generatedIdCardList.success(res?.data?.obj))
    } else {
      const {msg} = res?.data
      yield put(globalActions.generatedIdCardList.failure(msg))
    }
  } catch (e) {
    globalActions.generatedIdCardList.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getDefaultIdTemplatePreview(payload) {
  try {
    const res = yield call(Api.getDefaultIdTemplatePreview, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(
        globalActions.customIdDefaultPreview.success(
          `${res?.data?.obj}?timestamp=${+new Date()}`
        )
      )
    } else {
      yield put(
        globalActions.customIdDefaultPreview.failure(
          t('fetchPostsListErrorToast')
        )
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.customIdDefaultPreview.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}
function* setActiveTemplate(payload) {
  try {
    const res = yield call(Api.setActiveTemplate, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.setActiveTemplate.success(res?.data?.obj))
      payload?.successAction?.()
    } else {
      yield put(
        globalActions.setActiveTemplate.failure(t('fetchPostsListErrorToast'))
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.setActiveTemplate.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* generateIdCardsForCheckoutRequestId(payload) {
  try {
    const res = yield call(Api.generateBulkIdCard, payload?.data)
    const {status} = res.data

    if (status == true) {
      yield put(
        globalActions.idCardCheckoutPreviewUrls.request({
          requestId: res?.data?.obj,
          userType: payload?.data?.userType,
          successAction: payload.successAction,
        })
      )
    } else {
      const {msg, error_code} = res?.data
      yield put(globalActions.generateBulkIdCard.failure(msg))
      if (error_code && error_code === 7301) {
        yield put(showErrorToast(t('customCertificate.inactiveFields')))
      }
    }
  } catch (e) {
    globalActions.generateBulkIdCard.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* getIDCardsCheckoutPreview({data: json}) {
  yield race({
    // Start the polling worker
    task: call(pollIDCardsCheckoutPreview, json),
    // Start a take effect waiting for the cancel action.
    cancel: take(CANCEL_BULK_ID_STATUS_POLLING),
  })
}

function* idCardAccessoriesConfigSaga(payload) {
  try {
    const res = yield call(Api.getIdCardAccessoriesConfig, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.idCardAccessoriesConfig.success(res?.data?.obj))
    } else {
      const {msg} = res?.data
      yield put(globalActions.idCardAccessoriesConfig.failure(msg))
    }
  } catch (e) {
    globalActions.generateBulkIdCard.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* pollIDCardsCheckoutPreview(json) {
  while (true) {
    try {
      const res = yield call(Api.getbulkGeneratedIDCardStatus, [json.requestId])
      if (res.status && res?.data?.obj && res?.data?.obj?.length) {
        if (res?.data?.obj?.[0]?.file.status === COMPLETED) {
          const bulkPreviewUrls = yield select(idCardCheckoutPreviewUrls)
          bulkPreviewUrls[json.userType].push(res.data.obj[0].file.url)
          yield put(
            globalActions.idCardCheckoutPreviewUrls.success(bulkPreviewUrls)
          )
          json?.successAction()
          yield put({type: CANCEL_BULK_ID_STATUS_POLLING})
        }
      } else {
        yield put({type: CANCEL_BULK_ID_STATUS_POLLING})
      }
      yield delay(2000)
    } catch (error) {
      yield put({type: CANCEL_BULK_ID_STATUS_POLLING})
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  }
}

function* getIDCardOrderHistory(payload) {
  try {
    const res = yield call(Api.getIDCardOrderHistory, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.getIDCardOrderHistory.success(res?.data?.obj))
    } else {
      throw ''
    }
  } catch (e) {
    globalActions.getIDCardOrderHistory.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* idCardOrderCheckoutSaga(payload) {
  try {
    const res = yield call(Api.idCardOrderCheckout, payload?.data)
    const {status} = res.data
    if (status == true) {
      yield put(globalActions.idCardOrderCheckout.success(res?.data?.obj))
    } else {
      const {msg} = res?.data
      yield put(showErrorToast(msg))
      yield put(globalActions.idCardOrderCheckout.failure(msg))
    }
  } catch (e) {
    globalActions.generateBulkIdCard.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

export function* watchCustomIdSaga() {
  yield takeEvery(globalActions.customIdPreview.REQUEST, getTemplatePreview)
  yield takeEvery(globalActions.customIdTemplateList.REQUEST, getAllIdTemplates)
  yield takeEvery(globalActions.saveCustomIdTemplate.REQUEST, saveTemplate)
  yield takeEvery(
    globalActions.customIdTemplateDetails.REQUEST,
    getTemplateDetails
  )
  yield takeEvery(
    globalActions.updateCustomIdTemplate.REQUEST,
    updateCustomIdTemplate
  )
  yield takeEvery(
    globalActions.generateSingleIdCard.REQUEST,
    generateSingleIdCard
  )
  yield takeEvery(
    globalActions.bulkGeneratedIDCardStatus.REQUEST,
    bulkGeneratedIDCardStatus
  )
  yield takeEvery(
    globalActions.generateBulkIdCard.REQUEST,
    generateBulkIdCardSaga
  )
  yield takeEvery(
    globalActions.generatedIdCardList.REQUEST,
    generatedIdCardListSaga
  )
  yield takeEvery(
    globalActions.customIdDefaultPreview.REQUEST,
    getDefaultIdTemplatePreview
  )
  yield takeEvery(globalActions.setActiveTemplate.REQUEST, setActiveTemplate)
  yield takeEvery(
    globalActions.generateIdCardsForCheckoutRequestId.REQUEST,
    generateIdCardsForCheckoutRequestId
  )
  yield takeEvery(
    globalActions.idCardCheckoutPreviewUrls.REQUEST,
    getIDCardsCheckoutPreview
  )

  yield takeEvery(
    globalActions.getIDCardOrderHistory.REQUEST,
    getIDCardOrderHistory
  )

  yield takeEvery(
    globalActions.idCardAccessoriesConfig.REQUEST,
    idCardAccessoriesConfigSaga
  )
  yield takeEvery(
    globalActions.idCardOrderCheckout.REQUEST,
    idCardOrderCheckoutSaga
  )
}

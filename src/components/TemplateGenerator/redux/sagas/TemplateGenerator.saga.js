import {call, put, takeEvery} from 'redux-saga/effects'
import {Trans} from 'react-i18next'
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../redux/actions/commonAction'
import * as Api from '../../TemplateGenerator.api'
import globalActions from '../../../../redux/actions/global.actions'
import {t} from 'i18next'
import {STAFF, STUDENT} from '../../TemplateGenerator.constants'

// Messages translation
const somethingWentWrongPleaseCheckYourNetwork = (
  <Trans i18nKey={'fetchPostsListErrorToast'}>
    Something went wrong, please check your network
  </Trans>
)

const certificateBgImgDeleteSuccessfullyMsg = (
  <Trans i18nKey={'imageDeleteSuccessfullyMsg'}>
    Image deleted successfully
  </Trans>
)

function* getImageSignedUrl(payload) {
  try {
    const res = yield call(Api.getImageSignedUrl, {
      type: payload?.data?.type,
      module: payload?.data?.module,
    })
    const {status} = res.data
    if (status) {
      yield put(
        globalActions.getDocumentImageUploadSignedUrl.success(res?.data?.obj)
      )
      payload.successAction({
        ...res?.data?.obj,
        file: payload?.data?.file,
      })
    } else {
      yield put(
        globalActions.getDocumentImageUploadSignedUrl.failure(
          'Something went wrong, please check your network'
        )
      )
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    globalActions.getDocumentImageUploadSignedUrl.failure(
      'Something went wrong, please check your network'
    )
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* storePublicUrlInDB(payload) {
  try {
    const res = yield call(Api.storePublicUrlInDB, payload?.data)
    const {status} = res.data
    if (status) {
      yield put(globalActions.storePublicUrlInDB.success(res?.data?.obj))
      payload.successAction()
    } else {
      yield put(
        globalActions.storePublicUrlInDB.failure(
          'Something went wrong, please check your network'
        )
      )
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    globalActions.storePublicUrlInDB.failure(
      'Something went wrong, please check your network'
    )
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getImageDirectory(payload) {
  try {
    const res = yield call(Api.getImageDirectory, {
      type: payload?.data?.type,
      module: payload?.data?.module,
    })
    const {status} = res.data
    if (status) {
      yield put(globalActions.getImageDirectory.success(res?.data?.obj))
    } else {
      yield put(
        globalActions.getImageDirectory.failure(
          'Something went wrong, please check your network'
        )
      )
      yield put(
        showErrorToast('Something went wrong, please check your network')
      )
    }
  } catch (e) {
    globalActions.getImageDirectory.failure(
      'Something went wrong, please check your network'
    )
    yield put(showErrorToast('Something went wrong, please check your network'))
  }
}

function* getTemplateFields(payload) {
  try {
    const staffFields = yield call(Api.getTemplateFields, {
      type: STAFF,
      module: payload.data,
    })
    const studentFields = yield call(Api.getTemplateFields, {
      type: STUDENT,
      module: payload.data,
    })
    const {status: staffFieldsStatus} = staffFields?.data
    const {status: studentFieldsStatus} = studentFields?.data

    if (staffFieldsStatus && studentFieldsStatus) {
      yield put(
        globalActions.templateFields.success({
          staff: {
            data: staffFields?.data?.obj,
            fieldMap: {
              INSTITUTE: {
                displayName: t('instituteDetails'),
                type: 'static',
                displayField: 'value',
              },
              IMIS: {
                displayName: t('staffDetails'),
                type: 'dynamic',
                displayField: 'name',
              },
            },
          },
          student: {
            data: studentFields?.data?.obj,
            fieldMap: {
              INSTITUTE: {
                displayName: t('instituteDetails'),
                type: 'static',
                displayField: 'value',
              },
              IMIS: {
                displayName: t('studentDetails'),
                type: 'dynamic',
                displayField: 'name',
              },
            },
          },
        })
      )
    } else {
      yield put(
        globalActions.templateFields.failure(t('fetchPostsListErrorToast'))
      )
      yield put(showErrorToast(t('fetchPostsListErrorToast')))
    }
  } catch (e) {
    globalActions.templateFields.failure(t('fetchPostsListErrorToast'))
    yield put(showErrorToast(t('fetchPostsListErrorToast')))
  }
}

function* deleteTemplateGeneratorImage(payload) {
  try {
    const response = yield call(Api.deleteCertiBackgroundImage, {
      imgId: payload?.data?.id,
      module: payload?.data?.module,
    })
    if (response?.data?.status) {
      yield put(
        globalActions.templateGeneratorImageDelete.success(response?.data?.obj)
      )
      payload?.successAction()
      yield put(showSuccessToast(certificateBgImgDeleteSuccessfullyMsg))
    } else {
      yield put(showErrorToast(response?.data?.msg))
    }
  } catch (error) {
    payload?.failureAction?.()
    yield put(globalActions.templateGeneratorImageDelete.failure(error.message))
    yield put(showErrorToast(error || somethingWentWrongPleaseCheckYourNetwork))
  }
}

export function* watchTemplateFunctions() {
  yield takeEvery(
    globalActions.getDocumentImageUploadSignedUrl.REQUEST,
    getImageSignedUrl
  )
  yield takeEvery(globalActions.storePublicUrlInDB.REQUEST, storePublicUrlInDB)
  yield takeEvery(globalActions.getImageDirectory.REQUEST, getImageDirectory)
  yield takeEvery(globalActions.templateFields.REQUEST, getTemplateFields)
  yield takeEvery(
    globalActions.templateGeneratorImageDelete.REQUEST,
    deleteTemplateGeneratorImage
  )
}

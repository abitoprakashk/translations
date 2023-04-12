import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import instituteDefaultImg from '../../../assets/images/icons/sidebar/institute-default.svg'
import {
  showEditInstituteDetailsPopupAction,
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {utilsAddInstituteLogo} from '../../../routes/login'
import {
  utilsGetInstituteList,
  utilsUpdateInstituteInfo,
} from '../../../routes/dashboard'
import {
  getScreenWidth,
  getUpdatedInstituteInfoFromInstituteList,
} from '../../../utils/Helpers'
import {instituteInfoAction} from '../../../redux/actions/instituteInfoActions'
import ImageInput from '../../Common/ImageInput/ImageInput'
import CreatePopupCard from '../../Common/CreatePopupCard/CreatePopupCard'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'
import {ROLE_ID} from '../../../constants/permission.constants'

export default function EditInstitute() {
  const [instituteName, setInstituteName] = useState('')
  const [instituteLogo, setInstituteLogo] = useState(null)
  const {instituteInfo, currentAdminInfo} = useSelector((state) => state)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    if (instituteInfo) {
      setInstituteName(instituteInfo.name)
    }
  }, [instituteInfo])

  const inputFields = [
    {
      title: t('instituteName'),
      value: instituteName,
      onChange: setInstituteName,
      disabled: currentAdminInfo?.role_ids.includes(ROLE_ID.SUPER_ADMIN)
        ? false
        : true,
    },
  ]

  const closeEditInstitutePopup = () =>
    dispatch(showEditInstituteDetailsPopupAction(false))

  const getInputForm = (
    <>
      <div className="bg-white flex justify-center items-center p-4 lg:pt-8">
        <ImageInput
          instituteLogo={instituteLogo}
          instituteOldLogo={
            instituteInfo && instituteInfo.ins_logo
              ? instituteInfo.ins_logo
              : instituteDefaultImg
          }
          setInstituteLogo={setInstituteLogo}
        />
      </div>

      <div className="lg:p-4">
        {inputFields.map(({title, value, onChange, disabled}) => (
          <div key={title} className="mt-6">
            <div className="flex justify-between items-end">
              <div className="tm-h6">{title}</div>
              <div className="tm-para3 tm-color-orange">
                {(value && value.length) || 0}/50
              </div>
            </div>
            <input
              type="text"
              className="tm-input-field mt-2 tm-color-text-primary"
              placeholder={title}
              value={value}
              onChange={(e) => onChange(String(e.target.value).trimLeft())}
              maxLength={50}
              disabled={disabled}
            />
          </div>
        ))}

        <div
          className="tm-btn2-blue my-6"
          onClick={() =>
            handleSubmit(
              instituteInfo && instituteInfo._id,
              instituteName,
              instituteLogo
            )
          }
        >
          {t('save')}
        </div>
      </div>
    </>
  )

  const handleSubmit = async (instituteId, instituteName, instituteLogo) => {
    if (instituteName.length > 2 && instituteName.length <= 50 && instituteId) {
      if (instituteInfo.name !== instituteName) {
        dispatch(showLoadingAction(true))
        await utilsUpdateInstituteInfo(
          instituteId,
          instituteName,
          instituteLogo
        ).catch(() => dispatch(showErrorOccuredAction(true)))
        dispatch(showLoadingAction(false))
      }

      if (instituteLogo) {
        dispatch(showLoadingAction(true))
        await utilsAddInstituteLogo(instituteId, instituteLogo).catch(() =>
          dispatch(showErrorOccuredAction(true))
        )
        dispatch(showLoadingAction(false))
      }

      if (instituteLogo || instituteInfo.name !== instituteName) {
        dispatch(showLoadingAction(true))
        utilsGetInstituteList()
          .then(({institutes}) => {
            dispatch(
              instituteInfoAction(
                getUpdatedInstituteInfoFromInstituteList(
                  instituteInfo,
                  institutes
                )
              )
            )
            dispatch(
              showToast({type: 'success', message: t('successfullyUpdated')})
            )
          })
          .catch(() => {
            dispatch(showErrorOccuredAction(true))
          })
          .finally(() => dispatch(showLoadingAction(false)))
      }
      if (getScreenWidth() > 1024) closeEditInstitutePopup()
    }
  }

  return (
    <>
      <div className="tm-edit-profile-page px-4 py-3 relative lg:hidden">
        <ErrorBoundary>{getInputForm}</ErrorBoundary>
      </div>
      <ErrorBoundary>
        <CreatePopupCard
          title={t('editInstituteDetails')}
          onClose={closeEditInstitutePopup}
          htmlContent={getInputForm}
        />
      </ErrorBoundary>
    </>
  )
}

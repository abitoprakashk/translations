import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {events} from '../../../../../utils/EventsConstants'
import {validateInputs} from '../../../../../utils/Validations'
import InputField from '../../../../Common/InputField/InputField'
import SliderScreen from '../../../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../Common/SliderScreenHeader/SliderScreenHeader'
import {DateTime} from 'luxon'
import {Input, ToggleSwitch} from '@teachmint/common'
import {Icon, ICON_CONSTANTS, isMobile} from '@teachmint/krayon'
import MultipleCheckbox from '../../../../Common/MultipleCheckbox/MultipleCheckbox'
import {
  affiliatedBoardOptions,
  departmentOptions,
} from '../../../../../utils/SampleCSVRows'
import {
  BROWSER_STORAGE_KEYS,
  INSTITUTE_TYPES,
  INSTITUTE_TYPES_OPTIONS,
} from '../../../../../constants/institute.constants'
import {
  createAcademicSessionApi,
  updateAcademicSessionApi,
  utilsGetInstituteAcademicDetails,
} from '../../../../../routes/dashboard'
import ConfirmationPopup from '../../../../Common/ConfirmationPopup/ConfirmationPopup'
import {
  showEditSessionAction,
  showLoadingAction,
  showToast,
} from '../../../../../redux/actions/commonAction'
import {
  instituteAcademicSessionInfoAction,
  instituteActiveAcademicSessionIdAction,
} from '../../../../../redux/actions/instituteInfoActions'
import {schoolSystemScreenSelectedAction} from '../../../../../redux/actions/schoolSystemAction'

import {setAdminSpecificToLocalStorage} from '../../../../../utils/Helpers'
import SelectImportSession from '../SelectImportSession/SelectImportSession'
import styles from './SliderAcademicSession.module.css'
import {getLastCreatedSession} from '../../../../../utils/sessionUtils'

export default function SliderAcademicSession({
  setSetShowSliderScreen,
  selectedSessionObj = null,
  setSelectedSessionObj,
  onImport,
  setIsCreateFlow,
}) {
  const instituteInfo = useSelector((state) => state.instituteInfo)
  const instituteAcademicSessionInfo = useSelector(
    (state) => state.instituteAcademicSessionInfo
  )
  const {t} = useTranslation()
  const [instituteType, setInstituteType] = useState('Select')
  const [sessionName, setSessionName] = useState(selectedSessionObj?.name || '')
  const [startDate, setStartDate] = useState(
    selectedSessionObj ? new Date(parseInt(selectedSessionObj?.start_time)) : ''
  )
  const [endDate, setEndDate] = useState(
    selectedSessionObj ? new Date(parseInt(selectedSessionObj?.end_time)) : ''
  )

  const [sessionStatus, setSessionStatus] = useState(
    selectedSessionObj?._id
      ? selectedSessionObj?.active_status == 1
        ? true
        : false
      : true
  )
  const [departmentItems, setDepartmentItems] = useState([])
  const [affiliatedBoard, setAffiliatedBoard] = useState('Select')
  const [errorObject, setErrorObject] = useState({})
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [isUpdated, setIsUpdated] = useState(
    selectedSessionObj?._id ||
      instituteInfo?.institute_type === INSTITUTE_TYPES.NONE
      ? false
      : true
  )

  const dispatch = useDispatch()

  useEffect(() => {
    setDepartmentItems(JSON.parse(JSON.stringify(departmentOptions)))
  }, [])

  const close = () => {
    setSetShowSliderScreen(false)
    setSelectedSessionObj(null)
    dispatch(showEditSessionAction(false))
  }

  const handleInputChange = (fieldName, value) => {
    setIsUpdated(true)
    switch (fieldName) {
      case 'instituteType':
        setInstituteType(value)
        break
      case 'sessionName':
        setSessionName(value)
        break
      case 'startDate':
        setStartDate(value)
        break
      case 'endDate':
        setEndDate(value)
        break
      case 'sessionStatus':
        setSessionStatus(value)
        break
      case 'affiliatedBoard': {
        setAffiliatedBoard(value)
        break
      }
      default:
        break
    }
  }

  const handleDepartmentItemsChange = (num, value) => {
    let items = [...departmentItems]
    for (let i = num; i < items.length; i++) {
      items[i].checked = i === num ? value : value ? value : items[i].checked
    }
    setDepartmentItems(items)
  }

  const handleSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }

  const onSubmit = async () => {
    let flag = true
    setErrorObject({})

    // Session Name
    if (
      !sessionName?.length > 0 ||
      !validateInputs('sessionName', sessionName, true)
    ) {
      flag = false
      handleSetError('sessionName', t('required'))
    }

    // Start Date
    if (!startDate) {
      flag = false
      handleSetError('startDate', t('selectValidDate'))
    }

    // End Date
    if (!endDate) {
      flag = false
      handleSetError('endDate', t('selectValidDate'))
    }

    // Check if creating new hierarchy for institute
    if (instituteType === INSTITUTE_TYPES.SCHOOL && !selectedSessionObj?._id) {
      if (affiliatedBoard === 'Select') {
        // Check Affiliation Board
        handleSetError('affiliatedBoard', t('required'))
        flag = false
      }

      // Check departments
      if (departmentItems.filter(({checked}) => checked).length === 0) {
        handleSetError('departmentItems', t('required'))
        flag = false
      }
    }

    if (flag) {
      if (selectedSessionObj?._id) {
        setShowConfirmationPopup({
          title: t('changesAcademicSessionTitle'),
          desc: t('changesAcademicSessionDesc'),
          imgSrc: '',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('update'),
          onAction: handleCreateOrUpdate,
        })
      } else {
        setShowConfirmationPopup({
          title: t('createNewAcademicSessionTitle'),
          desc: t('createNewAcademicSessionDesc'),
          imgSrc: '',
          primaryBtnText: t('cancel'),
          secondaryBtnText: t('create'),
          onAction: handleCreateOrUpdate,
        })
      }
    }
  }

  const handleCreateOrUpdate = async () => {
    if (selectedSessionObj?._id) {
      dispatch(showLoadingAction(true))
      await updateAcademicSessionApi(
        selectedSessionObj._id,
        sessionName,
        DateTime.fromJSDate(startDate).toMillis(),
        DateTime.fromJSDate(endDate).toMillis(),
        sessionStatus
      ).catch(() => {})

      const {obj} = await utilsGetInstituteAcademicDetails(instituteInfo._id)
      dispatch(showLoadingAction(false))
      dispatch(instituteAcademicSessionInfoAction(obj))
    } else {
      const departmentNotExist =
        instituteType === INSTITUTE_TYPES.SCHOOL &&
        JSON.parse(instituteInfo?.departments || '[]')?.length <= 0

      dispatch(showLoadingAction(true))
      const {status, obj} = await createAcademicSessionApi(
        sessionName,
        DateTime.fromJSDate(startDate).toMillis(),
        DateTime.fromJSDate(endDate).toMillis(),
        false,
        instituteType !== 'Select'
          ? instituteType
          : instituteInfo?.institute_type,
        departmentNotExist ? affiliatedBoard : null,
        departmentNotExist
          ? departmentItems.filter((item) => item.checked).map(({code}) => code)
          : null,
        instituteInfo?.address?.country || 'India'
      ).catch(() => {})
      dispatch(showLoadingAction(false))

      if (status) {
        dispatch(schoolSystemScreenSelectedAction(null))

        const createdSessionId = obj.session_id
        setAdminSpecificToLocalStorage(
          BROWSER_STORAGE_KEYS.ACTIVE_ACADEMIC_SESSION_ID,
          createdSessionId
        )

        dispatch(showLoadingAction(true))
        const {obj: sessions} = await utilsGetInstituteAcademicDetails(
          instituteInfo._id
        )
        dispatch(instituteAcademicSessionInfoAction(sessions))
        dispatch(instituteActiveAcademicSessionIdAction(createdSessionId))
        const createdSession = sessions.find(
          (session) => session._id === createdSessionId
        )

        setSelectedSessionObj(createdSession)
        setSessionStatus(false)
        setIsCreateFlow(true)
        dispatch(showLoadingAction(false))
      }
    }

    dispatch(
      showToast({
        type: 'success',
        message: selectedSessionObj?._id
          ? t('academicSessionIsSuccessfullyUpdated')
          : t('academicSessionIsSuccessfullyCreated'),
      })
    )
    setShowConfirmationPopup(false)
    setIsUpdated(false)
  }

  const onImportSession = (sourceSessionId) => {
    onImport(sourceSessionId)
  }

  const lastCreatedSession = getLastCreatedSession(instituteAcademicSessionInfo)
  const isMobileDevice = isMobile()

  return (
    <SliderScreen setOpen={close}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/website-builder-primary.svg"
          title={`${
            selectedSessionObj ? t('edit') : t('createNewTitle')
          } ${' '}  ${t('academicYear')}`}
        />
        <div className={styles.sliderContent}>
          <div>
            {showConfirmationPopup && (
              <ConfirmationPopup
                onClose={setShowConfirmationPopup}
                onAction={showConfirmationPopup?.onAction}
                title={showConfirmationPopup?.title}
                desc={showConfirmationPopup?.desc}
                primaryBtnText={showConfirmationPopup?.primaryBtnText}
                secondaryBtnText={showConfirmationPopup?.secondaryBtnText}
              />
            )}

            {instituteInfo?.institute_type === INSTITUTE_TYPES.NONE &&
              !selectedSessionObj?._id && (
                <InputField
                  fieldType="dropdown"
                  title={t('selectInstituteType')}
                  placeholder=""
                  value={instituteType}
                  handleChange={handleInputChange}
                  fieldName="instituteType"
                  dropdownItems={INSTITUTE_TYPES_OPTIONS}
                  errorText={errorObject['instituteType']}
                />
              )}

            {instituteInfo?.institute_type !== INSTITUTE_TYPES.NONE ||
            (instituteInfo?.institute_type === INSTITUTE_TYPES.NONE &&
              instituteType !== 'Select') ||
            selectedSessionObj?._id ? (
              <>
                <Input
                  title={t('sessionName')}
                  placeholder={t('sessionNamePlaceholder')}
                  type="text"
                  value={sessionName}
                  onChange={(obj) =>
                    handleInputChange(obj.fieldName, obj.value)
                  }
                  maxLength={50}
                  eventName={events.SESSION_NAME_FILLED_TFI}
                  fieldName="sessionName"
                  isRequired={true}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    title={t('startDate')}
                    placeholder={t('startDate')}
                    value={startDate}
                    onChange={(obj) =>
                      handleInputChange(obj.fieldName, obj.value)
                    }
                    type="date"
                    eventName={events.SESSION_PERIOD_FILLED_TFI}
                    fieldName="startDate"
                    maxDate={endDate}
                    isRequired={true}
                    showError={errorObject['startDate']}
                    errorMsg={errorObject['startDate']}
                  />
                  <Input
                    title={t('endDate')}
                    placeholder={t('endDate')}
                    value={endDate}
                    onChange={(obj) =>
                      handleInputChange(obj.fieldName, obj.value)
                    }
                    type="date"
                    eventName={events.SESSION_PERIOD_FILLED_TFI}
                    fieldName="endDate"
                    minDate={startDate}
                    isRequired={true}
                    showError={errorObject['endDate']}
                    errorMsg={errorObject['endDate']}
                  />
                </div>

                {selectedSessionObj?._id && (
                  <div className="tm-input-field flex justify-between items-center w-auto m-4 mb-6">
                    <div className="tm-hdg tm-hdg-16">{t('sessionStatus')}</div>
                    <ToggleSwitch
                      id="daily"
                      small
                      checked={sessionStatus}
                      onChange={(v) => handleInputChange('sessionStatus', v)}
                    />
                  </div>
                )}

                {instituteType === INSTITUTE_TYPES.SCHOOL &&
                  !selectedSessionObj?._id &&
                  JSON.parse(instituteInfo?.departments || '[]')?.length <=
                    0 && (
                    <>
                      <InputField
                        fieldType="dropdown"
                        title={t('affiliatedBoard')}
                        placeholder={t('affiliatedBoarPlaceholder')}
                        value={affiliatedBoard}
                        handleChange={handleInputChange}
                        fieldName="affiliatedBoard"
                        dropdownItems={affiliatedBoardOptions}
                        errorText={errorObject['affiliatedBoard']}
                      />

                      <>
                        <div className="tm-para2 tm-color-text-primary mb-1">
                          {t('selectDepartmentsInYourSchool')}
                        </div>
                        <MultipleCheckbox
                          items={departmentItems}
                          handleChange={handleDepartmentItemsChange}
                        />
                        <div className="tm-para4 mt-1 h-4 tm-color-red">
                          {errorObject['departmentItems']}
                        </div>
                      </>
                    </>
                  )}
              </>
            ) : null}

            {!selectedSessionObj && lastCreatedSession && (
              <div className={styles.infoContainer}>
                <Icon
                  name="info"
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                />
                <span>
                  {t('importInfoForCreate', {
                    sessionName: lastCreatedSession.name,
                  })}
                </span>
              </div>
            )}

            {isUpdated && (
              <div className="tm-btn2-blue mt-6 mx-4" onClick={onSubmit}>
                {selectedSessionObj ? t('update') : t('addSession')}
              </div>
            )}
            {!isMobileDevice && (
              <SelectImportSession
                selectedSessionId={selectedSessionObj?._id}
                onImport={onImportSession}
                isEditActive={isUpdated}
              />
            )}
          </div>
        </div>
      </>
    </SliderScreen>
  )
}

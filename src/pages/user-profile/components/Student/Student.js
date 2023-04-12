import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import produce from 'immer'
import classNames from 'classnames'
import {ErrorBoundary} from '@teachmint/common'
import {events} from '../../../../utils/EventsConstants'
import Loader from '../../../../components/Common/Loader/Loader'
import {
  getNodeDataWithChildrensParent,
  getNodesListOfSimilarType,
} from '../../../../utils/HierarchyHelpers'
import Footer from '../common/Footer/Footer'
import Header from '../common/Header/Header'
import CsvUpload from '../common/CsvUpload/CsvUpload'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {modifyDataForPost} from '../../UserProfile.utils'
import {
  addProfileAction,
  updateProfileAction,
  emptyFieldsReduxStateAction,
} from '../../redux/actions/studentActions'

import {
  STUDENT_HEADER_DESCRIPTION,
  USER_TYPES,
  USER_TYPE_SETTINGS,
} from '../../constants'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
import {getActiveStudents} from '../../../../redux/reducers/CommonSelectors'
import {ANDROID_USERAGENT, IOS_USERAGENT} from '../../../../constants'
import DynamicCategories from './components/DynamicCategories/DynamicCategories'
import defaultEmptyCategoriesScreen from '../UICommon/profileSettingsEmptyIcon.svg'
import {getClassSectionValues} from './Student.utils'
import {useGetUser} from '../../hooks/getUser.hook'
import {useGetSettingObject} from '../../hooks/getSettingObject.hook'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import globalActions from '../../../../redux/actions/global.actions'
import {personaProfileSettingsSelector} from '../../../ProfileSettings/redux/ProfileSettingsSelectors'
import {getCategoriesCollection} from '../../../ProfileSettings/ProfileSettings.utils'
import {SETTING_TYPE} from '../../../ProfileSettings/ProfileSettings.constant'
import {fetchCategoriesRequestAction} from '../../../ProfileSettings/redux/actions/ProfileSettingsActions'
import {showLoadingAction} from '../../../../redux/actions/commonAction'
import {utilsGetTransportPickup} from '../../../../routes/transport'
import RemainingStudentsBanner from '../../../../components/SchoolSystem/SectionDetails/RemainingStudentsBanner'
import {showToast} from '../../../../redux/actions/commonAction'
import {getUserLabel} from '../UICommon/CategoryFieldsLoadingContainer/CategoryFieldsLoadingContainer.utils'
import commonStyles from './../../UserProfileComponent.module.css'
import styles from './Student.module.css'
import {Para, Popup, PARA_CONSTANTS} from '@teachmint/krayon'

const Student = ({
  iMemberId,
  isAddProfile,
  assignedToClass,
  handleCSV,
  screenName,
  downloadSampleCSVFile,
  closeSlider,
  nodeId = null,
  opened_from,
  canAdd = true,
  subscriptionData = null,
}) => {
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const {instituteHierarchy, eventManager, showLoading} = useSelector(
    (state) => state
  )
  const instituteStudentList = getActiveStudents(true)
  const {isPersonaProfileSettingsLoading, personaCategoryListData} =
    useSelector((state) => state.profileSettings)
  const {student, common} = useSelector((state) => state.userProfileInfo)
  const initialObject = common?.initialObject ? common.initialObject : {}
  const [isAdd, setIsAdd] = useState(isAddProfile)
  const [hasEdited, setHasEdited] = useState(false)
  const [memberId, setMemberId] = useState(iMemberId)

  const [userFieldsState, setUserFieldsState] = useState(null)
  const [classList, setClassList] = useState([])
  const [sectionList, setSectionList] = useState([])
  const [pickupPointList, setPickupPointList] = useState([])
  const [hasError, setHasError] = useState([])
  const [studentDP, setStudentDP] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSameAddress, setIsSameAddress] = useState(true)
  const [isProfileSetting, setIsProfileSetting] = useState(false)
  const [userList, setUserList] = useState([])
  const studentDetails = useGetUser(memberId, instituteStudentList)
  const settingObj = useGetSettingObject(personaCategoryListData)
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)

  const studentVerificationStatus = memberId
    ? studentDetails?.verification_status
    : null
  const disableInputs = memberId ? studentVerificationStatus === 4 : false

  // Get Category collection functions start
  const personaProfileSettingsData = personaProfileSettingsSelector()
  useEffect(() => {
    if (
      !personaProfileSettingsData.data ||
      personaProfileSettingsData?.data[0]?.persona ==
        USER_TYPE_SETTINGS.STAFF.persona
    ) {
      const getProfileSettings = {
        persona: USER_TYPE_SETTINGS.STUDENT.id,
      }
      dispatch(
        globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
          getProfileSettings
        )
      )
      setIsProfileSetting(true)
    }
  }, [])

  useEffect(() => {
    let categoriesCollection = null
    if (
      isProfileSetting &&
      personaProfileSettingsData?.data?.length > 0 &&
      personaProfileSettingsData?.data[0]?.persona ==
        USER_TYPE_SETTINGS.STUDENT.persona
    ) {
      categoriesCollection = getCategoriesCollection(
        personaProfileSettingsData.data,
        SETTING_TYPE.CATEGORY_FOR_INFO
      )
      dispatch(fetchCategoriesRequestAction(categoriesCollection))
      setIsProfileSetting(false)
    }
  }, [personaProfileSettingsData])
  // Get Category collection functions end

  // Get Transport Pickup
  useEffect(() => {
    getTransportPickup()
  }, [])

  // User dynamic fields state function start
  useEffect(() => {
    let fieldAndValueReduxState = {}
    if (memberId && studentDetails?._id && !isAdd) {
      if (studentDetails && studentDetails?.standard !== '') {
        const sectionsData = getClassSectionValues({
          studentDetails,
          classList,
          instituteHierarchy,
        })
        setSectionList(sectionsData)
      }
      let studentJson = {_id: studentDetails._id}
      for (const key in initialObject) {
        studentJson[key] = studentDetails[key] || ''
      }
      fieldAndValueReduxState = studentJson
      setStudentDP(studentDetails.img_url)
    } else {
      fieldAndValueReduxState = initialObject
      setStudentDP(null)
    }
    dispatch(emptyFieldsReduxStateAction(fieldAndValueReduxState))
  }, [personaCategoryListData, memberId, studentDetails])

  useEffect(() => {
    const list = getNodesListOfSimilarType(instituteHierarchy, 'STANDARD')
    if (list && list.length > 0) {
      setClassList(list?.map((item) => ({label: item.name, value: item.id})))
    }
  }, [instituteHierarchy])

  // Student Profile fields initial value set
  useEffect(() => {
    if (student && Object.keys(student).length > 0) {
      setUserFieldsState(student.dynamicFieldsValues)
    }
  }, [student, initialObject])

  useEffect(() => {
    if (!isAdd && memberId) {
      setUserList(instituteStudentList.filter((item) => item._id !== memberId))
    } else {
      setUserList(instituteStudentList)
    }
  }, [instituteStudentList])

  const openViewProfile = (id) => {
    setMemberId(id)
    setIsAdd(false)
  }

  //Transport Pickup Fetch
  const getTransportPickup = () => {
    dispatch(showLoadingAction(true))
    utilsGetTransportPickup()
      .then(({obj}) => {
        setPickupPointList(obj)
      })
      .catch(() =>
        dispatch(
          showToast({type: 'error', message: t('unableToGetPickupPointList')})
        )
      )
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const fieldsHandleChange = ({obj}) => {
    if (obj.fieldName == 'standard') {
      const node = getNodeDataWithChildrensParent(instituteHierarchy, obj.value)
      let sections = []
      node?.children?.forEach((item) => {
        if (item.type === 'SECTION') {
          sections.push({label: item.name, value: item.name})
        }
      })
      setSectionList(sections)
    }
    const updatedFieldsObject = produce(userFieldsState, (draft) => {
      draft[obj.fieldName] = obj.value
      return draft
    })
    setUserFieldsState(updatedFieldsObject)
    setHasEdited(true)
  }

  const handleError = (val, fieldName) => {
    if (val) {
      setHasError([...hasError, fieldName])
    } else {
      let index = hasError.indexOf(fieldName)
      if (index !== -1) {
        let tmp = [...hasError]
        tmp.splice(index, 1)
        setHasError(tmp)
      }
    }
  }

  const resetAllStates = () => {
    dispatch(emptyFieldsReduxStateAction(initialObject))
    setMemberId(null)
    setIsAdd(true)
    setHasError([])
    setClassList([])
    setSectionList([])
  }
  // User dynamic fields state function end
  useEffect(() => {
    if (student?.updated) {
      setIsLoading(false)
      addEvent(isAdd ? events.STUDENT_ADDED_TFI : events.STUDENT_UPDATED_TFI)
      if (closeSlider) {
        closeSlider(student.updated)
      }
      dispatch(emptyFieldsReduxStateAction(initialObject))
    }
  }, [student?.updated])

  useEffect(() => {
    setIsLoading(false)
  }, [student?.failed])

  const checkValidations = () => {
    let res = settingObj?.some((item) => {
      if (item.is_value_mandatory) {
        return (
          !userFieldsState ||
          !userFieldsState[item.key_id] ||
          !userFieldsState[item.key_id]?.toString().trim()
        )
      }
    })
    if (
      student?.dynamicFieldsValues?.phone_number &&
      student?.dynamicFieldsValues?.phone_number !== '' &&
      userFieldsState?.phone_number === ''
    ) {
      return true
    }

    return (
      hasError.length ||
      res ||
      (!userFieldsState?.phone_number?.trim() &&
        !userFieldsState?.email?.trim())
    )
  }
  const checkActiveStatus = () => {
    const activeElement = instituteStudentList.filter((ele) => {
      return ele._id === memberId
    })
    return activeElement[0]?.verification_status !== 4
  }
  const addEvent = (event) => {
    switch (event) {
      case events.ADD_STUDENT_CLICKED_TFI:
      case events.STUDENT_ADDED_TFI:
      case events.STUDENT_UPDATED_TFI:
        eventManager.send_event(event, {
          section_id: assignedToClass?.sectionId,
          screen_name: screenName,
          screen: opened_from,
        })
        return
      default:
        eventManager.send_event(event, {
          screen_name: 'add_student',
        })
        return
    }
  }

  const setDataForUpdate = (data) => {
    if (data?.standard && data?.standard !== '') {
      if (isAdd && assignedToClass) {
        data.standard = assignedToClass.standard || ''
        data.section = assignedToClass.section || ''
      } else {
        data.standard =
          classList.find((item) => item.value === data.standard)?.label ||
          data.standard
      }
    }
    if (
      student?.dynamicFieldsValues?.phone_number &&
      student?.dynamicFieldsValues?.phone_number !== '' &&
      data?.phone_number === ''
    ) {
      data.phone_number = student?.dynamicFieldsValues?.phone_number
    }
    return modifyDataForPost(data, settingObj, isSameAddress, studentDP)
  }

  const handleUpdateProfile = () => {
    setIsLoading(true)
    addEvent(
      isAdd ? events.ADD_STUDENT_CLICKED_TFI : events.UPDATE_STUDENT_CLICKED_TFI
    )
    let data = {}
    data = setDataForUpdate({...userFieldsState})
    const requestData = {
      users: [data],
      type: INSTITUTE_MEMBER_TYPE.STUDENT,
      node_id: nodeId,
    }
    if (isAdd) {
      dispatch(addProfileAction(requestData))
      resetAllStates()
    } else {
      dispatch(
        updateProfileAction({
          users: [data],
          user_type: INSTITUTE_MEMBER_TYPE.STUDENT,
        })
      )
    }
  }

  const sliderContent = () => {
    return (
      <ErrorBoundary>
        <div
          className={classNames(
            commonStyles.wrapper,
            {
              [commonStyles.footerGrid]: isAdd || hasEdited,
            },
            !canAdd ? 'tm-bg-modal-light-gray pointer-events-none' : ''
          )}
        >
          <div className={commonStyles.formContainer}>
            {isAdd && subscriptionData?.status && (
              <div className={styles.cstRemainingBanner}>
                <RemainingStudentsBanner content={subscriptionData} />
              </div>
            )}
            {isAdd && (
              <>
                {navigator.userAgent !== ANDROID_USERAGENT &&
                  navigator.userAgent !== IOS_USERAGENT && (
                    <>
                      <CsvUpload
                        handleCSV={handleCSV}
                        downloadSampleCSVFile={downloadSampleCSVFile}
                        userType="student"
                      />
                    </>
                  )}

                <div className={styles.addManually}>
                  {t('addstudentManually')}
                </div>
              </>
            )}
            <Header
              descriptionObj={{
                ...STUDENT_HEADER_DESCRIPTION,
              }}
              persona={USER_TYPE_SETTINGS.STUDENT.id}
              setPicUrl={(file) => {
                setStudentDP(file)
                setHasEdited(true)
              }}
              picUrl={studentDP}
              screenName={isAdd ? 'add_student' : 'update_student'}
              disableUpload={disableInputs}
            />
            <>
              <hr className={styles.dividerLine} />
            </>
            <div className={styles.dynamicCategoriesMainBlock}>
              <Loader show={isPersonaProfileSettingsLoading} />
              {personaCategoryListData && personaCategoryListData.length > 0 ? (
                <DynamicCategories
                  isAdd={isAdd}
                  userCategoriesListData={personaCategoryListData}
                  assignedToClass={assignedToClass}
                  userFieldsState={userFieldsState}
                  classList={classList}
                  sectionList={sectionList}
                  userList={userList}
                  userType={USER_TYPES['STUDENT']}
                  fieldsHandleChange={fieldsHandleChange}
                  handleValidationError={handleError}
                  openViewProfile={openViewProfile}
                  isSameAddress={isSameAddress}
                  setIsSameAddress={setIsSameAddress}
                  userDetails={studentDetails}
                  permissionId={
                    isAdd
                      ? PERMISSION_CONSTANTS.ipsController_addUsers_create
                      : PERMISSION_CONSTANTS.ipsController_updateUsers_update
                  }
                  pickupPointList={pickupPointList}
                />
              ) : (
                <EmptyScreenV1
                  image={defaultEmptyCategoriesScreen}
                  title={t('categoryAndTheirFieldsDetailsNotFound')}
                  btnType="primary"
                />
              )}
            </div>
          </div>

          {checkActiveStatus() && (isAdd || hasEdited) && (
            <Footer
              errorMessage={isAdd ? t('mandatoryContactErrorMessage') : ''}
              isDisabled={checkValidations()}
              handleUpdateProfile={
                isAdd
                  ? handleUpdateProfile
                  : studentDetails?.phone_number ===
                      userFieldsState?.phone_number &&
                    studentDetails?.email === userFieldsState?.email &&
                    !userFieldsState?.phone_number_countryCode
                  ? handleUpdateProfile
                  : () => {
                      setIsPopUpOpen(true)
                    }
              }
              isAdd={isAdd}
              userType={getUserLabel(USER_TYPES['STUDENT'])}
              permissionId={
                isAdd
                  ? PERMISSION_CONSTANTS.ipsController_addUsers_create
                  : PERMISSION_CONSTANTS.ipsController_updateUsers_update
              }
            />
          )}
          {hasEdited && !isAdd && (
            <Popup
              isOpen={isPopUpOpen}
              actionButtons={[
                {
                  body: 'Cancel',
                  id: 'cancel-btn',
                  onClick: () => {
                    setIsPopUpOpen(false)
                  },
                  type: 'outline',
                },
                {
                  body: 'Confirm',
                  category: 'constructive',
                  id: ' confirm-btn',
                  onClick: () => {
                    handleUpdateProfile()
                    setIsPopUpOpen(false)
                  },
                },
              ]}
              header={'Contact details modified'}
              headerIcon={'error'}
              onClose={() => {
                setIsPopUpOpen(false)
              }}
              size="xs"
            >
              <Para
                type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
                className={commonStyles.popUpContent}
              >
                You are about to change contact details for{' '}
                {studentDetails?.name}. They can now login using
                {userFieldsState?.phone_number
                  ? userFieldsState?.phone_number_countryCode
                    ? ' ' + userFieldsState?.phone_number_countryCode + '-'
                    : ' ' + userFieldsState?.phone_number.split('-')[0] + '-'
                  : ''}
                {userFieldsState.phone_number.split('-').length === 1
                  ? userFieldsState.phone_number
                  : userFieldsState?.phone_number.split('-')[1]}
                {userFieldsState?.phone_number && userFieldsState?.email
                  ? ' or '
                  : ' '}
                {userFieldsState?.email}
              </Para>
            </Popup>
          )}
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <>
      <ErrorBoundary>{sliderContent()}</ErrorBoundary>
      <Loader show={isLoading && showLoading} />
    </>
  )
}

export default Student

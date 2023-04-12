import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {ErrorBoundary} from '@teachmint/common'
import {events} from '../../../../utils/EventsConstants'
import Loader from '../../../../components/Common/Loader/Loader'
import Footer from '../common/Footer/Footer'
import Header from '../common/Header/Header'
import CsvUpload from '../common/CsvUpload/CsvUpload'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {
  addProfileAction,
  updateProfileAction,
  deleteTeacherAction,
  clearReduxStateAction,
} from '../../redux/actions/teacherActions'
import {
  TEACHER_HEADER_DESCRIPTION,
  USER_TYPES,
  USER_TYPE_SETTINGS,
} from '../../constants'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
import {ANDROID_USERAGENT, IOS_USERAGENT} from '../../../../constants'
import DeleteButton from '../common/DeleteButton/DeleteButton'
import DynamicCategories from '../Student/components/DynamicCategories/DynamicCategories'
import defaultEmptyCategoriesScreen from '../UICommon/profileSettingsEmptyIcon.svg'
import {useGetUser} from '../../hooks/getUser.hook'
import {useGetSettingObject} from '../../hooks/getSettingObject.hook'
import {modifyDataForPost} from '../../UserProfile.utils'
import Permission from '../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../utils/permission.constants'
import {getUserLabel} from '../UICommon/CategoryFieldsLoadingContainer/CategoryFieldsLoadingContainer.utils'
import commonStyles from './../../UserProfileComponent.module.css'
import styles from './Teacher.module.css'
import {Popup, Para, PARA_CONSTANTS} from '@teachmint/krayon'

const Teacher = ({
  iMemberId,
  isAddProfile,
  handleCSV,
  downloadSampleCSVFile,
  screenName,
  closeSlider,
  opened_from,
  nodeDetails,
  assignClassTeacherCheckbox,
  handleAssignClassTeacherCheckbox,
}) => {
  const {initialObject} = useSelector((state) => state.userProfileInfo.common)
  const {instituteInfo, eventManager, instituteTeacherList} = useSelector(
    (state) => state
  )
  const {isPersonaProfileSettingsLoading, personaCategoryListData} =
    useSelector((state) => state.profileSettings)
  const {updated, failed} = useSelector(
    (state) => state.userProfileInfo.teacher
  )
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [userData, setUserData] = useState({})
  const [memberId, setMemberId] = useState(iMemberId)
  const [isAdd, setIsAdd] = useState(isAddProfile)
  const [hasEdited, setHasEdited] = useState(false)
  const [hasError, setHasError] = useState([])
  const [teacherDPUrl, setTeacherDPUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSameAddress, setIsSameAddress] = useState(true)

  const teacher = useGetUser(memberId, instituteTeacherList)
  const settingObj = useGetSettingObject(personaCategoryListData)
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)

  // Get Category collection functions start
  useEffect(() => {
    return () => {
      dispatch(clearReduxStateAction())
      setMemberId(memberId)
      setIsAdd(isAdd)
      setHasError([])
    }
  }, [])

  useEffect(() => {
    if (teacher?._id) {
      let json = {_id: teacher._id}
      for (const key in initialObject) {
        json[key] = teacher[key] || ''
      }
      setUserData(json)
      setTeacherDPUrl(teacher.img_url)
    } else {
      setUserData({...initialObject})
      setTeacherDPUrl(null)
    }
  }, [teacher, initialObject])

  useEffect(() => {
    if (updated) {
      addEvent(isAdd ? events.TEACHER_ADDED_TFI : events.TEACHER_UPDATED_TFI)
      if (closeSlider) {
        closeSlider(updated)
      }
      dispatch(clearReduxStateAction())
    }
  }, [updated])

  useEffect(() => {
    setIsLoading(false)
  }, [failed])

  const openViewProfile = (id) => {
    setMemberId(id)
    setIsAdd(false)
  }

  const checkValidations = () => {
    let res = settingObj?.some((item) => {
      if (item.key_id !== 'roles' && item.is_value_mandatory) {
        return (
          !userData[item.key_id] || !userData[item.key_id]?.toString().trim()
        )
      }
    })
    if (
      teacher?.phone_number &&
      teacher?.phone_number !== '' &&
      userData?.phone_number === ''
    ) {
      return true
    }

    return (
      hasError.length ||
      res ||
      (!userData.phone_number?.trim() && !userData.email?.trim())
    )
  }

  const addEvent = (event) => {
    switch (event) {
      case events.ADD_TEACHER_CLICKED_TFI:
      case events.TEACHER_ADDED_TFI:
      case events.TEACHER_UPDATED_TFI:
        eventManager.send_event(event, {
          screen_name: screenName,
          screen: opened_from,
        })
        return
      default:
        eventManager.send_event(event, {
          screen_name: 'add_teacher',
        })
        return
    }
  }

  const setDataForUpdate = (data) => {
    delete data.roles
    if (
      teacher?.phone_number &&
      teacher?.phone_number !== '' &&
      data?.phone_number === ''
    ) {
      data.phone_number = teacher?.phone_number
    }
    return modifyDataForPost(data, settingObj, isSameAddress, teacherDPUrl)
  }

  const handleUpdateProfile = () => {
    setIsLoading(true)
    addEvent(
      isAdd ? events.ADD_TEACHER_CLICKED_TFI : events.UPDATE_TEACHER_CLICKED_TFI
    )
    let data = {}
    data = setDataForUpdate({...userData})
    if (isAdd) {
      dispatch(
        addProfileAction({
          users: [data],
          type: INSTITUTE_MEMBER_TYPE.TEACHER,
        })
      )
    } else {
      dispatch(
        updateProfileAction({
          users: [data],
          user_type: INSTITUTE_MEMBER_TYPE.TEACHER,
        })
      )
    }
  }

  const checkActiveStatus = () => {
    const activeElement = instituteTeacherList.filter((ele) => {
      return ele._id === iMemberId
    })
    return activeElement[0]?.verification_status !== 4
  }

  const deleteProfile = () => {
    dispatch(deleteTeacherAction({imember_id: iMemberId}))
    eventManager.send_event(events.USER_PROFILE_DELETED_TFI, {
      screen_name: 'user_profile',
      user_role: 'teacher',
    })
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

  const handleOnChange = ({obj: {fieldName, value}}) => {
    setHasEdited(true)
    setUserData({...userData, [fieldName]: value})
  }

  const sliderContent = () => {
    return (
      <ErrorBoundary>
        <div
          className={classNames(commonStyles.wrapper, {
            [commonStyles.footerGrid]: isAdd || hasEdited,
          })}
        >
          <div className={commonStyles.formContainer}>
            {isAdd && (
              <>
                {navigator.userAgent !== ANDROID_USERAGENT &&
                  navigator.userAgent !== IOS_USERAGENT && (
                    <>
                      <CsvUpload
                        handleCSV={handleCSV}
                        downloadSampleCSVFile={downloadSampleCSVFile}
                        userType={USER_TYPES['TEACHER']}
                      />
                    </>
                  )}

                <div className={styles.addManually}>
                  {t('addTeacherManually')}
                </div>
              </>
            )}
            <Header
              descriptionObj={{
                ...TEACHER_HEADER_DESCRIPTION,
              }}
              persona={USER_TYPE_SETTINGS.STAFF.id}
              setPicUrl={(url) => {
                setHasEdited(true)
                setTeacherDPUrl(url)
              }}
              picUrl={teacherDPUrl}
              screenName={isAdd ? 'add_teacher' : 'update_teacher'}
            />
            <hr />
            <>
              <Loader show={isPersonaProfileSettingsLoading} />
              {personaCategoryListData && personaCategoryListData.length > 0 ? (
                <DynamicCategories
                  isAdd={isAdd}
                  userCategoriesListData={personaCategoryListData}
                  fieldsHandleChange={handleOnChange}
                  userFieldsState={userData}
                  handleValidationError={handleError}
                  userList={instituteTeacherList}
                  openViewProfile={openViewProfile}
                  isSameAddress={isSameAddress}
                  setIsSameAddress={setIsSameAddress}
                  userDetails={teacher}
                  userType={USER_TYPES['TEACHER']}
                  permissionId={
                    isAdd
                      ? PERMISSION_CONSTANTS.ipsController_addUsers_create
                      : PERMISSION_CONSTANTS.ipsController_updateUsers_update
                  }
                />
              ) : (
                <EmptyScreenV1
                  image={defaultEmptyCategoriesScreen}
                  title={t('categoryAndTheirFieldsDetailsNotFound')}
                  btnType="primary"
                />
              )}
            </>
            {checkActiveStatus() && !isAdd && (
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.ipsController_deleteUser_delete
                }
              >
                <DeleteButton
                  userType="teacher"
                  deleteProfile={deleteProfile}
                  name={teacher?.name}
                  imember_id={iMemberId}
                />
              </Permission>
            )}
          </div>

          {checkActiveStatus() && (isAdd || hasEdited) && (
            <Footer
              errorMessage={isAdd ? t('mandatoryContactErrorMessage') : ''}
              isDisabled={checkValidations()}
              handleUpdateProfile={
                isAdd
                  ? handleUpdateProfile
                  : teacher?.phone_number === userData?.phone_number &&
                    teacher?.email === userData?.email &&
                    !userData?.phone_number_countryCode
                  ? handleUpdateProfile
                  : () => {
                      setIsPopUpOpen(true)
                    }
              }
              isAdd={isAdd}
              userType={getUserLabel(USER_TYPES['TEACHER'])}
              nodeDetails={
                instituteInfo.institute_type === 'SCHOOL' ? nodeDetails : null
              }
              assignClassTeacherCheckbox={assignClassTeacherCheckbox}
              handleAssignClassTeacherCheckbox={
                handleAssignClassTeacherCheckbox
              }
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
                You are about to change contact details for {teacher?.name}.
                They can now login using
                {userData?.phone_number
                  ? userData?.phone_number_countryCode
                    ? ' ' + userData?.phone_number_countryCode + '-'
                    : ' ' + userData?.phone_number.split('-')[0] + '-'
                  : ''}
                {userData.phone_number.split('-').length === 1
                  ? userData.phone_number
                  : userData?.phone_number.split('-')[1]}
                {userData?.phone_number && userData?.email ? ' or ' : ' '}
                {userData?.email}
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
      <Loader show={isLoading} />
    </>
  )
}

export default Teacher

import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import {ErrorBoundary} from '@teachmint/common'
import {events} from '../../../../utils/EventsConstants'
import Loader from '../../../../components/Common/Loader/Loader'
import Footer from '../common/Footer/Footer'
import Header from '../common/Header/Header'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {
  addProfileAction,
  updateProfileAction,
  deleteAdminAction,
  clearReduxStateAction,
} from '../../redux/actions/adminActions'
import {
  TEACHER_HEADER_DESCRIPTION,
  USER_TYPES,
  USER_TYPE_SETTINGS,
} from '../../constants'
import {INSTITUTE_MEMBER_TYPE} from '../../../../constants/institute.constants'
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
import {Popup, Para, PARA_CONSTANTS} from '@teachmint/krayon'

const Admin = ({
  iMemberId,
  isAddProfile,
  assignedToClass,
  screenName,
  closeSlider,
  isSameUser,
  isSuperAdmin,
  opened_from,
}) => {
  const {initialObject} = useSelector((state) => state.userProfileInfo.common)
  const {eventManager, instituteAdminList} = useSelector((state) => state)
  const {isPersonaProfileSettingsLoading, personaCategoryListData} =
    useSelector((state) => state.profileSettings)
  const {updated, failed} = useSelector((state) => state.userProfileInfo.admin)
  const allRoleList = useSelector((state) => [
    ...(state?.globalData?.getAllRoles?.data?.custom || []),
    ...(state?.globalData?.getAllRoles?.data?.default || []),
  ])
  const dispatch = useDispatch()
  const {t} = useTranslation()

  const [userData, setUserData] = useState({})
  const [memberId, setMemberId] = useState(iMemberId)
  const [isAdd, setIsAdd] = useState(isAddProfile)
  const [hasEdited, setHasEdited] = useState(false)
  const [hasError, setHasError] = useState([])
  const [adminDPUrl, setAdminDPUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSameAddress, setIsSameAddress] = useState(true)
  const admin = useGetUser(memberId, instituteAdminList)
  const settingObj = useGetSettingObject(personaCategoryListData)
  const roleLabelIdMap = allRoleList.map((role) => ({
    label: role.name,
    value: role._id,
  }))
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
    if (admin?._id) {
      let json = {_id: admin._id}
      for (const key in initialObject) {
        if (key === 'roles') json[key] = admin[key][0]
        else json[key] = admin[key] || ''
      }
      setUserData(json)
      setAdminDPUrl(admin.img_url)
    } else {
      setUserData({...initialObject})
      setAdminDPUrl(null)
    }
  }, [admin, initialObject])

  useEffect(() => {
    if (updated) {
      addEvent(isAdd ? events.ADMIN_ADDED_TFI : events.ADMIN_UPDATED_TFI)
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
      if (item.is_value_mandatory) {
        return (
          !userData[item.key_id] || !userData[item.key_id]?.toString().trim()
        )
      }
    })
    if (
      admin?.phone_number &&
      admin?.phone_number !== '' &&
      userData?.phone_number === ''
    ) {
      return true
    }

    return (
      hasError.length ||
      res ||
      (!userData.phone_number?.trim() && !userData.email?.trim()) ||
      !userData.roles?.trim()
    )
  }

  const addEvent = (event) => {
    switch (event) {
      case events.ADD_ADMIN_CLICKED_TFI:
      case events.ADMIN_ADDED_TFI:
      case events.ADMIN_UPDATED_TFI:
        eventManager.send_event(event, {
          section_id: assignedToClass?.sectionId,
          screen_name: screenName,
          screen: opened_from,
        })
        return
      default:
        eventManager.send_event(event, {
          screen_name: 'add_admin',
        })
        return
    }
  }

  const setDataForUpdate = (data) => {
    data.roles = [data.roles]
    if (
      admin?.phone_number &&
      admin?.phone_number !== '' &&
      data?.phone_number === ''
    ) {
      data.phone_number = admin?.phone_number
    }
    return modifyDataForPost(data, settingObj, isSameAddress, adminDPUrl)
  }

  const handleUpdateProfile = () => {
    setIsLoading(true)
    addEvent(
      isAdd ? events.ADD_ADMIN_CLICKED_TFI : events.UPDATE_ADMIN_CLICKED_TFI
    )
    let data = {}
    data = setDataForUpdate({...userData})
    if (isAdd) {
      dispatch(
        addProfileAction({
          users: [data],
          type: INSTITUTE_MEMBER_TYPE.ADMIN,
        })
      )
    } else {
      dispatch(
        updateProfileAction({
          users: [data],
          user_type: INSTITUTE_MEMBER_TYPE.ADMIN,
        })
      )
    }
  }

  const deleteProfile = () => {
    dispatch(deleteAdminAction({imember_id: iMemberId}))
    eventManager.send_event(events.USER_PROFILE_DELETED_TFI, {
      screen_name: 'user_profile',
      user_role: admin?.roles[0],
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
            <Header
              descriptionObj={{
                ...TEACHER_HEADER_DESCRIPTION,
              }}
              persona={USER_TYPE_SETTINGS.STAFF.id}
              setPicUrl={(url) => {
                setHasEdited(true)
                setAdminDPUrl(url)
              }}
              picUrl={adminDPUrl}
              screenName={isAdd ? 'add_admin' : 'update_admin'}
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
                  userList={instituteAdminList}
                  openViewProfile={openViewProfile}
                  userDetails={admin}
                  isSameAddress={isSameAddress}
                  setIsSameAddress={setIsSameAddress}
                  roleLabelIdMap={roleLabelIdMap}
                  userType={USER_TYPES['ADMIN']}
                  permissionId={
                    isAdd
                      ? PERMISSION_CONSTANTS.instituteAdminController_createRoute_create
                      : PERMISSION_CONSTANTS.instituteAdminController_updateRoute_update
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
            {!isAdd && !isSuperAdmin && !isSameUser ? (
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.instituteAdminController_deleteRoute_delete
                }
              >
                <DeleteButton
                  userType="admin"
                  deleteProfile={deleteProfile}
                  name={admin?.name}
                  imember_id={iMemberId}
                />
              </Permission>
            ) : null}
          </div>
          {(isAdd || hasEdited) && (
            <Footer
              errorMessage={isAdd ? t('mandatoryContactErrorMessage') : ''}
              isDisabled={checkValidations()}
              handleUpdateProfile={
                isAdd
                  ? handleUpdateProfile
                  : admin?.phone_number === userData?.phone_number &&
                    admin?.email === userData?.email &&
                    !userData?.phone_number_countryCode
                  ? handleUpdateProfile
                  : () => {
                      setIsPopUpOpen(true)
                    }
              }
              isAdd={isAdd}
              userType={getUserLabel(USER_TYPES['ADMIN'])}
              permissionId={
                PERMISSION_CONSTANTS.instituteAdminController_updateRoute_update
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
                You are about to change contact details for {admin?.name}. They
                can now login using
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

export default Admin

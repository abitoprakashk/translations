import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Button} from '@teachmint/common'
import SearchBox from '../../Common/SearchBox/SearchBox'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {showFeatureLockAction} from '../../../redux/actions/commonAction'
import {utilsDeleteAdmin} from '../../../routes/dashboard'
import {
  instituteAdminListAction,
  kamListAction,
} from '../../../redux/actions/instituteInfoActions'
import {
  showErrorOccuredAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {getDateFromTimeStamp} from '../../../utils/Helpers'
import {checkSubscriptionType} from '../../../utils/Helpers'
import Table from '../../Common/Table/Table'
import UserProfile from '../../Common/UserProfile/UserProfile'
import SliderAddAdminList from './SliderAddAdminList'
import NormalCard from '../../Common/NormalCard/NormalCard'
import RadioInput from '../../Common/RadioInput/RadioInput'
import '../Admin/AdminPage.css'
import SliderEditAdmin from './SliderEditAdmin'
import DropdownField from '../../Common/DropdownField/DropdownField'
import {events} from '../../../utils/EventsConstants'
import {t} from 'i18next'
import {searchBoxFilter} from '../../../utils/Helpers'
import globalActions from '../../../redux/actions/global.actions'
import {personaProfileSettingsSelector} from '../../../pages/ProfileSettings/redux/ProfileSettingsSelectors'
import {fetchCategoriesRequestAction} from '../../../pages/ProfileSettings/redux/actions/ProfileSettingsActions'
import {getCategoriesCollection} from '../../../pages/ProfileSettings/ProfileSettings.utils'
import {USER_TYPE_SETTINGS} from '../../../pages/user-profile/constants'
import Loader from '../../Common/Loader/Loader'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {getAdminProfiles} from '../../../pages/user-profile/apiService'
import {ROLE_ID} from '../../../constants/permission.constants'
// import UserProfileComponent from './../../../pages/user-profile/UserProfileComponent'

export default function AdminPageNew() {
  const [sourceList, setSourceList] = useState([])
  const [userType, setUserType] = useState(0)
  const [selectedAdminCard, setSelectedAdminCard] = useState(null)
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false)
  const {
    instituteAdminList,
    kamList,
    instituteInfo,
    rolesList,
    currentAdminInfo,
    eventManager,
  } = useSelector((state) => state)
  const allRoleList = useSelector((state) => [
    ...(state?.globalData?.getAllRoles?.data?.custom || []),
    ...(state?.globalData?.getAllRoles?.data?.default || []),
  ])
  const {isLoading} = useSelector((state) => state.userProfileInfo.admin)
  const [sliderScreen, setSliderScreen] = useState(null)
  const [showEditSlider, setShowEditSlider] = useState(null)
  const [isLoadingLocal, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const isPremium = checkSubscriptionType(instituteInfo)
  const personaProfileSettingsData = personaProfileSettingsSelector()
  const roleNameIdMap = {}
  allRoleList.forEach((role) => (roleNameIdMap[role._id] = role.name))

  // Get Category collection functions start
  useEffect(() => {
    setIsLoading(true)
    const getProfileSettings = {
      persona: USER_TYPE_SETTINGS.STAFF.id,
    }
    dispatch(
      globalActions?.fetchPersonaProfileSettingsRequestAction?.request(
        getProfileSettings
      )
    )
  }, [])

  useEffect(() => {
    let categoriesCollection = null
    if (
      personaProfileSettingsData.data &&
      personaProfileSettingsData.data.length > 0
    ) {
      categoriesCollection = getCategoriesCollection(
        personaProfileSettingsData.data,
        1
      )
    }
    dispatch(fetchCategoriesRequestAction(categoriesCollection))
  }, [personaProfileSettingsData])
  // Get Category collection functions end

  useEffect(() => {
    getInstituteAdmins(instituteInfo._id)
  }, [instituteInfo._id])

  useEffect(() => {
    if (instituteAdminList.length || kamList.length) {
      setIsLoading(false)
      setSourceList([...instituteAdminList, ...kamList])
    }
  }, [instituteAdminList, kamList])

  sourceList.forEach(function (item, i) {
    if (item?.user_id === currentAdminInfo?.user_id) {
      sourceList.splice(i, 1)
      sourceList.unshift(item)
    }
  })

  let searchParams = [['name'], ['phone_number'], ['email']]
  const resultvar = userType
    ? sourceList.filter((admin) => admin?.verification_status === userType)
    : searchBoxFilter(searchText, sourceList, searchParams)

  const joinedUsers = sourceList?.filter(
    ({verification_status}) => !verification_status || verification_status === 1
  )
  const pendingUsers = sourceList?.filter(
    ({verification_status}) => verification_status === 2
  )

  const userTypeOptions = [
    {
      key: 0,
      value: `${t('uTypeOptionsValAll')} ${sourceList?.length || 0}`,
    },
    {
      key: 1,
      value: `${t('uTypeOptionsValJoined')} ${joinedUsers?.length || 0}`,
    },
    {
      key: 2,
      value: `${t('uTypeOptionsValPending')} ${pendingUsers?.length || 0}`,
    },
  ]

  const getInstituteAdmins = () => {
    getAdminProfiles()
      .then(({obj}) => {
        dispatch(instituteAdminListAction(obj?.admin))
        dispatch(kamListAction(obj?.kam))
      })
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const onAddAdminClick = () => {
    eventManager.send_event(events.CREATE_USER_CLICKED_TFI, {
      insti_id: instituteInfo?._id,
      insti_type: instituteInfo?.institute_type,
    })
    if (isPremium) {
      setSliderScreen(true)
      eventManager.send_event(events.ADD_USER_POPUP_SHOWN_TFI, {
        insti_id: instituteInfo?._id,
        insti_type: instituteInfo?.institute_type,
      })
    } else dispatch(showFeatureLockAction(true))
  }

  const handleAdminDeletion = async () => {
    if (selectedAdminCard) {
      const response = await utilsDeleteAdmin(
        selectedAdminCard._id,
        instituteInfo._id
      )
      getInstituteAdmins(instituteInfo._id)
      setShowConfirmationPopUp(false)
      if (response.status === true) {
        eventManager.send_event(events.USER_REMOVED_TFI, {
          insti_id: instituteInfo?._id,
          insti_type: instituteInfo?.institute_type,
        })
        dispatch(
          showToast({
            type: 'success',
            message: t('userDeletedSuccessfully'),
          })
        )
        setShowConfirmationPopUp(false)
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('failedToDeleteThisUser'),
          })
        )
        setShowConfirmationPopUp(false)
      }
    }
  }

  const getRoleNames = (roles, roleNameIdMap) => {
    if (typeof roles === 'string') {
      return roleNameIdMap[roles]
    }
    return roles?.map((role_id) => roleNameIdMap[role_id])
  }

  const cols = [
    {key: 'admin_details', label: t('userDetails')},
    {key: 'added_date', label: t('addedOn')},
    {key: 'role', label: t('roles')},
    {key: 'remove', label: ''},
  ]

  const mobile_cols = [
    {key: 'admin_details', label: t('userDetails')},
    {key: 'role', label: t('roles')},
  ]

  const openEditSlider = (adminData) => {
    if (
      adminData?.roles?.[0] !== ROLE_ID.KAM && // KAM role users are READ Only
      (adminData['phone_number'] !== null || adminData['email'] !== null)
    ) {
      setSelectedAdminCard(adminData)
      setShowEditSlider(true)
    }
  }

  const getRows = (admins) => {
    let rows = []
    admins?.forEach((item) => {
      rows.push({
        id: item._id,
        admin_details: (
          <UserProfile
            name={
              currentAdminInfo.user_id === item.user_id ? (
                <span style={{color: '#1DA1F2'}}>You</span>
              ) : (
                <span style={{color: '#1DA1F2'}}>
                  {item.full_name && item.full_name !== ''
                    ? item.full_name
                    : item?.name}
                </span>
              )
            }
            phoneNumber={item?.phone_number || item.email}
            joinedState={item.verification_status}
            image={item.img_url}
            handleChange={() => openEditSlider(item)}
          />
        ),
        added_date: (
          <div className="tm-para tm-para-16">
            {getDateFromTimeStamp(item.c)}
          </div>
        ),
        role: (
          <div className="tm-para-16">
            {getRoleNames(item.roles, roleNameIdMap)}
          </div>
        ),
      })
    })
    return rows
  }

  return (
    <div className="p-5">
      <div className="tm-hdg tm-hdg-28 mb-2">{t('adminDirectory')}</div>

      {sourceList?.length > 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full">
              {showConfirmationPopUp && (
                <ConfirmationPopup
                  onClose={setShowConfirmationPopUp}
                  onAction={handleAdminDeletion}
                  icon={
                    'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
                  }
                  title={`Are you sure you want to remove
                  ${selectedAdminCard.name}?`}
                  desc={
                    <div>{t('userWillBeRemovedConfirmationPopupDesc')}</div>
                  }
                  primaryBtnText={t('cancel')}
                  secondaryBtnText={t('remove')}
                  secondaryBtnStyle="tm-btn2-red"
                />
              )}
              {sliderScreen && (
                <SliderAddAdminList setSliderScreen={setSliderScreen} />
              )}
              {showEditSlider && (
                <SliderEditAdmin
                  setShowEditSlider={setShowEditSlider}
                  selectedAdminCard={selectedAdminCard}
                  isSameUser={
                    selectedAdminCard?.user_id === currentAdminInfo?.user_id
                  }
                />
              )}

              <div className="flex flex-wrap justify-between items-center p-4">
                <div className="w-full lg:w-96">
                  <SearchBox
                    value={searchText}
                    placeholder={t('adminSearchPlaceholder')}
                    handleSearchFilter={(text) => setSearchText(text)}
                  />
                </div>
                <Permission
                  permissionId={
                    PERMISSION_CONSTANTS.instituteAdminController_createRoute_create
                  }
                >
                  <Button
                    className="mt-4"
                    size="medium"
                    onClick={onAddAdminClick}
                  >
                    + Add&nbsp;User
                  </Button>
                </Permission>
              </div>

              <div className="hidden lg:block px-4">
                <RadioInput
                  value={userType}
                  fieldName="userType"
                  handleChange={(_, value) => setUserType(value)}
                  dropdownItems={userTypeOptions}
                />
              </div>
              <div className="px-4 pb-2 lg:hidden">
                <DropdownField
                  value={userType}
                  fieldName="teacherType"
                  handleChange={(_, value) => setUserType(parseInt(value))}
                  dropdownItems={userTypeOptions}
                />
              </div>
              <div className="hidden lg:block">
                <Table
                  cols={cols}
                  rows={getRows(resultvar, rolesList)}
                  className={'admin'}
                />
              </div>
              <div className="lg:hidden overflow-x-auto">
                <Table
                  rows={getRows(resultvar, rolesList)}
                  cols={mobile_cols}
                  className={'admin'}
                />
              </div>
            </div>
          </div>
        </NormalCard>
      ) : null}
      <Loader show={isLoading && isLoadingLocal} />
    </div>
  )
}

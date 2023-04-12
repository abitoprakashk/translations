import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Trans} from 'react-i18next'
import SearchBox from '../../Common/SearchBox/SearchBox'
import {utilsDeleteHostel, utilsGetHostelList} from '../../../routes/dashboard'
import {hostelListAction} from '../../../redux/actions/hostelInfoActions'
import {
  showErrorOccuredAction,
  showToast,
} from '../../../redux/actions/commonAction'
import Table from '../../Common/Table/Table'
import SliderAddHostelList from './SliderAddHostelList'
import NormalCard from '../../Common/NormalCard/NormalCard'
import '../LibraryManagement/LibraryPage.css'
import AssignSlider from './SliderAssignWarden'
import {events} from '../../../utils/EventsConstants'
import BookProfile from '../LibraryManagement/BookProfile'
import {utilsAssignWarden} from '../../../routes/dashboard'
import {showLoadingAction} from '../../../redux/actions/commonAction'
import menuIcon from '../../../assets/images/icons/three-dot-menu.svg'
import hoverMenuIcon from '../../../assets/images/icons/three-dot-menu-hover.svg'
import AdminOptionMenu from '../../AdminPage/AdminOptionMenu'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import history from '../../../history'
import {sidebarData} from '../../../utils/SidebarItems'
import accomodation from '../../../assets/images/common/accomodation.png'
import {t} from 'i18next'
import {searchBoxFilter} from '../../../utils/Helpers'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {Button} from '@teachmint/common'

export default function HostelPage() {
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false)
  const [sourceList, setSourceList] = useState([])

  const [showMenu, setShowMenu] = useState(false)
  const {hostelList, instituteInfo, eventManager} = useSelector(
    (state) => state
  )
  const [assignHostelSlider, setAssignHostelSlider] = useState(null)
  const [hostelId, setHostelId] = useState('')
  const [sliderScreen, setSliderScreen] = useState(null)

  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getHostelList()
  }, [instituteInfo])
  useEffect(() => {
    setSourceList(hostelList)
  }, [hostelList])

  let searchParams = [['name']]
  const resultvar = searchBoxFilter(searchText, sourceList, searchParams)

  const getHostelList = () => {
    utilsGetHostelList()
      .then(({data}) => dispatch(hostelListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const onAddAdminClick = () => {
    eventManager.send_event(events.ADD_NEW_HOSTEL_CLICKED_TFI)
    setSliderScreen(true)
  }

  window.addEventListener('click', () => {
    if (showMenu) setShowMenu(false)
  })

  const cols = [
    {key: 'hostel_details', label: t('hostel')},
    {key: 'type', label: t('hostelType')},
    {key: 'user', label: t('WARDEN')},
    {key: 'view_details', label: t('VIEW_DETAILS')},
    {key: 'delete', label: ''},
  ]

  const mobile_cols = [
    {key: 'hostel_details', label: t('HOSTEL_DETAILS')},
    {key: 'user', label: t('WARDEN')},
  ]

  useEffect(() => {
    if (hostelId.active == false) {
      utilsAssignWarden(hostelId.hostel_id, hostelId.iid, hostelId.active).then(
        (response) => {
          if (response.status) getHostelList()
          else dispatch(showLoadingAction(false))

          dispatch(showLoadingAction(false))
          if (response.status === true) {
            dispatch(
              showToast({
                type: 'success',
                message: t('hostelStatusUpdatedSuccessfully'),
              })
            )
          } else {
            dispatch(
              showToast({
                type: 'error',
                message: t('hostelStatusUpdationFailed'),
              })
            )
          }
        }
      )
    }
  }, [hostelId])

  const handleHostelDeletion = async () => {
    if (hostelId) {
      const response = await utilsDeleteHostel(hostelId._id)
      getHostelList()
      setShowConfirmationPopUp(false)
      if (response.status === true) {
        eventManager.send_event(events.HOSTEL_DELETED_TFI)
        dispatch(
          showToast({
            type: 'success',
            message: t('hostelDeletedSuccessfully'),
          })
        )
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('failedToDeleteThisHostel'),
          })
        )
      }
    }
  }

  const getRows = (hostels) => {
    let rows = []
    hostels?.forEach((item) => {
      rows.push({
        id: item._id,
        hostel_details: (
          <BookProfile
            image={accomodation}
            name={<span style={{color: '#1DA1F2'}}>{item.name}</span>}
            isbnNumber={item.address}
          />
        ),
        type: (
          <div className="mt-3 tm-color-text-primary tm-para-16">
            {item?.hostel_type ? item.hostel_type : 'NA'}
          </div>
        ),
        user:
          item?.iids?.length > 0 ? (
            <div>
              <BookProfile
                name={
                  <span style={{color: '#1DA1F2'}}>
                    {item?.iids[0]?.fields?.name}
                  </span>
                }
                isbnNumber={item?.iids[0]?.phone_number}
              />
            </div>
          ) : (
            <div className="mt-3 tm-color-text-primary tm-para-14">
              {'Not Assigned'}
            </div>
          ),

        view_details: <ViewDetails data={item._id} name={item.name} />,

        delete: (
          <DeleteHostel
            data={item}
            selectedAdminCard={hostelId}
            setSelectedAdminCard={setHostelId}
            setShowConfirmationPopUp={() => setShowConfirmationPopUp(true)}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            setEditSlider={setAssignHostelSlider}
          />
        ),
      })
    })
    return rows
  }

  return (
    <div className="p-5">
      <div className="tm-hdg tm-hdg-24 mb-4">{t('hostel')}</div>

      {hostelList?.length >= 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center">
            <div
              className="w-full"
              onClick={(e) => {
                e.stopPropagation()
                showMenu && setShowMenu(false)
              }}
            >
              {sliderScreen && (
                <SliderAddHostelList setSliderScreen={setSliderScreen} />
              )}

              {showConfirmationPopUp && (
                <ConfirmationPopup
                  onClose={() => {
                    eventManager.send_event(
                      events.DELETE_HOSTEL_POPUP_CLICKED_TFI,
                      {action: 'cancel'}
                    )
                    setShowConfirmationPopUp()
                  }}
                  onAction={() => {
                    eventManager.send_event(
                      events.DELETE_HOSTEL_POPUP_CLICKED_TFI,
                      {action: 'confirm'}
                    )
                    handleHostelDeletion()
                  }}
                  icon={
                    'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
                  }
                  title={t('removeHostelConfirmationPopupTitle')}
                  desc={
                    <Trans i18nKey="removeHostelConfirmationPopupDesc">
                      <div>
                        Removing the hostel will delete all data of the hostel.
                        It can&apos;t be recovered later
                      </div>
                    </Trans>
                  }
                  primaryBtnText={t('cancel')}
                  secondaryBtnText={t('remove')}
                  secondaryBtnStyle="tm-btn2-red"
                />
              )}

              {assignHostelSlider && (
                <AssignSlider
                  hostel_id={hostelId}
                  getInstituteBooks={getHostelList}
                  dispatch={dispatch}
                  setAssignBookSlider={setAssignHostelSlider}
                />
              )}
              <div className="flex flex-wrap justify-between items-center p-4">
                <div className="w-full lg:w-96">
                  <SearchBox
                    value={searchText}
                    placeholder={t('searchForHostel')}
                    handleSearchFilter={(text) => setSearchText(text)}
                  />
                </div>

                <div className="mt-3 lg:mt-0">
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.hostelController_createRoute_create
                    }
                  >
                    <Button onClick={onAddAdminClick}>{t('addHostel')}</Button>
                  </Permission>
                </div>
              </div>

              <div className="hidden lg:block">
                <Table cols={cols} rows={getRows(resultvar)} className="m-0" />
              </div>
              <div className="lg:hidden">
                <Table
                  rows={getRows(resultvar)}
                  cols={mobile_cols}
                  className="m-0"
                />
              </div>
            </div>
          </div>
        </NormalCard>
      ) : null}
    </div>
  )
}

function DeleteHostel({
  data,
  selectedAdminCard,
  setSelectedAdminCard,
  setShowConfirmationPopUp,
  showMenu,
  setShowMenu,
  setEditSlider,
}) {
  const [hoverOnMenu, setHoverOnMenu] = useState(false)
  const {eventManager} = useSelector((state) => state)
  const {_id} = data

  const handleAdminCardSelection = () => {
    setSelectedAdminCard(data)
    setShowMenu(true)
  }

  const responseAssign = {
    hostel_id: data?._id,
  }

  const responseReturn = {
    hostel_id: data?._id,
    iid: data?.iids[0]?._id,
    active: false,
  }

  const handleAdminCardSelection2 = () => {
    if (data?.iids.length > 0) setSelectedAdminCard(responseReturn)
    else {
      setSelectedAdminCard(responseAssign)
      setEditSlider(true)
    }
  }

  const activeMenusList = [
    {
      menu: t('assign'),
      data: (
        <span className="tm-hdg">
          {data?.iids.length > 0 ? t('removeWarden') : t('assignWarden')}
        </span>
      ),
      onClickHandler: (...args) => {
        handleAdminCardSelection2(args)
      },
      permissionId: PERMISSION_CONSTANTS.hostelController_associate_update,
    },
    {
      menu: t('removeHostel'),
      data: <div className="text-red">{t('deleteHostel')}</div>,
      onClickHandler: (...args) => {
        eventManager.send_event(events.DELETE_HOSTEL_CLICKED_TFI)
        setShowConfirmationPopUp(...args)
      },
      permissionId: PERMISSION_CONSTANTS.hostelController_deleteRoute_delete,
    },
  ]

  return (
    <div className="flex flex-row">
      <div className="relative inset-y-0 right-0">
        <img
          className="cursor-pointer menu-icon"
          onMouseEnter={() => setHoverOnMenu(true)}
          onMouseLeave={() => setHoverOnMenu(false)}
          src={hoverOnMenu ? hoverMenuIcon : menuIcon}
          onClick={handleAdminCardSelection}
        />
        {showMenu && _id === selectedAdminCard._id && (
          <div className="absolute top-0 right-0">
            <AdminOptionMenu
              menusList={activeMenusList}
              onClose={setShowMenu}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ViewDetails({data, name}) {
  const {eventManager} = useSelector((state) => state)
  const handleViewDetails = () => {
    eventManager.send_event(events.MANAGE_HOSTEL_CLICKED_TFI, {hostel_id: data})
    history.push({
      pathname: sidebarData.HOSTEL_MANAGEMENT.subRoutes[0],
      state: {_id: data, name: name},
    })
  }
  return (
    <div
      className="w-full lg:w-min text-right tm-hdg-12 lg:tm-hdg-14 cursor-pointer tm-cr-bl-2 mt-4 lg:mt-0"
      onClick={handleViewDetails}
    >
      {t('manage')}
    </div>
  )
}

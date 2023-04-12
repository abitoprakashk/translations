import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Trans} from 'react-i18next'
import history from '../../../history'
import SearchBox from '../../Common/SearchBox/SearchBox'
import {utilsDeleteRoom, utilsGetRoomList} from '../../../routes/dashboard'
import {hostelRoomsListAction} from '../../../redux/actions/hostelInfoActions'
import {
  showErrorOccuredAction,
  showToast,
} from '../../../redux/actions/commonAction'
import Table from '../../Common/Table/Table'
import SliderAddRoomList from './SliderAddRoomList'
import NormalCard from '../../Common/NormalCard/NormalCard'
import '../LibraryManagement/LibraryPage.css'
import AssignSlider from './SliderAssignStudent'
import {events} from '../../../utils/EventsConstants'
import BookProfile from '../LibraryManagement/BookProfile'
import {utilsAssignStudent} from '../../../routes/dashboard'
import {showLoadingAction} from '../../../redux/actions/commonAction'
import menuIcon from '../../../assets/images/icons/three-dot-menu.svg'
import hoverMenuIcon from '../../../assets/images/icons/three-dot-menu-hover.svg'
import AdminOptionMenu from '../../AdminPage/AdminOptionMenu'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import {useHistory} from 'react-router-dom'
import accomodation from '../../../assets/images/common/accomodation.png'
import {t} from 'i18next'
import {searchBoxFilter} from '../../../utils/Helpers'
import Permission from '../../Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../utils/permission.constants'
import {Button} from '@teachmint/common'
import {sidebarData} from '../../../utils/SidebarItems'

export default function RoomPage() {
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false)
  const [sourceList, setSourceList] = useState([])

  const [showMenu, setShowMenu] = useState(false)
  const {hostelRoomsList, instituteInfo, eventManager} = useSelector(
    (state) => state
  )
  const [assignRoomSlider, setAssignRoomSlider] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [sliderScreen, setSliderScreen] = useState(null)
  const {location} = useHistory()
  const hostelId = location?.state?._id
  const hostelName = location?.state?.name
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (!hostelId) {
      history.push({
        pathname: sidebarData.HOSTEL_MANAGEMENT.route,
      })
    }
  }, [])

  useEffect(() => {
    if (hostelId) {
      getRoomList(hostelId)
    }
  }, [instituteInfo])
  useEffect(() => {
    setSourceList(hostelRoomsList)
  }, [hostelRoomsList])

  let searchParams = [['name']]
  const resultvar = searchBoxFilter(searchText, sourceList, searchParams)

  const getRoomList = (hostelId) => {
    utilsGetRoomList(hostelId)
      .then(({data}) => dispatch(hostelRoomsListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const onAddAdminClick = () => {
    eventManager.send_event(events.ADD_NEW_ROOM_CLICKED_TFI, {
      hostel_id: hostelId,
    })
    setSliderScreen(true)
  }

  window.addEventListener('click', () => {
    if (showMenu) setShowMenu(false)
  })

  const cols = [
    {key: 'room_details', label: 'ROOM DETAILS'},
    {key: 'occupancy', label: 'OCCUPANCY'},
    {key: 'user', label: 'STUDENT'},
    {key: 'assign', label: 'STUDENT ACTION'},
    {key: 'delete', label: ''},
  ]

  const mobile_cols = [
    {key: 'room_details', label: 'ROOM DETAILS'},
    {key: 'user', label: 'STUDENT'},
  ]

  useEffect(() => {
    if (roomId.active == false) {
      utilsAssignStudent(roomId.room_id, roomId.iid, roomId.active).then(
        (response) => {
          if (response.status) getRoomList(hostelId)
          else dispatch(showLoadingAction(false))

          dispatch(showLoadingAction(false))
          if (response.status === true) {
            eventManager.send_event(events.STUDENT_REMOVED_TFI)
            dispatch(
              showToast({
                type: 'success',
                message: t('roomStatusUpdatedSuccessfully'),
              })
            )
          } else {
            dispatch(
              showToast({
                type: 'error',
                message: t('roomStatusUpdationFailed'),
              })
            )
          }
        }
      )
    }
  }, [roomId])

  const handleRoomDeletion = async () => {
    if (roomId) {
      const response = await utilsDeleteRoom(roomId._id)
      getRoomList(hostelId)
      setShowConfirmationPopUp(false)
      if (response.status === true) {
        eventManager.send_event(events.ROOM_DELETED_TFI)
        dispatch(
          showToast({
            type: 'success',
            message: t('roomDeletedSuccessfully'),
          })
        )
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('failedToDeleteThisRoom'),
          })
        )
      }
    }
  }

  const getRows = (rooms) => {
    let rows = []
    rooms?.forEach((item) => {
      rows.push({
        id: `${item._id}+${item.olevel}`,
        room_details: (
          <BookProfile
            image={accomodation}
            name={<span style={{color: '#1DA1F2'}}>{item.name}</span>}
            isbnNumber={item.block}
          />
        ),
        occupancy: (
          <div className="mt-3 tm-color-text-primary tm-para-14">{`Occupancy ${item.olevel}`}</div>
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
              {t('notAssigned')}
            </div>
          ),

        assign: (
          <>
            <Permission
              permissionId={
                PERMISSION_CONSTANTS.hostelRoomController_associate_update
              }
            >
              <AssignStudent
                data={item}
                key={item._id}
                setSelectedAdminCard={setRoomId}
                setEditSlider={setAssignRoomSlider}
              />
            </Permission>
          </>
        ),

        delete: (
          <DeleteRoom
            data={item}
            selectedAdminCard={roomId}
            setSelectedAdminCard={setRoomId}
            setShowConfirmationPopUp={() => setShowConfirmationPopUp(true)}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
        ),
      })
    })
    return rows
  }

  return (
    <div className="p-5">
      <div className="tm-hdg tm-hdg-24 mb-4">{`${hostelName} rooms`}</div>

      {hostelRoomsList?.length >= 0 ? (
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
                <SliderAddRoomList setSliderScreen={setSliderScreen} />
              )}

              {showConfirmationPopUp && (
                <ConfirmationPopup
                  onClose={() => {
                    eventManager.send_event(
                      events.DELETE_ROOM_POPUP_CLICKED_TFI,
                      {action: 'cancel'}
                    )
                    setShowConfirmationPopUp()
                  }}
                  onAction={() => {
                    eventManager.send_event(
                      events.DELETE_ROOM_POPUP_CLICKED_TFI,
                      {action: 'confirm'}
                    )
                    handleRoomDeletion()
                  }}
                  icon={
                    'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg'
                  }
                  title={t('roomDeleteConfirmationPopupTitle')}
                  desc={
                    <Trans i18nKey="roomDeleteConfirmationPopupDesc">
                      <div>
                        Deleting this room will remove all occupancies. They
                        can&apos;t be recovered later
                      </div>
                    </Trans>
                  }
                  primaryBtnText={t('cancel')}
                  secondaryBtnText={t('remove')}
                  secondaryBtnStyle="tm-btn2-red"
                />
              )}

              {assignRoomSlider && (
                <AssignSlider
                  room_id={roomId}
                  setAssignBookSlider={setAssignRoomSlider}
                />
              )}
              <div className="flex flex-wrap justify-between items-center p-4">
                <div className="w-full lg:w-96">
                  <SearchBox
                    value={searchText}
                    placeholder={t('searchForRooms')}
                    handleSearchFilter={(text) => setSearchText(text)}
                  />
                </div>

                <div className="mt-3 lg:mt-0">
                  <Permission
                    permissionId={
                      PERMISSION_CONSTANTS.hostelRoomController_createRoute_create
                    }
                  >
                    <Button onClick={onAddAdminClick}>
                      {t('addRoomPlus')}
                    </Button>
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

function DeleteRoom({
  data,
  selectedAdminCard,
  setSelectedAdminCard,
  setShowConfirmationPopUp,
  showMenu,
  setShowMenu,
}) {
  const [hoverOnMenu, setHoverOnMenu] = useState(false)
  const {_id, olevel} = data
  const {eventManager} = useSelector((state) => state)

  const handleAdminCardSelection = () => {
    setSelectedAdminCard(data)
    setShowMenu(true)
  }

  const activeMenusList = [
    {
      menu: 'Delete',
      data: (
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.hostelRoomController_deleteRoute_delete
          }
        >
          <div className="text-red">{t('deleteRoom')}</div>
        </Permission>
      ),
      onClickHandler: (...args) => {
        eventManager.send_event(events.DELETE_ROOM_CLICKED_TFI)
        setShowConfirmationPopUp(...args)
      },
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
        {showMenu &&
          _id === selectedAdminCard._id &&
          selectedAdminCard.olevel === olevel && (
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

function AssignStudent({data, setSelectedAdminCard, setEditSlider}) {
  const {eventManager} = useSelector((state) => state)

  const responseAssign = {
    room_id: data?._id,
  }

  const responseReturn = {
    room_id: data?._id,
    iid: data?.iids[0]?._id,
    active: false,
  }

  const handleAdminCardSelection = () => {
    if (data?.iids.length > 0) {
      setSelectedAdminCard(responseReturn)
      eventManager.send_event(events.REMOVE_STUDENT_CLICKED_TFI)
    } else {
      eventManager.send_event(events.ASSIGN_ROOM_CLICKED_TFI)
      setSelectedAdminCard(responseAssign)
      setEditSlider(true)
    }
  }

  return (
    <div className="flex flex-row">
      <div className="relative inset-y-0 right-0">
        <div
          className="w-full lg:w-min text-right tm-hdg-12 lg:tm-hdg-14 cursor-pointer tm-cr-bl-2 mt-4 lg:mt-0"
          onClick={handleAdminCardSelection}
        >
          {data?.iids.length > 0 ? t('remove') : t('assign')}
        </div>
      </div>
    </div>
  )
}

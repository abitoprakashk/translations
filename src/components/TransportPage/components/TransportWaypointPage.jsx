import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {
  utilsDeleteTransportPickup,
  utilsGetTransportPickup,
} from '../../../routes/transport'
import NormalCard from '../../Common/NormalCard/NormalCard'
import SearchBox from '../../Common/SearchBox/SearchBox'
import * as TRC from '../../../constants/transport.constants'
import {Button, Table} from '@teachmint/common'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import defaultPickupPointsImage from '../../../assets/images/dashboard/empty-pickup-points.svg'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import SubjectTooltipOptions from '../../SchoolSystem/SectionDetails/SubjectTooltipOptions'
import SliderAddTransportWaypoint from './SliderAddTransportWaypoint'
import SliderManageWaypointStudents from './SliderManageWaypointStudents'
import {events} from '../../../utils/EventsConstants'
import {searchBoxFilter} from '../../../utils/Helpers'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'

export default function TransportWaypointPage() {
  const [waypointList, setWaypointList] = useState([])
  const [filteredWaypointList, setFilteredWaypointList] = useState([])
  const [sliderScreen, setSliderScreen] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const [selectedWaypoint, setSelectedWaypoint] = useState(null)

  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const instituteStudentList = getActiveStudents(true)
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getTransportPickup()
  }, [])

  const getTransportPickup = () => {
    dispatch(showLoadingAction(true))
    utilsGetTransportPickup()
      .then(({obj}) => {
        setWaypointList(obj)
        setFilteredWaypointList(obj)
      })
      .catch(() => setToastData('error', 'Unable to get pickup point list'))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)
    let searchParams = [['name']]
    setFilteredWaypointList(searchBoxFilter(text, waypointList, searchParams))
  }

  const handleChange = (action, waypoint = null) => {
    switch (action) {
      case TRC.ACT_TRASNPORT_ADD_WAYPOINT: {
        eventManager.send_event(events.ADD_PICKUP_POINT_CLICKED_TFI)
        setSliderScreen(TRC.SCN_SLI_TRASNPORT_ADD_WAYPOINT)
        break
      }
      case TRC.ACT_TRASNPORT_DELETE_WAYPOINT: {
        eventManager.send_event(events.DELETE_PICKUP_POINT_CLICKED_TFI, {
          distance: waypoint?.distance,
          pickup_point_name: waypoint?.name,
        })
        setShowConfirmationPopup({
          title: `Are you sure you want to delete "${waypoint?.name}" pickup point?`,
          desc: 'If you delete the pickup point you will lose all the data and you will not be able recover it later.',
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: 'Cancel',
          secondaryBtnText: 'Delete',
          onAction: () => deleteTransportWaypoint(waypoint),
        })
        break
      }
      case TRC.ACT_TRASNPORT_WAYPOINT_MANAGE_STUDENTS: {
        setSliderScreen(TRC.SCN_SLI_TRASNPORT_WAYPOINT_MANAGE_STUDENTS)
        setSelectedWaypoint(waypoint)
        break
      }
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case TRC.SCN_SLI_TRASNPORT_ADD_WAYPOINT:
        return (
          <SliderAddTransportWaypoint
            setSliderScreen={setSliderScreen}
            getTransportPickup={getTransportPickup}
          />
        )
      case TRC.SCN_SLI_TRASNPORT_WAYPOINT_MANAGE_STUDENTS:
        return (
          <SliderManageWaypointStudents
            setSliderScreen={setSliderScreen}
            selectedWaypoint={selectedWaypoint}
            setSelectedWaypoint={setSelectedWaypoint}
          />
        )
      default:
        break
    }
  }

  const deleteTransportWaypoint = (waypoint) => {
    dispatch(showLoadingAction(true))
    utilsDeleteTransportPickup(waypoint?._id)
      .then(() => {
        getTransportPickup()
        eventManager.send_event(events.PICKUP_POINT_DELETED_TFI, {
          distance: waypoint?.distance,
          pickup_point_name: waypoint?.name,
        })
        setToastData('success', 'Pickup Point successfully deleted')
      })
      .catch((e) => setToastData('error', e.msg))
      .finally(() => {
        dispatch(showLoadingAction(false))
        setShowConfirmationPopup(null)
      })
  }

  const getRows = (waypointList) => {
    return waypointList?.map((item) => {
      return {
        id: item?._id,
        name: (
          <div className="tm-color-text-primary tm-para-14">{item?.name}</div>
        ),
        distance: (
          <div className="tm-color-text-primary tm-para-14">
            {item?.distance} km
          </div>
        ),
        manage_students: (
          <div
            className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
            onClick={() => {
              eventManager.send_event(events.MANAGE_STUDENTS_CLICKED_TFI, {
                screen_name: 'PICKUP_POINTS',
              })
              handleChange(TRC.ACT_TRASNPORT_WAYPOINT_MANAGE_STUDENTS, item)
            }}
          >
            Manage Students
          </div>
        ),
        num_students: (
          <div className="tm-color-text-primary tm-para-14">
            {instituteStudentList?.filter(
              ({transport_waypoint}) => item?._id === transport_waypoint
            )?.length || 0}
          </div>
        ),
        settings: (
          <SubjectTooltipOptions
            subjectItem={item}
            options={TRC.TRANSPORT_WAYPOINT_TOOLTIP_OPTIONS}
            trigger={
              <img
                src="https://storage.googleapis.com/tm-assets/icons/secondary/settings-dots-secondary.svg"
                alt=""
                className="w-4 h-4"
              />
            }
            handleChange={handleChange}
          />
        ),
      }
    })
  }

  return (
    <div>
      {showConfirmationPopup && (
        <ConfirmationPopup
          onClose={() => {
            if (showConfirmationPopup?.secondaryBtnText === 'Delete') {
              eventManager.send_event(
                events.DELETE_PICKUP_POINT_POPUP_CLICKED_TFI,
                {action: 'cancel'}
              )
            }
            setShowConfirmationPopup()
          }}
          onAction={() => {
            if (showConfirmationPopup?.secondaryBtnText === 'Delete') {
              eventManager.send_event(
                events.DELETE_PICKUP_POINT_POPUP_CLICKED_TFI,
                {action: 'confirm'}
              )
            }
            showConfirmationPopup?.onAction()
          }}
          icon={showConfirmationPopup?.imgSrc}
          title={showConfirmationPopup?.title}
          desc={showConfirmationPopup?.desc}
          primaryBtnText={showConfirmationPopup?.primaryBtnText}
          secondaryBtnText={showConfirmationPopup?.secondaryBtnText}
          secondaryBtnStyle="tm-btn2-red"
        />
      )}

      {waypointList?.length > 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="w-full lg:w-96">
              <SearchBox
                value={searchText}
                placeholder="Search for pickup point"
                handleSearchFilter={handleSearchFilter}
              />
            </div>

            <div className="mt-3 lg:mt-0">
              <Button
                onClick={() => handleChange(TRC.ACT_TRASNPORT_ADD_WAYPOINT)}
              >
                +Add&nbsp;Pickup&nbsp;Point
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <Table
              rows={getRows(filteredWaypointList)}
              cols={TRC.TRANSPORT_WAYPOINT_TABLE_HEADERS}
              className="m-0"
            />
          </div>

          <div className="lg:hidden">
            <Table
              rows={getRows(filteredWaypointList)}
              cols={TRC.TRANSPORT_WAYPOINT_TABLE_HEADERS_MOBILE}
              className="m-0"
            />
          </div>
        </NormalCard>
      ) : (
        <div className="w-full h-screen pt-20 px-6">
          <EmptyScreenV1
            image={defaultPickupPointsImage}
            title="Start adding pickup points to your institute"
            desc="There are no pickup points in your institute right now, pickup points added will appear here"
            btnText="Add Pickup Point"
            handleChange={() => handleChange(TRC.ACT_TRASNPORT_ADD_WAYPOINT)}
          />
        </div>
      )}

      <div>{getSliderScreen(sliderScreen)}</div>
    </div>
  )
}

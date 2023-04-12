import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {
  utilsDeleteTransportRoutes,
  utilsGetTransportRoutes,
} from '../../../routes/transport'
import NormalCard from '../../Common/NormalCard/NormalCard'
import SearchBox from '../../Common/SearchBox/SearchBox'
import * as TRC from '../../../constants/transport.constants'
import {Button, Table} from '@teachmint/common'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import SliderAddTransportRoute from '../components/SliderAddTransportRoute'
import defaultRouteImage from '../../../assets/images/dashboard/empty-routes.svg'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import SubjectTooltipOptions from '../../SchoolSystem/SectionDetails/SubjectTooltipOptions'
import SliderManageRouteWaypoint from './SliderManageRouteWaypoint'
import {events} from '../../../utils/EventsConstants'

export default function TransportRoutePage() {
  const [routesList, setRoutesList] = useState([])
  const [filteredRoutesList, setFilteredRoutesList] = useState([])
  const [sliderScreen, setSliderScreen] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [selectedTransportRoute, setSelectedTransportRoute] = useState(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getTrasnportRoutes()
  }, [])

  const getTrasnportRoutes = () => {
    dispatch(showLoadingAction(true))
    utilsGetTransportRoutes()
      .then(({obj}) => {
        setRoutesList(obj)
        setFilteredRoutesList(obj)
        setSelectedTransportRoute(
          obj?.find(({_id}) => _id === selectedTransportRoute?._id)
        )
      })
      .catch(() => setToastData('error', 'Unable to get routes'))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)

    if (text === '') setFilteredRoutesList(routesList)
    else {
      let tempArray = routesList?.filter((item) =>
        item?.name?.toLowerCase()?.includes(text.toLowerCase())
      )
      setFilteredRoutesList(tempArray)
    }
  }

  const handleChange = (action, route = null) => {
    switch (action) {
      case TRC.ACT_TRASNPORT_ADD_ROUTE: {
        eventManager.send_event(events.ADD_ROUTE_CLICKED_TFI)
        setSliderScreen(TRC.SCN_SLI_TRASNPORT_ADD_ROUTE)
        break
      }
      case TRC.ACT_TRASNPORT_DELETE_ROUTE: {
        eventManager.send_event(events.DELETE_ROUTE_CLICKED_TFI, {
          route_name: route?.name,
          assign_vehicle: route?.vehicle_ids[0]?._id
            ? route?.vehicle_ids[0]?._id
            : '',
          assign_staff: route?.iids.map((ele) => ele?._id),
        })
        setShowConfirmationPopup({
          title: `Are you sure you want to delete "${route?.name}" route?`,
          desc: 'If you delete the route you will lose all the data and you will not be able recover it later.',
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: 'Cancel',
          secondaryBtnText: 'Delete',
          onAction: () => deleteTransportRoute(route),
        })
        break
      }
      case TRC.ACT_TRASNPORT_ROUTE_MANAGE_WAYPOINT: {
        setSelectedTransportRoute(route)
        setSliderScreen(TRC.SCN_SLI_TRASNPORT_MANAGE_WAYPOINT)
        break
      }
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case TRC.SCN_SLI_TRASNPORT_ADD_ROUTE:
        return (
          <SliderAddTransportRoute
            setSliderScreen={setSliderScreen}
            getTrasnportRoutes={getTrasnportRoutes}
          />
        )
      case TRC.SCN_SLI_TRASNPORT_MANAGE_WAYPOINT:
        return (
          <SliderManageRouteWaypoint
            setSliderScreen={setSliderScreen}
            selectedTransportRoute={selectedTransportRoute}
            setSelectedTransportRoute={setSelectedTransportRoute}
            getTrasnportRoutes={getTrasnportRoutes}
          />
        )
      default:
        break
    }
  }

  const deleteTransportRoute = (route) => {
    dispatch(showLoadingAction(true))
    utilsDeleteTransportRoutes(route?._id)
      .then(() => {
        eventManager.send_event(events.ROUTE_DELETED_TFI, {
          route_name: route?.name,
          assign_vehicle: route?.vehicle_ids[0]?._id
            ? route?.vehicle_ids[0]?._id
            : '',
          assign_staff: route?.iids.map((ele) => ele?._id),
        })
        getTrasnportRoutes()
        setToastData('success', 'Route successfully deleted')
      })
      .catch(() => setToastData('error', 'Unable to delete route'))
      .finally(() => {
        dispatch(showLoadingAction(false))
        setShowConfirmationPopup(null)
      })
  }

  const getRows = (routesList) => {
    return routesList?.map((item) => {
      return {
        id: item?._id,
        name: (
          <div className="tm-color-text-primary tm-para-14">{item?.name}</div>
        ),
        manageWaypoint: (
          <div
            className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
            onClick={() => {
              eventManager.send_event(events.ADD_REMOVE_CLICKED_TFI, {
                screen_name: 'routes',
              })
              handleChange(TRC.ACT_TRASNPORT_ROUTE_MANAGE_WAYPOINT, item)
            }}
          >
            Add/Remove
          </div>
        ),
        pickupPoints: (
          <div className="tm-color-text-primary tm-para-14">
            {item?.pickup_ids?.length || 0}
          </div>
        ),
        vehicle: (
          <div className="tm-color-text-primary tm-para-14 whitespace-nowrap">
            {item?.vehicle_ids?.[0]?.vehicle_name
              ? `${item?.vehicle_ids?.[0]?.vehicle_name || ''} (
            ${item?.vehicle_ids?.[0]?.number || ''})`
              : 'NA'}
          </div>
        ),
        staff: (
          <div className="tm-color-text-primary tm-para-14">
            {item?.iids?.map(({name}) => name)?.join(', ') || 'NA'}
          </div>
        ),
        settings: (
          <SubjectTooltipOptions
            subjectItem={item}
            options={TRC.TRANSPORT_ROUTES_TOOLTIP_OPTIONS}
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
              eventManager.send_event(events.DELETE_ROUTE_POPUP_CLICKED_TFI, {
                action: 'cancel',
              })
            }
            setShowConfirmationPopup()
          }}
          onAction={() => {
            if (showConfirmationPopup?.secondaryBtnText === 'Delete') {
              eventManager.send_event(events.DELETE_ROUTE_POPUP_CLICKED_TFI, {
                action: 'confirm',
              })
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

      {routesList?.length > 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="w-full lg:w-96">
              <SearchBox
                value={searchText}
                placeholder="Search for route"
                handleSearchFilter={handleSearchFilter}
              />
            </div>

            <div className="mt-3 lg:mt-0">
              <Button onClick={() => handleChange(TRC.ACT_TRASNPORT_ADD_ROUTE)}>
                +Add&nbsp;Route
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <Table
              rows={getRows(filteredRoutesList)}
              cols={TRC.TRANSPORT_ROUTE_TABLE_HEADERS}
              className="m-0"
            />
          </div>

          <div className="lg:hidden">
            <Table
              rows={getRows(filteredRoutesList)}
              cols={TRC.TRANSPORT_ROUTE_TABLE_HEADERS_MOBILE}
              className="m-0"
            />
          </div>
        </NormalCard>
      ) : (
        <div className="w-full h-screen pt-20 px-6">
          <EmptyScreenV1
            image={defaultRouteImage}
            title="Start adding transport routes to your institute"
            desc="There are no routes in your institute right now, routes added will appear here"
            btnText="Add Route"
            handleChange={() => handleChange(TRC.ACT_TRASNPORT_ADD_ROUTE)}
          />
        </div>
      )}

      <div>{getSliderScreen(sliderScreen)}</div>
    </div>
  )
}

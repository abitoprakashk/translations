import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import {
  utilsDeleteTransportVehicle,
  utilsGetTransportVehicle,
} from '../../../routes/transport'
import NormalCard from '../../Common/NormalCard/NormalCard'
import SearchBox from '../../Common/SearchBox/SearchBox'
import * as TRC from '../../../constants/transport.constants'
import {Button, Table} from '@teachmint/common'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import defaultVehicleImage from '../../../assets/images/dashboard/empty-vehicles.svg'
import ConfirmationPopup from '../../Common/ConfirmationPopup/ConfirmationPopup'
import SubjectTooltipOptions from '../../SchoolSystem/SectionDetails/SubjectTooltipOptions'
import SliderAddTransportVehicle from './SliderAddTransportVehicle'
import {events} from '../../../utils/EventsConstants'

export default function TransportVehiclePage() {
  const [vehicleList, setVehicleList] = useState([])
  const [filteredVehicleList, setFilteredVehicleList] = useState([])
  const [sliderScreen, setSliderScreen] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getTrasnportVehicles()
  }, [])

  const getTrasnportVehicles = () => {
    dispatch(showLoadingAction(true))
    utilsGetTransportVehicle()
      .then(({obj}) => {
        setVehicleList(obj)
        setFilteredVehicleList(obj)
      })
      .catch(() => setToastData('error', 'Unable to get vehicle list'))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)

    if (text === '') setFilteredVehicleList(vehicleList)
    else {
      let tempArray = vehicleList?.filter(
        (item) =>
          item?.vehicle_name?.toLowerCase()?.includes(text.toLowerCase()) ||
          item?.number
            ?.toString()
            ?.toLowerCase()
            ?.includes(text.toLowerCase()) ||
          item?.type?.toString()?.toLowerCase()?.includes(text.toLowerCase())
      )
      setFilteredVehicleList(tempArray)
    }
  }

  const handleChange = (action, vehicle = null) => {
    switch (action) {
      case TRC.ACT_TRASNPORT_ADD_VEHICLE: {
        eventManager.send_event(events.ADD_VEHICLE_CLICKED_TFI)
        setSliderScreen(TRC.SCN_SLI_TRASNPORT_ADD_VEHICLE)
        break
      }
      case TRC.ACT_TRASNPORT_DELETE_VEHICLE: {
        eventManager.send_event(events.DELETE_VEHICLE_CLICKED_TFI, {
          vehicle_name: vehicle?.vehicle_name,
          vehicle_number: vehicle?.number,
          vehicle_type: vehicle?.vehicle_type,
        })
        setShowConfirmationPopup({
          title: `Are you sure you want to delete "${vehicle?.vehicle_name}" vehicle?`,
          desc: 'If you delete the vehicle you will lose all the data and you will not be able recover it later.',
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: 'Cancel',
          secondaryBtnText: 'Delete',
          onAction: () => deleteTransportVehicle(vehicle),
        })
        break
      }
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case TRC.SCN_SLI_TRASNPORT_ADD_VEHICLE:
        return (
          <SliderAddTransportVehicle
            setSliderScreen={setSliderScreen}
            getTrasnportVehicles={getTrasnportVehicles}
          />
        )
      default:
        break
    }
  }

  const deleteTransportVehicle = (vehicle) => {
    dispatch(showLoadingAction(true))
    utilsDeleteTransportVehicle(vehicle?._id)
      .then(() => {
        eventManager.send_event(events.VEHICLE_DELETED_TFI, {
          vehicle_name: vehicle?.vehicle_name,
          vehicle_number: vehicle?.number,
          vehicle_type: vehicle?.vehicle_type,
        })
        getTrasnportVehicles()
        setToastData('success', 'Vehicle successfully deleted')
      })
      .catch(() => setToastData('error', 'Unable to delete vehicle'))
      .finally(() => {
        dispatch(showLoadingAction(false))
        setShowConfirmationPopup(null)
      })
  }

  const getRows = (vehicleList) => {
    return vehicleList?.map((item) => {
      return {
        id: item?._id,
        name: (
          <div className="tm-color-text-primary tm-para-14">
            {item?.vehicle_name}
          </div>
        ),
        number: (
          <div className="tm-color-text-primary tm-para-14">{item?.number}</div>
        ),
        vehicle_type: (
          <div className="tm-color-text-primary tm-para-14">
            {item?.vehicle_type}
          </div>
        ),
        settings: (
          <SubjectTooltipOptions
            subjectItem={item}
            options={TRC.TRANSPORT_VEHICLE_TOOLTIP_OPTIONS}
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
              eventManager.send_event(events.DELETE_VEHICLE_POPUP_CLICKED_TFI, {
                action: 'cancel',
              })
            }
            setShowConfirmationPopup()
          }}
          onAction={() => {
            if (showConfirmationPopup?.secondaryBtnText === 'Delete') {
              eventManager.send_event(events.DELETE_VEHICLE_POPUP_CLICKED_TFI, {
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

      {vehicleList?.length > 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="w-full lg:w-96">
              <SearchBox
                value={searchText}
                placeholder="Search for vehicle"
                handleSearchFilter={handleSearchFilter}
              />
            </div>

            <div className="mt-3 lg:mt-0">
              <Button
                onClick={() => handleChange(TRC.ACT_TRASNPORT_ADD_VEHICLE)}
              >
                +Add&nbsp;Vehicle
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <Table
              rows={getRows(filteredVehicleList)}
              cols={TRC.TRANSPORT_VEHICLE_TABLE_HEADERS}
              className="m-0"
            />
          </div>

          <div className="lg:hidden">
            <Table
              rows={getRows(filteredVehicleList)}
              cols={TRC.TRANSPORT_VEHICLE_TABLE_HEADERS_MOBILE}
              className="m-0"
            />
          </div>
        </NormalCard>
      ) : (
        <div className="w-full h-screen pt-20 px-6">
          <EmptyScreenV1
            image={defaultVehicleImage}
            title="Start adding vehicle to your institute"
            desc="There are no vehicles in your institute right now, vehicles added will appear here"
            btnText="Add Vehicle"
            handleChange={() => handleChange(TRC.ACT_TRASNPORT_ADD_VEHICLE)}
          />
        </div>
      )}

      <div>{getSliderScreen(sliderScreen)}</div>
    </div>
  )
}

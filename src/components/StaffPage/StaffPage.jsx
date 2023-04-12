import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../redux/actions/commonAction'
import NormalCard from '../Common/NormalCard/NormalCard'
import SearchBox from '../Common/SearchBox/SearchBox'
import * as STC from '../../constants/staff.constants'
import {Button, Table} from '@teachmint/common'
import EmptyScreenV1 from '../Common/EmptyScreenV1/EmptyScreenV1'
import SliderAddStaff from './components/SliderAddStaff'
import defaultStaffImage from '../../assets/images/dashboard/empty-staff.svg'
import ConfirmationPopup from '../Common/ConfirmationPopup/ConfirmationPopup'
import SubjectTooltipOptions from '../SchoolSystem/SectionDetails/SubjectTooltipOptions'
import {utilsDeleteStaff, utilsGetStaff} from '../../routes/staff'
import {events} from '../../utils/EventsConstants'

export default function StaffPage() {
  const [staffList, setStaffList] = useState([])
  const [filteredStaffList, setFilteredStaffList] = useState([])
  const [sliderScreen, setSliderScreen] = useState(null)
  const [searchText, setSearchText] = useState('')
  // const [selectedStaffMember, setSelectedStaffMember] = useState(null)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(null)
  const {eventManager} = useSelector((state) => state)

  const dispatch = useDispatch()
  const setToastData = (type, message) => dispatch(showToast({type, message}))

  useEffect(() => {
    getStaffList()
  }, [])

  const getStaffList = () => {
    dispatch(showLoadingAction(true))
    utilsGetStaff()
      .then(({obj}) => {
        setStaffList(obj)
        setFilteredStaffList(obj)
      })
      .catch(() => setToastData('error', 'Unable to get staff'))
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)

    if (text === '') setFilteredStaffList(staffList)
    else {
      let tempArray = staffList?.filter((item) =>
        item?.name
          ?.toLowerCase()
          ?.replace('  ', ' ')
          ?.includes(text.toLowerCase())
      )
      setFilteredStaffList(tempArray)
    }
  }

  const handleChange = (action, staff = null) => {
    switch (action) {
      case STC.ACT_STAFF_ADD: {
        eventManager.send_event(events.ADD_STAFF_CLICKED_TFI)
        setSliderScreen(STC.SCN_SLI_STAFF_ADD)
        break
      }
      case STC.ACT_STAFF_DELETE: {
        eventManager.send_event(events.DELETE_STAFF_CLICKED_TFI, {
          type: staff?.staff_type,
        })
        setShowConfirmationPopup({
          title: `Are you sure you want to delete ${staff?.name} staff?`,
          desc: 'If you delete the staff you will lose all data and you will not be able recover it later ever.',
          imgSrc:
            'https://storage.googleapis.com/tm-assets/icons/colorful/remove-bg-red.svg',
          primaryBtnText: 'Cancel',
          secondaryBtnText: 'Delete',
          onAction: () => deleteStaff(staff),
        })
        break
      }
    }
  }

  const getSliderScreen = (id) => {
    switch (id) {
      case STC.SCN_SLI_STAFF_ADD:
        return (
          <SliderAddStaff
            setSliderScreen={setSliderScreen}
            getStaffList={getStaffList}
          />
        )

      default:
        break
    }
  }

  const deleteStaff = (staff) => {
    dispatch(showLoadingAction(true))
    utilsDeleteStaff(staff?._id)
      .then(() => {
        eventManager.send_event(events.STAFF_DELETED_TFI, {
          type: staff?.staff_type,
        })
        getStaffList()
        setToastData('success', 'Staff successfully deleted')
      })
      .catch(() => setToastData('error', 'Unable to delete staff'))
      .finally(() => {
        dispatch(showLoadingAction(false))
        setShowConfirmationPopup(null)
      })
  }

  const getRows = (staffList) =>
    staffList
      ?.filter(
        ({staff_type}) => staff_type === 'Driver' || staff_type === 'Conductor'
      )
      .map((item) => {
        return {
          id: item?._id,
          name: (
            <div className="tm-color-text-primary tm-para-14">{item?.name}</div>
          ),
          phone_number: (
            <div className="tm-color-text-primary tm-para-14">
              {item?.phone_number}
            </div>
          ),
          type: (
            <div className="tm-color-text-primary tm-para-14">
              {item?.staff_type}
            </div>
          ),
          settings: (
            <SubjectTooltipOptions
              subjectItem={item}
              options={STC.STAFF_TOOLTIP_OPTIONS}
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

  return (
    <div>
      {showConfirmationPopup && (
        <ConfirmationPopup
          onClose={() => {
            if (showConfirmationPopup?.secondaryBtnText === 'Delete') {
              eventManager.send_event(events.DELETE_STAFF_POPUP_CLICKED_TFI, {
                action: 'cancel',
              })
            }
            setShowConfirmationPopup()
          }}
          onAction={() => {
            if (showConfirmationPopup?.secondaryBtnText === 'Delete') {
              eventManager.send_event(events.DELETE_STAFF_POPUP_CLICKED_TFI, {
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

      {staffList?.length > 0 ? (
        <NormalCard>
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="w-full lg:w-96">
              <SearchBox
                value={searchText}
                placeholder="Search for staff members"
                handleSearchFilter={handleSearchFilter}
              />
            </div>

            <div className="mt-3 lg:mt-0">
              <Button onClick={() => handleChange(STC.ACT_STAFF_ADD)}>
                +Add&nbsp;Staff
              </Button>
            </div>
          </div>

          <Table
            rows={getRows(filteredStaffList)}
            cols={STC.STAFF_TABLE_HEADERS}
            className="m-0"
          />
        </NormalCard>
      ) : (
        <div className="w-full h-screen pt-20 px-6">
          <EmptyScreenV1
            image={defaultStaffImage}
            title="Start adding staff to your institute"
            desc="There are no staff in your institute right now, staff added will appear here"
            btnText="Add Staff"
            handleChange={() => handleChange(STC.ACT_STAFF_ADD)}
          />
        </div>
      )}

      <div>{getSliderScreen(sliderScreen)}</div>
    </div>
  )
}

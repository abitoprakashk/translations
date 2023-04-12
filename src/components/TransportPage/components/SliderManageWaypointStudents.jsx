import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {instituteStudentListAction} from '../../../redux/actions/instituteInfoActions'
import {utilsGetUsersList} from '../../../routes/dashboard'
import {utilsManagePickupStudents} from '../../../routes/transport'
import {events} from '../../../utils/EventsConstants'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import CheckBoxListWithSearch from '../../SchoolSystem/SectionDetails/ImportStudents/CheckBoxListWithSearch'
import {getPropKey} from '../../SchoolSystem/SectionDetails/SliderStudent'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'
import {INSTITUTE_MEMBER_TYPE} from '../../../constants/institute.constants'

export default function SliderManageWaypointStudents({
  setSliderScreen,
  selectedWaypoint,
  setSelectedWaypoint,
}) {
  const onClose = () => {
    setSliderScreen(null)
    setSelectedWaypoint(null)
  }

  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const instituteStudentList = getActiveStudents(true)

  const handleSubmit = (data) => {
    const addStudents = [],
      removeStudents = []

    if (data && Array.isArray(data)) {
      data?.forEach(({_id, checked, transport_waypoint}) => {
        if (checked) addStudents.push(_id)
        else if (selectedWaypoint?._id === transport_waypoint)
          removeStudents.push(_id)
      })
    }

    eventManager.send_event(events.UPDATE_TRANSPORT_STUDENT_CLICKED_TFI, {
      added_students: addStudents,
      removed_students: removeStudents,
    })

    utilsManagePickupStudents({
      pickup_id: selectedWaypoint?._id,
      to_add_iids: addStudents,
      to_remove_iids: removeStudents,
    })
      .then(() => {
        dispatch(showLoadingAction(true))
        utilsGetUsersList({type: [INSTITUTE_MEMBER_TYPE.STUDENT]})
          .then(({status, obj}) => {
            if (status) {
              dispatch(instituteStudentListAction(obj))
              onClose()
            }
          })
          .catch(() => dispatch(showErrorOccuredAction(true)))
          .finally(() => dispatch(showLoadingAction(false)))
      })
      .catch(() =>
        dispatch(
          showToast({type: 'error', message: 'Unable to delete pickup point'})
        )
      )
      .finally(() => dispatch(showLoadingAction(false)))
  }

  const addedStudents =
    instituteStudentList?.filter(
      ({transport_waypoint}) => selectedWaypoint?._id === transport_waypoint
    ) || []
  const notAddedStudents =
    instituteStudentList?.filter(
      ({transport_waypoint}) => selectedWaypoint?._id !== transport_waypoint
    ) || []

  return (
    <SliderScreen setOpen={onClose}>
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title={`Assign students to ${selectedWaypoint?.name}`}
        />

        <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
          <div className="tm-hdg tm-hdg-16 mb-4">
            Students added: {addedStudents?.length || 0}
          </div>

          <CheckBoxListWithSearch
            list={[...addedStudents, ...notAddedStudents].map((item) => {
              return {
                ...item,
                title: item.name,
                checked: selectedWaypoint?._id === item?.transport_waypoint,
                num: item._id,
              }
            })}
            extraField={getPropKey}
            primaryButtonText={`Update`}
            onSubmit={handleSubmit}
            submitDisableAllowed={false}
          />
        </div>
      </>
    </SliderScreen>
  )
}

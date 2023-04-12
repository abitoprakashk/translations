import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import UserProfile from '../../Common/UserProfile/UserProfile'
import {useSelector, useDispatch} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {utilsAssignStudent, utilsGetRoomList} from '../../../routes/dashboard'
import {showLoadingAction} from '../../../redux/actions/commonAction'
import {useEffect, useState} from 'react'
import {showToast} from '../../../redux/actions/commonAction'
import SearchBox from '../../Common/SearchBox/SearchBox'
import {hostelRoomsListAction} from '../../../redux/actions/hostelInfoActions'
import {showErrorOccuredAction} from '../../../redux/actions/commonAction'
import {useHistory} from 'react-router-dom'
import {events} from '../../../utils/EventsConstants'
import {searchBoxFilter} from '../../../utils/Helpers'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'

export default function AssignSlider({room_id, setAssignBookSlider}) {
  const dispatch = useDispatch()
  const {eventManager} = useSelector((state) => state)
  const instituteStudentList = getActiveStudents(true)
  const {t} = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])
  useEffect(() => {
    setFilteredStudents(instituteStudentList)
  }, [instituteStudentList])
  const {location} = useHistory()
  const hostelId = location.state._id

  const close = () => setAssignBookSlider(null)

  const getRoomList = (hostelId) => {
    utilsGetRoomList(hostelId)
      .then(({data}) => dispatch(hostelRoomsListAction(data)))
      .catch(() => dispatch(showErrorOccuredAction(true)))
  }

  const handleSearchFilter = (text) => {
    setSearchText(text)
    let searchParams = [['name']]
    setFilteredStudents(
      searchBoxFilter(text, instituteStudentList, searchParams)
    )
  }

  const handleChange = (user_id) => {
    utilsAssignStudent(room_id.room_id, user_id, true).then((response) => {
      if (response.status) getRoomList(hostelId)
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      if (response.status === true) {
        eventManager.send_event(events.ROOM_ASSIGNED_TFI)
        dispatch(
          showToast({
            type: 'success',
            message: t('roomStatusUpdatedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('roomStatusUpdationFailed'),
          })
        )
        close()
      }
      setAssignBookSlider(false)
    })
  }

  return (
    <>
      <SliderScreen setOpen={() => setAssignBookSlider(null)}>
        <>
          <SliderScreenHeader
            icon="https://storage.googleapis.com/tm-assets/icons/primary/students-primary.svg"
            title={t('assignStudent')}
          />

          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <div>
              <div className="">
                <>
                  <div className="w-full">
                    <SearchBox
                      value={searchText}
                      placeholder={t('searchForUser')}
                      handleSearchFilter={handleSearchFilter}
                    />
                  </div>

                  <div>
                    {filteredStudents &&
                      filteredStudents.map(
                        ({
                          _id,
                          img_url,
                          verification_status,
                          enrollment_number,
                          phone_number,
                          name,
                        }) => (
                          <div
                            key={_id}
                            className="flex items-center justify-between tm-bdr-b-gy-2 py-5"
                          >
                            <UserProfile
                              image={img_url}
                              name={name}
                              phoneNumber={
                                enrollment_number?.trim()
                                  ? `${enrollment_number}`
                                  : phone_number
                              }
                              joinedState={verification_status}
                            />
                            <div
                              className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
                              onClick={() => {
                                handleChange(_id)
                              }}
                            >
                              {t('assign')}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </>
              </div>
            </div>
          </div>
        </>
      </SliderScreen>
    </>
  )
}

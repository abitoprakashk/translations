import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import UserProfile from '../../Common/UserProfile/UserProfile'
import {useSelector, useDispatch} from 'react-redux'
import {utilsAssignWarden} from '../../../routes/dashboard'
import {showLoadingAction} from '../../../redux/actions/commonAction'
import {useEffect, useState} from 'react'
import {showToast} from '../../../redux/actions/commonAction'
import SearchBox from '../../Common/SearchBox/SearchBox'
import {useTranslation} from 'react-i18next'

export default function AssignSlider({
  hostel_id,
  getInstituteBooks,
  setAssignBookSlider,
}) {
  const dispatch = useDispatch()
  const {instituteAdminList} = useSelector((state) => state)
  const {t} = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])
  useEffect(() => {
    setFilteredStudents(instituteAdminList)
  }, [instituteAdminList])

  const close = () => setAssignBookSlider(null)

  const handleSearchFilter = (text) => {
    setSearchText(text)

    if (text === '') setFilteredStudents(instituteAdminList)
    else {
      let tempArray = instituteAdminList.filter(
        (teacher) =>
          teacher.name &&
          teacher.name
            .toLowerCase()
            .replace('  ', ' ')
            .includes(text.toLowerCase())
      )
      setFilteredStudents(tempArray)
    }
  }

  const handleChange = (user_id) => {
    utilsAssignWarden(hostel_id.hostel_id, user_id, true).then((response) => {
      if (response.status) getInstituteBooks()
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      if (response.status === true) {
        dispatch(
          showToast({
            type: 'success',
            message: t('hostelStatusUpdatedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('hostelStatusUpdationFailed'),
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
            title="Assign Hostel Warden"
          />

          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <div>
              <div className="">
                <>
                  <div className="w-full">
                    <SearchBox
                      value={searchText}
                      placeholder="Search for User"
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
                          phone_number,
                          email,
                          name,
                        }) => (
                          <div
                            key={_id}
                            className="flex items-center justify-between tm-bdr-b-gy-2 py-5"
                          >
                            <UserProfile
                              image={img_url}
                              name={name}
                              phoneNumber={phone_number || email}
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

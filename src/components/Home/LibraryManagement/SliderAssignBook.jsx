import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import UserProfile from '../../Common/UserProfile/UserProfile'
import {useSelector, useDispatch} from 'react-redux'
import {utilsAssignBook} from '../../../routes/dashboard'
import {showLoadingAction} from '../../../redux/actions/commonAction'
import {useEffect, useState} from 'react'
import {showToast} from '../../../redux/actions/commonAction'
import SearchBox from '../../Common/SearchBox/SearchBox'
import {useTranslation} from 'react-i18next'
import {events} from '../../../utils/EventsConstants'
import {searchBoxFilter} from '../../../utils/Helpers'
import {getActiveStudents} from '../../../redux/reducers/CommonSelectors'

export default function AssignSlider({
  book_id,
  getInstituteBooks,
  setAssignBookSlider,
}) {
  const dispatch = useDispatch()
  const {eventManager, instituteBooksList} = useSelector((state) => state)
  const instituteStudentList = getActiveStudents(true)
  const {t} = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])
  useEffect(() => {
    setFilteredStudents(instituteStudentList)
  }, [instituteStudentList])
  const close = () => setAssignBookSlider(null)

  const handleSearchFilter = (text) => {
    setSearchText(text)
    let searchParams = [['name']]
    setFilteredStudents(
      searchBoxFilter(text, instituteStudentList, searchParams)
    )
  }

  const handleChange = (user_id) => {
    utilsAssignBook(book_id.book_id, user_id, true).then((response) => {
      if (response.status) getInstituteBooks()
      else dispatch(showLoadingAction(false))

      dispatch(showLoadingAction(false))
      const studentAssigned = instituteStudentList.find((student) => {
        if (student?._id === user_id) {
          return true
        }
      })
      if (response.status === true) {
        const selectedBook = instituteBooksList.find(
          (book) => book?._id === book_id?.book_id
        )
        eventManager.send_event(events.BOOK_ASSIGNED_TFI, {
          student_id: studentAssigned?._id,
          ISBN_no: selectedBook?.isbn_code,
        })
        eventManager.send_event(events.BOOK_STATUS_UPDATED_TFI, {
          status: 'assign',
          ISBN_no: selectedBook?.isbn_code,
        })
        dispatch(
          showToast({
            type: 'success',
            message: t('bookStatusUpdatedSuccessfully'),
          })
        )
        close()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('bookStatusUpdationFailed'),
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
            title={t('updateBookUser')}
          />

          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <div>
              <div className="">
                <>
                  <div className="w-full">
                    <SearchBox
                      value={searchText}
                      placeholder={t('searchForStudent')}
                      handleSearchFilter={(value) => handleSearchFilter(value)}
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

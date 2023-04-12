import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import SearchBox from '../../Common/SearchBox/SearchBox'
import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import UserProfile from '../../Common/UserProfile/UserProfile'
import SliderAddTeacher from './SliderAddTeacher'
import * as SHC from '../../../utils/SchoolSetupConstants'
import {SECTION_TEACHER_SLIDER_TABS} from '../../../utils/HierarchyOptions'
import {
  showErrorOccuredAction,
  showLoadingAction,
  showToast,
} from '../../../redux/actions/commonAction'
import {
  utilsAssignClassTeacher,
  utilsAssignSubjectTeacher,
} from '../../../routes/instituteSystem'
import defaultTeacherImage from '../../../assets/images/dashboard/empty-teacher.png'
import EmptyScreenV1 from '../../Common/EmptyScreenV1/EmptyScreenV1'
import {events} from '../../../utils/EventsConstants'
import {useTranslation} from 'react-i18next'
import {getActiveTeachers} from '../../../redux/reducers/CommonSelectors'

export default function SliderTeacher({
  callback = () => {},
  setSliderScreen,
  nodeDetails = null,
}) {
  const [selectedTab, setSelectedTab] = useState(SHC.SCN_SLI_TEACHER_DIRECTORY)
  const [assignClassTeacherCheckbox, handleAssignClassTeacherCheckbox] =
    useState(nodeDetails?.isClassTeacher ? true : false)
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [searchText, setSearchText] = useState('')

  const {eventManager} = useSelector((state) => state)
  const instituteTeacherList = getActiveTeachers(true)
  const dispatch = useDispatch()
  const {t} = useTranslation()

  useEffect(() => {
    setFilteredTeachers([...instituteTeacherList])
    if (nodeDetails?.isCoTeacher) handleCoTeacherFilter()
    if (instituteTeacherList?.length === 0)
      setSelectedTab(SHC.SCN_SLI_ADD_TEACHER)
  }, [instituteTeacherList])

  const handleSearchFilter = (text) => {
    setSearchText(text)

    if (text === '') {
      setFilteredTeachers(instituteTeacherList)
    } else {
      let tempArray = instituteTeacherList.filter(
        (teacher) =>
          teacher?.name
            ?.toLowerCase()
            .replace('  ', ' ')
            .includes(text.toLowerCase()) ||
          teacher?.phone_number?.toString().includes(text) ||
          teacher?.email?.toString().includes(text)
      )
      setFilteredTeachers(tempArray)
    }
  }

  const handleCoTeacherFilter = () => {
    const coTeacherIds = nodeDetails?.co_teacher_detail?.map(
      (teacher) => teacher._id
    )
    let tempArray = instituteTeacherList.filter((teacher) => {
      if (!coTeacherIds.includes(teacher._id)) return teacher
    })
    setFilteredTeachers(tempArray)
  }

  const handleChange = (teacherId) => {
    if (assignClassTeacherCheckbox) assignClassTeacher(teacherId)
    if (
      nodeDetails?.isCoTeacher &&
      nodeDetails?.co_teacher_detail?.length >= 6
    ) {
      dispatch(
        showToast({
          type: 'error',
          message: t('coTeachersMaxValidation'),
        })
      )
      return
    }
    const tags = nodeDetails?.isCoTeacher ? ['CO_TEACHER'] : []
    assignSubjectTeacher(teacherId, tags)
  }

  const assignClassTeacher = (teacherId) => {
    if (nodeDetails?.parentId && teacherId) {
      dispatch(showLoadingAction(true))
      eventManager.send_event(events.ASSIGN_CLASS_TEACHER_CLICKED_TFI, {
        section_id: nodeDetails?.parentId,
      })
      utilsAssignClassTeacher(nodeDetails?.parentId, teacherId)
        .then(({status}) => {
          if (status) {
            eventManager.send_event(events.CLASS_TEACHER_ASSIGNED_TFI, {
              section_id: nodeDetails?.parentId,
            })
            dispatch(
              showToast({
                type: 'success',
                message: t('classTeacherAddedSuccessfully'),
              })
            )
            callback(true)
          } else {
            dispatch(
              showToast({
                type: 'error',
                message: t('unableToAddAsClassTeacher'),
              })
            )
            setSliderScreen(null)
          }
        })
        .catch((_err) => dispatch(showErrorOccuredAction(true)))
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  const assignSubjectTeacher = (teacherId, tags) => {
    if (nodeDetails?.id && teacherId && !nodeDetails?.isClassTeacher) {
      !nodeDetails?.isCoTeacher &&
        eventManager.send_event(events.ASSIGN_SUBJECT_TEACHER_CLICKED_TFI, {
          section_id: nodeDetails?.classroomName,
          class_id: nodeDetails?.id,
        })
      dispatch(showLoadingAction(true))
      utilsAssignSubjectTeacher(nodeDetails?.id, teacherId, tags)
        .then(() => {
          eventManager.send_event(
            nodeDetails?.isCoTeacher
              ? events.CO_TEACHER_ASSIGNED_TFI
              : events.SUBJECT_TEACHER_ASSIGNED_TFI,
            {
              section_id: nodeDetails?.parent?.name,
              class_id: nodeDetails?.id,
            }
          )
          dispatch(
            showToast({
              type: 'success',
              message: `Successfully added as a ${
                nodeDetails?.isCoTeacher ? 'co-' : ''
              } teacher`,
            })
          )
          callback(true)
        })
        .catch(() =>
          dispatch(
            showToast({
              type: 'error',
              message: t('unableToAssignSubjectTeacher'),
            })
          )
        )
        .finally(() => dispatch(showLoadingAction(false)))
    }
  }

  return (
    <SliderScreen setOpen={() => setSliderScreen(null)} width="900">
      <>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title={`Assign ${nodeDetails?.name || 'Class'} ${
            nodeDetails?.isCoTeacher ? 'Co-' : ''
          }Teacher for ${nodeDetails?.classroomName}`}
          options={SECTION_TEACHER_SLIDER_TABS}
          optionsSelected={selectedTab}
          handleChange={setSelectedTab}
        />
        {selectedTab === SHC.SCN_SLI_TEACHER_DIRECTORY ? (
          <div className="p-5 lg:p-10 h-4/5 overflow-y-auto">
            <div>
              {instituteTeacherList?.length > 0 ? (
                <>
                  <div className="w-full">
                    <SearchBox
                      value={searchText}
                      placeholder={t('searchForTeacher')}
                      handleSearchFilter={handleSearchFilter}
                    />
                  </div>

                  <div
                    className="tm-hdg-14 tm-cr-bl-2 my-5 cursor-pointer"
                    onClick={() => {
                      setSelectedTab(SHC.SCN_SLI_ADD_TEACHER)
                      eventManager.send_event(events.ADD_TEACHER_CLICKED, {
                        screen_name: 'teacher_slider',
                      })
                    }}
                  >
                    {t('addNewTeacher')}
                  </div>

                  <div>
                    {filteredTeachers &&
                      filteredTeachers.map(
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
                              phoneNumber={phone_number ? phone_number : email}
                              joinedState={verification_status}
                            />
                            <div
                              className="tm-hdg-14 tm-cr-bl-2 cursor-pointer"
                              onClick={() => handleChange(_id, name)}
                            >
                              {t('assign')}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </>
              ) : (
                <EmptyScreenV1
                  image={defaultTeacherImage}
                  title={t('addingTeachersEmptyScreenTitle')}
                  desc={t('addingTeachersEmptyScreenDesc')}
                  btnText={t('addTeachers')}
                  handleChange={() => setSelectedTab(SHC.SCN_SLI_ADD_TEACHER)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-4/5">
            <SliderAddTeacher
              callback={(teacherId) => {
                // Call Assign Teacher to subject or class
                handleChange(teacherId)
                setSliderScreen(null)
              }}
              // nodeDetails={sectionDetails}
              nodeDetails={nodeDetails}
              showAssignClassTeacherCheckbox={
                nodeDetails?.id
                  ? !nodeDetails?.class_teacher?.phone_number
                  : false
              }
              assignClassTeacherCheckbox={assignClassTeacherCheckbox}
              handleAssignClassTeacherCheckbox={
                handleAssignClassTeacherCheckbox
              }
            />
          </div>
        )}
      </>
    </SliderScreen>
  )
}

import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import UserProfile from '../../Common/UserProfile/UserProfile'
import styles from './SliderRemoveCoTeacher.module.css'
import {utilsRemoveSubjectCoTeacher} from '../../../routes/instituteSystem'
import {useDispatch, useSelector} from 'react-redux'
import {showLoadingAction, showToast} from '../../../redux/actions/commonAction'
import classNames from 'classnames'
import {events} from '../../../utils/EventsConstants'

export default function SliderRemoveCoTeacher({
  callback,
  nodeId,
  coTeacherList,
  setSliderScreen,
  sectionId,
}) {
  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const handleChange = (id, name) => {
    removeSubjectCoTeacher([id], name)
  }

  const removeAllCoTeachers = () => {
    const teacherIds = coTeacherList.map((teacher) => teacher._id)
    removeSubjectCoTeacher(teacherIds, 'All teacher')
  }

  const removeSubjectCoTeacher = (teacherIds, teacherName) => {
    dispatch(showLoadingAction(true))
    utilsRemoveSubjectCoTeacher(nodeId, teacherIds)
      .then(() => {
        eventManager.send_event(events.CO_TEACHER_REMOVED_TFI, {
          section_id: sectionId,
          class_id: nodeId,
        })
        dispatch(
          showToast({
            type: 'success',
            message: `${teacherName} has been removed as co teacher`,
          })
        )
        callback(true)
      })
      .catch(() => {
        dispatch(
          showToast({
            type: 'error',
            message: `Unable to remove co teacher`,
          })
        )
      })
      .finally(() => dispatch(showLoadingAction(false)))
  }
  return (
    <>
      <SliderScreen setOpen={() => setSliderScreen(null)}>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title="Co Teacher(s)"
        />

        {coTeacherList?.length > 0 && (
          <>
            <div className={styles.removeAll} onClick={removeAllCoTeachers}>
              Remove All
            </div>
            <div>
              <div className={styles.coTeacherListContainer}>
                {coTeacherList.map(
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
                      className={classNames(
                        styles.teacherContainer,
                        'tm-bdr-b-gy-2'
                      )}
                    >
                      <UserProfile
                        image={img_url}
                        name={name}
                        phoneNumber={
                          phone_number !== null && phone_number !== ''
                            ? phone_number
                            : email
                        }
                        joinedState={verification_status}
                      />
                      <div
                        className={styles.removeCoTeacher}
                        onClick={() => handleChange(_id, name)}
                      >
                        Remove
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </SliderScreen>
    </>
  )
}

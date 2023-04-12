import SliderScreen from '../../Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../Common/SliderScreenHeader/SliderScreenHeader'
import UserProfile from '../../Common/UserProfile/UserProfile'
import styles from './SliderCoTeacherList.module.css'
import classNames from 'classnames'

export default function SliderCoTeacherList({coTeacherList, setSliderScreen}) {
  return (
    <>
      <SliderScreen setOpen={() => setSliderScreen(null)}>
        <SliderScreenHeader
          icon="https://storage.googleapis.com/tm-assets/icons/primary/teacher-primary.svg"
          title="Co Teacher(s)"
        />
        <div className={styles.coTeacherListContainer}>
          {coTeacherList.map((item) => (
            <div
              key={item.phone_number}
              className={classNames('tm-bdr-b-gy-2', styles.teacherContainer)}
            >
              <UserProfile
                image={item.img_url}
                name={item.name}
                phoneNumber={item.phone_number || item.email}
                joinedState={item.verification_status}
              />
            </div>
          ))}
        </div>
      </SliderScreen>
    </>
  )
}

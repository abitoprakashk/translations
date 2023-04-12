import {AvatarGroup, AVATAR_CONSTANTS, Para} from '@teachmint/krayon'
import {useTranslation} from 'react-i18next'
import UserInfo from '../../../../../../../../../components/Common/Krayon/UserInfo'

import styles from './SubjectCard.module.css'

const SubjectTeacher = ({
  teacher,
  coTeachers,
  showDesignation = false,
  size = AVATAR_CONSTANTS.SIZE.MEDIUM,
}) => {
  const {t} = useTranslation()

  return (
    <>
      {teacher && (
        <UserInfo
          name={teacher?.full_name || teacher?.name}
          profilePic={teacher?.img_url}
          avatarSize={size}
          designation={showDesignation ? t('teacher') : null}
        />
      )}
      {!teacher && coTeachers && coTeachers.length > 0 && (
        <>
          <AvatarGroup
            data={coTeachers.map(({_id, full_name, name, img_url}) => ({
              id: _id,
              name: full_name || name,
              imgSrc: img_url,
            }))}
            showToolTip
            size={size}
            className={styles.avatarGroup}
          />
          <span className={styles.coteacher}>({t('coTeacher')})</span>
        </>
      )}
      {!teacher && !(coTeachers && coTeachers.length > 0) && (
        <Para className={styles.semiBold}>{t('teacherNotAssigned')}</Para>
      )}
    </>
  )
}

export default SubjectTeacher

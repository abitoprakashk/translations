import styles from './StudentDetailsColumn.module.css'
import {Avatar, AVATAR_CONSTANTS} from '@teachmint/krayon'

export default function StudentDetailsColumn({student}) {
  return (
    <div className={styles.flexHorizontal}>
      <Avatar
        imgSrc={student?.imgUrl}
        name={student?.fullName || '-'}
        onClick={() => {}}
        size={AVATAR_CONSTANTS.SIZE.MEDIUM}
        variant={AVATAR_CONSTANTS.VARIANTS[2]}
      />

      <div className={styles.flexVertical}>
        <span>{student?.fullName || '-'}</span>
        <div className={styles.phoneNumber}>
          {student?.phoneNumber
            ? student.phoneNumber
            : student?.email
            ? student.email
            : '-'}
        </div>
      </div>
    </div>
  )
}

import userDetailsStyles from './UserDetailsRow.module.css'
import {Avatar, Para, PARA_CONSTANTS} from '@teachmint/krayon'

const UserDetailsRow = ({data}) => {
  const fullName = data?.full_name || data?.name
  return (
    <div className={userDetailsStyles.userProfile}>
      <Avatar imgSrc={data?.img_url} name={fullName} />
      <div>
        <Para
          type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}
          textSize={PARA_CONSTANTS.TEXT_SIZE.LARGE}
          weight={PARA_CONSTANTS.WEIGHT.MEDIUM}
        >
          {fullName}
        </Para>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          weight={PARA_CONSTANTS.WEIGHT.REGULAR}
        >
          {data?.phone_number || ''}
        </Para>
      </div>
    </div>
  )
}

export default UserDetailsRow

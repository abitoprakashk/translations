import React from 'react'
import OnLeaveCard from './onLeaveCard'
import UpcomingLeaveCard from './upcomingLeaveCard'
import HorizontalSwiper from '../../../../../components/Common/HorizontalSwiper'
import {useSelector} from 'react-redux'
import styles from './styles.module.scss'
import {IS_MOBILE} from '../../../../../constants'
import classNames from 'classnames'

const StaffOnLeaveCardList = ({upcoming = false}) => {
  const list = useSelector((state) => state.leaveManagement.upcomingLeaves.data)

  return (
    <>
      <HorizontalSwiper
        sideSpan={IS_MOBILE ? 16 : 20}
        className={classNames(styles.listWrapper, {
          [styles.showScrollbar]:
            !IS_MOBILE && navigator.platform.indexOf('Win') > -1,
        })}
      >
        {list.map((leave) =>
          upcoming ? (
            <UpcomingLeaveCard leave={leave} key={leave._id} />
          ) : (
            <OnLeaveCard leave={leave} key={leave._id} />
          )
        )}
      </HorizontalSwiper>
    </>
  )
}

export default StaffOnLeaveCardList

import {useSelector} from 'react-redux'

export const getLeaveWidget = () => {
  const leaveWidgetData = useSelector(
    (store) => store?.globalData?.leaveWidgetData
  )
  return leaveWidgetData
}

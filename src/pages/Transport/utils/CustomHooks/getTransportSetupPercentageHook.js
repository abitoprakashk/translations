import {useSelector} from 'react-redux'

export default function useTransportSetupPercentage() {
  const {transportAggregates, schoolTransportSettings} = useSelector(
    (state) => state?.globalData
  )
  const totalSteps = 5
  let stepsCompleted = 0

  if (schoolTransportSettings?.data?.is_school_address_set) stepsCompleted++
  if (transportAggregates?.data?.total_pickup_points) stepsCompleted++
  if (transportAggregates?.data?.total_staff) stepsCompleted++
  if (transportAggregates?.data?.total_vehicles) stepsCompleted++
  if (transportAggregates?.data?.total_routes) stepsCompleted++

  return (stepsCompleted / totalSteps) * 100
}

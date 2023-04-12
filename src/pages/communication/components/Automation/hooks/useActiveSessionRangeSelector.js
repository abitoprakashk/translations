import {useSelector} from 'react-redux'
import {hasSessionEndDatePassed} from '../utils'

const useActiveSessionRangeSelector = () => {
  const instituteAcademicSessionInfo = useSelector(
    (state) => state.instituteAcademicSessionInfo
  )
  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )

  const activeSessionRange =
    instituteAcademicSessionInfo?.find(
      (session) => session._id == instituteActiveAcademicSessionId
    ) || {}

  return {
    end_time: activeSessionRange.end_time,
    sessionEndDatePassed: hasSessionEndDatePassed(activeSessionRange),
  }
}

export default useActiveSessionRangeSelector

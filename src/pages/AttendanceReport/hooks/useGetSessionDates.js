import {useLayoutEffect, useState} from 'react'
import {useSelector} from 'react-redux'

function useGetSessionDates() {
  const [sessiondates, setsessiondates] = useState(null)
  const {
    instituteAcademicSessionInfo,
    instituteInfo,
    instituteActiveAcademicSessionId,
  } = useSelector((state) => state)

  useLayoutEffect(() => {
    instituteAcademicSessionInfo?.map((session) => {
      if (session._id === instituteActiveAcademicSessionId) {
        setsessiondates({
          from: new Date(
            new Date(+session.start_time).toLocaleString('en-EU', {
              timeZone: instituteInfo.timezone,
            })
          ),
          to: new Date(
            new Date(+session.end_time).toLocaleString('en-EU', {
              timeZone: instituteInfo.timezone,
            })
          ),
        })
      }
    })
  }, [
    instituteAcademicSessionInfo,
    instituteActiveAcademicSessionId,
    instituteInfo,
  ])

  return sessiondates
}

export default useGetSessionDates

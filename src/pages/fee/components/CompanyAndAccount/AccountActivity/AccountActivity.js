import React, {useState, useEffect, useMemo} from 'react'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import styles from './AccountActivity.module.css'
import HistoryCard from '../components/HistoryCard/HistoryCard'
import globalActions from '../../../../../redux/actions/global.actions'
import ActivitySkeleton from './ActivitySkeleton/ActivitySkeleton'
import {useCompanyAndAccountSelector} from '../selectors'
import {useDispatch} from 'react-redux'
import {
  ACCOUNT_ACTIVITY_EVENT_TYPES,
  ACCOUNT_ACTIVITY_FILTER_TYPES,
} from '../companyAccConstants'
import {Para, EmptyState} from '@teachmint/krayon'

export default function AccountActivity({selectedFilterType}) {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {data: companies} =
    useCompanyAndAccountSelector()?.getCompanyAccountListCA
  // get current week's first and last date
  const current_date = new Date()
  const start_date = new Date(
    current_date.setDate(current_date.getDate() - current_date.getDay())
  )
  const end_date = new Date(
    current_date.setDate(current_date.getDate() - current_date.getDay() + 6)
  )

  // get session details
  const instituteActiveAcademicSessionId = useSelector(
    (state) => state.instituteActiveAcademicSessionId
  )
  const {start_time, end_time} = useSelector((state) =>
    state.instituteAcademicSessionInfo.find(
      ({_id}) => _id === instituteActiveAcademicSessionId
    )
  )
  const [historyData, setHistoryData] = useState([])
  const instituteAdmin = useSelector((state) => state.instituteAdminList)
  const [isLoading, setIsLoading] = useState(false)

  const instituteAdmins = useMemo(() => {
    let admins = {}
    instituteAdmin.forEach((admin) => {
      admins[admin.user_id] = {name: admin.name, imgUrl: admin.imgUrl}
    })
    return admins
  }, [instituteAdmin])

  const getCompanyDetails = (company_id) => {
    let allCompanies = Object.values(companies || {})?.flat(1)
    return allCompanies.find((company) => company._id == company_id)
  }

  useEffect(() => {
    switch (selectedFilterType) {
      case ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_WEEK: {
        fetchAccountActivities(
          parseInt(start_date.getTime() / 1000),
          parseInt(end_date.getTime() / 1000)
        )
        break
      }
      case ACCOUNT_ACTIVITY_FILTER_TYPES.THIS_SESSION: {
        fetchAccountActivities(
          parseInt(start_time / 1000),
          parseInt(end_time / 1000)
        )
        break
      }
      default:
        break
    }
  }, [selectedFilterType])

  const fetchAccountActivities = (start_timestamp, end_timestamp) => {
    setIsLoading(true)
    function successAction(obj) {
      setHistoryData(obj)
      setIsLoading(false)
    }

    dispatch(
      globalActions.accountActivityCA.request(
        {start_timestamp, end_timestamp},
        successAction,
        () => {}
      )
    )
  }

  return (
    <div className={styles.activityWrapper}>
      {isLoading ? (
        <ActivitySkeleton />
      ) : (
        historyData.map((history, i) => {
          const user = instituteAdmins[history.created_user_id]?.name
          const newEntityName =
            history?.data?.new_data?.account_name ||
            history?.data?.new_data?.name
          const oldEntityName =
            history?.data?.new_data?.account_name ||
            history?.data?.new_data?.name
          const companyName = history?.data?.new_data?.master_company_id
            ? getCompanyDetails(history?.data?.new_data?.master_company_id)
                ?.name
            : ''

          return (
            <HistoryCard
              key={i}
              imgScr={instituteAdmins[history.created_user_id]?.imgUrl}
              name={user ?? '-'}
              content={
                <Para>
                  <span className={styles.username}>{user}</span>{' '}
                  {t(
                    ACCOUNT_ACTIVITY_EVENT_TYPES[history.event_type]?.SENTENCE,
                    {
                      user,
                      newEntityName,
                      oldEntityName,
                      companyName,
                    }
                  )}
                </Para>
              }
              timestamp={history.timestamp}
            />
          )
        })
      )}
      {!isLoading && historyData.length == 0 && (
        <div className={styles.emptyState}>
          <EmptyState
            button={false}
            iconName={'timeline'}
            content={t('noActivityFound')}
          />
        </div>
      )}
    </div>
  )
}

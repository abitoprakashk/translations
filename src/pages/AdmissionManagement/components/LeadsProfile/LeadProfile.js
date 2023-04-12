import {useParams} from 'react-router-dom'
import {ErrorBoundary} from '@teachmint/common'
import LeadData from './LeadData/LeadData'
import {getSpecificLeadData} from '../../utils/helpers'
import LeadProgress from './LeadProgress/LeadProgress'
import RecentActivity from './RecentActivity/RecentActivity'
import {useLeadList} from '../../redux/admissionManagement.selectors'
import history from '../../../../history'

export default function LeadProfile() {
  const {leadId} = useParams()
  const leadList = useLeadList()

  if (leadList.isLoading) {
    return <div className="loader"></div>
  }

  const leadData = getSpecificLeadData(leadList?.data, leadId)

  return (
    <div>
      {leadData ? (
        <ErrorBoundary>
          <LeadData leadData={leadData} />
          <LeadProgress leadData={leadData} />
          <RecentActivity leadData={leadData} />
        </ErrorBoundary>
      ) : (
        history.push('/institute/dashboard/admission-management/leads')
      )}
    </div>
  )
}

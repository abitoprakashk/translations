import {t} from 'i18next'
import {Icon, IconFrame, ICON_CONSTANTS, Para} from '@teachmint/krayon'
import {ErrorBoundary} from '@teachmint/common'
import styles from './Leads.module.css'
import {useLeadList} from '../../redux/admissionManagement.selectors'
import LeadList from './LeadList/LeadList'
import AddLeadDropdown from './AddLeadDropdown'

export default function Leads() {
  const leadList = useLeadList()

  if (leadList.isLoading) {
    return <div className="loader"></div>
  }

  return (
    <ErrorBoundary>
      <div>
        {leadList.data && leadList.data.length === 0 ? (
          <div className={styles.emptyListContainer}>
            <div className={styles.emptyListContent}>
              <IconFrame type={ICON_CONSTANTS.TYPES.PRIMARY}>
                <Icon
                  size={ICON_CONSTANTS.SIZES.SMALL}
                  name="request"
                  type={ICON_CONSTANTS.TYPES.SECONDARY}
                />
              </IconFrame>
              <Para>{t('leadListEmptyListMessage')}</Para>
              <AddLeadDropdown className={styles.addNewLeadBtn} />
            </div>
          </div>
        ) : (
          <LeadList />
        )}
      </div>
    </ErrorBoundary>
  )
}

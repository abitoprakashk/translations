import {EmptyState, isMobile as isMobileDevice} from '@teachmint/krayon'
import {t} from 'i18next'
import {useSelector} from 'react-redux'
import RuleCard from '../RuleCard/RuleCard'
import Loader from '../../../../../../components/Common/Loader/Loader'
import styles from './RulesSetup.module.css'

export default function RulesSetup({
  heirarchy,
  loadingInfo,
  setChosenTemplate,
  setPreSelectedIds,
}) {
  const rulesList = useSelector(
    (state) => state.communicationInfo.scheduler.rulesList
  )

  const isMobile = isMobileDevice()

  return (
    <div className={styles.rulesList}>
      <RulesList
        rules={rulesList}
        isMobile={isMobile}
        heirarchy={heirarchy}
        setTemplate={setChosenTemplate}
        setPreSelectedIds={setPreSelectedIds}
        loading={loadingInfo.rules}
      />
    </div>
  )
}

const RulesList = ({
  rules,
  setTemplate,
  setPreSelectedIds,
  heirarchy,
  isMobile,
  loading,
}) => {
  if (loading) {
    return <Loader show />
  }

  if (rules.length) {
    return rules.map((item) => {
      return (
        <RuleCard
          key={item._id}
          rule={item}
          setData={setTemplate}
          setPreSelectedIds={setPreSelectedIds}
          hierarchy={heirarchy}
        />
      )
    })
  }

  return (
    <div className={styles.emptyStateContainer}>
      <EmptyState
        iconName="addChart"
        content={isMobile ? t('noRulesAreSet') : t('noRulesAreSetCreateNew')}
        button={null}
      />
    </div>
  )
}

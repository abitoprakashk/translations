import {t} from 'i18next'
import {ErrorBoundary} from '@teachmint/common'
import styles from './AddLead.module.css'
import {Dropdown, Para} from '@teachmint/krayon'

const ChooseStage = ({leadstages, leadstage, setLeadStage}) => {
  return (
    <ErrorBoundary>
      <div className={styles.dropdown}>
        <Para>{t('chooseStage')}</Para>
        <Dropdown
          placeholder={t('selectLeadStage')}
          options={leadstages}
          selectedOptions={leadstage}
          onChange={({value}) => setLeadStage(value)}
        />
      </div>
    </ErrorBoundary>
  )
}

export default ChooseStage

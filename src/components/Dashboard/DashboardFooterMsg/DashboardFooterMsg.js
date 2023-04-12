import {Divider} from '@teachmint/krayon'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import styles from './DashboardFooterMsg.module.css'

const DashboardFooterMsg = () => {
  const {t} = useTranslation()
  const formUrl = 'https://forms.gle/61ZrHbvWbv2w6ZqeA'
  return (
    <div className={styles.dashboardFooterMsg}>
      <div className={styles.dashboardFooterMsgText}>
        {`${t('anythingYouWantToTellUs')} `}
        <Link to={{pathname: formUrl}} target="_blank">
          <div className={styles.dashboardFooterMsgLink}>{t('tellUs')}</div>
        </Link>
      </div>
      <Divider length={'200px'} />
    </div>
  )
}

export default DashboardFooterMsg

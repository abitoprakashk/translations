import {Icon} from '@teachmint/common'
import classNames from 'classnames'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {generatePath, Link} from 'react-router-dom'
import REPORT_CARD_ROUTES from '../../../../../../ReportCard.routes'
import styles from './SectionCard.module.css'

export default function SectionCard({title, standardId, id, onViewClick}) {
  const {t} = useTranslation()

  return (
    <Link
      to={generatePath(REPORT_CARD_ROUTES.SECTION_VIEW, {
        standardId,
        sectionId: id,
      })}
      className={styles.wrapper}
      onClick={onViewClick}
    >
      <div className={classNames(styles.title, 'tm-hdg tm-hdg-24')}>
        {title}
      </div>
      <div className={styles.viewWrapper}>
        <div className={styles.view}>{t('view')}</div>
        <Icon
          color="primary"
          name="forwardArrow"
          size="xxs"
          type="filled"
          className={styles.viewIcon}
        />
      </div>
    </Link>
  )
}

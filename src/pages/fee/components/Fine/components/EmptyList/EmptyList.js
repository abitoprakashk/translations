import React from 'react'
import {useTranslation} from 'react-i18next'
import {EMPTY_FINE_LIST_LBL} from '../../FineConstant'
import styles from './EmptyList.module.css'
import EmptyListCard from './EmptyListCard/EmptyListCard'

export default function EmptyList() {
  const {t} = useTranslation()
  return (
    <>
      <div className={styles.section}>
        <div className={styles.firstCardSection}>
          <EmptyListCard cardClassName={styles.firstCard} />
        </div>
        <div className={styles.secondCardSection}>
          <EmptyListCard cardClassName={styles.secondCard} />
        </div>

        <div className={styles.emptyText}>{t(EMPTY_FINE_LIST_LBL)}</div>
      </div>
    </>
  )
}

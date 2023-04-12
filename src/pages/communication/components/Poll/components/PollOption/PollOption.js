import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import styles from './PollOption.module.css'

export default function PollOption({title, resultPercentage, votes, isDraft}) {
  const {t} = useTranslation()
  const tVote = t('vote')
  const tVotes = t('votes')

  return (
    <div className={styles.progressbarContainer}>
      <div
        className={styles.progressbar}
        style={{width: `${resultPercentage}%`}}
      />
      <div className={styles.pollOptionInformation}>
        <span className={styles.polloptionTitle}>
          <Trans i18nKey={'pollOptionTitle'}>{title}</Trans>
        </span>
        {!isDraft && (
          <>
            <span className={styles.pollOptionPercentage}>
              <Trans i18nKey={'pollOptionResultPercentage'}>
                {`${resultPercentage}`}%
              </Trans>
            </span>
            <span className={styles.pollOptionVotes}>
              <Trans i18nKey={'pollOptionVotes'}>{`${votes}`}</Trans>
              <span className={styles.pollOptionVotesText}>
                {votes !== 1 ? tVotes : tVote}
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

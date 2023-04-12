import {Avatar, AVATAR_CONSTANTS, PlainCard} from '@teachmint/krayon'
import styles from './HistoryCard.module.css'

export default function HistoryCard({name, imgScr = null, content, timestamp}) {
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000)
    const day = date.toLocaleString('default', {day: 'numeric'})
    const month = date.toLocaleString('default', {month: 'short'})
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const amOrPm = hours >= 12 ? 'pm' : 'am'
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
    return {
      date: `${day} ${month} ${year}`,
      time: `${formattedHours}:${formattedMinutes} ${amOrPm}`,
    }
  }

  return (
    <PlainCard className={styles.plainCardWrapper}>
      <div className={styles.main}>
        <Avatar
          imgSrc={imgScr}
          name={name}
          onClick={() => {}}
          size={AVATAR_CONSTANTS.SIZE.LARGE}
          variant={AVATAR_CONSTANTS.VARIANTS[2]}
        />
        <div className={styles.content}>
          <div>{content}</div>
          <div className={styles.timestamp}>
            <span>{formatTimestamp(timestamp).date}</span>
            <span>{formatTimestamp(timestamp).time}</span>
          </div>
        </div>
      </div>
    </PlainCard>
  )
}

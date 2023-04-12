// import styles from './SettingsHeader.module.css'
import styles from './FeeSettings.module.css'
const DetailHeader = ({title, desc}) => {
  return (
    <>
      <div className={styles.settingsHeaderWrapper}>
        {/* <div className={styles.settingsHeaderImageContainer}>
          <div className={styles.settingsHeaderImage}>{headerIcon}</div>
        </div> */}

        <div className={styles.settingsHeaderTitleWrapper}>
          <div className={styles.settingsHeaderTitle}>{title}</div>
          <div className={styles.settingsHeaderDesc}>{desc}</div>
        </div>
      </div>
    </>
  )
}

export default DetailHeader

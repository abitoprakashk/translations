import {preferrenceSettingsOptions} from '../../../constants/constants'
import {
  useSelectedSettingCategory,
  useSelectedSettingSubCategory,
} from '../../../redux/GlobalSettingsSelectors'
import styles from './SettingsHeader.module.css'
import {useTranslation} from 'react-i18next'

const SettingsHeader = () => {
  const {t} = useTranslation()
  const selectedSettingCategory = useSelectedSettingCategory()
  const selectedSettingSubCategory = useSelectedSettingSubCategory()
  const {title, desc, headerIcon} = selectedSettingSubCategory
    ? preferrenceSettingsOptions[selectedSettingCategory].settingsList[
        selectedSettingSubCategory
      ]
    : {}
  return (
    <>
      <div className={styles.settingsHeaderWrapper}>
        <div className={styles.settingsHeaderImageContainer}>
          <div className={styles.settingsHeaderImage}>{headerIcon}</div>
        </div>

        <div className={styles.settingsHeaderTitleWrapper}>
          <div className={styles.settingsHeaderTitle}>{t(title)}</div>
          <div className={styles.settingsHeaderDesc}>{t(desc)}</div>
        </div>
      </div>
    </>
  )
}

export default SettingsHeader

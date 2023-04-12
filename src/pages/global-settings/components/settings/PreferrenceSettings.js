import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {Route, useHistory, Switch} from 'react-router-dom'
import {
  useGlobalSettings,
  useSelectedSettingCategory,
  useSelectedSettingSubCategory,
} from '../../redux/GlobalSettingsSelectors'
import OptionsBox from '../common/containers/options-box/OptionsBox'
import GlobalLanguageSettings from '../your-preferences-settings/language/GlobalLanguageSettings'
import {
  YOUR_PREFERENCES_TYPES,
  LANGUAGE_SETTINGS_URL,
  preferrenceSettingsOptions,
  SETTINGS_CATEGORY_TYPES,
} from '../../constants/constants'
import {
  setSelectedSettingCategoryAction,
  setSelectedSettingSubCategoryAction,
} from '../../redux/GlobalSettingsActions'
import styles from './GlobalSettings.module.css'
import {useTranslation} from 'react-i18next'

const PreferrenceSettings = () => {
  const {t} = useTranslation()

  const screenWidth = window.innerWidth > 0 ? window.innerWidth : screen.width
  const isSmallScreen = screenWidth <= 600
  const selectedSettingCategory = useSelectedSettingCategory()
  const selectedSettingSubCategory = useSelectedSettingSubCategory()

  const globalSettings = useGlobalSettings()
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    dispatch(
      setSelectedSettingCategoryAction(
        SETTINGS_CATEGORY_TYPES.YOUR_PREFERENCES_SETTINGS.title
      )
    )
    if (!isSmallScreen)
      dispatch(
        setSelectedSettingCategoryAction(
          SETTINGS_CATEGORY_TYPES.YOUR_PREFERENCES_SETTINGS.title
        )
      )
    dispatch(
      setSelectedSettingSubCategoryAction(
        YOUR_PREFERENCES_TYPES.LANGUAGE_SETTINGS
      )
    )
  }, [])

  useEffect(() => {
    return () => {
      if (!isSmallScreen)
        dispatch(
          setSelectedSettingCategoryAction(
            SETTINGS_CATEGORY_TYPES.YOUR_PREFERENCES_SETTINGS.title
          )
        )
      dispatch(
        setSelectedSettingSubCategoryAction(
          YOUR_PREFERENCES_TYPES.LANGUAGE_SETTINGS
        )
      )
    }
  }, [])

  const handleActions = (titleId, optionId) => {
    if (optionId) {
      dispatch(setSelectedSettingSubCategoryAction(optionId))
    } else {
      dispatch(setSelectedSettingCategoryAction(titleId))
      switch (titleId) {
        case YOUR_PREFERENCES_TYPES.MAIN:
          dispatch(
            setSelectedSettingSubCategoryAction(
              YOUR_PREFERENCES_TYPES.LANGUAGE_SETTINGS
            )
          )
          break
      }
    }
  }
  const getSettingsComponent = () => {
    switch (selectedSettingSubCategory) {
      case YOUR_PREFERENCES_TYPES.LANGUAGE_SETTINGS:
        history.push(LANGUAGE_SETTINGS_URL)
        break
      case YOUR_PREFERENCES_TYPES.MAIN:
        history.push(LANGUAGE_SETTINGS_URL)
        break
      default:
        history.push(LANGUAGE_SETTINGS_URL)
    }
  }

  useEffect(() => {
    getSettingsComponent()
  }, [globalSettings, selectedSettingCategory])

  return (
    <>
      <div className={styles.wrapper}>
        <div className="tm-hdg tm-hdg-24 mb-4">{t('preferencesText')}</div>

        <div className={styles.settingsWrapper}>
          <div className={styles.settingsSidebar}>
            {selectedSettingCategory &&
              !(isSmallScreen && selectedSettingSubCategory) &&
              Object.values(preferrenceSettingsOptions).map(
                ({
                  id,
                  title,
                  icon,
                  iconSelected,
                  titleType,
                  optionType,
                  desc,
                  settingsList,
                }) => (
                  <div key={id}>
                    <OptionsBox
                      id={id}
                      icon={icon}
                      iconSelected={iconSelected}
                      title={t(title)}
                      optionType={optionType}
                      titleType={titleType}
                      desc={desc}
                      isOn={selectedSettingCategory === id}
                      optionsList={Object.values(settingsList)}
                      handleAction={handleActions}
                      isLeafNode={false}
                      selectedOption={selectedSettingSubCategory}
                    />
                  </div>
                )
              )}
          </div>
          <div className={styles.settingsContiner}>
            <Switch>
              {selectedSettingSubCategory && (
                <Route
                  path={LANGUAGE_SETTINGS_URL}
                  exact
                  component={GlobalLanguageSettings}
                />
              )}
            </Switch>
          </div>
        </div>
      </div>
    </>
  )
}

export default PreferrenceSettings

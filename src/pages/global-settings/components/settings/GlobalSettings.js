import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {Route, useHistory, Switch} from 'react-router-dom'
import {useInstituteId} from '../../../../redux/reducers/CommonSelectors'
import {
  useGlobalSettings,
  useSelectedSettingCategory,
  useSelectedSettingSubCategory,
} from '../../redux/GlobalSettingsSelectors'
import OptionsBox from '../common/containers/options-box/OptionsBox'
import GlobalContentSettings from '../classroom-settings/GlobalContentSettings/GlobalContentSettings'
import GlobalManagementSettings from '../classroom-settings/GlobalManagementSettings/GlobalManagementSettings'
import GlobalCommunicationSettings from '../classroom-settings/communication/GlobalCommunicationSettings'
import GlobalLanguageSettings from '../your-preferences-settings/language/GlobalLanguageSettings'
import GlobalExamSettings from '../classroom-settings/GlobalExamSettings/GlobalExamSettings'
import {
  CLASSROOM_SETTINGS_TYPES,
  LANGUAGE_SETTINGS_URL,
  CONTENT_SETTINGS_URL,
  COMMUNICATION_SETTINGS_URL,
  EXAM_SETTINGS_URL,
  settingsOptions,
  SETTINGS_CATEGORY_TYPES,
  SETTINGS_URL,
} from '../../constants/constants'
import {
  fetchGlobalSettingsRequestedAction,
  setSelectedSettingCategoryAction,
  setSelectedSettingSubCategoryAction,
} from '../../redux/GlobalSettingsActions'
import styles from './GlobalSettings.module.css'
import {useUpdateSettingLoading} from '../../redux/GlobalSettingsSelectors'
import {useTranslation} from 'react-i18next'

const GlobalSettings = () => {
  const {t} = useTranslation()

  const screenWidth = window.innerWidth > 0 ? window.innerWidth : screen.width
  const isSmallScreen = screenWidth <= 600
  const selectedSettingCategory = useSelectedSettingCategory()
  const selectedSettingSubCategory = useSelectedSettingSubCategory()
  const updateSettingLoading = useUpdateSettingLoading()

  const instituteId = useInstituteId()
  const globalSettings = useGlobalSettings()
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    dispatch(
      setSelectedSettingCategoryAction(
        SETTINGS_CATEGORY_TYPES.CLASSROOM_SETTINGS.title
      )
    )
    if (!isSmallScreen)
      dispatch(
        setSelectedSettingCategoryAction(
          SETTINGS_CATEGORY_TYPES.CLASSROOM_SETTINGS.title
        )
      )
    dispatch(
      setSelectedSettingSubCategoryAction(
        CLASSROOM_SETTINGS_TYPES.MANAGEMENT_SETTINGS
      )
    )
  }, [])

  useEffect(() => {
    if (instituteId) dispatch(fetchGlobalSettingsRequestedAction(instituteId))
  }, [instituteId])

  useEffect(() => {
    return () => {
      if (!isSmallScreen)
        dispatch(
          setSelectedSettingCategoryAction(
            SETTINGS_CATEGORY_TYPES.CLASSROOM_SETTINGS.title
          )
        )
      dispatch(
        setSelectedSettingSubCategoryAction(
          CLASSROOM_SETTINGS_TYPES.MANAGEMENT_SETTINGS
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
        case CLASSROOM_SETTINGS_TYPES.MAIN:
          dispatch(
            setSelectedSettingSubCategoryAction(
              CLASSROOM_SETTINGS_TYPES.MANAGEMENT_SETTINGS
            )
          )
          break
        default:
          dispatch(
            setSelectedSettingSubCategoryAction(
              CLASSROOM_SETTINGS_TYPES.MANAGEMENT_SETTINGS
            )
          )
      }
    }
  }
  const getSettingsComponent = () => {
    switch (selectedSettingSubCategory) {
      case CLASSROOM_SETTINGS_TYPES.COMMUNICATION_SETTINGS:
        history.push(COMMUNICATION_SETTINGS_URL)
        break
      case CLASSROOM_SETTINGS_TYPES.CONTENT_SETTINGS:
        history.push(CONTENT_SETTINGS_URL)
        break
      case CLASSROOM_SETTINGS_TYPES.EXAM_SETTINGS:
        history.push(EXAM_SETTINGS_URL)
        break
      default:
        history.push(SETTINGS_URL)
    }
  }

  useEffect(() => {
    getSettingsComponent()
  }, [globalSettings, selectedSettingCategory])

  if (globalSettings.settings.length === 0) {
    return <div className="loading" />
  }

  if (updateSettingLoading) return <div className="loading" />
  return (
    <>
      <div className={styles.wrapper}>
        <div className="tm-hdg tm-hdg-24 mb-4">
          {t('classroomSettingsText')}
        </div>

        <div className={styles.settingsWrapper}>
          <div className={styles.settingsSidebar}>
            {selectedSettingCategory &&
              !(isSmallScreen && selectedSettingSubCategory) &&
              Object.values(settingsOptions).map(
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
                  path={SETTINGS_URL}
                  exact
                  component={GlobalManagementSettings}
                />
              )}
              {selectedSettingSubCategory && (
                <Route
                  path={CONTENT_SETTINGS_URL}
                  exact
                  component={GlobalContentSettings}
                />
              )}
              {selectedSettingSubCategory && (
                <Route
                  path={COMMUNICATION_SETTINGS_URL}
                  exact
                  component={GlobalCommunicationSettings}
                />
              )}
              {selectedSettingSubCategory && (
                <Route
                  path={LANGUAGE_SETTINGS_URL}
                  exact
                  component={GlobalLanguageSettings}
                />
              )}
              {selectedSettingSubCategory && (
                <Route
                  path={EXAM_SETTINGS_URL}
                  exact
                  component={GlobalExamSettings}
                />
              )}
            </Switch>
          </div>
        </div>
      </div>
    </>
  )
}

export default GlobalSettings

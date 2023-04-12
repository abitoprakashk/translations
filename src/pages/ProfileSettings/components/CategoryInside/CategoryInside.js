import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom' // BrowserRouter as Router,Switch,Route // import ReactDOM from 'react-dom'
import {useTranslation} from 'react-i18next'
import {ErrorBoundary} from '@teachmint/common'
import Loader from '../../../../components/Common/Loader/Loader'
import globalActions from '../../../../redux/actions/global.actions'
import EmptyScreenV1 from '../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {URL_PARAMS_KEYS} from '../../ProfileSettings.constant'
import {getCategoryAndFieldsSettingsAction} from '../../redux/actions/ProfileSettingsActions'
import {
  addCategoryFieldFormSubmitSelector,
  categoryFieldsSettingsSelector,
  updateCategoryFieldFormSubmitSelector,
} from '../../redux/ProfileSettingsSelectors'
import CategoryFieldsSection from './CategoryFieldsSection/CategoryFieldsSection'
import CategoryHeaderSection from './CategoryHeaderSection/CategoryHeaderSection'
import DocumentCategoryHeaderSection from './DocumentCategoryHeaderSection/DocumentCategoryHeaderSection'
import {getCategoryFieldsSettings} from './CategoryInside.utils'
import CategoryFieldsBreadCrumb from './CategoryFieldsBreadCrumb/CategoryFieldsBreadCrumb'
import defaultEmptyCategoriesScreen from '../UICommon/profileSettingsEmptyIcon.svg'
import styles from './CategoryInside.module.css'
import {events} from '../../../../utils/EventsConstants'

const CategoryInside = () => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const eventManager = useSelector((state) => state.eventManager)
  const {search} = useLocation()
  const queryParams = new URLSearchParams(search)
  const getUserType = queryParams.get(URL_PARAMS_KEYS.USER_TYPE)
  const getCategoryId = queryParams.get(URL_PARAMS_KEYS.CATEGORY)
  const categoryFieldsSettingsData = categoryFieldsSettingsSelector()
  const submitCategoryFieldFormResponse = addCategoryFieldFormSubmitSelector()
  const updateCategoryFieldFormResponse =
    updateCategoryFieldFormSubmitSelector()
  const {categoryAndFieldsSettingsData} = useSelector(
    (state) => state.profileSettings
  )

  useEffect(() => {
    const getCategoryDetails = {
      category_id: getCategoryId,
      userType: getUserType,
    }
    dispatch(
      globalActions?.requestForCategoryDetails?.request(getCategoryDetails)
    )
  }, [getCategoryId])

  useEffect(() => {
    if (
      categoryFieldsSettingsData.data &&
      categoryFieldsSettingsData.data.length > 0
    ) {
      const categoryFieldsObject = getCategoryFieldsSettings(
        getCategoryId,
        categoryFieldsSettingsData.data
      )
      if (
        categoryFieldsObject &&
        Object.keys(categoryFieldsObject).length > 0
      ) {
        dispatch(getCategoryAndFieldsSettingsAction(categoryFieldsObject))
      }
    }
  }, [getCategoryId, categoryFieldsSettingsData])

  const getHeaderSection = () => {
    let renderHeaderHtml = null
    if (categoryAndFieldsSettingsData) {
      if (categoryAndFieldsSettingsData?.setting_type == 1) {
        renderHeaderHtml = (
          <CategoryHeaderSection
            userType={getUserType}
            categoryFieldsDetails={categoryAndFieldsSettingsData}
          />
        )
        eventManager.send_event(events.PROFILE_SECTION_NODE_CLICKED_TFI, {
          screen_name: getUserType,
          category_id: getCategoryId,
        })
      } else if (categoryAndFieldsSettingsData?.setting_type == 3) {
        renderHeaderHtml = (
          <DocumentCategoryHeaderSection
            userType={getUserType}
            categoryFieldsDetails={categoryAndFieldsSettingsData}
          />
        )
        eventManager.send_event(events.PROFILE_DOCUMENT_NODE_CLICKED_TFI, {
          screen_name: getUserType,
          category_id: getCategoryId,
        })
      }
    }
    return renderHeaderHtml
  }

  return (
    <div className={styles.categoryInsideContainer}>
      <ErrorBoundary>
        <Loader
          show={
            categoryFieldsSettingsData.isLoading ||
            submitCategoryFieldFormResponse.isLoading ||
            updateCategoryFieldFormResponse.isLoading
          }
        />
        {categoryAndFieldsSettingsData &&
        Object.keys(categoryAndFieldsSettingsData).length > 0 ? (
          <div className={styles.categoryFieldsBlock}>
            <div className={styles.categoryInsideBreadCrumb}>
              <CategoryFieldsBreadCrumb
                userType={getUserType}
                categoryFieldsDetails={categoryAndFieldsSettingsData}
                settingType={categoryAndFieldsSettingsData?.setting_type}
              />
            </div>
            <div className={styles.headerTopSection}>{getHeaderSection()}</div>
            <div className={styles.categoryFieldsSection}>
              <CategoryFieldsSection userType={getUserType} />
            </div>
          </div>
        ) : (
          <div className={styles.noCategoryFieldsFound}>
            <EmptyScreenV1
              image={defaultEmptyCategoriesScreen}
              title={t('categoryAndTheirFieldsDetailsNotFound')}
              btnType="primary"
            />
          </div>
        )}
      </ErrorBoundary>
    </div>
  )
}

export default CategoryInside

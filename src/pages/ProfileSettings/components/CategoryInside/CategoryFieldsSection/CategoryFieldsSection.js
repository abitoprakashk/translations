import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {Table} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {
  getCategoryFieldsTableData,
  getCategoryFieldsTableHeader,
  getEmptyStateDescription,
} from './CategoryFieldsSection.utils'
import defaultEmptyCategoriesScreen from '../../UICommon/profileSettingsEmptyIcon.svg'
import EditCategoryFieldsSlider from '../EditCategoryFieldsSlider/EditCategoryFieldsSlider'
import EditDocumentCategoryFieldSlider from '../EditDocumentCategoryFieldSlider/EditDocumentCategoryFieldSlider'
import CloseSliderConfirmPopup from '../../UICommon/CloseSliderConfirmPopUp'
import {SETTING_TYPE} from '../../../ProfileSettings.constant'
import styles from './CategoryFieldsSection.module.css'
import {events} from '../../../../../utils/EventsConstants'

const CategoryFieldsSection = ({userType}) => {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const {categoryAndFieldsSettingsData} = useSelector(
    (state) => state.profileSettings
  )
  const [categoryFieldsData, setCategoryFieldsData] = useState(null)
  const [showEditFieldSlider, setEditFieldSlider] = useState(false)
  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)
  const [fieldEditFormData, setFieldEditFormData] = useState(null)
  // Get Edit Field Slider
  const getEditFieldSlider = () => {
    let editFieldSliderHTMLrender = null
    if (categoryAndFieldsSettingsData?.setting_type == 1) {
      editFieldSliderHTMLrender = (
        <EditCategoryFieldsSlider
          userType={userType}
          editFieldSliderCloseHandler={editFieldSliderCloseHandler}
          closeEditFieldSlider={closeEditFieldSlider}
          fieldEditFormData={fieldEditFormData}
        />
      )
    } else if (categoryAndFieldsSettingsData?.setting_type == 3) {
      editFieldSliderHTMLrender = (
        <EditDocumentCategoryFieldSlider
          userType={userType}
          editFieldSliderCloseHandler={editFieldSliderCloseHandler}
          closeEditFieldSlider={closeEditFieldSlider}
          fieldEditFormData={fieldEditFormData}
        />
      )
    }
    return editFieldSliderHTMLrender
  }
  // Get Category fields Table Header
  const getTableHeader = getCategoryFieldsTableHeader(
    userType,
    categoryAndFieldsSettingsData
  )
  // Open-Close  Profile Information & Document Category Field Edit slider functions start
  const openEditFieldSlider = (rowData) => {
    setEditFieldSlider(true)
    setFieldEditFormData({
      ...fieldEditFormData,
      ...rowData,
    })
    if (categoryAndFieldsSettingsData?.setting_type == 3) {
      eventManager.send_event(events.EDIT_PROFILE_DOCUMENTS_CLICKED_TFI, {
        screen_name: userType,
        category_id: categoryAndFieldsSettingsData?._id,
        field_id: rowData?._id,
      })
    } else {
      eventManager.send_event(events.EDIT_PROFILE_FIELD_CLICKED_TFI, {
        screen_name: userType,
        category_id: categoryAndFieldsSettingsData?._id,
        field_id: rowData?._id,
      })
    }
  }
  const editFieldSliderCloseHandler = () => {
    setShowCloseConfirmPopup(true)
  }
  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      if (showEditFieldSlider) {
        closeEditFieldSlider()
        if (categoryAndFieldsSettingsData?.setting_type == 3) {
          eventManager.send_event(
            events.PROFILE_DOCUMENT_EXIT_WITHOUT_EDITING_CLICKED_TFI,
            {
              screen_name: userType,
              category_id: categoryAndFieldsSettingsData?._id,
            }
          )
        } else {
          eventManager.send_event(
            events.PROFILE_FIELD_EXIT_WITHOUT_EDITING_CLICKED_TFI,
            {
              screen_name: userType,
              category_id: categoryAndFieldsSettingsData?._id,
            }
          )
        }
      }
      setShowCloseConfirmPopup(false)
    },
    confirmationTitle: t('closeUpdateFieldSliderPopupTitle'),
    confirmationDesc: t('closeAddFieldSliderPopupDesc'),
  }
  const closeEditFieldSlider = () => {
    setEditFieldSlider(false)
  }
  // Open-Close Profile Information & Document Category Field Edit slider functions end

  useEffect(() => {
    if (
      categoryAndFieldsSettingsData &&
      Object.keys(categoryAndFieldsSettingsData).length > 0
    ) {
      setFieldEditFormData({
        ...fieldEditFormData,
        category_label: categoryAndFieldsSettingsData?.label,
      })
      if (categoryAndFieldsSettingsData?.childrenFields?.length > 0) {
        const getRowData = getCategoryFieldsTableData({
          categoryAndFieldsSettingsData,
          openEditFieldSlider,
        })
        setCategoryFieldsData(getRowData)
      }
    }
  }, [categoryAndFieldsSettingsData])

  return (
    <div className={styles.fieldsInsideSection}>
      {categoryFieldsData ? (
        <div className={styles.fieldsSectionWrapper}>
          <div className={styles.fieldsTableSection}>
            {showEditFieldSlider && (
              <div className={styles.editCategoryFieldSliderSection}>
                {getEditFieldSlider()}
              </div>
            )}
            <Table
              cols={getTableHeader}
              rows={categoryFieldsData}
              className={styles.fieldsTableBlock}
              uniqueKey={`fields_${categoryAndFieldsSettingsData._id}`}
            />
          </div>
          {showCloseConfirmPopup && (
            <CloseSliderConfirmPopup {...closeConfirmObject} />
          )}
        </div>
      ) : (
        <div className={styles.noCategoryFieldsFound}>
          <EmptyScreenV1
            image={defaultEmptyCategoriesScreen}
            title={
              categoryAndFieldsSettingsData?.setting_type ==
              SETTING_TYPE['CATEGORY_FOR_DOCUMENT']
                ? t('noDocumentsAdded')
                : t('noFieldsAdded')
            }
            desc={getEmptyStateDescription(categoryAndFieldsSettingsData)}
            btnType="primary"
            // btnText={t('createField')}
          />
        </div>
      )}
    </div>
  )
}

export default CategoryFieldsSection

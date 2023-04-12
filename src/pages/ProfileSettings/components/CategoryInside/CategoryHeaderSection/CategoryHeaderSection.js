import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {Button, Icon} from '@teachmint/common'
import {useTranslation} from 'react-i18next'
import classNames from 'classnames'
import MainTitleBar from '../../UICommon/MainTitleBar'
import AddCategoryFieldsSlider from '../AddCategoryFieldsSlider/AddCategoryFieldsSlider'
import CategoryFieldsPreviewSlider from '../CategoryFieldsPreviewSlider/CategoryFieldsPreviewSlider'
import CloseSliderConfirmPopup from '../../UICommon/CloseSliderConfirmPopUp'
import {events} from '../../../../../utils/EventsConstants'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import styles from './CategoryHeaderSection.module.css'

const CategoryHeaderSection = ({categoryFieldsDetails, userType}) => {
  const {t} = useTranslation()
  const eventManager = useSelector((state) => state.eventManager)
  const [showFieldsPreviewSlider, setFieldsPreviewSlider] = useState(false)
  const [showAddFieldSlider, setAddFieldSlider] = useState(false)
  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)
  const [dataResetFlag, setDataResetFlag] = useState(false)

  // Preview Fields Slider Functions
  const openFieldsPreviewSlider = () => {
    setFieldsPreviewSlider(true)
    eventManager.send_event(events.PREVIEW_PROFILE_SECTION_CLICKED_TFI, {
      screen_name: userType,
      preview_screen: 'node',
    })
  }

  // Add Field Slider Functions
  const openAddFieldSlider = () => {
    setAddFieldSlider(true)
    setDataResetFlag(false)
    eventManager.send_event(events.ADD_NEW_PROFILE_FIELD_CLICKED_TFI, {
      screen_name: userType,
      category_id: categoryFieldsDetails?._id,
    })
  }
  const addFieldSliderCloseHandler = () => {
    setShowCloseConfirmPopup(true)
  }
  const closeAddFieldSlider = () => {
    setAddFieldSlider(false)
    setDataResetFlag(true)
  }

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      if (showAddFieldSlider) {
        closeAddFieldSlider()
        eventManager.send_event(
          events.PROFILE_FIELD_EXIT_WITHOUT_ADDING_CLICKED_TFI,
          {
            screen_name: userType,
            category_id: categoryFieldsDetails?._id,
          }
        )
      }
      setShowCloseConfirmPopup(false)
    },
    confirmationTitle: t('closeAddFieldSliderPopupTitle'),
    confirmationDesc: t('closeAddFieldSliderPopupDesc'),
  }

  return (
    <div className={styles.headerInnerSection}>
      <div className={styles.headerInnerBlock}>
        <div className={styles.headerInnerBar}>
          <div className={styles.headerLeftSection}>
            <MainTitleBar titleInfo={categoryFieldsDetails?.label} />
          </div>
          <div className={styles.headerRightSection}>
            <div className={styles.headerButtonSection}>
              {categoryFieldsDetails?.childrenFields?.length > 0 && (
                <>
                  <span
                    className={classNames(
                      styles.commonBtnBlock,
                      styles.previewBlock
                    )}
                  >
                    <Button
                      size="big"
                      onClick={openFieldsPreviewSlider}
                      className={styles.previewButton}
                      type="border"
                    >
                      <Icon
                        name="eye"
                        size="s"
                        type="outlined"
                        color="primary"
                        className={styles.previewIcon}
                      />
                    </Button>
                  </span>
                </>
              )}
              <Permission
                permissionId={
                  PERMISSION_CONSTANTS.profileSettingsController_addField_create
                }
              >
                <span
                  className={classNames(
                    styles.commonBtnBlock,
                    styles.addCategoryBlock
                  )}
                >
                  <Button
                    size="big"
                    onClick={openAddFieldSlider}
                    className={styles.addCategoryButton}
                  >
                    {t('createField')}
                  </Button>
                </span>
              </Permission>
            </div>
          </div>
        </div>
      </div>
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
      {/* Add Field Slider */}
      {showAddFieldSlider && (
        <AddCategoryFieldsSlider
          userType={userType}
          addFieldSliderCloseHandler={addFieldSliderCloseHandler}
          closeAddFieldSlider={closeAddFieldSlider}
          categoryFieldsData={categoryFieldsDetails}
          dataResetFlag={dataResetFlag}
          setDataResetFlag={setDataResetFlag}
        />
      )}
      {/* Preview Fields Slider */}
      {showFieldsPreviewSlider && (
        <CategoryFieldsPreviewSlider
          setFieldsPreviewSlider={setFieldsPreviewSlider}
          categoryFieldsData={categoryFieldsDetails}
        />
      )}
    </div>
  )
}

export default CategoryHeaderSection

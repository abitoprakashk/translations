import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, Icon} from '@teachmint/common'
import classNames from 'classnames'
import SubTitleBar from '../../UICommon/SubTitleBar'
import ProfileAddCategorySlider from '../ProfileAddCategorySlider/ProfileAddCategorySlider'
import ProfileCategoryPreviewSlider from '../ProfileCategoryPreviewSlider/ProfileCategoryPreviewSlider'
import globalActions from '../../../../../redux/actions/global.actions'
import CloseSliderConfirmPopup from '../../UICommon/CloseSliderConfirmPopUp'
import {titleFieldRegex} from '../../../../../utils/Validations'
import {getProfileOrDocumentHeaderInfo} from '../../../ProfileSettings.utils'
import {SETTING_TYPE} from '../../../ProfileSettings.constant'
import {events} from '../../../../../utils/EventsConstants'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import styles from './ProfileHeaderSection.module.css'

const ProfileHeaderSection = ({persona}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const {personaCategoryListData} = useSelector(
    (state) => state.profileSettings
  )
  const [showPreviewSlider, setPreviewSlider] = useState(false)
  const [showAddSlider, setAddSlider] = useState(false)
  const [showCloseConfirmPopup, setShowCloseConfirmPopup] = useState(false)
  const [fieldsData, setFieldsData] = useState({
    categoryName: '',
  })
  const [errorObject, setErrorObject] = useState({})
  const [isAddCategoryFormValid, setIsAddCategoryFormValid] = useState(false)

  const profileHeaderInfo = getProfileOrDocumentHeaderInfo(
    persona,
    SETTING_TYPE['CATEGORY_FOR_INFO']
  )
  const categoryPreviewSliderHandler = () => {
    setPreviewSlider(true)
    eventManager.send_event(events.PREVIEW_PROFILE_SECTION_CLICKED_TFI, {
      screen_name: persona,
      preview_screen: 'settings',
    })
  }

  // Add Category Slider functions
  const addInfoCategoryHandler = () => {
    setAddSlider(true)
    eventManager.send_event(events.ADD_NEW_PROFILE_SECTION_CLICKED_TFI, {
      screen_name: persona,
    })
  }
  const categoryInputsChangeHandle = (e) => {
    const fieldName = e.fieldName
    setErrorObject({})
    const data = {...fieldsData}
    data[fieldName] = e.value
    // On Change Validation Category Name Field
    let isValidFlag = true
    const categoryText = String(data[fieldName]).trim()
    if (!titleFieldRegex(categoryText)) {
      return false
    }
    if (categoryText.length == 0) {
      handleCategoryInputsSetError(
        fieldName,
        t('errorMsgCategoryFieldNameEmpty')
      )
      isValidFlag = false
    }
    setIsAddCategoryFormValid(isValidFlag)
    setFieldsData({...data})
  }
  const handleCategoryInputsSetError = (fieldName, error) => {
    let obj = {}
    obj[fieldName] = error
    setErrorObject((errorObject) => ({...errorObject, ...obj}))
  }
  const categoryFormSubmitHandler = () => {
    let getCategoryNames = []
    if (personaCategoryListData && personaCategoryListData.length > 0) {
      getCategoryNames = personaCategoryListData.map((value) => {
        return value.label.trim()
      })
    }
    const isCategoryNameExist = getCategoryNames.includes(
      fieldsData.categoryName.trim()
    )
    if (!isCategoryNameExist) {
      if (isAddCategoryFormValid) {
        const payload = {
          label: fieldsData.categoryName,
          persona: persona,
          institute_type: instituteInfo.institute_type,
          setting_type: 1,
        }
        dispatch(
          globalActions?.profileSettingAddCategoryFormSubmitRequestAction?.request(
            payload
          )
        )
        closeAddCategorySlider()
        eventManager.send_event(events.SAVE_NEW_PROFILE_SECTION_CLICKED_TFI, {
          screen_name: persona,
          category_name: fieldsData.categoryName,
        })
      }
    } else {
      handleCategoryInputsSetError(
        'categoryName',
        t('enteredCategoryNameIsAlreadyExists')
      )
      setIsAddCategoryFormValid(false)
    }
  }
  const addCategorysliderCloseHandler = () => {
    setShowCloseConfirmPopup(true)
  }
  const closeAddCategorySlider = () => {
    setErrorObject({})
    setFieldsData({
      categoryName: '',
    })
    setAddSlider(false)
    setIsAddCategoryFormValid(false)
  }

  const closeConfirmObject = {
    onClose: () => {
      setShowCloseConfirmPopup(false)
    },
    onAction: () => {
      if (showAddSlider) {
        closeAddCategorySlider()
        eventManager.send_event(
          events.PROFILE_SECTION_EXIT_WITHOUT_ADDING_CLICKED_TFI,
          {
            screen_name: persona,
          }
        )
      }
      setShowCloseConfirmPopup(false)
    },
    confirmationTitle: t('closeAddCategorySliderPopupTitle'),
    confirmationDesc: t('closeAddCategorySliderPopupDesc'),
  }

  return (
    <div className={styles.headerInnerSection}>
      <div className={styles.headerLeftSection}>
        <SubTitleBar titleInfo={profileHeaderInfo} />
      </div>
      <div className={styles.headerRightSection}>
        <span
          className={classNames(styles.commonBtnBlock, styles.previewBlock)}
        >
          <Button
            size="big"
            onClick={categoryPreviewSliderHandler}
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
        <Permission
          permissionId={
            PERMISSION_CONSTANTS.profileSettingsController_addCategory_create
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
              onClick={addInfoCategoryHandler}
              className={styles.addCategoryButton}
              type="border"
            >
              {t('createSection')}
            </Button>
          </span>
        </Permission>
      </div>
      {/* Profile Category Preview Slider */}
      {showPreviewSlider && (
        <ProfileCategoryPreviewSlider
          persona={persona}
          setPreviewSlider={setPreviewSlider}
          categoriesAndTheirFieldsData={personaCategoryListData}
        />
      )}
      {/* Add Profile Category Slider */}
      {showAddSlider && (
        <ProfileAddCategorySlider
          persona={persona}
          closeAddSlider={addCategorysliderCloseHandler}
          fieldsData={fieldsData}
          handleChange={categoryInputsChangeHandle}
          errorObject={errorObject}
          handleAddCategoryFormSubmit={categoryFormSubmitHandler}
          isAddCategoryFormValid={isAddCategoryFormValid}
        />
      )}
      {showCloseConfirmPopup && (
        <CloseSliderConfirmPopup {...closeConfirmObject} />
      )}
    </div>
  )
}

export default ProfileHeaderSection

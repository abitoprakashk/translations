import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, Icon} from '@teachmint/common'
import classNames from 'classnames'
import SubTitleBar from '../../UICommon/SubTitleBar'
import {titleFieldRegex} from '../../../../../utils/Validations'
import CloseSliderConfirmPopup from '../../UICommon/CloseSliderConfirmPopUp'
import globalActions from '../../../../../redux/actions/global.actions'
import DocumentCategoryPreviewSlider from '../DocumentCategoryPreviewSlider/DocumentCategoryPreviewSlider'
import DocumentAddCategorySlider from '../DocumentAddCategorySlider/DocumentAddCategorySlider'
import {getProfileOrDocumentHeaderInfo} from '../../../ProfileSettings.utils'
import {SETTING_TYPE} from '../../../ProfileSettings.constant'
import Permission from '../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../utils/permission.constants'
import {events} from '../../../../../utils/EventsConstants'
import styles from './DocumentHeaderSection.module.css'

const DocumentHeaderSection = ({persona}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const {personaWiseDocumentCategoryListData} = useSelector(
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

  const docHeaderInfo = getProfileOrDocumentHeaderInfo(
    persona,
    SETTING_TYPE['CATEGORY_FOR_DOCUMENT']
  )
  const categoryPreviewSliderHandler = () => {
    setPreviewSlider(true)
    eventManager.send_event(events.PREVIEW_DOCUMENT_SECTION_CLICKED_TFI, {
      screen_name: persona,
      preview_screen: 'settings',
    })
  }

  // Add Document Category Slider functions
  const addDocCategoryHandler = () => {
    setAddSlider(true)
    eventManager.send_event(events.ADD_NEW_DOCUMENT_SECTION_CLICKED_TFI, {
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
    if (categoryText.length == 0) {
      handleCategoryInputsSetError(
        fieldName,
        t('errorMsgDocumentSectionFieldNameEmpty')
      )
      isValidFlag = false
    }
    if (!titleFieldRegex(categoryText)) {
      return false
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
    if (
      personaWiseDocumentCategoryListData &&
      personaWiseDocumentCategoryListData.length > 0
    ) {
      getCategoryNames = personaWiseDocumentCategoryListData.map((value) => {
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
          setting_type: 3,
        }
        dispatch(
          globalActions?.profileSettingAddCategoryFormSubmitRequestAction?.request(
            payload
          )
        )
        closeAddCategorySlider()
        eventManager.send_event(events.SAVE_NEW_DOCUMENTS_SECTION_CLICKED_TFI, {
          screen_name: persona,
          document_name: fieldsData.categoryName,
        })
      }
    } else {
      handleCategoryInputsSetError(
        'categoryName',
        t('enteredDocCategoryNameIsAlreadyExists')
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
          events.PROFILE_DOCUMENT_SECTION_EXIT_WITHOUT_ADDING_CLICKED_TFI,
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
        <SubTitleBar titleInfo={docHeaderInfo} />
      </div>
      <div className={styles.headerRightSection}>
        {personaWiseDocumentCategoryListData?.length > 0 && (
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
        )}
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
              onClick={addDocCategoryHandler}
              className={styles.addCategoryButton}
              type="border"
            >
              {t('createSection')}
            </Button>
          </span>
        </Permission>
      </div>
      {/* Document Category Preview Slider */}
      {showPreviewSlider && (
        <DocumentCategoryPreviewSlider
          persona={persona}
          setPreviewSlider={setPreviewSlider}
          documentCategoriesData={personaWiseDocumentCategoryListData}
        />
      )}
      {/* Add Document Category Slider */}
      {showAddSlider && (
        <DocumentAddCategorySlider
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

export default DocumentHeaderSection

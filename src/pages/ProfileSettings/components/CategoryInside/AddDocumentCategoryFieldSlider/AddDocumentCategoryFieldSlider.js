import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, StickyFooter} from '@teachmint/common'
import {showToast} from '../../../../../redux/actions/commonAction'
import globalActions from '../../../../../redux/actions/global.actions'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import FieldSettingsToggles from '../../UICommon/FieldSettingsToggles/FieldSettingsToggles'
import CustomDocumentFieldBoxContainer from '../CustomDocumentFieldBoxContainer/CustomDocumentFieldBoxContainer'
import {getAddDocumentCategoryFieldToolTips} from '../CategoryInside.utils'
import {
  addCategoryFieldFormState,
  getRequestParamsObject,
  isFieldNameExist,
} from './AddDocumentCategoryFieldSlider.utils'
import {events} from '../../../../../utils/EventsConstants'
import styles from './AddDocumentCategoryFieldSlider.module.css'

const AddDocumentCategoryFieldSlider = ({
  userType,
  addFieldSliderCloseHandler,
  closeAddFieldSlider,
  categoryFieldsData,
  dataResetFlag,
  setDataResetFlag,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const [addNewFieldFormInputsValue, setAddNewFieldFormInputsValue] = useState(
    addCategoryFieldFormState
  )
  const [isFormValid, setIsFormValid] = useState(false)
  const makeSliderHeaderTitle = `Add document - ${categoryFieldsData?.label}`
  // ToolTips Options Data
  const toolTipsOptionsData = getAddDocumentCategoryFieldToolTips(userType)

  // Add field submit form
  const handleAddFieldSubmitForm = () => {
    const fieldTitle = addNewFieldFormInputsValue?.fieldName.trim()
    if (fieldTitle !== '') {
      const isCategoryFieldNameExist = isFieldNameExist({
        fieldTitle,
        categoryFieldsData,
      })
      if (!isCategoryFieldNameExist) {
        const requestParams = getRequestParamsObject({
          instituteInfo,
          userType,
          categoryFieldsData,
          addNewFieldFormInputsValue,
        })
        dispatch(
          globalActions?.addCategoryFieldFormSubmitRequest?.request(
            requestParams
          )
        )
        eventManager.send_event(events.SAVE_NEW_PROFILE_DOCUMENTS_CLICKED_TFI, {
          screen_name: userType,
          category_id: requestParams?.category_id,
          field_form: requestParams,
        })
        resetDataHandler()
      } else {
        dispatch(
          showToast({
            type: 'error',
            message: t('documentCategoryFieldNameAlreadyExist'),
          })
        )
      }
    }
  }

  // Reset Data handler
  useEffect(() => {
    if (dataResetFlag) {
      resetDataHandler()
    }
  }, [dataResetFlag])
  const resetDataHandler = () => {
    setDataResetFlag(false)
    setAddNewFieldFormInputsValue(addCategoryFieldFormState)
    closeAddFieldSlider()
  }

  return (
    <div className={styles.categoryFieldSliderInside}>
      <SliderScreen setOpen={addFieldSliderCloseHandler}>
        <div className={styles.sliderMainContainer}>
          <SliderScreenHeader title={makeSliderHeaderTitle} />
          <div className={styles.sliderContainer}>
            <div className={styles.sliderBody}>
              <div className={styles.customFieldSection}>
                {/* Custom fields box container */}
                <CustomDocumentFieldBoxContainer
                  setIsFormValid={setIsFormValid}
                  dataResetFlag={dataResetFlag}
                  fieldFormInputsValue={addNewFieldFormInputsValue}
                  setFieldFormInputsValue={setAddNewFieldFormInputsValue}
                />
                {/* Fields settings ToggleSwitch */}
                <div className={styles.fieldSettingsToggleBlock}>
                  <FieldSettingsToggles
                    fieldFormInputsValue={addNewFieldFormInputsValue}
                    setFieldFormInputsValue={setAddNewFieldFormInputsValue}
                    toolTipsOptionsData={toolTipsOptionsData}
                  />
                </div>
              </div>
            </div>
            <div className={styles.sliderFooter}>
              <div className={styles.addSectionNote}>
                {t('documentCategoryFieldNote')}
              </div>
              <StickyFooter forSlider={true}>
                <Button
                  size="big"
                  type="primary"
                  className={styles.addSaveButton}
                  onClick={handleAddFieldSubmitForm}
                  disabled={!isFormValid}
                >
                  {t('save')}
                </Button>
              </StickyFooter>
            </div>
          </div>
        </div>
      </SliderScreen>
    </div>
  )
}

export default AddDocumentCategoryFieldSlider

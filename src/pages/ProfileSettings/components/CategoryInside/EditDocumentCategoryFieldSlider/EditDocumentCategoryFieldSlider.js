import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Button, StickyFooter} from '@teachmint/common'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import globalActions from '../../../../../redux/actions/global.actions'
import {getEditCategoryFieldFormState} from '../EditCategoryFieldsSlider/EditCategoryFieldsSlider.utils'
import {getEditDocumentCategoryFieldToolTips} from '../CategoryInside.utils'
import FieldSettingsToggles from '../../UICommon/FieldSettingsToggles/FieldSettingsToggles'
import styles from './EditDocumentCategoryFieldSlider.module.css'
import {FIELD_TYPES} from '../../../ProfileSettings.constant'
import {events} from '../../../../../utils/EventsConstants'

const EditDocumentCategoryFieldSlider = ({
  userType,
  editFieldSliderCloseHandler,
  fieldEditFormData,
  closeEditFieldSlider,
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {instituteInfo, eventManager} = useSelector((state) => state)
  const [editCategoryFieldFormValue, setEditCategoryFieldFormValue] = useState(
    getEditCategoryFieldFormState(fieldEditFormData)
  )
  const [isFormValid, setIsFormValid] = useState(false)
  const fieldTitle = fieldEditFormData?.label
  const makeSliderHeaderTitle = `Edit settings - ${fieldTitle}`
  // ToolTips Options Data
  const toolTipsOptionsData = getEditDocumentCategoryFieldToolTips({
    userType,
    fieldEditFormData,
  })

  // Update field form submit
  const requestParamsObject = () => {
    return {
      institute_type: instituteInfo.institute_type,
      persona: userType,
      field_type: FIELD_TYPES['DOCUMENT'].key,
      category_id: fieldEditFormData?.category_id,
      _id: fieldEditFormData?._id,
      is_value_mandatory: editCategoryFieldFormValue.isValueMandatory,
      is_visible_to_persona: editCategoryFieldFormValue.isVisibleToPersona,
      is_value_editable_by_persona:
        editCategoryFieldFormValue.isValueEditableByPersona,
      is_active: !editCategoryFieldFormValue.isThisFieldInActive,
    }
  }
  const handleUpdateFieldSubmitForm = () => {
    const requestParams = requestParamsObject()
    dispatch(
      globalActions?.updateCategoryFieldFormSubmitRequest?.request(
        requestParams
      )
    )
    eventManager.send_event(events.PROFILE_DOCUMENT_UPDATE_CLICKED_TFI, {
      screen_name: userType,
      category_id: requestParams?.category_id,
      field_form: requestParams,
    })
    resetDataHandler()
  }
  const resetDataHandler = () => {
    closeEditFieldSlider()
  }
  return (
    <div className={styles.categoryFieldSliderInside}>
      <SliderScreen setOpen={editFieldSliderCloseHandler}>
        <div className={styles.sliderMainContainer}>
          <SliderScreenHeader title={makeSliderHeaderTitle} />
          <div className={styles.sliderContainer}>
            <div className={styles.sliderBody}>
              <div className={styles.customFieldSection}>
                {/* Fields Settings ToggleSwitch */}
                <div className={styles.fieldSettingsToggleBlock}>
                  <FieldSettingsToggles
                    fieldFormInputsValue={editCategoryFieldFormValue}
                    setFieldFormInputsValue={setEditCategoryFieldFormValue}
                    toolTipsOptionsData={toolTipsOptionsData}
                    setIsFormValid={setIsFormValid}
                  />
                </div>
              </div>
            </div>
            <div className={styles.sliderFooter}>
              <StickyFooter forSlider={true}>
                <Button
                  size="big"
                  type="primary"
                  className={styles.addSaveButton}
                  onClick={handleUpdateFieldSubmitForm}
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

export default EditDocumentCategoryFieldSlider

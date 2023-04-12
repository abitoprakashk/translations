import React from 'react'
import {useTranslation} from 'react-i18next'
import {Button, Input, StickyFooter} from '@teachmint/common'
import classNames from 'classnames'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {getSliderHeaderTitle} from '../../../commonFunctions'
import {PERSONA_STATUS} from '../../../ProfileSettings.constant'
import styles from './DocumentAddCategorySlider.module.css'

const DocumentAddCategorySlider = ({
  persona,
  closeAddSlider,
  fieldsData,
  handleChange,
  errorObject,
  isAddCategoryFormValid,
  handleAddCategoryFormSubmit,
}) => {
  const {t} = useTranslation()
  const makeSliderHeaderTitle = PERSONA_STATUS[persona].addDocumentCategoryTitle
    ? getSliderHeaderTitle(PERSONA_STATUS[persona].addDocumentCategoryTitle)
    : ''
  return (
    <div>
      <SliderScreen setOpen={closeAddSlider}>
        <div>
          <SliderScreenHeader title={t(makeSliderHeaderTitle)} />
          <div className={styles.sliderContainer}>
            <div className={styles.sliderBody}>
              <div className={styles.customFieldSection}>
                <div
                  className={classNames(
                    styles.inputGroup,
                    styles.categoryTitleInputGroup
                  )}
                >
                  <span className={styles.limitText}>
                    {t('categoryFieldLimitText')}
                  </span>
                  <Input
                    type="text"
                    title={t('enterDocCategoryName')}
                    fieldName="categoryName"
                    value={fieldsData?.categoryName}
                    placeholder={t('identityProofPlaceHolder')}
                    onChange={handleChange}
                    className={styles.inputFieldTitleClass}
                    maxLength="50"
                    isRequired={true}
                    showError={Object.keys(errorObject).length > 0}
                    errorMsg={errorObject['categoryName']}
                  />
                </div>
              </div>
            </div>

            <div className={styles.sliderFooter}>
              <div className={styles.addSectionNote}>
                {t('documentCategoryNote')}
              </div>
              <StickyFooter forSlider={true}>
                <Button
                  size="big"
                  onClick={handleAddCategoryFormSubmit}
                  type="primary"
                  className={styles.addSaveButton}
                  disabled={!isAddCategoryFormValid}
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

export default DocumentAddCategorySlider

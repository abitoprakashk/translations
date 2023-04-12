import React from 'react'
import {useTranslation} from 'react-i18next'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import {getSliderHeaderTitle} from '../../../commonFunctions'
import {PERSONA_STATUS} from '../../../ProfileSettings.constant'
import DocumentUploadPreview from '../../UICommon/DocumentUploadPreview/DocumentUploadPreview'
import defaultEmptyCategoriesScreen from '../../UICommon/profileSettingsEmptyIcon.svg'
import styles from './DocumentCategoryPreviewSlider.module.css'

const DocumentCategoryPreviewSlider = ({
  setPreviewSlider,
  persona,
  documentCategoriesData,
}) => {
  const {t} = useTranslation()
  const makeSliderHeaderTitle = PERSONA_STATUS[persona].documentPreviewTitle
    ? getSliderHeaderTitle(PERSONA_STATUS[persona].documentPreviewTitle)
    : ''

  return (
    <>
      <SliderScreen
        setOpen={() => {
          setPreviewSlider(false)
        }}
        width={'900'}
      >
        <div>
          <SliderScreenHeader title={t(makeSliderHeaderTitle)} />
          <div className={styles.sliderContainer}>
            <div className={styles.sliderBody}>
              <div className={styles.dynamicCategoriesMainBlock}>
                {documentCategoriesData && documentCategoriesData.length > 0 ? (
                  <DocumentUploadPreview
                    persona={persona}
                    documentSettings={documentCategoriesData}
                  />
                ) : (
                  <EmptyScreenV1
                    image={defaultEmptyCategoriesScreen}
                    title={t('documentAndTheirFieldsDetailsNotFound')}
                    btnType="primary"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SliderScreen>
    </>
  )
}

export default DocumentCategoryPreviewSlider

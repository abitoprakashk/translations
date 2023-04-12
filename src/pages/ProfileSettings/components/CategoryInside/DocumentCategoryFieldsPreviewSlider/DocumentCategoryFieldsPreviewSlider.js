import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import DocumentUploadPreview from '../../UICommon/DocumentUploadPreview/DocumentUploadPreview'
import defaultEmptyCategoriesScreen from '../../UICommon/profileSettingsEmptyIcon.svg'
import styles from './DocumentCategoryFieldsPreviewSlider.module.css'

const DocumentCategoryFieldsPreviewSlider = ({
  setFieldsPreviewSlider,
  categoryFieldsData,
  persona,
}) => {
  const {t} = useTranslation()
  const makeSliderHeaderTitle = `Preview - ${categoryFieldsData?.label}`
  const categoryAndTheirFieldData = useMemo(() => {
    if (categoryFieldsData && Object.keys(categoryFieldsData).length > 0) {
      return [categoryFieldsData]
    } else {
      return null
    }
  }, [categoryFieldsData])

  return (
    <div>
      <SliderScreen
        setOpen={() => {
          setFieldsPreviewSlider(false)
        }}
        width={'900'}
      >
        <div>
          <SliderScreenHeader title={makeSliderHeaderTitle} />
          <div className={styles.sliderContainer}>
            <div className={styles.sliderBody}>
              <div className={styles.dynamicCategoriesMainBlock}>
                {categoryAndTheirFieldData &&
                categoryAndTheirFieldData.length > 0 ? (
                  <DocumentUploadPreview
                    persona={persona}
                    documentSettings={categoryAndTheirFieldData}
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
    </div>
  )
}

export default DocumentCategoryFieldsPreviewSlider

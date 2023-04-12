import React, {useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import PreviewDynamicCategories from '../../UICommon/PreviewDynamicCategories/PreviewDynamicCategories'
import defaultEmptyCategoriesScreen from '../../UICommon/profileSettingsEmptyIcon.svg'
import styles from './CategoryFieldsPreviewSlider.module.css'

const CategoryFieldsPreviewSlider = ({
  setFieldsPreviewSlider,
  categoryFieldsData,
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
                  <>
                    <PreviewDynamicCategories
                      categoriesAndTheirFieldsData={categoryAndTheirFieldData}
                    />
                  </>
                ) : (
                  <EmptyScreenV1
                    image={defaultEmptyCategoriesScreen}
                    title={t('categoryAndTheirFieldsDetailsNotFound')}
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

export default CategoryFieldsPreviewSlider

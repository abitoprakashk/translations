import React from 'react'
import {useTranslation} from 'react-i18next'
import SliderScreen from '../../../../../components/Common/SliderScreen/SliderScreen'
import SliderScreenHeader from '../../../../../components/Common/SliderScreenHeader/SliderScreenHeader'
import EmptyScreenV1 from '../../../../../components/Common/EmptyScreenV1/EmptyScreenV1'
import {getSliderHeaderTitle} from '../../../commonFunctions'
import {PERSONA_STATUS} from '../../../ProfileSettings.constant'
import PreviewDynamicCategories from '../../UICommon/PreviewDynamicCategories/PreviewDynamicCategories'
import Header from '../../../../user-profile/components/common/Header/Header'
import {STUDENT_HEADER_DESCRIPTION} from '../../../../user-profile/constants'
import defaultEmptyCategoriesScreen from '../../UICommon/profileSettingsEmptyIcon.svg'
import styles from './ProfileCategoryPreviewSlider.module.css'

const ProfileCategoryPreviewSlider = ({
  setPreviewSlider,
  persona,
  categoriesAndTheirFieldsData,
}) => {
  const {t} = useTranslation()
  const makeSliderHeaderTitle = PERSONA_STATUS[persona].profilePreviewTitle
    ? getSliderHeaderTitle(PERSONA_STATUS[persona].profilePreviewTitle)
    : ''

  return (
    <div>
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
                {categoriesAndTheirFieldsData &&
                categoriesAndTheirFieldsData.length > 0 ? (
                  <>
                    <Header
                      descriptionObj={{
                        ...STUDENT_HEADER_DESCRIPTION,
                      }}
                      persona={persona}
                      setPicUrl={null}
                      picUrl={''}
                      screenName={'add_student'}
                      disableUpload={true}
                    />
                    <>
                      <hr className={styles.dividerLine} />
                    </>
                    <PreviewDynamicCategories
                      categoriesAndTheirFieldsData={
                        categoriesAndTheirFieldsData
                      }
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
            <div className={styles.sliderFooter}></div>
          </div>
        </div>
      </SliderScreen>
    </div>
  )
}

export default ProfileCategoryPreviewSlider

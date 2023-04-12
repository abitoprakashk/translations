import React from 'react'
import {useTranslation} from 'react-i18next'
import {FlatAccordion} from '@teachmint/common'
import CategoryFieldsPreivewContainer from './CategoryFieldsPreivewContainer'
import styles from './PreviewDynamicCategories.module.css'

const PreviewDynamicCategories = ({categoriesAndTheirFieldsData}) => {
  const {t} = useTranslation()
  const userFormTitle =
    categoriesAndTheirFieldsData &&
    categoriesAndTheirFieldsData[0]?.key_id &&
    ['student_basic_details', 'staff_basic_details'].includes(
      categoriesAndTheirFieldsData[0]?.key_id
    )
  return (
    <div className={styles.dynamicCategoriesSection}>
      {userFormTitle && (
        <div className={styles.sliderFormCueText}>
          {t('inviteUserFormHeadsUp')}
        </div>
      )}

      {categoriesAndTheirFieldsData &&
        categoriesAndTheirFieldsData.map((item, i) => {
          if (!item.deleted && item.is_active) {
            const categoryFieldsDetails = item?.childrenFields
            let isCategoryHaveField = true
            let actiVeFieldList = []
            if (categoryFieldsDetails && categoryFieldsDetails.length > 0) {
              categoryFieldsDetails.forEach((item) => {
                if (item.is_active) {
                  actiVeFieldList.push(item._id)
                }
              })
              if (actiVeFieldList.length == 0) {
                isCategoryHaveField = false
              }
            }
            return (
              <>
                {isCategoryHaveField &&
                  categoryFieldsDetails &&
                  categoryFieldsDetails.length > 0 && (
                    <div className={styles.categoriesAccordion} key={item._id}>
                      <FlatAccordion
                        accordionClass={styles.categoriesFlatAccordion}
                        title={item.label}
                        isOpen={i === 0 ? true : false}
                      >
                        <div className={styles.accordionDiv}>
                          <div className={styles.categoryFieldsLoadingBlock}>
                            {
                              <CategoryFieldsPreivewContainer
                                categoryFieldsDetails={item}
                              />
                            }
                          </div>
                        </div>
                      </FlatAccordion>
                    </div>
                  )}
              </>
            )
          }
        })}
    </div>
  )
}

export default PreviewDynamicCategories

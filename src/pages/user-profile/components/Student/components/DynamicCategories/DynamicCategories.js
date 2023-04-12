import React from 'react'
import {useTranslation} from 'react-i18next'
import {FlatAccordion} from '@teachmint/common'
import CategoryFieldsLoadingContainer from '../../../UICommon/CategoryFieldsLoadingContainer/CategoryFieldsLoadingContainer'
import styles from './DynamicCategories.module.css'
import Permission from '../../../../../../components/Common/Permission/Permission'

const DynamicCategories = ({
  isAdd,
  userCategoriesListData,
  assignedToClass,
  userFieldsState,
  classList,
  sectionList,
  userType,
  fieldsHandleChange,
  handleValidationError,
  openViewProfile,
  userList = [],
  isSameAddress,
  setIsSameAddress,
  userDetails = null,
  roleLabelIdMap,
  permissionId = null,
  pickupPointList = [],
}) => {
  const {t} = useTranslation()
  return (
    <div className={styles.dynamicCategoriesSection}>
      <div className={styles.sliderFormCueText}>
        {t('inviteUserFormHeadsUp')}
      </div>
      {userCategoriesListData &&
        userCategoriesListData.map((item, i) => {
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
                          <Permission
                            permissionId={permissionId}
                            showOpacity={false}
                          >
                            <div className={styles.categoryFieldsLoadingBlock}>
                              {
                                <CategoryFieldsLoadingContainer
                                  isAdd={isAdd}
                                  categoryFieldsDetails={item}
                                  fieldsHandleChange={fieldsHandleChange}
                                  userFieldsState={userFieldsState}
                                  assignedToClass={assignedToClass}
                                  classList={classList}
                                  sectionList={sectionList}
                                  userType={userType}
                                  handleValidationError={handleValidationError}
                                  userList={userList}
                                  openViewProfile={openViewProfile}
                                  isSameAddress={isSameAddress}
                                  setIsSameAddress={setIsSameAddress}
                                  userDetails={userDetails}
                                  roleLabelIdMap={roleLabelIdMap}
                                  pickupPointList={pickupPointList}
                                />
                              }
                            </div>
                          </Permission>
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

export default DynamicCategories

import {
  Accordion,
  Button,
  BUTTON_CONSTANTS,
  Divider,
  Heading,
  HEADING_CONSTANTS,
  Para,
  PARA_CONSTANTS,
} from '@teachmint/krayon'
import {t} from 'i18next'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import SliderStudentDetail from '../../../../../../components/SchoolSystem/StudentDirectory/SliderStudentDetail'
import {FIELD_TYPES} from '../../../../../ProfileSettings/ProfileSettings.constant'
import styles from './DetailedProfilePage.module.css'
import {DateTime} from 'luxon'
import Permission from '../../../../../../components/Common/Permission/Permission'
import {PERMISSION_CONSTANTS} from '../../../../../../utils/permission.constants'

const itemssNotToShow = ['classroom_ids']

export default function DetailedProfilePage({currentStudent, pickupPointList}) {
  const [showEditProfileSilder, setShowEditProfileSilder] = useState(false)

  const {personaCategoryListData} = useSelector(
    (state) => state.profileSettings
  )
  const getValue = ({fieldType, valueKey}) => {
    let newFieldValue = '-'
    if (currentStudent?.[valueKey]) {
      newFieldValue = currentStudent?.[valueKey]
      if (fieldType === FIELD_TYPES.DATE.key) {
        newFieldValue = DateTime.fromSeconds(
          currentStudent?.[valueKey]
        ).toFormat('dd/MM/yyyy')
      }
      if (valueKey === 'transport_waypoint') {
        newFieldValue =
          pickupPointList.find(
            (item) => item._id === currentStudent?.[valueKey]
          )?.name || currentStudent?.transport_waypoint
      }
    }
    return newFieldValue
  }

  const getInfoItemUI = (id, label, valueKey, fieldType) => {
    return (
      <div key={id}>
        <Para
          textSize={PARA_CONSTANTS.TEXT_SIZE.MEDIUM}
          className={styles.infoItemLabel}
        >
          {label}
        </Para>
        <Para type={PARA_CONSTANTS.TYPE.TEXT_PRIMARY}>
          {getValue({fieldType, valueKey})}
        </Para>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.editButtonWrapper}></div>

      {personaCategoryListData &&
        personaCategoryListData
          ?.filter(({deleted, is_active}) => !deleted && is_active)
          .map((item, i) => {
            const activeFieldList = []

            item?.childrenFields?.forEach((item) => {
              if (item.is_active) activeFieldList.push(item)
            })

            return (
              <>
                {activeFieldList?.length > 0 && (
                  <Accordion
                    classes={{
                      accordionWrapper: styles.accordionWrapper,
                      accordionBody: styles.accordionBody,
                    }}
                    headerContent={
                      <div className={styles.accordionHeader}>
                        <Heading
                          textSize={HEADING_CONSTANTS.TEXT_SIZE.X_SMALL}
                          className={styles.accordionHeading}
                        >
                          {item.label}
                        </Heading>

                        <Permission
                          permissionId={
                            PERMISSION_CONSTANTS.ipsController_updateUsers_update
                          }
                        >
                          <Button
                            type={BUTTON_CONSTANTS.TYPE.TEXT}
                            onClick={() => setShowEditProfileSilder(true)}
                          >
                            {t('edit')}
                          </Button>
                        </Permission>
                      </div>
                    }
                    isOpen={i === 0 ? true : false}
                    allowHeaderClick={true}
                  >
                    <>
                      {item?.key_id === 'address' ? (
                        <div>
                          {[
                            {label: t('currentAddress'), key: 'p_'},
                            {label: t('permanentAddress'), key: 'c_'},
                          ].map((addressItem, i) => (
                            <div key={addressItem.key}>
                              <Heading
                                textSize={HEADING_CONSTANTS.TEXT_SIZE.XX_SMALL}
                                className={styles.addressSubSectionHeading}
                              >
                                {addressItem.label}
                              </Heading>
                              <div className={styles.itemDataformat}>
                                {activeFieldList
                                  ?.filter((item) =>
                                    item?.key_id?.search(addressItem.key)
                                  )
                                  ?.map((item) =>
                                    getInfoItemUI(
                                      item?._id,
                                      item?.label,
                                      item?.key_id
                                    )
                                  )}
                              </div>
                              {i === 0 && <Divider spacing="20px" />}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.itemDataformat}>
                          {activeFieldList
                            ?.filter(
                              ({key_id}) => !itemssNotToShow.includes(key_id)
                            )
                            .map((item) =>
                              getInfoItemUI(
                                item?._id,
                                item?.label,
                                item?.key_id,
                                item?.field_type
                              )
                            )}
                        </div>
                      )}
                    </>
                  </Accordion>
                )}
              </>
            )
          })}

      {showEditProfileSilder && (
        <SliderStudentDetail
          setSliderScreen={setShowEditProfileSilder}
          studentId={currentStudent?._id}
          width="900"
        />
      )}
    </div>
  )
}

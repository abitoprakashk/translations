import React from 'react'
import classNames from 'classnames'
import styles from './Classes.module.css'
import InstituteTree from '../../tfi-common/InstituteTree/InstituteTree'
import {
  FEE_STRUCTURE_TYPES_IDS,
  INSTITUTE_HIERARCHY_TYPES,
  PROFILE_CATEGORY_OPTIONS,
  PROFILE_GENDER_OPTIONS,
  STUDENT_PROFILE_OPTIONS,
} from '../../../fees.constants'
import {useTranslation} from 'react-i18next'
import FormError from '../../tfi-common/FormError/FormError'
import {Icon, Input} from '@teachmint/common'

export default function ClassesTab({
  formValues,
  formErrors,
  setFormValues,
  handleChange,
  hidden,
  showAdvancedFilter = false,
  setShowAdvancedFilter = () => {},
}) {
  const {t} = useTranslation()
  let preSelectedNodes = {}
  formValues.assigned_to.forEach((_id) => {
    preSelectedNodes[_id] = true
  })
  const getSelectedNodes = (nodes) => {
    let selectedClassSections = []
    Object.keys(nodes).map((node) => {
      if (
        nodes[node].type === INSTITUTE_HIERARCHY_TYPES.STANDARD ||
        nodes[node].type === INSTITUTE_HIERARCHY_TYPES.SECTION
      ) {
        selectedClassSections.push(node)
      }
    })
    setFormValues({...formValues, assigned_to: selectedClassSections})
  }

  const admissionDateOptions = STUDENT_PROFILE_OPTIONS.map((option) => {
    return {
      value: option.id,
      label: option.label,
    }
  })

  const genderOptions = PROFILE_GENDER_OPTIONS.map((option) => {
    return {
      value: option.id,
      label: t(option.label),
    }
  })

  // Usefull for next phase - By Nirav
  // const genderSelected = () => {
  //   let selectedGender = formValues.gender
  //   if (selectedGender) {
  //     if (selectedGender !== 'all') {
  //       selectedGender = PROFILE_GENDER_OPTIONS.find(
  //         (gen) => gen.id === selectedGender
  //       ).id
  //     } else {
  //       selectedGender = 'all'
  //     }
  //   } else {
  //     selectedGender = 'all'
  //   }
  //   return selectedGender
  // }

  return (
    <div className={classNames({hidden: hidden})}>
      {t('classesTabTitle')}
      <FormError errorMessage={formErrors.assigned_to} />
      <div>
        <InstituteTree
          isVertical={false}
          allChecked={
            !formValues._id &&
            formValues.fee_Type === FEE_STRUCTURE_TYPES_IDS.TRANSPORT_FEE
          }
          preSelectedNodes={preSelectedNodes}
          getSelectedNodes={getSelectedNodes}
          hierarchyTypes={[
            INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
            INSTITUTE_HIERARCHY_TYPES.STANDARD,
            INSTITUTE_HIERARCHY_TYPES.SECTION,
          ]}
          expandChildNodesDefault={false}
          expandTill={INSTITUTE_HIERARCHY_TYPES.DEPARTMENT}
          showInactiveClasses
        />
      </div>
      <div className={styles.divider}></div>
      <div className={styles.advancedFiltersSection}>
        <div
          className={styles.advancedFiltersSectionHeadingSection}
          onClick={() => {
            setShowAdvancedFilter(!showAdvancedFilter)
          }}
        >
          <div className={styles.headingText}>
            {t('addProfileBasedFilters')}
          </div>
          <div
            className={classNames(styles.headingSectionIcon, {
              [styles.headingSectionIconRight]: !showAdvancedFilter,
            })}
          >
            <Icon color="basic" name="downArrow" size="xxs" />
          </div>
        </div>
        {showAdvancedFilter && (
          <div className={styles.advanceFilter}>
            <div className={styles.sectionHeadingSec}>
              <div className={styles.sectionHeadingText}>{t('profile')}</div>
              <div
                className={styles.clearAllBtn}
                onClick={() => {
                  setFormValues({
                    ...formValues,
                    category: [],
                    gender: '',
                    applicable_students: '',
                  })
                }}
              >
                {t('clearAll')}
              </div>
            </div>
            <div className={styles.profileBasedSection}>
              <div>
                <FormError errorMessage={formErrors.applicable_students} />
                <div className={styles.profileOptions}>
                  <Input
                    type="radio"
                    title={t('basedOnAdmission')}
                    fieldName="applicable_students"
                    value={formValues.applicable_students}
                    options={admissionDateOptions}
                    onChange={handleChange}
                    classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
                  />
                </div>
              </div>
              <div>
                <div className={styles.profileOptions}>
                  <Input
                    type="radio"
                    title={t('basedOnGender')}
                    fieldName="gender"
                    value={formValues.gender}
                    options={genderOptions}
                    onChange={handleChange}
                    classes={{wrapper: styles.inputWrapper, title: 'tm-para'}}
                  />
                </div>
              </div>
              <div>
                <div className={styles.profileBasedHeadingText}>
                  {t('basedOnCategory')}
                </div>
                <div className={styles.profileOptions}>
                  <Input
                    type="checkbox"
                    value={'all'}
                    onChange={handleChange}
                    labelTxt={t('applicableForAll')}
                    fieldName="category"
                    classes={{
                      wrapper: styles.inputRadioWrapper,
                      title: 'tm-para',
                    }}
                    isChecked={
                      formValues?.category
                        ? formValues.category.length ===
                          PROFILE_CATEGORY_OPTIONS.length
                        : false
                    }
                  />
                  {PROFILE_CATEGORY_OPTIONS.map((option) => {
                    return (
                      <div key={option.value} className={styles.inputGroup}>
                        <Input
                          type="checkbox"
                          key={option.value}
                          value={option.value}
                          onChange={handleChange}
                          labelTxt={option.label}
                          fieldName="category"
                          classes={{
                            wrapper: styles.inputWrapper,
                            title: 'tm-para',
                          }}
                          isChecked={
                            formValues?.category
                              ? formValues.category.includes(option.value)
                              : false
                          }
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

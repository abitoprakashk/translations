import React, {useEffect, useMemo, useState} from 'react'
import styles from './FilterAccountMapping.module.css'
import {CheckboxGroup, Modal} from '@teachmint/krayon'
import classNames from 'classnames'
import Option from './Option/Option'
import {
  ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES,
  FILTER_BY_MODE,
  FILTER_BY_STATUS,
  FILTER_FOR,
  FILTER_OPTION_IDS,
  TRANSLATIONS_CA,
} from '../../companyAccConstants'
import InstituteHierarchy, {
  INSTITUTE_HIERARCHY_TYPES,
} from '../../../../../AdmissionManagement/components/Common/InstituteHierarchy/InstituteHierarchy'
import AccordianSelection from './AccordianSelection/AccordianSelection'

export default function FilterAccountMapping({
  isOpen = false,
  onClose = () => {},
  handleApplyFilterBtnClick = () => {},
  appliedFilter = {},
  selectedBasis = '',
  instituteHierarchy,
  feeTypeOptions = [],
  companyAccountData = [],
  filterFor = FILTER_FOR.ACCOUNT_MAPPING,
}) {
  const [selectedOption, setSelectedOption] = useState()
  const [selectedClasses, setSelectedClasses] = useState([])
  const [selectedFeeTypes, setSelectedFeeTypes] = useState([])
  const [selectedAccounts, setSelectedAccounts] = useState([])
  const [selectedStatus, setSelectedStatus] = useState([])
  const [selectedPaymentModes, setSelectedPaymentModes] = useState([])

  useEffect(() => {
    setSelectedClasses(
      appliedFilter?.classAndSection && appliedFilter.classAndSection.length > 0
        ? appliedFilter?.classAndSection
        : []
    )
    setSelectedFeeTypes(
      appliedFilter?.feeTypes && appliedFilter.feeTypes.length > 0
        ? appliedFilter?.feeTypes
        : []
    )
    setSelectedAccounts(
      appliedFilter?.accounts && appliedFilter.accounts.length > 0
        ? appliedFilter?.accounts
        : []
    )
    setSelectedStatus(
      appliedFilter?.status && appliedFilter.status.length > 0
        ? appliedFilter?.status
        : []
    )
    setSelectedPaymentModes(
      appliedFilter?.mode && appliedFilter.mode.length > 0
        ? appliedFilter?.mode
        : []
    )
  }, [])

  const onApplyFilterBtnClick = () => {
    let filterValues = {feeTypes: selectedFeeTypes}

    if (filterFor === FILTER_FOR.ACCOUNT_MAPPING) {
      filterValues = {
        ...filterValues,
        classAndSection: selectedClasses,
        accounts: selectedAccounts,
      }
    } else if (filterFor === FILTER_FOR.ACCOUNT_PASSBOOK) {
      filterValues = {
        ...filterValues,
        feeTypes: selectedFeeTypes,
        status: selectedStatus,
        mode: selectedPaymentModes,
      }
    }

    handleApplyFilterBtnClick(filterValues)
    onClose()
  }

  const filterOptions = useMemo(() => {
    return [
      {
        id: FILTER_OPTION_IDS.CLASS,
        isActive: selectedOption === FILTER_OPTION_IDS.CLASS,
        text: TRANSLATIONS_CA.class,
        onClick: () => {},
        isVisible:
          filterFor === FILTER_FOR.ACCOUNT_MAPPING &&
          [
            ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.CLASS,
            ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL,
          ].includes(selectedBasis),
      },
      {
        id: FILTER_OPTION_IDS.FEE_TYPE,
        isActive: selectedOption === FILTER_OPTION_IDS.FEE_TYPE,
        text: TRANSLATIONS_CA.feeType,
        onClick: () => {},
        isVisible:
          filterFor === FILTER_FOR.ACCOUNT_PASSBOOK ||
          (filterFor === FILTER_FOR.ACCOUNT_MAPPING &&
            [
              ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE,
              ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL,
            ].includes(selectedBasis)),
      },
      {
        id: FILTER_OPTION_IDS.ACCOUNT,
        isActive: selectedOption === FILTER_OPTION_IDS.ACCOUNT,
        text: TRANSLATIONS_CA.bankAccount,
        onClick: () => {},
        isVisible: filterFor === FILTER_FOR.ACCOUNT_MAPPING,
      },
      {
        id: FILTER_OPTION_IDS.STATUS,
        isActive: selectedOption === FILTER_OPTION_IDS.STATUS,
        text: TRANSLATIONS_CA.status,
        onClick: () => {},
        isVisible: filterFor === FILTER_FOR.ACCOUNT_PASSBOOK,
      },
      {
        id: FILTER_OPTION_IDS.MODE,
        isActive: selectedOption === FILTER_OPTION_IDS.MODE,
        text: TRANSLATIONS_CA.mode,
        onClick: () => {},
        isVisible: filterFor === FILTER_FOR.ACCOUNT_PASSBOOK,
      },
    ]
  }, [selectedOption])

  useEffect(() => {
    setSelectedOption(filterOptions.filter((option) => option.isVisible)[0]?.id)
  }, [])

  const handleFilterOptionClick = (optionId) => {
    setSelectedOption(optionId)
  }

  return (
    <Modal
      classes={{content: styles.modal}}
      isOpen={isOpen}
      actionButtons={[
        {
          body: TRANSLATIONS_CA.cancel,
          onClick: onClose,
          type: 'outline',
        },
        {
          body: TRANSLATIONS_CA.confirm,
          onClick: onApplyFilterBtnClick,
        },
      ]}
      header="Filters"
      onClose={onClose}
      size="m"
    >
      <div className={styles.contentSection}>
        <div
          className={classNames(styles.contentSectionBorder, styles.height56vh)}
        >
          <>
            <div
              className={classNames(
                styles.lastChildBorderNone,
                styles.height56vh
              )}
            >
              {filterOptions
                .filter((option) => option.isVisible)
                .map((item) => (
                  <Option
                    isActive={item.isActive}
                    key={item?.id}
                    item={item}
                    handleFilterOptionClick={handleFilterOptionClick}
                  />
                ))}
            </div>
            <div
              className={classNames(
                styles.height56vh,
                styles.flex1,
                styles.borderLeft
              )}
            >
              <div className={styles.rightSideSection}>
                {selectedOption === FILTER_OPTION_IDS.CLASS && (
                  <div>
                    <InstituteHierarchy
                      instituteHierarchy={instituteHierarchy}
                      selectedIds={selectedClasses}
                      handleChange={(obj) =>
                        setSelectedClasses(Object.keys(obj))
                      }
                      hierarchyTypes={[
                        INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
                        INSTITUTE_HIERARCHY_TYPES.STANDARD,
                        INSTITUTE_HIERARCHY_TYPES.SECTION,
                      ]}
                    />
                  </div>
                )}
                {selectedOption === FILTER_OPTION_IDS.FEE_TYPE && (
                  <div>
                    <CheckboxGroup
                      name="sections"
                      onChange={(obj) => {
                        setSelectedFeeTypes([...obj])
                      }}
                      wrapperClass={styles.checkboxGroupWrapperClass}
                      options={feeTypeOptions.map((fee) => {
                        return {value: fee?._id, label: fee?.name}
                      })}
                      selectedOptions={selectedFeeTypes}
                    />
                  </div>
                )}
                {selectedOption === FILTER_OPTION_IDS.ACCOUNT && (
                  <div>
                    <AccordianSelection
                      selectedIds={selectedAccounts}
                      handleChange={(obj) =>
                        setSelectedAccounts(Object.keys(obj))
                      }
                      data={companyAccountData
                        .filter((item) => item?.accounts?.length !== 0)
                        .map((compAcc) => {
                          return {
                            ...compAcc,
                            children: compAcc.accounts.map((acc) => {
                              return {
                                ...acc,
                                status: acc?.disabled,
                                name: acc?.account_name,
                              }
                            }),
                            status: compAcc?.disabled,
                          }
                        })}
                    />
                  </div>
                )}

                {selectedOption === FILTER_OPTION_IDS.STATUS && (
                  <div>
                    <CheckboxGroup
                      name="status"
                      onChange={(obj) => {
                        setSelectedStatus([...obj])
                      }}
                      wrapperClass={styles.checkboxGroupWrapperClass}
                      options={FILTER_BY_STATUS.map((status) => {
                        return {value: status?.id, label: status?.label}
                      })}
                      selectedOptions={selectedStatus}
                    />
                  </div>
                )}

                {selectedOption === FILTER_OPTION_IDS.MODE && (
                  <div>
                    <CheckboxGroup
                      name="mode"
                      onChange={(obj) => {
                        setSelectedPaymentModes([...obj])
                      }}
                      wrapperClass={styles.checkboxGroupWrapperClass}
                      options={FILTER_BY_MODE.map((status) => {
                        return {value: status?.id, label: status?.label}
                      })}
                      selectedOptions={selectedPaymentModes}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
    </Modal>
  )
}

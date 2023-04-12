import React, {useEffect, useState} from 'react'
import styles from './AccountMapping.module.css'
import {useDispatch, useSelector} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {useCompanyAndAccountSelector} from '../selectors'
import BasisSelection from './BasisSelection/BasisSelection'
import {useFeeStructure} from '../../../redux/feeStructure/feeStructureSelectors'
import {fetchFeeTypesRequestedAction} from '../../../redux/feeStructure/feeStructureActions'
import {getClassroomWithSection} from '../../../helpers/helpers'
import {v4 as uuid} from 'uuid'
import {
  ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES,
  COL_TYPE,
  DEFAULT_GROUPS_VALUE,
  IS_EDIT_OR_CREATE_NEW,
  TRANSLATIONS_CA,
} from '../companyAccConstants'
import FeeTypesSelectionModal from './FeeTypesSelectionModal/FeeTypesSelectionModal'
import {
  getClassFeeTypeGroupedObj,
  getClassGroupedObj,
  getClassroomWithSectionObjData,
  getFeeTypeGroupedObj,
  getFeeTypesDataObj,
  getGroupedDataInitData,
  getSectionFeeTypeObj,
} from '../helpers'
import ResetAccountMappingPopup from './ResetAccountMappingPopup/ResetAccountMappingPopup'
import MainSection from './MainSection'
import {events} from '../../../../../utils/EventsConstants'
import useActiveinstituteHierarchy from '../../../../../hooks/useActiveinstituteHierarchy'

export default function AccountMapping() {
  // = flat() is not available for older browser so define here
  useEffect(() => {
    Object.defineProperty(Array.prototype, 'flat', {
      value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
          return flat.concat(
            Array.isArray(toFlatten) && depth > 1
              ? toFlatten.flat(depth - 1)
              : toFlatten
          )
        }, [])
      },
    })
  }, [])

  const dispatch = useDispatch()
  const {feeTypes} = useFeeStructure()
  const myInstituteHierarchy = useSelector((state) => state.instituteHierarchy)
  const instituteHierarchy = useActiveinstituteHierarchy({
    instituteHierarchy: myInstituteHierarchy,
  })
  // const {activeDepartments} = useActiveDepartments({instituteHierarchy})
  const eventManager = useSelector((state) => state.eventManager)
  const classroomWithSection = getClassroomWithSection(instituteHierarchy)
  const {data, isLoading, loaded} =
    useCompanyAndAccountSelector()?.getAccountMappingListCA
  const {data: sessionFeeTypesData} =
    useCompanyAndAccountSelector()?.getSessionFeeTypesCA
  const {data: companyAccountListData} =
    useCompanyAndAccountSelector()?.getCompanyAccountListCA

  const [isEditOrCreateNew, setIsEditOrCreateNew] = useState(null)
  const [groupedByModalProps, setGroupedByModalProps] = useState({
    isOpen: false,
    groupBy: 'class',
    modalHeader: TRANSLATIONS_CA.groupClasses,
    data: [],
    groupData: [],
  })
  const [selectedBasis, setSelectedBasis] = useState(
    ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.CLASS
  )
  const [isResetAccountMappingPopupOpen, setIsResetAccountMappingPopupOpen] =
    useState(false)
  const [backupDataForEdit, setBackupDataForEdit] = useState(null)
  const [feeTypesSelectionModalProps, setFeeTypesSelectionModalProps] =
    useState({
      isOpen: false,
      data: feeTypes,
      selectedFeeTypes: [],
    })
  const [groups, setGroupes] = useState({...DEFAULT_GROUPS_VALUE})

  const [initData, setInitData] = useState(null)
  const [myData, setMyData] = useState([])
  const [accountsList, setAccountsList] = useState([])
  const [companyAccountData, setCompanyAccountData] = useState([])

  useEffect(() => {
    if (companyAccountListData?.companies) {
      const accountsList = companyAccountListData?.companies
        .filter(
          (company) => company?.accounts?.length !== 0 && !company.disabled
        )
        .reduce?.((acc, curr) => {
          let accounts = curr.accounts
            .filter((acc) => !acc.disableds)
            .map((item) => {
              return {...item, name: item?.account_name, compName: curr.name}
            })
          return acc.concat(accounts)
        }, [])

      setAccountsList([
        {_id: '', name: TRANSLATIONS_CA.none, compName: ''},
        ...accountsList,
      ])
      setCompanyAccountData(companyAccountListData?.companies)
    }
  }, [companyAccountListData?.companies])

  useEffect(() => {
    if (
      data &&
      data?.mapping_rules?.length > 0 &&
      !isLoading &&
      loaded &&
      feeTypes
    ) {
      setSelectedBasis(ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES[data?.mapping_type])

      let selectedFeeTypesIds = new Set()
      selectedFeeTypesIds.add(sessionFeeTypesData)
      selectedFeeTypesIds.add(
        data.mapping_rules
          ?.filter?.((item) => item?.master_category_id)
          ?.map?.((item) => item?.master_category_id)
      )
      setFeeTypesSelectionModalProps((prev) => {
        return {
          ...prev,
          selectedFeeTypes: [...selectedFeeTypesIds].flat(),
        }
      })

      let myIntiData = []

      if (
        [
          ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.ALL,
          ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.CLASS,
        ].includes(ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES[data?.mapping_type])
      ) {
        myIntiData = getClassroomWithSectionObjData({
          classroomWithSection,
          feeTypes,
          savedData: data.mapping_rules?.flat?.() || [],
          selectedFeeTypesIds: [...selectedFeeTypesIds]?.flat?.() || [],
        })
      } else {
        myIntiData = getFeeTypesDataObj({
          feeTypes,
          savedData: data.mapping_rules?.flat?.() || [],
          selectedFeeTypesIds: [...selectedFeeTypesIds]?.flat?.() || [],
        })
      }
      setInitData(myIntiData)
    }
  }, [data, feeTypes, sessionFeeTypesData])

  useEffect(() => {
    if (sessionFeeTypesData && sessionFeeTypesData.length > 0) {
      setFeeTypesSelectionModalProps((prev) => {
        return {
          ...prev,
          selectedFeeTypes: [
            ...new Set([...prev.selectedFeeTypes, sessionFeeTypesData]),
          ],
        }
      })
    }
  }, [sessionFeeTypesData])

  const sendClickEvent = (eventName, dataObj = {}) => {
    return eventManager.send_event(eventName, {...dataObj})
  }

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [appliedFilter, setAppliedFilter] = useState({
    feeTypes: [],
  })

  const handleApplyFilterBtnClick = (obj) => {
    setAppliedFilter((prev) => {
      return {...prev, ...obj}
    })
  }

  const handleFilterModalCloseBtnClick = () => {
    setIsFilterModalOpen(false)
  }
  useEffect(() => {
    dispatch(globalActions.getAccountMappingListCA.request())
    dispatch(globalActions.getSessionFeeTypesCA.request())
    if (!companyAccountListData)
      dispatch(globalActions.getCompanyAccountListCA.request())
    if (Array.isArray(feeTypes) ? feeTypes.length === 0 : !feeTypes)
      dispatch(fetchFeeTypesRequestedAction())
  }, [])

  useEffect(() => {
    if (feeTypes && feeTypes.length > 0) {
      setFeeTypesSelectionModalProps((prev) => {
        return {...prev, data: feeTypes}
      })
    }
  }, [feeTypes])

  useEffect(() => {
    if (!initData) return
    let data = []
    if (selectedBasis === ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE) {
      data = getGroupedDataInitData({
        groups,
        type: `feeType:groupedByFeeType`,
        data: initData,
      }).map((item) => {
        return {...getFeeTypeGroupedObj(item)}
      })
    } else {
      // prepering classroom level data
      data = getGroupedDataInitData({
        groups,
        type: COL_TYPE.CLASS,
        data: initData,
      }).map((classroom) => {
        return {...getClassGroupedObj(classroom)}
      })

      data = data.reduce((acc, curr) => {
        if (curr?.addSection) {
          let sections = curr?.section.map((section, secIdx) => {
            return {
              rowUuid: uuid(),
              class: {id: section?.class?.id, name: section?.class?.name},
              id: section?.id,
              classId: section?.class?.id || '',
              sectionId: section?.sectionId,
              name: section?.name,
              addSectionFeeType: section?.addSectionFeeType,
              feeTypes: section?.feeTypes,
              account_id: section?.account_id,
              colType: COL_TYPE.SECTION,
              isLastChild: curr?.section?.length === secIdx + 1,
            }
          })
          return acc.concat(curr, sections)
        } else if (curr?.addClassFeeType) {
          let feetypes = getGroupedDataInitData({
            groups,
            type: `feeType:groupedByClass:${curr?.id}`,
            data: curr?.feeTypes,
          })
          feetypes = feetypes.map((feeType, feeTdx) => {
            return {
              ...getClassFeeTypeGroupedObj(feeType, curr),
              isLastChild: feetypes?.length === feeTdx + 1,
            }
          })
          return acc.concat(curr, feetypes)
        } else {
          return acc.concat(curr)
        }
      }, [])

      data = data.reduce((acc, curr) => {
        if (curr?.addSectionFeeType) {
          let feetypes = getGroupedDataInitData({
            groups,
            type: `feeType:groupedBySection:${curr?.id}`,
            data: curr?.feeTypes,
          })

          feetypes = feetypes.map((feeType, feeTdx) => {
            return {
              ...getSectionFeeTypeObj(feeType, curr),
              isLastChild: feetypes?.length === feeTdx + 1,
            }
          })
          return acc.concat(curr, feetypes)
        } else {
          return acc.concat(curr)
        }
      }, [])
    }

    setMyData(data)
  }, [initData, groups, isEditOrCreateNew])

  const handleBasisSelection = ({selected}) => {
    setSelectedBasis(selected)
  }

  const handleProceedBtnClick = () => {
    let data = []

    if (selectedBasis === ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.CLASS) {
      data = getClassroomWithSectionObjData({
        classroomWithSection,
        feeTypes,
      })
      setInitData(data)
      setIsEditOrCreateNew(IS_EDIT_OR_CREATE_NEW.CREATE_NEW)
      sendClickEvent(events.FEE_ACCOUNT_MAPPING_INITIATED_TFI, {
        option: selectedBasis,
      })
    } else {
      setFeeTypesSelectionModalProps((prev) => {
        return {...prev, isOpen: true}
      })
    }
  }

  const handleResetMapping = (obj) => {
    if (obj === 'RESET_MAPPING') {
      setIsResetAccountMappingPopupOpen(true)
    }
  }

  const confirmResetAccountMapping = () => {
    function successAction() {
      setIsResetAccountMappingPopupOpen(false)
      dispatch(globalActions.getAccountMappingListCA.request())
      setMyData([])
      setInitData([])
      setGroupes({...DEFAULT_GROUPS_VALUE})
      setFeeTypesSelectionModalProps((prev) => {
        return {...prev, selectedFeeTypes: []}
      })
      sendClickEvent(events.FEE_ACCOUNT_MAPPING_RESET_TFI, {
        option: selectedBasis,
      })
    }
    function failureAction() {}

    if (data && data?.mapping_rules?.length > 0) {
      dispatch(
        globalActions.resetAccountMappingCA.request(
          {delete: true},
          successAction,
          failureAction
        )
      )
    } else {
      successAction()
    }
  }

  const handleSelectFeeTypesModalClose = () => {
    setFeeTypesSelectionModalProps((prev) => {
      return {...prev, isOpen: false}
    })
  }

  const handleConfirmFeeTypeSelection = (selectedItems) => {
    let data = []

    if (selectedBasis === ACCOUNT_MAPPING_BASIS_OPTIONS_VALUES.FEE_TYPE) {
      data = getFeeTypesDataObj({
        feeTypes,
        savedData: initData,
        selectedFeeTypesIds: [...selectedItems]?.flat?.() || [],
      })
      sendClickEvent(events.FEE_ACCOUNT_MAPPING_INITIATED_TFI, {
        option: selectedBasis,
      })
    } else {
      data = getClassroomWithSectionObjData({
        classroomWithSection,
        feeTypes,
        savedData: initData || [],
        selectedFeeTypesIds: selectedItems,
      })
      sendClickEvent(events.FEE_ACCOUNT_MAPPING_INITIATED_TFI, {
        option: selectedBasis,
      })
    }
    if (initData) {
      setIsEditOrCreateNew(IS_EDIT_OR_CREATE_NEW.EDIT)
    } else {
      setIsEditOrCreateNew(IS_EDIT_OR_CREATE_NEW.CREATE_NEW)
    }
    setFeeTypesSelectionModalProps((prev) => {
      return {...prev, isOpen: false, selectedFeeTypes: selectedItems}
    })
    setInitData(data)
  }

  const handleFeeTypeSelectionEdit = () => {
    setFeeTypesSelectionModalProps((prev) => {
      return {...prev, isOpen: true}
    })
  }

  return (
    <>
      {isResetAccountMappingPopupOpen && (
        <ResetAccountMappingPopup
          setIsResetAccountMappingPopupOpen={setIsResetAccountMappingPopupOpen}
          confirmResetAccountMapping={confirmResetAccountMapping}
          isOpen={isResetAccountMappingPopupOpen}
        />
      )}

      {feeTypesSelectionModalProps?.isOpen && (
        <FeeTypesSelectionModal
          {...feeTypesSelectionModalProps}
          onClose={handleSelectFeeTypesModalClose}
          handleConfirmFeeTypeSelection={handleConfirmFeeTypeSelection}
          sessionFeeTypesData={sessionFeeTypesData}
        />
      )}

      {isLoading && <div className="loading"></div>}

      {!isLoading &&
        (!data || (data && data?.mapping_rules?.length === 0)) &&
        myData.length === 0 && (
          <div className={styles.basisSection}>
            <BasisSelection
              selectedOption={selectedBasis}
              handleChange={handleBasisSelection}
              handleProceedBtnClick={handleProceedBtnClick}
            />
          </div>
        )}
      <MainSection
        mappingData={data?.mapping_rules}
        myData={myData}
        groups={groups}
        initData={initData}
        accountsList={accountsList}
        companyAccountData={companyAccountData}
        sessionFeeTypesData={sessionFeeTypesData}
        setIsFilterModalOpen={setIsFilterModalOpen}
        setBackupDataForEdit={setBackupDataForEdit}
        setIsEditOrCreateNew={setIsEditOrCreateNew}
        handleResetMapping={handleResetMapping}
        setGroupes={setGroupes}
        setGroupedByModalProps={setGroupedByModalProps}
        classroomWithSection={classroomWithSection}
        handleFeeTypeSelectionEdit={handleFeeTypeSelectionEdit}
        handleFilterModalCloseBtnClick={handleFilterModalCloseBtnClick}
        handleApplyFilterBtnClick={handleApplyFilterBtnClick}
        setInitData={setInitData}
        setFeeTypesSelectionModalProps={setFeeTypesSelectionModalProps}
        groupedByModalProps={groupedByModalProps}
        feeTypesSelectionModalProps={feeTypesSelectionModalProps}
        appliedFilter={appliedFilter}
        setAppliedFilter={setAppliedFilter}
        backupDataForEdit={backupDataForEdit}
        instituteHierarchy={instituteHierarchy}
        selectedBasis={selectedBasis}
        isFilterModalOpen={isFilterModalOpen}
        isEditOrCreateNew={isEditOrCreateNew}
        sendClickEvent={sendClickEvent}
      />
    </>
  )
}

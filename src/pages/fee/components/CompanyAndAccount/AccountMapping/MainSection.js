import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import globalActions from '../../../../../redux/actions/global.actions'
import {events} from '../../../../../utils/EventsConstants'
import {
  ADD_REMOVE,
  COL_TYPE,
  DEFAULT_GROUPS_VALUE,
  GROUPS_KEYS,
  TRANSLATIONS_CA,
} from '../companyAccConstants'
import {getInitDataOnAccountChange} from '../helpers'
import AccountMappingTable from './AccountMappingTable/AccountMappingTable'
import FilterAccountMapping from './FilterAccountMapping/FilterAccountMapping'
import FilterBtnSection from './FilterBtnSection/FilterBtnSection'
import SaveDataConfirmPopup from './SaveDataConfirmPopup/SaveDataConfirmPopup'
import StickyFooterAccMapping from './StickyFooterAccMapping/StickyFooterAccMapping'

export default function MainSection({
  myData = [],
  groups = [],
  initData = [],
  accountsList = [],
  companyAccountData = [],
  classroomWithSection = [],
  sessionFeeTypesData = [],
  setIsFilterModalOpen = () => {},
  setBackupDataForEdit = () => {},
  setIsEditOrCreateNew = () => {},
  handleResetMapping = () => {},
  setGroupes = () => {},
  setGroupedByModalProps = () => {},
  //   handleGroupeByBtnClicked = () => {},
  handleFeeTypeSelectionEdit = () => {},
  handleFilterModalCloseBtnClick = () => {},
  handleApplyFilterBtnClick = () => {},
  setInitData = () => {},
  setFeeTypesSelectionModalProps = () => {},
  sendClickEvent = () => {},
  setAppliedFilter = () => {},
  groupedByModalProps = {},
  feeTypesSelectionModalProps = {},
  appliedFilter = {},
  backupDataForEdit = {},
  instituteHierarchy = {},
  selectedBasis = '',
  isFilterModalOpen = false,
  isEditOrCreateNew,
  mappingData,
}) {
  const dispatch = useDispatch()

  const [
    isDataSaveConfirmationPopupProps,
    setIsDataSaveConfirmationPopupProps,
  ] = useState({isOpen: false, buttonLoader: false})

  const handleAddRemoveClassSectionFeeType = ({rowData = [], addRemove}) => {
    let objIndex = ''
    let newInitData = [...initData]
    let ids = rowData?.id.split(',')
    if (
      addRemove === ADD_REMOVE.CLASS_SECTION ||
      addRemove === ADD_REMOVE.CLASS_FEE_TYPE
    ) {
      ids.map((id) => {
        objIndex = newInitData.findIndex((data) => data?.id === id)
        if (objIndex !== -1) {
          if (addRemove === ADD_REMOVE.CLASS_SECTION) {
            newInitData[objIndex].addSection = !newInitData[objIndex].addSection
            newInitData[objIndex].addClassFeeType = newInitData[objIndex]
              .addClassFeeType
              ? false
              : newInitData[objIndex].addClassFeeType
            newInitData[objIndex].section = [
              ...newInitData[objIndex].section,
            ].map((item) => {
              return {...item, addSectionFeeType: false}
            })
          } else if (addRemove === ADD_REMOVE.CLASS_FEE_TYPE) {
            newInitData[objIndex].addClassFeeType =
              !newInitData[objIndex].addClassFeeType
          }
        }
      })
    } else if (addRemove === ADD_REMOVE.SECTION_FEE_TYPE) {
      objIndex = newInitData.findIndex((obj) => obj.id == rowData?.class?.id)
      if (objIndex === -1) return
      newInitData[objIndex].section = [...newInitData[objIndex].section].map(
        (item) => {
          return item?.id === rowData?.sectionId
            ? {...item, addSectionFeeType: !item.addSectionFeeType}
            : item
        }
      )
    }

    setInitData(newInitData)
  }

  const handleGroupeByBtnClicked = (groupBy, rowData) => {
    let modalProps = {}
    let metaDataInfo = {}
    let groupBySubType = groupBy.split(':')
    if (groupBySubType.length === 0) return
    if (groupBySubType[0] === GROUPS_KEYS.FEE_TYPE) {
      let groupData = ''
      if (
        groupBySubType[1] &&
        groupBySubType[1] === GROUPS_KEYS.GROUPED_BY_CLASS
      ) {
        let flatDta = rowData?.classroom.flat()
        let joinId = flatDta.map((item) => item.id).join(',')
        let joinName = flatDta.map((item) => item.name).join(',')
        metaDataInfo.class = {id: joinId, name: joinName}
        groupData = groups?.feeType?.groupedByClass[joinId] || []
      } else if (
        groupBySubType[1] &&
        groupBySubType[1] === GROUPS_KEYS.GROUPED_BY_SECTION
      ) {
        groupData = groups?.feeType?.groupedBySection[rowData.sectionId] || []
        metaDataInfo.class = rowData?.class
        metaDataInfo.section = {id: rowData?.sectionId, name: rowData?.name}
      } else {
        groupData = groups?.feeType?.groupedByFeeType || []
      }
      modalProps = {
        selectedFeeTypes: feeTypesSelectionModalProps?.selectedFeeTypes,
        groupBy,
        data: feeTypesSelectionModalProps?.data.filter((item) =>
          feeTypesSelectionModalProps.selectedFeeTypes.length > 0
            ? feeTypesSelectionModalProps.selectedFeeTypes.includes(item._id)
            : true
        ),
        modalHeader: TRANSLATIONS_CA.groupFeeTypes,
        allReadyGroupedValue: groupData || [],
        metaDataInfo,
      }
    } else {
      modalProps = {
        allReadyGroupedValue: groups.class,
        groupBy: GROUPS_KEYS.CLASS,
        data: classroomWithSection,
        modalHeader: TRANSLATIONS_CA.groupClasses,
      }
    }
    setGroupedByModalProps((prev) => {
      return {
        ...prev,
        isOpen: true,
        ...modalProps,
      }
    })
    sendClickEvent(events.FEE_ACCOUNT_MAPPING_CLASSES_GROUP_INITIATED_TFI)
  }

  const handleOnChangeAccount = (obj, rowData) => {
    let newInitData = getInitDataOnAccountChange({
      obj,
      rowData,
      initData,
    })
    setInitData(newInitData)
  }
  const handleCancelEditCreateNew = () => {
    let dataForInit = []
    if (backupDataForEdit?.backupInitData) {
      dataForInit = JSON.parse(backupDataForEdit?.backupInitData) || null
    } else {
      setFeeTypesSelectionModalProps((prev) => {
        return {
          ...prev,
          selectedFeeTypes: [...new Set([sessionFeeTypesData])],
        }
      })
    }
    setInitData(dataForInit)
    setBackupDataForEdit(null)
    setIsEditOrCreateNew(null)
    setAppliedFilter({
      feeTypes: [],
    })
    setGroupes(
      backupDataForEdit?.backupGroups
        ? JSON.parse(backupDataForEdit?.backupGroups)
        : groups
    )
  }

  const handleSaveBtnClick = () => {
    setIsDataSaveConfirmationPopupProps({isOpen: true})
  }
  const handleCancelSaveDataBtnClick = () => {
    setIsDataSaveConfirmationPopupProps({isOpen: false, buttonLoader: false})
  }

  const handleConfirmSaveBtnClick = () => {
    if (!initData) return
    let prepareData = []
    setIsDataSaveConfirmationPopupProps((prev) => {
      return {...prev, buttonLoader: true}
    })

    myData.forEach((item) => {
      if (item?.colType === COL_TYPE.CLASS && !item?.addSection) {
        item.classroom.forEach((each) => {
          prepareData.push({
            type: selectedBasis,
            account_id: item?.account_id,
            class_id: each?.id,
            section_id: '',
            master_category_id: '',
          })
        })
      } else if (item?.colType === COL_TYPE.SECTION) {
        prepareData.push({
          type: selectedBasis,
          account_id: item?.account_id,
          class_id: item?.classId,
          section_id: item?.sectionId,
          master_category_id: '',
        })
      } else if (item?.colType === COL_TYPE.FEE_TYPE) {
        item.feeType.forEach((each) => {
          prepareData.push({
            type: selectedBasis,
            account_id: item?.account_id || '',
            class_id: each?.classId || '',
            section_id: each?.sectionId || '',
            master_category_id: each?.feeTypeId || '',
          })
        })
      }
    })

    let sendData = {
      mapping_type: selectedBasis,
      mapping_rules: prepareData,
    }

    function successAction() {
      setIsEditOrCreateNew(null)
      setBackupDataForEdit(null)
      sendClickEvent(events.FEE_ACCOUNT_MAPPING_SAVED_TFI, {
        option: selectedBasis,
      })
      setAppliedFilter({
        feeTypes: [],
      })
      setIsDataSaveConfirmationPopupProps({isOpen: false, buttonLoader: false})
      setGroupes({...DEFAULT_GROUPS_VALUE})
      dispatch(globalActions.getAccountMappingListCA.request())
    }
    function failureAction() {}
    dispatch(
      globalActions.updateAccountMappingCA.request(
        sendData,
        successAction,
        failureAction
      )
    )
  }
  return (
    <>
      {isFilterModalOpen && (
        <FilterAccountMapping
          isOpen={isFilterModalOpen}
          onClose={handleFilterModalCloseBtnClick}
          selectedBasis={selectedBasis}
          instituteHierarchy={instituteHierarchy}
          handleApplyFilterBtnClick={handleApplyFilterBtnClick}
          appliedFilter={appliedFilter}
          feeTypeOptions={feeTypesSelectionModalProps.data.filter((feeType) =>
            feeTypesSelectionModalProps.selectedFeeTypes.includes(feeType?._id)
          )}
          companyAccountData={companyAccountData}
        />
      )}

      {isDataSaveConfirmationPopupProps.isOpen && (
        <SaveDataConfirmPopup
          isOpen={isDataSaveConfirmationPopupProps.isOpen}
          onClose={handleCancelSaveDataBtnClick}
          onConfirm={handleConfirmSaveBtnClick}
          buttonLoader={isDataSaveConfirmationPopupProps.buttonLoader}
        />
      )}

      {myData.length > 0 && (
        <div>
          <FilterBtnSection
            setIsFilterModalOpen={setIsFilterModalOpen}
            setBackupDataForEdit={setBackupDataForEdit}
            setIsEditOrCreateNew={setIsEditOrCreateNew}
            handleResetMapping={handleResetMapping}
            isEditOrCreateNew={isEditOrCreateNew}
            initData={initData}
            groups={groups}
            setGroupes={setGroupes}
            setGroupedByModalProps={setGroupedByModalProps}
            groupedByModalProps={groupedByModalProps}
            mappingData={mappingData}
          />
          <AccountMappingTable
            myData={myData}
            selectedBasis={selectedBasis}
            handleGroupeByBtnClicked={handleGroupeByBtnClicked}
            handleFeeTypeSelectionEdit={handleFeeTypeSelectionEdit}
            handleAddRemoveClassSectionFeeType={
              handleAddRemoveClassSectionFeeType
            }
            handleOnChangeAccount={handleOnChangeAccount}
            accountsList={accountsList}
            appliedFilter={appliedFilter}
            isEditOrCreateNew={isEditOrCreateNew}
          />
          {isEditOrCreateNew && (
            <StickyFooterAccMapping
              handleCancelEditCreateNew={handleCancelEditCreateNew}
              handleSaveBtnClick={handleSaveBtnClick}
            />
          )}
        </div>
      )}
    </>
  )
}

import {COL_TYPE, COMPANY_ACC_TAB_OPTIONS_IDS} from './companyAccConstants'
import {v4 as uuid} from 'uuid'
import React from 'react'
import {Icon, ICON_CONSTANTS} from '@teachmint/krayon'

export const getActiveTab = ({currUrl, ROUTES}) => {
  switch (currUrl) {
    case ROUTES.DEFAULT:
      return COMPANY_ACC_TAB_OPTIONS_IDS.COMPANY_AND_ACCOUNT

    default:
      return COMPANY_ACC_TAB_OPTIONS_IDS.COMPANY_AND_ACCOUNT
  }
}

export const getSectionFeeTypeObj = (feeType, section) => {
  let flatDta = feeType.flat()
  let joinId = flatDta.map((item) => item.id).join(',')
  let joinName = flatDta.map((item) => item.name).join(',')

  return {
    rowUuid: uuid(),
    class: section?.class,
    section: {id: section?.id, name: section?.name},
    id: joinId,
    name: joinName,
    account_id: feeType[0]?.account_id,
    colType: COL_TYPE.FEE_TYPE,
    feeType,
  }
}

export const getClassGroupedObj = (classroom) => {
  let flatDta = classroom.flat()
  let joinId = flatDta.map((item) => item.id).join(',')
  let joinName = flatDta.map((item) => item.name).join(', ')
  let joinSection = flatDta.reduce((acc, curr) => {
    return acc.concat(curr.section)
  }, [])
  return {
    rowUuid: uuid(),
    id: joinId,
    classId: joinId,
    name: joinName,
    isGrouped: classroom.length > 1,
    addSection: classroom[0]?.addSection,
    addClassFeeType: classroom[0]?.addClassFeeType,
    section: joinSection,
    account_id: classroom[0]?.account_id,
    colType: COL_TYPE.CLASS,
    classroom,
    feeTypes: classroom[0]?.feeTypes,
  }
}

export const getClassFeeTypeGroupedObj = (feeType, classroom) => {
  let flatDta = feeType.flat()
  let joinId = flatDta.map((item) => item.id).join(',')
  let joinName = flatDta.map((item) => item.name).join(', ')

  return {
    rowUuid: uuid(),
    class: {id: classroom?.id, name: classroom?.name},
    classId: classroom?.id,
    id: joinId,
    feeTypeId: joinId,
    name: joinName,
    account_id: feeType[0]?.account_id,
    colType: COL_TYPE.FEE_TYPE,
    feeType,
  }
}

export const getFeeTypeGroupedObj = (feeType) => {
  let flatDta = feeType.flat()
  let joinId = flatDta.map((item) => item.id).join(',')
  let joinName = flatDta.map((item) => item.name).join(', ')
  return {
    rowUuid: uuid(),
    isGrouped: feeType.length > 1,
    id: joinId,
    feeTypeId: joinId,
    name: joinName,
    account_id: feeType[0]?.account_id,
    colType: COL_TYPE.FEE_TYPE,
    feeType,
  }
}

const findClassDataFromSavedData = (savedData, classroom) => {
  return savedData.filter((item) => {
    let classId = item?.class_id ? item?.class_id : item?.id
    return classId === classroom?.classId
  })
}

export const getClassroomWithSectionObjData = ({
  classroomWithSection = [],
  feeTypes = [],
  savedData = [],
  selectedFeeTypesIds = [],
}) => {
  let selectedFeeTypesAre = feeTypes
    .filter((item) => selectedFeeTypesIds.includes(item?._id))
    .map((feeType) => {
      return {
        account_id: '',
        id: feeType._id,
        feeTypeId: feeType._id,
        name: feeType?.name,
      }
    })
  return classroomWithSection.map((classroom) => {
    let findClassData = findClassDataFromSavedData(savedData, classroom)
    let isSectionData = findClassData?.filter((item) => item?.section_id)
    let isSectionDataAdded =
      isSectionData?.length > 0 || findClassData[0]?.addSection || false
    let isClassFeeTypeData = findClassData?.filter(
      (item) => !item?.section_id && item?.master_category_id
    )
    let isClassFeeTypeDataAdded =
      isClassFeeTypeData?.length > 0 ||
      findClassData[0]?.addClassFeeType ||
      false
    return {
      id: classroom.classId,
      classId: classroom.classId,
      name: classroom.className,
      addSection: isSectionDataAdded || false,
      addClassFeeType: isClassFeeTypeDataAdded || false,
      account_id:
        !isSectionDataAdded && !isClassFeeTypeDataAdded
          ? findClassData[0]?.account_id || ''
          : '',
      section: classroom.children.map((section) => {
        let findSectionData = isSectionData?.filter(
          (item) => item?.section_id === section.value
        )

        let isSectionFeeTypeData = findSectionData?.filter(
          (item) => item?.master_category_id
        )
        let isSectionFeeTypeAdded = isSectionFeeTypeData?.length > 0
        return {
          class: {id: classroom?.classId, name: classroom?.className},
          classId: classroom?.classId,
          sectionName: `${classroom?.className} - ${section.label}`,
          id: section.value,
          sectionId: section.value,
          name: section.label,
          addSectionFeeType: isSectionFeeTypeAdded || false,
          account_id: !isSectionFeeTypeAdded
            ? findSectionData[0]?.account_id || ''
            : '',
          feeTypes: selectedFeeTypesAre.map((feeType) => {
            let findSectionFeeTypeData = isSectionFeeTypeData?.filter?.(
              (item) =>
                item?.section_id === section.value &&
                item?.master_category_id === feeType.id
            )
            return {
              id: feeType.id,
              feeTypeId: feeType.id,
              classId: classroom?.classId,
              sectionId: section?.value,
              class: {id: classroom?.classId, name: classroom?.className},
              section: {id: section?.value, name: section?.label},
              name: feeType?.name,
              account_id: findSectionFeeTypeData[0]?.account_id || '',
            }
          }),
        }
      }),
      feeTypes: selectedFeeTypesAre.map((feeType) => {
        let feeTypeData = isClassFeeTypeData.find(
          (item) => item.master_category_id === feeType.id
        )
        return {
          id: feeType.id,
          feeTypeId: feeType.id,
          classId: classroom?.classId,
          class: {id: classroom?.classId, name: classroom?.className},
          name: feeType?.name,
          account_id: feeTypeData?.account_id || '',
        }
      }),
    }
  })
}

export const getFeeTypesDataObj = ({
  feeTypes = [],
  savedData = [],
  selectedFeeTypesIds = [],
}) => {
  return feeTypes
    .filter((item) => selectedFeeTypesIds.includes(item?._id))
    .map((feeType) => {
      let feeTypeData =
        savedData?.length > 0
          ? savedData.find((item) => {
              let feeTypeId = item?.master_category_id
                ? item?.master_category_id
                : item?.id
              return feeTypeId === feeType._id
            })
          : null
      return {
        account_id: feeTypeData ? feeTypeData?.account_id || '' : '',
        id: feeType._id,
        feeTypeId: feeType._id,
        name: feeType?.name,
      }
    })
}

export const getGroupedDataInitData = ({groups = {}, type = '', data = []}) => {
  let typeSubType = type.split(':')
  let groupIds = []

  let result = groups
  for (const part of typeSubType) {
    result = result[part] || []
  }

  groupIds = result
  const groupIdsFlat = groupIds.flat?.() || []

  let dataTobeGrouped = data.filter((item) => groupIdsFlat.includes(item.id))
  let leftOutData = data.filter((item) => !groupIdsFlat.includes(item.id))

  const groupedArr = []
  groupIds?.forEach?.((group) => {
    const groupElements = []
    group.forEach((id) => {
      const element = data.find((el) => el.id === id)
      if (element) {
        groupElements.push(element)
      } else {
        groupedArr.push(element)
      }
    })
    groupedArr.push(groupElements)
  })

  groupedArr.concat(leftOutData)

  let main = []
  const grouped =
    groupIds?.reduce?.((result, groupIds) => {
      const myGroup = dataTobeGrouped.filter((item) =>
        groupIds.some((id) => id === item.id)
      )
      return result.concat([myGroup])
    }, []) || []

  return main.concat(grouped).concat(leftOutData.map((item) => [item]))
}

export const getInitDataOnAccountChange = ({
  obj = {},
  rowData = {},
  initData = [],
}) => {
  let objIndex = ''
  let newInitData = [...initData]
  // for class and fee type
  let ids = rowData?.id.split(',')
  if (rowData?.colType === COL_TYPE.CLASS) {
    ids.map((id) => {
      objIndex = newInitData.findIndex((data) => data?.id === id)
      objIndex !== -1 ? (newInitData[objIndex].account_id = obj?.value) : ''
    })
  }

  // for class's section
  if (rowData?.sectionId) {
    let findClassIndex = newInitData.findIndex(
      (data) => data?.id === rowData?.class?.id
    )
    if (findClassIndex === -1) return
    let newSection = [...newInitData[findClassIndex].section]
    newInitData[findClassIndex].section = newSection.map((item) => {
      return item?.id === rowData?.sectionId
        ? {...item, account_id: obj?.value}
        : item
    })
  }

  if (rowData?.colType === COL_TYPE.FEE_TYPE) {
    if (rowData?.section) {
      let findClassIndex = newInitData.findIndex(
        (data) => data?.id === rowData?.class?.id
      )
      if (findClassIndex === -1) return
      let classroom = newInitData[findClassIndex]
      let findSectionIndex = classroom.section.findIndex(
        (data) => data?.id === rowData?.section?.id
      )
      if (findSectionIndex === -1) return
      let section = classroom.section[findSectionIndex]
      ids.map((id) => {
        objIndex = section.feeTypes?.findIndex((data) => data?.id === id)
        objIndex !== -1
          ? (newInitData[findClassIndex].section[findSectionIndex].feeTypes[
              objIndex
            ].account_id = obj?.value)
          : ''
      })
    } else if (rowData?.classId && !rowData?.section) {
      let findClassIndex = newInitData.findIndex(
        (data) => data?.id === rowData?.class?.id
      )
      if (findClassIndex === -1) return
      let classroom = newInitData[findClassIndex]
      ids.map((id) => {
        objIndex = classroom.feeTypes?.findIndex((data) => data?.id === id)
        objIndex !== -1
          ? (newInitData[findClassIndex].feeTypes[objIndex].account_id =
              obj?.value)
          : ''
      })
    } else {
      ids.map((id) => {
        objIndex = newInitData.findIndex((data) => data?.id === id)
        objIndex !== -1 ? (newInitData[objIndex].account_id = obj?.value) : ''
      })
    }
  }

  return newInitData
}

export const getAccountsList = (
  companies = [],
  extraData = {withDisabled: false}
) => {
  const {withDisabled} = extraData
  return companies
    .filter((company) =>
      company?.accounts?.length !== 0 && withDisabled ? true : !company.disabled
    )
    .reduce?.((acc, curr) => {
      let accounts = curr.accounts
        .filter((acc) => (withDisabled ? true : !acc.disableds))
        .map((item) => {
          return {...item, name: item?.account_name, compName: curr.name}
        })
      return acc.concat(accounts)
    }, [])
}

export default function PrefixIcon({styles}) {
  return (
    <div className={styles.rotatePrefixIcon}>
      <Icon
        name={'callSplit'}
        size={ICON_CONSTANTS.SIZES.XX_SMALL}
        type={ICON_CONSTANTS.TYPES.PRIMARY}
      />
    </div>
  )
}

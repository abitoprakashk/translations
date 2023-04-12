import {t} from 'i18next'
import produce from 'immer'
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {useSelector} from 'react-redux'

function useInstituteHeirarchy({
  allSelected = false,
  setData = null,
  selectedItem,
}) {
  const [heirarchy, setHeirarchy] = useState(null)
  const allSlectedSectionsDetails = useRef([])
  const TYPE = useMemo(() => ['STANDARD', 'SECTION', 'DEPARTMENT'], [])

  const instituteHierarchy = useSelector((state) => state.instituteHierarchy)

  const filterSectionLessClass = (data) => {
    data.map((department) => {
      department.standard = department.standard.filter(
        (standard) => standard.section.length
      )
    })
  }

  const getClassList = (allSelected) => {
    const allClassData = []

    const traverse = (data, setData, parent) => {
      if (TYPE.includes(data.type)) {
        if (data.type === 'DEPARTMENT') {
          setData.name = data.name
          setData._id = data.id
          setData.standard = []
          setData.isSelected = allSelected || selectedItem === data.id
          setData.isOpen = allSelected || selectedItem === data.id
        } else if (data.type === 'STANDARD') {
          setData.push({
            _id: data.id,
            name: data.name,
            section: [],
            department: parent?.name,
            departmentId: parent?._id,
            isSelected: allSelected || selectedItem === data.id,
            isOpen: allSelected || selectedItem === data.id,
          })
        } else if (data.type === 'SECTION') {
          setData.section.push({
            _id: data.id,
            name: data.name,
            department: setData.department,
            standard: setData.name,
            standardId: setData._id,
            departmentId: setData.departmentId,
            isSelected: allSelected || selectedItem === data.id,
            isOpen: allSelected || selectedItem === data.id,
          })
        }
      }
      data?.children?.map((child) => {
        if (child.type === 'DEPARTMENT') {
          // allClassData[child.id] = {}
          allClassData.push({})
          traverse(child, allClassData[allClassData.length - 1 || 0])
        } else if (child.type === 'STANDARD') {
          traverse(child, setData.standard, setData)
        } else if (child.type === 'SECTION') {
          traverse(child, setData[setData.length - 1 || 0])
        } else {
          traverse(child, setData)
        }
      })
    }

    traverse(instituteHierarchy, allClassData)
    filterSectionLessClass(allClassData)
    return allClassData
  }

  const setDepartment = (allSelected) => {
    const categorisedClasses = getClassList(allSelected)
    // const uncategorizedClasses = []
    // common.uncategorisedClassesData?.map((uncategorisedClass) => {
    //   uncategorizedClasses.push({
    //     _id: uncategorisedClass._id,
    //     name: uncategorisedClass.name,
    //     type: 'UNCATEGORIZED',
    //   })
    // })
    return [
      ...categorisedClasses,
      // ...(uncategorizedClasses.length
      //   ? [{name: 'Uncategorised', children: uncategorizedClasses}]
      //   : []),
    ]
  }

  useLayoutEffect(() => {
    if (instituteHierarchy) {
      const department = setDepartment(allSelected)
      setHeirarchy({
        _id: 'ALL',
        isOpen: true,
        isSelected: allSelected,
        name: t('selectAll'),
        department,
      })
    }
  }, [
    instituteHierarchy,
    selectedItem,
    // common.uncategorisedClassesData
  ])

  useLayoutEffect(() => {
    if (setData) {
      setHeirarchy(setData)
    }
  }, [setData])

  const toggleAllCheckbox = (arr = [], val) => {
    return arr.map((item) => {
      return {
        ...item,
        isSelected: val,
      }
    })
  }

  const handleSelectionHelper = ({selectedItem, data, setData}) => {
    const newHeirarchy = produce(data, (draft) => {
      // selected Item is array
      let selectedItemIds
      if (selectedItem.constructor.name == 'Array') {
        selectedItemIds = selectedItem.map((item) => item._id)
      } else {
        selectedItemIds = selectedItem._id
      }
      if (selectedItem._id === 'ALL') {
        const department = setDepartment(!selectedItem.isSelected)
        draft = {
          _id: 'ALL',
          isOpen: true,
          isSelected: !selectedItem.isSelected,
          name: t('selectAll'),
          department,
        }
        return draft
      }
      let allSelectedDepartmentCount = 0
      draft.department.map((department) => {
        let found = false
        // toggle department
        if (selectedItemIds.includes(department._id)) {
          department.standard = toggleAllCheckbox(
            department.standard,
            !department.isSelected
          )
          department.standard.map((standard) => {
            standard.section = toggleAllCheckbox(
              standard.section || [],
              !department.isSelected
            )
          })
          department.isSelected = !department.isSelected
          if (!department.isSelected) {
            draft.isSelected = false
          }
          department.isOpen = true
          found = true
        }
        // toggle standard
        let allSelectedCount = 0
        department?.standard?.map((standard) => {
          if (
            selectedItemIds.includes(standard._id) &&
            standard.section?.length
          ) {
            standard.section = toggleAllCheckbox(
              standard.section,
              !standard.isSelected
            )
            standard.isSelected = !standard.isSelected
            standard.isOpen = true
            found = true
            // if standard is unselected and department is selected.
            // unselect department
            if (!standard.isSelected) {
              department.isSelected = false
            }
          }
          if (standard.isSelected) {
            allSelectedCount = ++allSelectedCount
          } else {
            draft.isSelected = false
          }
        })

        if (department?.standard?.length === allSelectedCount) {
          department.isSelected = true
          department.isOpen = true
        }
        let allSelectedStandardCount = 0
        // toggle section
        department?.standard?.map((standard) => {
          let allSelectedSectionCount = 0

          standard.section.map((section) => {
            if (selectedItemIds.includes(section._id)) {
              section.isSelected = !section.isSelected
              found = true
              // if section is unselected and standard is selected.
              // unselect standard
              if (!section.isSelected) {
                standard.isSelected = false
              }
              // if standard is unselected and department is selected.
              // unselect department
              if (!standard.isSelected) {
                department.isSelected = false
                department.isOpen = true
              }
            }
            if (section.isSelected) {
              allSelectedSectionCount = ++allSelectedSectionCount
            } else {
              draft.isSelected = false
            }
          })
          if (standard.section.length === allSelectedSectionCount) {
            standard.isSelected = true
            standard.isOpen = true
          }
          if (standard.isSelected) {
            allSelectedStandardCount += 1
          }
        })
        if (department?.standard?.length === allSelectedStandardCount) {
          department.isSelected = true
          department.isOpen = true
        }
        if (department.isSelected) {
          allSelectedDepartmentCount += 1
        }
        return found
      })
      if (allSelectedDepartmentCount === draft.department.length) {
        draft.isSelected = true
      }
      return draft
    })
    setData(newHeirarchy)
  }

  const handleSelection = useCallback(
    (selectedItem) => {
      handleSelectionHelper({
        selectedItem,
        data: heirarchy,
        setData: setHeirarchy,
      })
    },
    [heirarchy]
  )

  const allselectedSections = useMemo(() => {
    const allSections = []
    allSlectedSectionsDetails.current = []
    heirarchy?.department?.forEach((department) => {
      department.standard?.forEach((standard) => {
        standard.section?.forEach((section) => {
          if (section.isSelected) {
            allSections.push(section._id)
            allSlectedSectionsDetails.current.push(section)
          }
        })
      })
    })
    return allSections
  }, [heirarchy])

  const sectionWithName = useMemo(() => {
    let allSections = null
    heirarchy?.department?.forEach((department) => {
      department.standard?.forEach((standard) => {
        standard.section?.forEach((section) => {
          if (section.isSelected) {
            if (!allSections) {
              allSections = {}
            }
            const className = section.standard?.replace(/^class/i, '')
            allSections[section._id] = (
              (className ? className + '-' : '') + section.name
            )?.trim()
          }
        })
      })
    })
    return allSections
  }, [heirarchy])

  return {
    heirarchy,
    setHeirarchy,
    handleSelection,
    allselectedSections,
    sectionWithName,
    allSlectedSectionsDetails,
    handleSelectionHelper,
  }
}

export default useInstituteHeirarchy

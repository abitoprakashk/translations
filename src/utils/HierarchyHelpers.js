import * as SHC from './SchoolSetupConstants'
import {events} from './EventsConstants'
import {
  SECTION_COUNT_LIMIT,
  INSTITUTE_TYPES,
} from '../constants/institute.constants'
import {t} from 'i18next'

export const hierarchyInitialization = (
  hierarchyOld,
  hierarchyNew,
  instituteType
) => {
  if (isHierarchyAvailable(hierarchyNew)) {
    let hierarchyTemp = JSON.parse(JSON.stringify(hierarchyNew))
    hierarchyTemp.children = [
      {
        children: [],
        id: SHC.NODE_SCHOOL_SYSTEM_OVERVIEW,
        name:
          instituteType === INSTITUTE_TYPES.SCHOOL
            ? t('schoolOverview')
            : 'Institute Overview',
        type: SHC.NODE_SCHOOL_SYSTEM_OVERVIEW,
        icon: 'https://storage.googleapis.com/tm-assets/icons/primary/institute-v1-primary.svg',
        iconSelected:
          'https://storage.googleapis.com/tm-assets/icons/white/institite-v1-white.svg',
      },
      ...hierarchyTemp.children,
      {
        children: [],
        id: SHC.NODE_UNASSIGNED_CLASSES,
        name: t('customClassrooms'),
        type: SHC.NODE_UNASSIGNED_CLASSES,
        icon: 'https://storage.googleapis.com/tm-assets/icons/primary/folder-primary.svg',
        iconSelected:
          'https://storage.googleapis.com/tm-assets/icons/white/folder-white.svg',
        event: events.UNASSIGNED_CLASSES_CLICKED_TFI,
      },
    ]
    let hierarchyOldObj = hierarchyToObject(hierarchyOld)
    addInitialNodes(hierarchyTemp, hierarchyOldObj, instituteType)
    return hierarchyTemp
  }
  return hierarchyNew
}

export const addInitialNodes = (hierarchy, hierarchyOldObj, instituteType) => {
  if (hierarchy) {
    let frontendOptions = {
      isOpen:
        hierarchy.type === SHC.NODE_SESSION ||
        hierarchy.type === SHC.NODE_SCHOOL_SYSTEM_OVERVIEW,
      isLeafNode:
        hierarchy.type === SHC.NODE_SECTION ||
        hierarchy.type === SHC.NODE_SCHOOL_SYSTEM_OVERVIEW ||
        hierarchy.type === SHC.NODE_SCHOOL_ARCHIVE ||
        hierarchy.type === SHC.NODE_UNASSIGNED_CLASSES,
      isVisible:
        hierarchy.type !== SHC.NODE_SESSION &&
        hierarchy.type !== SHC.NODE_SUBJECT,
      collapseHeader: false,
    }
    hierarchy.frontendOptions = hierarchyOldObj[hierarchy.id]
      ? hierarchyOldObj[hierarchy.id]
      : frontendOptions

    // add ADD_SCETION child on class(CLA) level
    if (
      hierarchy.type === SHC.NODE_CLASS &&
      Array.isArray(hierarchy.children) &&
      hierarchy.children.length < SECTION_COUNT_LIMIT
    ) {
      hierarchy.children = [
        ...hierarchy.children,
        {
          children: [],
          id: hierarchy.id,
          name:
            instituteType === INSTITUTE_TYPES.SCHOOL
              ? '+ Add new section'
              : '+ Add new batch',
          type: SHC.NODE_ADD_SEC,
          eventName: events.ADD_NEW_SECTION_CLICKED_TFI,
          eventOptions: {screen_name: 'middle_bar'},
        },
      ]
    }

    // Call with childrens
    hierarchy.children &&
      hierarchy.children.map((item) =>
        addInitialNodes(item, hierarchyOldObj, instituteType)
      )
  }
}

export const handleHierarchyOpenClose = (hierarchy, id) => {
  let hierarchyTemp = JSON.parse(JSON.stringify(hierarchy))

  const visitNode = (hierarchy, id) => {
    if (hierarchy && hierarchy.id) {
      let finalFlag = false

      // Base Condidtion
      if (hierarchy.id === id) {
        if (hierarchy?.frontendOptions?.isLeafNode)
          hierarchy.frontendOptions.isOpen = true
        else
          hierarchy.frontendOptions.isOpen = !hierarchy?.frontendOptions?.isOpen
        return true
      } else hierarchy.frontendOptions.isOpen = false

      // Traverse through child nodes
      hierarchy &&
        hierarchy.children &&
        hierarchy.children.map((item) => {
          let flag = visitNode(item, id)
          finalFlag = flag ? flag : finalFlag
        })

      hierarchy.frontendOptions.isOpen = finalFlag
      return finalFlag
    }
  }

  visitNode(hierarchyTemp, id)
  return hierarchyTemp
}

const hierarchyToObject = (hierarchy) => {
  let hierarchyObj = {}

  const visitNode = (hierarchy) => {
    if (hierarchy) {
      if (!hierarchyObj[hierarchy.id]) {
        hierarchyObj[hierarchy.id] = hierarchy.frontendOptions
      }

      // Call with childrens
      hierarchy.children && hierarchy.children.map((item) => visitNode(item))
    }
  }

  visitNode(hierarchy)
  return hierarchyObj
}

// Get selected(active) node data without childrens
export const getSelectedNodeDataWithoutChildrens = (hierarchy, node) => {
  let nodeData = {}

  const visitNode = (hierarchy) => {
    if ((hierarchy, node)) {
      if (!hierarchy) return

      if (hierarchy?.type === node && hierarchy?.frontendOptions?.isOpen) {
        nodeData = {...hierarchy, children: []}
        return
      }

      // Call with childrens
      hierarchy.children &&
        hierarchy.children.map((item) => visitNode(item, node))
    }
  }

  visitNode(hierarchy, node)
  return nodeData
}

// Get Node data and all childrens and parent
export const getNodeDataWithChildrensParent = (hierarchy, node) => {
  let nodeData = {}

  const visitNode = (hierarchy) => {
    if ((hierarchy, node)) {
      if (!hierarchy) return
      if (hierarchy?.id === node) {
        nodeData = {...hierarchy}
        return true
      }

      // Call with childrens
      hierarchy.children &&
        hierarchy.children.map((item) => {
          const gotTheChild = visitNode(item, node)
          if (gotTheChild)
            nodeData.parentDetails = {
              id: hierarchy?.id,
              name: hierarchy?.name,
              type: hierarchy?.type,
            }
        })
    }
  }

  visitNode(hierarchy, node)
  return nodeData
}

// Return all Nodes of same type as list
export const getNodesListOfSimilarType = (hierarchy, node) => {
  let nodeData = []

  const visitNode = (hierarchy) => {
    if ((hierarchy, node)) {
      if (!hierarchy) return

      if (hierarchy?.type === node) {
        nodeData.push({...hierarchy, children: []})
        return
      }

      // Call with childrens
      hierarchy.children &&
        hierarchy.children.map((item) => visitNode(item, node))
    }
  }

  visitNode(hierarchy, node)
  return nodeData
}

export const getNodesListOfSimilarTypeWithChildren = (hierarchy, node) => {
  let nodeData = []

  const visitNode = (hierarchy) => {
    if ((hierarchy, node)) {
      if (!hierarchy) return

      if (hierarchy?.type === node) {
        nodeData.push({...hierarchy})
        return
      }

      // Call with childrens
      hierarchy.children &&
        hierarchy.children.map((item) => visitNode(item, node))
    }
  }

  visitNode(hierarchy, node)
  return nodeData
}

export const isHierarchyAvailable = (hierarchy) =>
  hierarchy?.children?.length > 0

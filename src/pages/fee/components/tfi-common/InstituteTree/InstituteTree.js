import React, {useEffect, useState} from 'react'
import classNames from 'classnames'
import styles from './InstituteTree.module.css'
import {useSelector} from 'react-redux'
import InstituteNode from './InstituteNode'
import {INSTITUTE_HIERARCHY_TYPES} from '../../../fees.constants'

export default function InstituteTree({
  isVertical = true,
  hierarchyTypes,
  getSelectedNodes,
  allChecked = false,
  preSelectedNodes = {},
  expandChildNodesDefault,
  showToggleBtnOn = [
    INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
    INSTITUTE_HIERARCHY_TYPES.STANDARD,
    INSTITUTE_HIERARCHY_TYPES.SECTION,
    INSTITUTE_HIERARCHY_TYPES.SUBJECT,
  ],
  expandTill = INSTITUTE_HIERARCHY_TYPES.SECTION,
  showInactiveClasses = false,
}) {
  const {instituteHierarchy} = useSelector((state) => state)
  const departments = instituteHierarchy?.children
  const [tree, setTree] = useState({})

  const iterateOverChildNodes = (classTree, childrens, parentId, isChecked) => {
    return childrens
      ?.filter((child) => hierarchyTypes.includes(child.type))
      .map((child) => {
        if (hierarchyTypes.includes(child.type)) {
          classTree[[child.id]] = {
            id: child.id,
            name: child.name,
            type: child.type,
            status: child.status,
            parentId: parentId,
            isChecked: isChecked,
            hasChildren: child.children.length > 0,
          }

          if (child.children.length > 0) {
            iterateOverChildNodes(
              classTree,
              child.children,
              child.id,
              isChecked
            )
          }
        }
      })
  }

  const createTree = () => {
    let classTree = {
      allDept: {
        id: 'allDept',
        name: 'Select All',
        type: 'All',
        parentId: null,
        isChecked: allChecked,
        hasChildren: departments?.length > 0,
      },
    }
    iterateOverChildNodes(classTree, departments, 'allDept', allChecked)
    return classTree
  }

  useEffect(() => {
    let classTree = createTree()
    if (Object.keys(preSelectedNodes).length > 0) {
      Object.keys(classTree).map((node) => {
        if (preSelectedNodes[node]) {
          changeNodeState(classTree, node, preSelectedNodes[node], false)
        }
      })
    } else if (allChecked) {
      changeFormValues(classTree)
    }
    setTree(classTree)
  }, [])

  const changeNodeState = (classTree, name, state, isRecursive = true) => {
    classTree[name].isChecked = state
    if (!isRecursive) {
      changeChildrenNodes(classTree, classTree[name], state)
      changeSiblingsNodes(classTree, classTree[name])
    }
  }

  const getParent = (classTree, node) => {
    return node.parentId ? classTree[node.parentId] : null
  }

  const getChildrens = (classTree, node) => {
    return Object.values(classTree).filter((n) => n.parentId === node.id)
  }

  const getSiblings = (classTree, node) => {
    return Object.values(classTree).filter((n) => n.parentId === node.parentId)
  }

  const changeChildrenNodes = (classTree, node, state) => {
    if (node.hasChildren) {
      getChildrens(classTree, node).map((childNode) => {
        if (hierarchyTypes.includes(childNode.type)) {
          changeNodeState(classTree, childNode.id, state)
        }
        if (childNode.hasChildren) {
          changeChildrenNodes(classTree, childNode, state)
        }
      })
    }
  }

  const changeSiblingsNodes = (classTree, node) => {
    if (node.parentId) {
      changeNodeState(
        classTree,
        node.parentId,
        !getSiblings(classTree, node).some((sNode) => sNode.isChecked === false)
      )
      changeSiblingsNodes(classTree, getParent(classTree, node))
    }
  }

  const changeFormValues = (classTree) => {
    let selectedNodes = {}
    Object.keys(classTree)
      .filter((node) => classTree[node].isChecked)
      .map((node) => {
        selectedNodes[node] = classTree[node]
      })
    getSelectedNodes(selectedNodes)
  }

  const handleChange = (e) => {
    const {name, checked} = e.target
    const classTree = {...tree}
    changeNodeState(classTree, name, checked, false)
    changeFormValues(classTree)
    setTree(classTree)
  }

  let valuesForExpanding = []
  if (expandTill === INSTITUTE_HIERARCHY_TYPES.SECTION) {
    valuesForExpanding = [
      INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
      INSTITUTE_HIERARCHY_TYPES.STANDARD,
      INSTITUTE_HIERARCHY_TYPES.SECTION,
    ]
  } else if (expandTill === INSTITUTE_HIERARCHY_TYPES.STANDARD) {
    valuesForExpanding = [
      INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
      INSTITUTE_HIERARCHY_TYPES.STANDARD,
    ]
  } else if (expandTill === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT) {
    valuesForExpanding = [INSTITUTE_HIERARCHY_TYPES.DEPARTMENT]
  }

  if (!Object.keys(tree).length) {
    return <div className="loading"></div>
  }

  const renderNodes = (nodes) => {
    return nodes.map((node) => {
      if (hierarchyTypes.includes(node.type)) {
        return (
          <div key={node.id} className="flex-row px-3">
            <InstituteNode
              tree={tree}
              node={node}
              isVertical={isVertical}
              hierarchyTypes={hierarchyTypes}
              handleChange={handleChange}
              expandChildNodesDefault={expandChildNodesDefault}
              showToggleBtnOn={showToggleBtnOn}
              expandTill={expandTill}
              valuesForExpanding={valuesForExpanding}
              showInactiveClasses={showInactiveClasses}
            />
          </div>
        )
      }
    })
  }

  return (
    <>
      <div className={'pt-4 lg:w-1/3'}>
        <input
          id={tree.allDept.id}
          name={tree.allDept.id}
          type="checkbox"
          value={tree.allDept.id}
          checked={tree.allDept.isChecked}
          className={styles.checkbox}
          onChange={handleChange}
        />
        <label
          htmlFor="allDept"
          className={classNames(styles.label, {
            [styles.active]: tree.allDept.isChecked,
          })}
        >
          {tree.allDept.name}
        </label>
      </div>
      <div className={classNames('py-1', {[styles.nodeCol]: !isVertical})}>
        {renderNodes(departments)}
      </div>
    </>
  )
}

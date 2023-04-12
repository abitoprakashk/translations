import React, {useEffect, useState} from 'react'
import {t} from 'i18next'
import classNames from 'classnames'
import {ErrorBoundary} from '@teachmint/common'
import {Accordion, Checkbox, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './InstituteHierarchy.module.css'

export const INSTITUTE_HIERARCHY_TYPES = {
  SSO: 'SSO',
  DEPARTMENT: 'DEPARTMENT',
  UAC: 'UAC',
  STANDARD: 'STANDARD',
  SECTION: 'SECTION',
  SUBJECT: 'SUBJECT',
}

const STATUS_TYPES = {
  ACTIVE: 1,
  INACTIVE: 2,
}

export default function InstituteHierarchy({
  instituteHierarchy,
  selectedIds = [],
  handleChange,
  allChecked = false,
  classPrefix = `${t('class')} `,
  hierarchyTypes = [
    INSTITUTE_HIERARCHY_TYPES.DEPARTMENT,
    INSTITUTE_HIERARCHY_TYPES.STANDARD,
  ],
}) {
  const departments = instituteHierarchy?.children
  if (!departments) return ''
  const [tree, setTree] = useState({})

  const iterateOverChildNodes = (classTree, childrens, parentId, isChecked) => {
    return childrens
      .filter((child) => hierarchyTypes.includes(child.type))
      .map((child) => {
        if (
          hierarchyTypes.includes(child.type) &&
          child.status === STATUS_TYPES.ACTIVE
        ) {
          classTree[[child.id]] = {
            id: child.id,
            name: child.name,
            type: child.type,
            status: child.status,
            parentId: parentId,
            isChecked: isChecked,
            showToggleIcon:
              child.type === INSTITUTE_HIERARCHY_TYPES.DEPARTMENT
                ? false
                : true,
            hasChildren: !!child.children.length,
            showChildren: parentId === null ? true : false,
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
    let classTree = {}
    iterateOverChildNodes(classTree, departments, null, allChecked)
    return classTree
  }

  useEffect(() => {
    let classTree = createTree()
    if (selectedIds.length > 0) {
      Object.keys(classTree).map((node) => {
        if (selectedIds.includes(node)) {
          changeNodeState(classTree, node, true, false)
        }
      })
    } else if (allChecked) {
      changeFormValues(classTree)
    }
    setTree(classTree)
  }, [instituteHierarchy])

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
    handleChange(selectedNodes)
  }

  const isLastNode = (node) => {
    return hierarchyTypes.indexOf(node.type) !== hierarchyTypes.length - 1
  }

  const showToggleIcon = (node) => {
    return tree?.[node.id]?.showToggleIcon && isLastNode(node)
  }

  const toggleIconClick = (node) => {
    setTree({
      ...tree,
      [node.id]: {...tree[node.id], showChildren: !tree[node.id]?.showChildren},
    })
  }

  const handleCheckboxChange = ({value, isChecked}) => {
    const classTree = {...tree}
    changeNodeState(classTree, value, isChecked, false)
    changeFormValues(classTree)
    setTree(classTree)
  }

  const renderCheckbox = (node) => {
    return (
      <Checkbox
        label={
          <div className={styles.checkboxLabel}>
            {`${
              node.type === INSTITUTE_HIERARCHY_TYPES.STANDARD
                ? classPrefix
                : ''
            }${node.name}`}
          </div>
        }
        fieldName={node.id}
        classes={{checkbox: styles.checkbox}}
        isSelected={tree[node.id]?.isChecked}
        handleChange={({fieldName, value}) => {
          handleCheckboxChange({
            value: fieldName,
            isChecked: value,
          })
        }}
      />
    )
  }

  const renderCheckboxSelection = (node) => {
    if (
      hierarchyTypes.includes(node.type) &&
      node.status === STATUS_TYPES.ACTIVE
    ) {
      return (
        <div
          key={node.id}
          className={classNames(
            {[styles.marginTop]: hierarchyTypes.indexOf(node.type) !== 1},
            {
              [styles.hideChildren]:
                !tree[tree[node.id]?.parentId]?.showChildren,
            },
            {
              [styles.marginLeftWithoutToggle]:
                !showToggleIcon(node) &&
                hierarchyTypes.indexOf(node.type) !== 1,
            }
          )}
        >
          <div className={styles.nodeSelection}>
            {showToggleIcon(node) && (
              <div
                className={styles.toggleIconDiv}
                onClick={() => toggleIconClick(node)}
              >
                <Icon
                  name={
                    !tree[node.id]?.showChildren
                      ? 'chevronRight'
                      : 'chevronDown'
                  }
                  className={styles.toggleIcon}
                  size={ICON_CONSTANTS.SIZES.XX_SMALL}
                />
              </div>
            )}
            {renderCheckbox(node)}
          </div>
          {node.type !== INSTITUTE_HIERARCHY_TYPES.DEPARTMENT &&
          !!node.children.length
            ? renderChildrenNodes(node.children, styles.marginLeftWithToggle)
            : ''}
        </div>
      )
    }
  }

  const renderChildrenNodes = (childNodes, classes) => {
    return (
      <div className={classes}>
        {childNodes.map((node) => {
          return renderCheckboxSelection(node)
        })}
      </div>
    )
  }

  const checkForActiveStandard = (standards) => {
    return standards.some((standard) => standard.status === STATUS_TYPES.ACTIVE)
  }

  if (!Object.keys(tree).length) {
    return (
      <div className={styles.noHierarchyMsg}>
        {t('noInstituteHierarchyFound')}
      </div>
    )
  }

  return (
    <ErrorBoundary>
      {departments.map((department) => {
        if (
          hierarchyTypes.includes(department.type) &&
          checkForActiveStandard(department?.children)
        ) {
          return (
            <Accordion
              isOpen={false}
              key={department.id}
              classes={{accordionWrapper: styles.accordionWrapper}}
              headerContent={
                <div className={styles.headerContent}>
                  {renderCheckbox(department)}
                </div>
              }
            >
              {renderChildrenNodes(department?.children, styles.standards)}
            </Accordion>
          )
        }
      })}
    </ErrorBoundary>
  )
}

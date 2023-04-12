import {Accordion, Checkbox, Icon, ICON_CONSTANTS} from '@teachmint/krayon'
import styles from './AccordianSelection.module.css'
import classNames from 'classnames'
import React, {useEffect, useState} from 'react'
import {ErrorBoundary} from '@teachmint/common'
import {t} from 'i18next'

export default function AccordianSelection({
  data = [],
  selectedIds = [],
  disabledIds = [],
  handleChange = () => {},
  allChecked = false,
}) {
  const [tree, setTree] = useState({})

  const iterateOverChildNodes = (classTree, children, parentId, isChecked) => {
    return children.map((child) => {
      classTree[[child._id]] = {
        _id: child?._id,
        name: child?.name,
        status: child?.status,
        parentId: parentId,
        isChecked: isChecked,
        isDisabled: disabledIds.includes(child?._id),
        showToggleIcon: parentId ? false : true,
        hasChildren:
          child?.children && child.children.length > 0 ? true : false,
        showChildren: parentId === null ? true : false,
      }

      if (child?.children && child.children.length > 0) {
        iterateOverChildNodes(classTree, child.children, child._id, isChecked)
      }
    })
  }

  const createTree = () => {
    let classTree = {}
    iterateOverChildNodes(classTree, data, null, allChecked)
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
  }, [])

  const changeNodeState = (classTree, name, state, isRecursive = true) => {
    if (!classTree[name].isDisabled) {
      classTree[name].isChecked = state
      if (!isRecursive) {
        changeChildrenNodes(classTree, classTree[name], state)
        changeSiblingsNodes(classTree, classTree[name])
      }
    }
  }

  const getParent = (classTree, node) => {
    return node.parentId ? classTree[node.parentId] : null
  }

  const getChildrens = (classTree, node) => {
    return Object.values(classTree).filter((n) => n.parentId === node._id)
  }

  const getSiblings = (classTree, node) => {
    return Object.values(classTree).filter((n) => n.parentId === node.parentId)
  }

  const changeChildrenNodes = (classTree, node, state) => {
    if (node.hasChildren) {
      getChildrens(classTree, node).map((childNode) => {
        changeNodeState(classTree, childNode._id, state)
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
    return data.indexOf(node.type) !== data.length - 1
  }

  const showToggleIcon = (node) => {
    return tree?.[node._id]?.showToggleIcon && isLastNode(node)
  }

  const toggleIconClick = (node) => {
    setTree({
      ...tree,
      [node._id]: {
        ...tree[node._id],
        showChildren: !tree[node._id]?.showChildren,
      },
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
        label={<div className={styles.checkboxLabel}>{`${node.name}`}</div>}
        fieldName={node._id}
        classes={{checkbox: styles.checkbox}}
        isSelected={tree[node._id]?.isChecked}
        isDisabled={disabledIds.includes(node._id)}
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
    return (
      <div
        key={node._id}
        className={classNames(
          {[styles.marginTop]: false},
          {
            [styles.hideChildren]:
              !tree[tree[node._id]?.parentId]?.showChildren,
          },
          {
            [styles.marginLeftWithoutToggle]: !showToggleIcon(node),
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
                  !tree[node._id]?.showChildren ? 'chevronRight' : 'chevronDown'
                }
                className={styles.toggleIcon}
                size={ICON_CONSTANTS.SIZES.XX_SMALL}
              />
            </div>
          )}
          {renderCheckbox(node)}
        </div>
        {node && node?.children && node.children.length
          ? renderChildrenNodes(node.children, styles.marginLeftWithToggle)
          : ''}
      </div>
    )
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

  if (!Object.keys(tree).length) {
    return <div className={styles.noHierarchyMsg}>{t('dataNotFound')}</div>
  }

  return (
    <ErrorBoundary>
      {data.map((item) => {
        return (
          <Accordion
            isOpen={true}
            key={item?._id}
            classes={{accordionWrapper: styles.accordionWrapper}}
            headerContent={
              <div className={styles.headerContent}>{renderCheckbox(item)}</div>
            }
          >
            {renderChildrenNodes(item?.children, styles.standards)}
          </Accordion>
        )
      })}
    </ErrorBoundary>
  )
}

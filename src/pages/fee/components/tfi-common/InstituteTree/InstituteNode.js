import React, {useState} from 'react'
import classNames from 'classnames'
import styles from './InstituteTree.module.css'

export default function InstituteNode({
  tree,
  node,
  isVertical,
  hierarchyTypes,
  handleChange,
  expandChildNodesDefault = true,
  showToggleBtnOn,
  expandTill,
  valuesForExpanding = [],
  showInactiveClasses,
}) {
  const [showChildNode, setShowChildNode] = useState(
    expandChildNodesDefault || valuesForExpanding.includes(node.type)
  )
  const closeUrl =
    'https://storage.googleapis.com/tm-assets/icons/secondary/right-arrow-secondary.svg'
  const openUrl =
    'https://storage.googleapis.com/tm-assets/icons/secondary/down-arrow-secondary.svg'

  if (
    !hierarchyTypes.includes(node.type) ||
    (node.status === 2 && !showInactiveClasses)
  ) {
    return ''
  }

  const showToggle =
    node.children.length !== 0 && hierarchyTypes.includes(node.children[0].type)

  return (
    <>
      <div key={node.id} className="flex py-1 items-baseline">
        {/* {isVertical && showToggle && ( */}
        {showToggleBtnOn.includes(node.type) && showToggle && (
          <img
            className={styles.toggle}
            src={showChildNode ? openUrl : closeUrl}
            onClick={() => setShowChildNode(!showChildNode)}
          />
        )}
        {/* <div className={classNames({'pl-5': !showToggle && isVertical})}> */}
        <div className={classNames({'pl-5': !showToggle})}>
          <input
            id={node.id}
            name={node.id}
            value={node.id}
            type="checkbox"
            onChange={handleChange}
            className={styles.checkbox}
            checked={tree[node.id].isChecked}
          />
          <label
            htmlFor={node.id}
            className={classNames(styles.label, {
              [styles.active]: tree[node.id].isChecked,
            })}
          >
            {node.name}
          </label>
        </div>
      </div>
      {node.children.length !== 0 && (
        <div
          className={classNames('pl-5', {
            hidden: !showChildNode,
          })}
        >
          {node.children.map((n) => {
            return (
              <InstituteNode
                node={n}
                key={n.id}
                tree={tree}
                isVertical={isVertical}
                handleChange={handleChange}
                hierarchyTypes={hierarchyTypes}
                showToggleBtnOn={showToggleBtnOn}
                expandTill={expandTill}
                expandChildNodesDefault={expandChildNodesDefault}
                valuesForExpanding={valuesForExpanding}
                showInactiveClasses={showInactiveClasses}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

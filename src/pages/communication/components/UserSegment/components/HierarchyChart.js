import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {events} from '../../../../../utils/EventsConstants'
import CheckItem from './CheckItem'
import HierarchyNode from './HierarchyNode'
import styles from '../UserSegment.module.css'
import classNames from 'classnames'
import CommunicationStyles from '../../../Communication.module.css'
import {setUserFilterVisibleAction} from '../../../redux/actions/commonActions'
import {useTranslation} from 'react-i18next'

const HierarchyChart = ({
  data,
  updateUsers,
  hierarchyList = {},
  setUnassigned,
  title,
  isUnassigned,
  selectedOption,
  isAllSelected,
  setIsAllSelected,
  uncategorisedClasses,
  isAllUncategorisedSelected,
  setIsAllUncategorisedSelected,
  handleCancelFilterClickedTfi,
  addOrApplyFilter,
}) => {
  const {t} = useTranslation()
  const tCancel = t('cancel')
  const tApply = t('apply')

  const {eventManager} = useSelector((state) => state)
  const dispatch = useDispatch()
  const setIsCheck = (obj, parent) => {
    let tmp = {...hierarchyList}
    if (obj.isChecked) {
      if (parent && parent.name) {
        tmp[obj.id] = `${
          parent.type === 'DEPARTMENT' ? 'Class' : parent.name
        } - ${obj.text}`
      } else {
        tmp[obj.id] = obj.text
      }
      checkAllChildren(obj, tmp)

      if (obj.text !== 'All Classes') {
        eventManager.send_event(events.USER_SEGMENT_NODE_CLICKED_TFI, {
          post_type: selectedOption,
          post_title: title,
          all_classes: isAllSelected ? 'yes' : 'no',
          department: obj.type === 'DEPARTMENT' ? tmp[obj.id] : null,
          standard: obj.type === 'STANDARD' ? tmp[obj.id] : null,
          section: obj.type === 'SECTION' ? tmp[obj.id] : null,
        })
      }
    } else {
      delete tmp[obj.id]
      unCheckAllChildren(obj, tmp)
    }
  }

  const selectAll = (obj, parent) => {
    if (obj.isChecked) {
      setIsCheck(obj, parent)
      setIsAllSelected(true)
    } else {
      updateUsers({})
      setIsAllSelected(false)
    }

    if (obj.isChecked) {
      eventManager.send_event(events.USER_SEGMENT_NODE_CLICKED_TFI, {
        post_type: selectedOption,
        post_title: title,
        all_classes: obj.isChecked ? 'yes' : 'no',
      })
    }
  }

  const selectAllUncategorised = (obj) => {
    if (obj.isChecked) {
      checkAllChildren(obj, {...hierarchyList})
      setIsAllUncategorisedSelected(true)
    } else {
      unCheckAllChildren(obj, {...hierarchyList})
      setIsAllUncategorisedSelected(false)
    }
  }

  const checkAllChildren = (parent, tmp) => {
    parent.children?.forEach((item) => {
      if (item.type !== 'ADD_SEC') {
        if (parent.type !== 'SESSION' && parent.type !== 'SUBJECT') {
          tmp[item.id || item._id] = `${parent.name} - ${item.name}`
        } else {
          tmp[item.id || item._id] = item.name
        }
        if (item.children) {
          checkAllChildren(item, tmp)
        }
      }
    })
    updateUsers(tmp)
  }

  const unCheckAllChildren = (parent, tmp) => {
    parent.children?.forEach((item) => {
      delete tmp[item.id || item._id]
      if (item.children) {
        unCheckAllChildren(item, tmp)
      }
    })
    updateUsers(tmp)
  }

  const renderDepartments = (root, margin = 0, parent = {}) => {
    margin += 15
    return root.map((item) => {
      let check = (
        <CheckItem
          key={item.id}
          value={item.id}
          checked={hierarchyList[item.id] ? true : false}
          text={item.name}
          obj={item}
          setIsCheck={(obj) => setIsCheck(obj, parent)}
        />
      )
      if (item.children.length && item.type !== 'SECTION') {
        if (
          item.type !== 'STANDARD' ||
          (item.type === 'STANDARD' && item.status === 1)
        ) {
          return (
            <HierarchyNode
              key={item.id}
              item={item}
              parent={parent}
              isChecked={hierarchyList[item.id] ? true : false}
              setIsCheck={setIsCheck}
            >
              <div style={{marginLeft: margin}}>
                {renderDepartments(item.children, margin, item)}
              </div>
            </HierarchyNode>
          )
        }
      } else if (item.type !== 'ADD_SEC') {
        return check
      }
    })
  }

  const renderUncategorisedClasses = () => {
    return uncategorisedClasses.map((item) => (
      <CheckItem
        key={item._id}
        value={item._id}
        checked={hierarchyList[item._id] ? true : false}
        text={`${item.name} (${item.subject})`}
        obj={item}
        setIsCheck={(obj) => setIsCheck(obj, uncategorisedClasses)}
      />
    ))
  }

  return (
    <>
      <div className={styles.hierarchyContainer}>
        <div className={styles.filterButtonSection}>
          <button
            className={classNames(
              styles.filterCancelBtn,
              CommunicationStyles.cancelBtn,
              'mr-3'
            )}
            onClick={() => {
              dispatch(setUserFilterVisibleAction(false))
              handleCancelFilterClickedTfi()
            }}
          >
            {tCancel}
          </button>
          <button
            className={classNames(
              styles.applyFilterBtn,
              styles.filterCancelBtn,
              'justify-center'
            )}
            onClick={addOrApplyFilter}
          >
            {tApply}
          </button>
        </div>

        <div className={styles.border}>
          <CheckItem
            value="all_departments"
            text="Select All"
            setIsCheck={selectAll}
            checked={isAllSelected}
            obj={data}
          />
          {renderDepartments(data.children, 0)}
          <div className="tm-bdr-t-gy-2 m-4"></div>
          <HierarchyNode
            item={{
              name: 'Custom classrooms',
              children: uncategorisedClasses,
            }}
            parent={null}
            isChecked={isAllUncategorisedSelected}
            setIsCheck={selectAllUncategorised}
          >
            <div className="ml-6">{renderUncategorisedClasses()}</div>
          </HierarchyNode>
          <div className="tm-bdr-t-gy-2 m-4"></div>
          <CheckItem
            value="unassigned"
            text="Not assigned to a class"
            checked={isUnassigned}
            setIsCheck={(obj) => {
              setUnassigned(obj.isChecked)
              if (obj.isChecked) {
                eventManager.send_event(events.USER_SEGMENT_NODE_CLICKED_TFI, {
                  post_type: selectedOption,
                  post_title: title,
                  unassigned: obj.isChecked ? 'yes' : 'no',
                })
              }
            }}
            obj={{}}
          />
        </div>
      </div>
    </>
  )
}

export default HierarchyChart
